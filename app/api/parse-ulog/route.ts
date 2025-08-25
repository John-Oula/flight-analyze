import { NextRequest, NextResponse } from 'next/server'
import { MessageType, ULog } from '@foxglove/ulog'
import { FileReader } from '@foxglove/ulog/node'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.name.endsWith('.ulg')) {
      return NextResponse.json({ error: 'File must be a ULOG file (.ulg)' }, { status: 400 })
    }

    // Convert File to Buffer and create a temporary file path
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Create a temporary file path for the ULOG reader
    const tempFilePath = `/tmp/${Date.now()}_${file.name}`
    
    // Write buffer to temporary file
    const fs = require('fs')
    fs.writeFileSync(tempFilePath, buffer)

    // Create ULog instance with FileReader
    const ulog = new ULog(new FileReader(tempFilePath))
    await ulog.open() // Required before any other operations

    console.log('ULOG file opened successfully')
    console.log(`Total messages: ${ulog.messageCount()}`)
    console.log(`Time range: ${ulog.timeRange()}`)

    // Extract message definitions and data
    const messages: any = {}
    const msgIdCounts = new Map()
    const MAX_SAMPLES_PER_MSG = 5000

    // Process all messages
    for await (const msg of ulog.readMessages()) {
      if (msg.type === MessageType.Data) {
        // Count data messages
        msgIdCounts.set(msg.msgId, (msgIdCounts.get(msg.msgId) ?? 0) + 1)

        // Get subscription info for this message
        const subscription = ulog.subscriptions.get(msg.msgId)
        if (subscription) {
          const msgName = subscription.name

          if (!messages[msgName]) {
            // Create message entry if it doesn't exist
            messages[msgName] = {
              fields: subscription.fields.map(field => ({
                name: field.name,
                type: field.type,
                description: getFieldDescription(field.name, field.type)
              })),
              data: [],
              messageCount: 0,
              frequency: 0,
              lastUpdate: new Date().toISOString(),
              firstTimestampUs: undefined as number | undefined,
              lastTimestampUs: undefined as number | undefined
            }
          }

          // Extract best-available timestamp in microseconds
          const value: any = msg.value
          let tsUs: number | undefined
          const candidate =
            value?.timestamp !== undefined ? value.timestamp :
            (value?.timestamp_sample !== undefined ? value.timestamp_sample : undefined)
          
          if (typeof candidate === 'bigint') tsUs = Number(candidate)
          else if (typeof candidate === 'number') tsUs = candidate
          else {
            const tsBigInt = (msg as any).timestamp as bigint | undefined
            if (tsBigInt !== undefined) tsUs = Number(tsBigInt)
          }

          // Store message data with timestamp (cap payload)
          if (messages[msgName].data.length < MAX_SAMPLES_PER_MSG) {
            messages[msgName].data.push({
              ...(tsUs !== undefined ? { timestampUs: tsUs, timestampMs: tsUs / 1000 } : {}),
              ...value
            })
          }
          messages[msgName].messageCount++

          // Track per-message time range for accurate frequency estimation
          if (tsUs !== undefined) {
            if (messages[msgName].firstTimestampUs === undefined) {
              messages[msgName].firstTimestampUs = tsUs
            }
            messages[msgName].lastTimestampUs = tsUs
          }
        }
      }
    }

    // Calculate frequencies and finalize message data
    Object.values(messages).forEach((msg: any) => {
      if (msg.messageCount > 0) {
        // Estimate frequency from this message's own time range when available
        if (msg.firstTimestampUs !== undefined && msg.lastTimestampUs !== undefined && msg.lastTimestampUs > msg.firstTimestampUs) {
          const durationSec = (msg.lastTimestampUs - msg.firstTimestampUs) / 1_000_000
          msg.frequency = Math.round(msg.messageCount / durationSec)
        } else {
          const timeRange = ulog.timeRange()
          const duration = timeRange ? Number(timeRange[1] - timeRange[0]) / 1000000 : 300
          msg.frequency = Math.round(msg.messageCount / duration)
        }
      }
    })

    const parsedData = {
      header: {
        magic: 'ULog (Foxglove)',
        version: '1.0',
        timestamp: ulog.timeRange()?.[0]?.toString() || '0',
        messageCount: ulog.messageCount(),
        timeRange: ulog.timeRange() ? {
          start: ulog.timeRange()![0].toString(),
          end: ulog.timeRange()![1].toString()
        } : null
      },
      messages,
      fileSize: file.size,
      messageCount: Object.keys(messages).length
    }

    console.log('Successfully parsed ULOG file:', {
      fileSize: file.size,
      messageCount: Object.keys(messages).length,
      messages: Object.keys(messages),
      totalMessages: ulog.messageCount()
    })

    // Clean up temporary file
    try {
      fs.unlinkSync(tempFilePath)
    } catch (error) {
      console.warn('Failed to clean up temporary file:', error)
    }

    // Convert BigInt values to strings for JSON serialization
    const serializableData = convertBigIntsToStrings(parsedData)

    return NextResponse.json({ success: true, data: serializableData })

  } catch (error) {
    console.error('Error parsing ULOG file:', error)
    
    let errorMessage = 'Error parsing ULOG file. '
    if (error instanceof Error) {
      if (error.message.includes('not a valid ULog file')) {
        errorMessage += 'This file does not appear to be a valid ULOG file. Please ensure you are uploading a PX4 ULOG (.ulg) file.'
      } else if (error.message.includes('corrupted')) {
        errorMessage += 'The ULOG file appears to be corrupted or incomplete.'
      } else {
        errorMessage += error.message
      }
    } else {
      errorMessage += 'Please check if the file is valid and not corrupted.'
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

function convertBigIntsToStrings(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj
  }
  
  if (typeof obj === 'bigint') {
    return obj.toString()
  }
  
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntsToStrings)
  }
  
  if (typeof obj === 'object') {
    const result: any = {}
    for (const [key, value] of Object.entries(obj)) {
      result[key] = convertBigIntsToStrings(value)
    }
    return result
  }
  
  return obj
}

function getFieldDescription(fieldName: string, fieldType: string): string {
  // Common field descriptions based on PX4 uORB message definitions
  const descriptions: { [key: string]: string } = {
    timestamp: 'Timestamp in microseconds',
    timestamp_sample: 'Timestamp of the sensor sample',
    x: 'X position in meters',
    y: 'Y position in meters', 
    z: 'Z position in meters',
    vx: 'X velocity in m/s',
    vy: 'Y velocity in m/s',
    vz: 'Z velocity in m/s',
    ax: 'X acceleration in m/s²',
    ay: 'Y acceleration in m/s²',
    az: 'Z acceleration in m/s²',
    gyro_rad: 'Angular velocity in rad/s',
    accelerometer_m_s2: 'Acceleration in m/s²',
    magnetometer_ga: 'Magnetic field in Gauss',
    baro_alt_meter: 'Barometric altitude in meters',
    baro_temp_celcius: 'Barometric temperature in Celsius',
    voltage_v: 'Battery voltage in volts',
    current_a: 'Battery current in amperes',
    remaining: 'Remaining capacity percentage',
    temperature: 'Temperature in Celsius',
    lat: 'Latitude in degrees',
    lon: 'Longitude in degrees',
    alt: 'Altitude in meters',
    heading: 'Heading in radians',
    q: 'Quaternion representing vehicle attitude',
    roll: 'Roll angle in radians',
    pitch: 'Pitch angle in radians',
    yaw: 'Yaw angle in radians',
    groundspeed: 'Ground speed in m/s',
    airspeed: 'Airspeed in m/s',
    throttle: 'Throttle position (0-1)',
    flaps: 'Flap position',
    gear: 'Landing gear position',
    mode: 'Flight mode',
    nav_state: 'Navigation state',
    arming_state: 'Arming state',
    failsafe: 'Failsafe state',
    gps_fix: 'GPS fix type',
    satellites_used: 'Number of satellites used',
    hdop: 'Horizontal dilution of precision',
    vdop: 'Vertical dilution of precision',
    eph: 'Estimated horizontal position error',
    epv: 'Estimated vertical position error'
  }
  
  return descriptions[fieldName] || `${fieldName} field (${fieldType})`
}
