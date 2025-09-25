'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Play, 
  Pause, 
  RotateCcw,
  Download,
  Settings,
  MapPin,
  TrendingUp,
  Activity,
  Target,
  Navigation
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ComposedChart
} from 'recharts'

interface TrajectoryData {
  timestamp: number
  x: number
  y: number
  z: number
  setpoint_x?: number
  setpoint_y?: number
  setpoint_z?: number
  velocity_x?: number
  velocity_y?: number
  velocity_z?: number
}

interface ParsedULogData {
  messages: {
    [key: string]: {
      fields: Array<{
        name: string
        type: string
        description: string
      }>
      data: any[]
      messageCount: number
      frequency: number
      lastUpdate: string
    }
  }
  header: {
    messageCount: number
    timeRange: [number, number]
  }
}

export default function TrajectoryAnalyzerPage() {
  const [parsedData, setParsedData] = useState<ParsedULogData | null>(null)
  const [isParsing, setIsParsing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showSetpoints, setShowSetpoints] = useState(true)
  const [showVelocities, setShowVelocities] = useState(false)

  // Process trajectory data from ulog messages
  const trajectoryData = useMemo(() => {
    try {
      if (!parsedData?.messages) {
        console.log('No parsed data available')
        return []
      }

      // Get local position data
      const localPosMsg = parsedData.messages['vehicle_local_position']
      const setpointMsg = parsedData.messages['vehicle_local_position_setpoint']

      console.log('Available messages:', Object.keys(parsedData.messages))
      console.log('Local position message:', localPosMsg ? 'Found' : 'Not found')
      console.log('Setpoint message:', setpointMsg ? 'Found' : 'Not found')

      if (!localPosMsg?.data || !Array.isArray(localPosMsg.data)) {
        console.log('No valid local position data')
        return []
      }

      // Process local position data directly
      const data: TrajectoryData[] = localPosMsg.data
        .filter((sample: any) => {
          const timestamp = sample.timestampMs || sample.timestampUs / 1000
          return timestamp && 
                 typeof sample.x === 'number' && 
                 typeof sample.y === 'number' && 
                 typeof sample.z === 'number' &&
                 !isNaN(sample.x) && 
                 !isNaN(sample.y) && 
                 !isNaN(sample.z)
        })
        .map((sample: any) => {
          const timestamp = sample.timestampMs || sample.timestampUs / 1000
          return {
            timestamp,
            x: sample.x,
            y: sample.y,
            z: sample.z,
            velocity_x: sample.vx,
            velocity_y: sample.vy,
            velocity_z: sample.vz
          }
        })
        .sort((a, b) => a.timestamp - b.timestamp)

      // Add setpoint data if available
      if (setpointMsg?.data && Array.isArray(setpointMsg.data)) {
        const setpointMap = new Map<number, any>()
        
        setpointMsg.data.forEach((sample: any) => {
          const timestamp = sample.timestampMs || sample.timestampUs / 1000
          if (timestamp && typeof sample.x === 'number' && !isNaN(sample.x)) {
            setpointMap.set(timestamp, {
              setpoint_x: sample.x,
              setpoint_y: sample.y,
              setpoint_z: sample.z
            })
          }
        })

        // Merge setpoint data with trajectory data
        data.forEach(point => {
          const setpoint = setpointMap.get(point.timestamp)
          if (setpoint) {
            point.setpoint_x = setpoint.setpoint_x
            point.setpoint_y = setpoint.setpoint_y
            point.setpoint_z = setpoint.setpoint_z
          }
        })
      }

      console.log('Trajectory data processed successfully:', {
        totalPoints: data.length,
        hasSetpoints: data.some(p => p.setpoint_x !== undefined),
        samplePoint: data[0],
        dataRange: data.length > 0 ? {
          x: [Math.min(...data.map(d => d.x)), Math.max(...data.map(d => d.x))],
          y: [Math.min(...data.map(d => d.y)), Math.max(...data.map(d => d.y))],
          z: [Math.min(...data.map(d => d.z)), Math.max(...data.map(d => d.z))]
        } : null
      })

      return data
    } catch (error) {
      console.error('Error processing trajectory data:', error)
      return []
    }
  }, [parsedData])

  // Handle file upload and parsing
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.ulg')) {
      alert('Please select a valid ULOG file (.ulg)')
      return
    }

    await parseULogFile(file)
  }

  const parseULogFile = async (file: File) => {
    setIsParsing(true)
    try {
      console.log('Uploading ULOG file for trajectory analysis...')
      
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/parse-ulog', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to parse ULOG file')
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to parse ULOG file')
      }
      
      setParsedData(result.data)
      console.log('Successfully parsed ULOG file for trajectory analysis:', {
        fileSize: file.size,
        messageCount: Object.keys(result.data.messages).length,
        trajectoryPoints: trajectoryData.length
      })
      
    } catch (error) {
      console.error('Error parsing ULOG file:', error)
      alert(`Error parsing ULOG file: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsParsing(false)
    }
  }

  // Playback controls
  useEffect(() => {
    if (!isPlaying || trajectoryData.length === 0) return

    const interval = setInterval(() => {
      setCurrentTimeIndex(prev => {
        const next = prev + playbackSpeed
        return next >= trajectoryData.length ? 0 : next
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying, playbackSpeed, trajectoryData.length])

  // Generate chart data for current time slice
  const currentChartData = useMemo(() => {
    if (trajectoryData.length === 0) return []
    
    const endIndex = Math.min(currentTimeIndex + 1, trajectoryData.length)
    return trajectoryData.slice(0, endIndex)
  }, [trajectoryData, currentTimeIndex])

  // Generate 2D XY trajectory data
  const xyTrajectoryData = useMemo(() => {
    return currentChartData.map((point, index) => ({
      index,
      x: point.x,
      y: point.y,
      setpoint_x: point.setpoint_x,
      setpoint_y: point.setpoint_y,
      timestamp: point.timestamp
    }))
  }, [currentChartData])

  // Generate Z trajectory data
  const zTrajectoryData = useMemo(() => {
    return currentChartData.map((point, index) => ({
      index,
      z: point.z,
      setpoint_z: point.setpoint_z,
      timestamp: point.timestamp
    }))
  }, [currentChartData])

  return (
    <div className="h-full w-full bg-dark-bg p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark-text flex items-center gap-2">
              <Navigation className="w-6 h-6" />
              Trajectory Analyzer
            </h1>
            <p className="text-dark-text-secondary text-sm mt-1">
              Analyze 2D XY and Z trajectories with setpoints from ULOG data
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* File Upload */}
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              {isParsing ? 'Parsing...' : 'Upload ULOG'}
              <input
                type="file"
                accept=".ulg"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isParsing}
              />
            </label>

            {/* Playback Controls */}
            {trajectoryData.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                
                <button
                  onClick={() => setCurrentTimeIndex(0)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>

                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  className="px-3 py-2 bg-dark-surface border border-dark-border text-dark-text rounded-lg"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={5}>5x</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Data Info */}
        {trajectoryData.length > 0 && (
          <div className="mt-4 flex items-center gap-6 text-sm text-dark-text-secondary">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>{trajectoryData.length} trajectory points</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>Progress: {currentTimeIndex + 1} / {trajectoryData.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Duration: {((trajectoryData[trajectoryData.length - 1]?.timestamp - trajectoryData[0]?.timestamp) / 1000).toFixed(1)}s</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      {trajectoryData.length === 0 ? (
        <div className="flex items-center justify-center h-96 bg-dark-surface border border-dark-border rounded-lg">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-dark-text-secondary mx-auto mb-4" />
            <h3 className="text-dark-text text-lg font-semibold mb-2">No Trajectory Data</h3>
            <p className="text-dark-text-secondary text-sm mb-4">
              Upload a ULOG file to analyze trajectory data
            </p>
            <p className="text-xs text-dark-text-secondary">
              Looking for: vehicle_local_position, position_setpoint_triplet, trajectory_setpoint
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 h-full">
          {/* 2D XY Trajectory Plot - Left Side */}
          <div className="bg-dark-surface border border-dark-border rounded-lg p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-dark-text text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                2D XY Trajectory
              </h3>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm text-dark-text-secondary">
                  <input
                    type="checkbox"
                    checked={showSetpoints}
                    onChange={(e) => setShowSetpoints(e.target.checked)}
                    className="rounded"
                  />
                  Show Setpoints
                </label>
              </div>
            </div>
            
            <div className="h-96">
              {xyTrajectoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={xyTrajectoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="y" 
                    type="number"
                    scale="linear"
                    domain={['dataMin', 'dataMax']}
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    tickFormatter={(value) => value.toFixed(2)}
                  />
                  <YAxis 
                    dataKey="x" 
                    type="number"
                    scale="linear"
                    domain={['dataMin', 'dataMax']}
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    tickFormatter={(value) => value.toFixed(2)}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      color: '#F9FAFB'
                    }}
                    formatter={(value: any, name: string) => [
                      typeof value === 'number' ? value.toFixed(2) : value,
                      name === 'x' ? 'X Position (Y-axis)' : 
                      name === 'y' ? 'Y Position (X-axis)' :
                      name === 'setpoint_x' ? 'Setpoint X' :
                      name === 'setpoint_y' ? 'Setpoint Y' : name
                    ]}
                  />
                  <Legend />
                  
                  {/* Actual trajectory */}
                  <Line
                    type="monotone"
                    dataKey="x"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                    name="Actual Position"
                    connectNulls={false}
                  />
                  
                  {/* Setpoints */}
                  {showSetpoints && (
                    <>
                      <Line
                        type="monotone"
                        dataKey="setpoint_x"
                        stroke="#10B981"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        name="Setpoint X"
                        connectNulls={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="setpoint_y"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        name="Setpoint Y"
                        connectNulls={false}
                      />
                    </>
                  )}
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-dark-text-secondary">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No trajectory data available</p>
                    <p className="text-sm mt-2">Upload a ULOG file to see trajectory data</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Z Trajectory Plot - Right Side */}
          <div className="bg-dark-surface border border-dark-border rounded-lg p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-dark-text text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Z Trajectory (Altitude)
              </h3>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm text-dark-text-secondary">
                  <input
                    type="checkbox"
                    checked={showVelocities}
                    onChange={(e) => setShowVelocities(e.target.checked)}
                    className="rounded"
                  />
                  Show Velocities
                </label>
              </div>
            </div>
            
            <div className="h-96">
              {zTrajectoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={zTrajectoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="index" 
                    type="number"
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    tickFormatter={(value) => value.toString()}
                  />
                  <YAxis 
                    dataKey="z" 
                    type="number"
                    scale="linear"
                    domain={['dataMin', 'dataMax']}
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    tickFormatter={(value) => value.toFixed(2)}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      color: '#F9FAFB'
                    }}
                    formatter={(value: any, name: string) => [
                      typeof value === 'number' ? value.toFixed(2) : value,
                      name === 'z' ? 'Z Position' : 
                      name === 'setpoint_z' ? 'Setpoint Z' : name
                    ]}
                  />
                  <Legend />
                  
                  {/* Actual Z trajectory */}
                  <Line
                    type="monotone"
                    dataKey="z"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={false}
                    name="Actual Z"
                    connectNulls={false}
                  />
                  
                  {/* Z setpoints */}
                  {showSetpoints && (
                    <Line
                      type="monotone"
                      dataKey="setpoint_z"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Setpoint Z"
                      connectNulls={false}
                    />
                  )}
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-dark-text-secondary">
                  <div className="text-center">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No trajectory data available</p>
                    <p className="text-sm mt-2">Upload a ULOG file to see trajectory data</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
