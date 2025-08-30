import dgram from 'node:dgram'
import { EventEmitter } from 'node:events'

type TelemetrySample = { timestampMs: number; value: number }

class TelemetryHub extends EventEmitter {
  private started = false
  private socket: dgram.Socket | null = null

  start(port = 14550, host = '0.0.0.0') {
    if (this.started) return
    this.started = true
    this.socket = dgram.createSocket('udp4')
    this.socket.on('message', (msg) => this.handlePacket(msg))
    this.socket.on('listening', () => {
      const address = this.socket!.address()
    })
    this.socket.on('error', (err) => {
      // Silent error handling
    })
    this.socket.bind(port, host)
  }

  private handlePacket(buf: Buffer) {
    const now = Date.now()
    // Detect MAVLink v1 or v2
    const stx = buf[0]
    if (stx === 0xFE) {
      // MAVLink v1
      const payloadLen = buf[1]
      const msgId = buf[5]
      const payloadOffset = 6
      this.parseMessageV1(buf, payloadOffset, payloadLen, msgId, now)
    } else if (stx === 0xFD) {
      // MAVLink v2
      const payloadLen = buf[1]
      const msgId = buf[7] | (buf[8] << 8) | (buf[9] << 16)
      const payloadOffset = 10
      this.parseMessageV2(buf, payloadOffset, payloadLen, msgId, now)
    }
  }

  private parseMessageV1(buf: Buffer, off: number, len: number, msgId: number, now: number) {
    try {
      if (msgId === 30 && len >= 28) {
        // ATTITUDE (#30)
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        const roll = dv.getFloat32(4, true)
        const pitch = dv.getFloat32(8, true)
        const yaw = dv.getFloat32(12, true)
        const rollspeed = dv.getFloat32(16, true)
        const pitchspeed = dv.getFloat32(20, true)
        const yawspeed = dv.getFloat32(24, true)
        this.emitTopic('attitude.roll', { timestampMs: now, value: roll })
        this.emitTopic('attitude.pitch', { timestampMs: now, value: pitch })
        this.emitTopic('attitude.yaw', { timestampMs: now, value: yaw })
        this.emitTopic('attitude.rollspeed', { timestampMs: now, value: rollspeed })
        this.emitTopic('attitude.pitchspeed', { timestampMs: now, value: pitchspeed })
        this.emitTopic('attitude.yawspeed', { timestampMs: now, value: yawspeed })
      } else if (msgId === 1 && len >= 31) {
        // SYS_STATUS (#1)
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        const voltage = dv.getUint16(14, true) / 1000
        const current = dv.getInt16(16, true) / 100
        const battery_remaining = dv.getInt8(28)
        this.emitTopic('battery.voltage', { timestampMs: now, value: voltage })
        this.emitTopic('battery.current', { timestampMs: now, value: current })
        this.emitTopic('battery.remaining', { timestampMs: now, value: battery_remaining })
      } else if (msgId === 33 && len >= 28) {
        // GLOBAL_POSITION_INT (#33)
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        const lat = dv.getInt32(4, true) / 1e7
        const lon = dv.getInt32(8, true) / 1e7
        const alt = dv.getInt32(12, true) / 1000
        const relative_alt = dv.getInt32(16, true) / 1000
        const vx = dv.getInt16(20, true) / 100
        const vy = dv.getInt16(22, true) / 100
        const vz = dv.getInt16(24, true) / 100
        const hdg = dv.getUint16(26, true) / 100
        this.emitTopic('gps.lat', { timestampMs: now, value: lat })
        this.emitTopic('gps.lon', { timestampMs: now, value: lon })
        this.emitTopic('gps.alt', { timestampMs: now, value: alt })
        this.emitTopic('gps.relative_alt', { timestampMs: now, value: relative_alt })
        this.emitTopic('gps.vx', { timestampMs: now, value: vx })
        this.emitTopic('gps.vy', { timestampMs: now, value: vy })
        this.emitTopic('gps.vz', { timestampMs: now, value: vz })
        this.emitTopic('gps.hdg', { timestampMs: now, value: hdg })
      } else if (msgId === 32 && len >= 28) {
        // LOCAL_POSITION_NED (#32)
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        const x = dv.getFloat32(4, true)
        const y = dv.getFloat32(8, true)
        const z = dv.getFloat32(12, true)
        const vx = dv.getFloat32(16, true)
        const vy = dv.getFloat32(20, true)
        const vz = dv.getFloat32(24, true)
        this.emitTopic('local_position.x', { timestampMs: now, value: x })
        this.emitTopic('local_position.y', { timestampMs: now, value: y })
        this.emitTopic('local_position.z', { timestampMs: now, value: z })
        this.emitTopic('local_position.vx', { timestampMs: now, value: vx })
        this.emitTopic('local_position.vy', { timestampMs: now, value: vy })
        this.emitTopic('local_position.vz', { timestampMs: now, value: vz })
      } else if (msgId === 35 && len >= 36) {
        // RC_CHANNELS_RAW (#35)
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        for (let i = 0; i < 8; i++) {
          const chan = dv.getUint16(4 + i * 2, true)
          this.emitTopic(`rc.ch${i + 1}`, { timestampMs: now, value: chan })
        }
      } else if (msgId === 24 && len >= 44) {
        // GPS_RAW_INT (#24)
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        const lat = dv.getInt32(4, true) / 1e7
        const lon = dv.getInt32(8, true) / 1e7
        const alt = dv.getUint32(12, true) / 1000
        const hdop = dv.getUint16(20, true) / 100
        const vdop = dv.getUint16(22, true) / 100
        const satellites_visible = dv.getUint8(23)
        this.emitTopic('gps_raw.lat', { timestampMs: now, value: lat })
        this.emitTopic('gps_raw.lon', { timestampMs: now, value: lon })
        this.emitTopic('gps_raw.alt', { timestampMs: now, value: alt })
        this.emitTopic('gps_raw.hdop', { timestampMs: now, value: hdop })
        this.emitTopic('gps_raw.vdop', { timestampMs: now, value: vdop })
        this.emitTopic('gps_raw.satellites', { timestampMs: now, value: satellites_visible })
      } else if (msgId === 36 && len >= 22) {
        // SERVO_OUTPUT_RAW (#36)
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        for (let i = 0; i < 8; i++) {
          const servo = dv.getUint16(4 + i * 2, true)
          this.emitTopic(`servo.${i + 1}`, { timestampMs: now, value: servo })
        }
      } else if (msgId === 42 && len >= 22) {
        // MISSION_CURRENT (#42)
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        const seq = dv.getUint16(4, true)
        this.emitTopic('mission.current', { timestampMs: now, value: seq })
      } else if (msgId === 74 && len >= 14) {
        // VFR_HUD (#74)
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        const airspeed = dv.getFloat32(4, true)
        const groundspeed = dv.getFloat32(8, true)
        const heading = dv.getUint16(12, true)
        this.emitTopic('vfr.airspeed', { timestampMs: now, value: airspeed })
        this.emitTopic('vfr.groundspeed', { timestampMs: now, value: groundspeed })
        this.emitTopic('vfr.heading', { timestampMs: now, value: heading })
      } else if (msgId === 87 && len >= 14) {
        // POSITION_TARGET_GLOBAL_INT (#87)
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        const lat = dv.getInt32(4, true) / 1e7
        const lon = dv.getInt32(8, true) / 1e7
        const alt = dv.getFloat32(12, true)
        this.emitTopic('target.lat', { timestampMs: now, value: lat })
        this.emitTopic('target.lon', { timestampMs: now, value: lon })
        this.emitTopic('target.alt', { timestampMs: now, value: alt })
      } else if (msgId === 85 && len >= 18) {
        // POSITION_TARGET_LOCAL_NED (#85)
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        const x = dv.getFloat32(4, true)
        const y = dv.getFloat32(8, true)
        const z = dv.getFloat32(12, true)
        this.emitTopic('target_local.x', { timestampMs: now, value: x })
        this.emitTopic('target_local.y', { timestampMs: now, value: y })
        this.emitTopic('target_local.z', { timestampMs: now, value: z })
      } else if (msgId === 147 && len >= 36) {
        // BATTERY_STATUS (#147)
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        const current_consumed = dv.getInt32(4, true)
        const energy_consumed = dv.getInt32(8, true)
        const temperature = dv.getInt16(12, true)
        const current_battery = dv.getInt16(14, true) / 100
        const battery_remaining = dv.getInt8(16)
        this.emitTopic('battery_status.consumed', { timestampMs: now, value: current_consumed })
        this.emitTopic('battery_status.energy', { timestampMs: now, value: energy_consumed })
        this.emitTopic('battery_status.temperature', { timestampMs: now, value: temperature })
        this.emitTopic('battery_status.current', { timestampMs: now, value: current_battery })
        this.emitTopic('battery_status.remaining', { timestampMs: now, value: battery_remaining })
      } else if (msgId === 105 && len >= 22) {
        // HIGH_LATENCY (#105)
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        const custom_mode = dv.getUint16(4, true)
        const latitude = dv.getInt32(6, true) / 1e7
        const longitude = dv.getInt32(10, true) / 1e7
        const altitude = dv.getInt16(14, true)
        const target_altitude = dv.getInt16(16, true)
        const target_distance = dv.getUint16(18, true)
        const wp_num = dv.getUint8(20)
        const failure_flags = dv.getUint8(21)
        this.emitTopic('high_latency.custom_mode', { timestampMs: now, value: custom_mode })
        this.emitTopic('high_latency.lat', { timestampMs: now, value: latitude })
        this.emitTopic('high_latency.lon', { timestampMs: now, value: longitude })
        this.emitTopic('high_latency.alt', { timestampMs: now, value: altitude })
        this.emitTopic('high_latency.target_alt', { timestampMs: now, value: target_altitude })
        this.emitTopic('high_latency.target_distance', { timestampMs: now, value: target_distance })
        this.emitTopic('high_latency.wp_num', { timestampMs: now, value: wp_num })
        this.emitTopic('high_latency.failure_flags', { timestampMs: now, value: failure_flags })
      }
    } catch {}
  }

  private parseMessageV2(buf: Buffer, off: number, len: number, msgId: number, now: number) {
    try {
      if (msgId === 30 && len >= 28) {
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        const roll = dv.getFloat32(4, true)
        const pitch = dv.getFloat32(8, true)
        const yaw = dv.getFloat32(12, true)
        const rollspeed = dv.getFloat32(16, true)
        const pitchspeed = dv.getFloat32(20, true)
        const yawspeed = dv.getFloat32(24, true)
        this.emitTopic('attitude.roll', { timestampMs: now, value: roll })
        this.emitTopic('attitude.pitch', { timestampMs: now, value: pitch })
        this.emitTopic('attitude.yaw', { timestampMs: now, value: yaw })
        this.emitTopic('attitude.rollspeed', { timestampMs: now, value: rollspeed })
        this.emitTopic('attitude.pitchspeed', { timestampMs: now, value: pitchspeed })
        this.emitTopic('attitude.yawspeed', { timestampMs: now, value: yawspeed })
      } else if (msgId === 1 && len >= 31) {
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        const voltage = dv.getUint16(14, true) / 1000
        const current = dv.getInt16(16, true) / 100
        const battery_remaining = dv.getInt8(28)
        this.emitTopic('battery.voltage', { timestampMs: now, value: voltage })
        this.emitTopic('battery.current', { timestampMs: now, value: current })
        this.emitTopic('battery.remaining', { timestampMs: now, value: battery_remaining })
      } else if (msgId === 33 && len >= 28) {
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        const lat = dv.getInt32(4, true) / 1e7
        const lon = dv.getInt32(8, true) / 1e7
        const alt = dv.getInt32(12, true) / 1000
        const relative_alt = dv.getInt32(16, true) / 1000
        const vx = dv.getInt16(20, true) / 100
        const vy = dv.getInt16(22, true) / 100
        const vz = dv.getInt16(24, true) / 100
        const hdg = dv.getUint16(26, true) / 100
        this.emitTopic('gps.lat', { timestampMs: now, value: lat })
        this.emitTopic('gps.lon', { timestampMs: now, value: lon })
        this.emitTopic('gps.alt', { timestampMs: now, value: alt })
        this.emitTopic('gps.relative_alt', { timestampMs: now, value: relative_alt })
        this.emitTopic('gps.vx', { timestampMs: now, value: vx })
        this.emitTopic('gps.vy', { timestampMs: now, value: vy })
        this.emitTopic('gps.vz', { timestampMs: now, value: vz })
        this.emitTopic('gps.hdg', { timestampMs: now, value: hdg })
      } else if (msgId === 32 && len >= 28) {
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        const x = dv.getFloat32(4, true)
        const y = dv.getFloat32(8, true)
        const z = dv.getFloat32(12, true)
        const vx = dv.getFloat32(16, true)
        const vy = dv.getFloat32(20, true)
        const vz = dv.getFloat32(24, true)
        this.emitTopic('local_position.x', { timestampMs: now, value: x })
        this.emitTopic('local_position.y', { timestampMs: now, value: y })
        this.emitTopic('local_position.z', { timestampMs: now, value: z })
        this.emitTopic('local_position.vx', { timestampMs: now, value: vx })
        this.emitTopic('local_position.vy', { timestampMs: now, value: vy })
        this.emitTopic('local_position.vz', { timestampMs: now, value: vz })
      } else if (msgId === 35 && len >= 36) {
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        for (let i = 0; i < 8; i++) {
          const chan = dv.getUint16(4 + i * 2, true)
          this.emitTopic(`rc.ch${i + 1}`, { timestampMs: now, value: chan })
        }
      } else if (msgId === 24 && len >= 44) {
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        const lat = dv.getInt32(4, true) / 1e7
        const lon = dv.getInt32(8, true) / 1e7
        const alt = dv.getUint32(12, true) / 1000
        const hdop = dv.getUint16(20, true) / 100
        const vdop = dv.getUint16(22, true) / 100
        const satellites_visible = dv.getUint8(23)
        this.emitTopic('gps_raw.lat', { timestampMs: now, value: lat })
        this.emitTopic('gps_raw.lon', { timestampMs: now, value: lon })
        this.emitTopic('gps_raw.alt', { timestampMs: now, value: alt })
        this.emitTopic('gps_raw.hdop', { timestampMs: now, value: hdop })
        this.emitTopic('gps_raw.vdop', { timestampMs: now, value: vdop })
        this.emitTopic('gps_raw.satellites', { timestampMs: now, value: satellites_visible })
      } else if (msgId === 36 && len >= 22) {
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        for (let i = 0; i < 8; i++) {
          const servo = dv.getUint16(4 + i * 2, true)
          this.emitTopic(`servo.${i + 1}`, { timestampMs: now, value: servo })
        }
      } else if (msgId === 42 && len >= 22) {
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        const seq = dv.getUint16(4, true)
        this.emitTopic('mission.current', { timestampMs: now, value: seq })
      } else if (msgId === 74 && len >= 14) {
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        const airspeed = dv.getFloat32(4, true)
        const groundspeed = dv.getFloat32(8, true)
        const heading = dv.getUint16(12, true)
        this.emitTopic('vfr.airspeed', { timestampMs: now, value: airspeed })
        this.emitTopic('vfr.groundspeed', { timestampMs: now, value: groundspeed })
        this.emitTopic('vfr.heading', { timestampMs: now, value: heading })
      } else if (msgId === 87 && len >= 14) {
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        const lat = dv.getInt32(4, true) / 1e7
        const lon = dv.getInt32(8, true) / 1e7
        const alt = dv.getFloat32(12, true)
        this.emitTopic('target.lat', { timestampMs: now, value: lat })
        this.emitTopic('target.lon', { timestampMs: now, value: lon })
        this.emitTopic('target.alt', { timestampMs: now, value: alt })
      } else if (msgId === 85 && len >= 18) {
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        const x = dv.getFloat32(4, true)
        const y = dv.getFloat32(8, true)
        const z = dv.getFloat32(12, true)
        this.emitTopic('target_local.x', { timestampMs: now, value: x })
        this.emitTopic('target_local.y', { timestampMs: now, value: y })
        this.emitTopic('target_local.z', { timestampMs: now, value: z })
      } else if (msgId === 147 && len >= 36) {
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        const current_consumed = dv.getInt32(4, true)
        const energy_consumed = dv.getInt32(8, true)
        const temperature = dv.getInt16(12, true)
        const current_battery = dv.getInt16(14, true) / 100
        const battery_remaining = dv.getInt8(16)
        this.emitTopic('battery_status.consumed', { timestampMs: now, value: current_consumed })
        this.emitTopic('battery_status.energy', { timestampMs: now, value: energy_consumed })
        this.emitTopic('battery_status.temperature', { timestampMs: now, value: temperature })
        this.emitTopic('battery_status.current', { timestampMs: now, value: current_battery })
        this.emitTopic('battery_status.remaining', { timestampMs: now, value: battery_remaining })
      } else if (msgId === 105 && len >= 22) {
        const dv = new DataView(buf.buffer, buf.byteOffset + off, len)
        const custom_mode = dv.getUint16(4, true)
        const latitude = dv.getInt32(6, true) / 1e7
        const longitude = dv.getInt32(10, true) / 1e7
        const altitude = dv.getInt16(14, true)
        const target_altitude = dv.getInt16(16, true)
        const target_distance = dv.getUint16(18, true)
        const wp_num = dv.getUint8(20)
        const failure_flags = dv.getUint8(21)
        this.emitTopic('high_latency.custom_mode', { timestampMs: now, value: custom_mode })
        this.emitTopic('high_latency.lat', { timestampMs: now, value: latitude })
        this.emitTopic('high_latency.lon', { timestampMs: now, value: longitude })
        this.emitTopic('high_latency.alt', { timestampMs: now, value: altitude })
        this.emitTopic('high_latency.target_alt', { timestampMs: now, value: target_altitude })
        this.emitTopic('high_latency.target_distance', { timestampMs: now, value: target_distance })
        this.emitTopic('high_latency.wp_num', { timestampMs: now, value: wp_num })
        this.emitTopic('high_latency.failure_flags', { timestampMs: now, value: failure_flags })
      }
    } catch {}
  }

  private emitTopic(topic: string, data: TelemetrySample) {
    // Emit the telemetry event that the SSE route expects
    this.emit('telemetry', { topic, data })
  }
}

// Singleton hub
const globalAny = global as any
export const telemetryHub: TelemetryHub = globalAny.__telemetryHub || new TelemetryHub()
if (!globalAny.__telemetryHub) {
  globalAny.__telemetryHub = telemetryHub
  // Auto-start on import; default UDP port 14550
  try { 
    telemetryHub.start(14550, '0.0.0.0') 
  } catch (error) {
    // Silent error handling
  }
}


