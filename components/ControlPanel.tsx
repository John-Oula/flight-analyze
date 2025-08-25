'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Wifi, 
  WifiOff,
  Zap,
  Target,
  Gauge,
  Activity,
  Signal,
  Battery,
  Thermometer,
  Compass
} from 'lucide-react'

interface ControlPanelProps {
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
}

export default function ControlPanel({ isConnected, setIsConnected }: ControlPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState('00:00:00')
  const [totalTime, setTotalTime] = useState('00:05:30')

  const toggleConnection = () => {
    setIsConnected(!isConnected)
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="panel-military rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-military-orange font-semibold text-sm uppercase tracking-wider">
          <Target className="inline w-4 h-4 mr-2" />
          FLIGHT CONTROLS
        </h3>
        <div className="flex space-x-2">
          <button 
            onClick={toggleConnection}
            className={`px-4 py-2 text-xs font-mono font-medium uppercase tracking-wider border transition-all duration-200 focus:outline-none focus:ring-1 active:scale-95 ${
              isConnected ? 'bg-hud-green text-military-black border-hud-green' : 'bg-hud-red text-military-white border-hud-red'
            }`}
          >
            {isConnected ? (
              <Wifi className="w-3 h-3 mr-1" />
            ) : (
              <WifiOff className="w-3 h-3 mr-1" />
            )}
            {isConnected ? 'CONNECTED' : 'CONNECT'}
          </button>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="bg-military-darker rounded-lg p-4 mb-4">
        <h4 className="text-military-white text-xs font-semibold uppercase tracking-wider mb-3">
          PLAYBACK CONTROLS
        </h4>
        
        <div className="flex items-center justify-center space-x-2 mb-3">
          <button 
            className="px-4 py-2 text-xs font-mono font-medium text-military-orange uppercase tracking-wider bg-transparent border border-military-orange hover:bg-military-orange hover:text-military-black transition-all duration-200 focus:outline-none focus:ring-1 active:scale-95"
            title="Reset"
            aria-label="Reset playback"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button 
            onClick={togglePlayback}
            className={`relative inline-flex items-center justify-center px-6 py-3 text-sm font-mono font-semibold text-white uppercase tracking-wider bg-military-dark border-2 border-military-orange transition-all duration-200 ease-in-out hover:bg-military-orange hover:text-military-black focus:outline-none focus:ring-2 focus:ring-military-orange focus:ring-offset-2 focus:ring-offset-military-black active:scale-95 ${isPlaying ? 'bg-military-orange text-military-black' : ''}`}
            title={isPlaying ? "Pause" : "Play"}
            aria-label={isPlaying ? "Pause playback" : "Start playback"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button 
            className="px-4 py-2 text-xs font-mono font-medium text-military-orange uppercase tracking-wider bg-transparent border border-military-orange hover:bg-military-orange hover:text-military-black transition-all duration-200 focus:outline-none focus:ring-1 active:scale-95"
            title="Stop"
            aria-label="Stop playback"
          >
            <Square className="w-4 h-4" />
          </button>
        </div>

        {/* Time Display */}
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-military-white">{currentTime}</span>
          <div className="flex-1 mx-3">
            <div className="w-full bg-military-gray rounded-full h-1">
              <div className="bg-military-orange h-1 rounded-full" style={{ width: '35%' }}></div>
            </div>
          </div>
          <span className="text-military-white">{totalTime}</span>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="bg-military-darker rounded-lg p-4">
        <h4 className="text-military-white text-xs font-semibold uppercase tracking-wider mb-3">
          REAL-TIME METRICS
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Gauge className="w-3 h-3 text-hud-green" />
            <span className="text-military-white text-xs font-mono">ALT:</span>
            <span className="text-hud-green text-xs font-mono font-bold">127.3m</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Compass className="w-3 h-3 text-hud-blue" />
            <span className="text-military-white text-xs font-mono">HDG:</span>
            <span className="text-hud-blue text-xs font-mono font-bold">245°</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Activity className="w-3 h-3 text-hud-yellow" />
            <span className="text-military-white text-xs font-mono">SPD:</span>
            <span className="text-hud-yellow text-xs font-mono font-bold">12.4m/s</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Thermometer className="w-3 h-3 text-hud-red" />
            <span className="text-military-white text-xs font-mono">TEMP:</span>
            <span className="text-hud-red text-xs font-mono font-bold">23°C</span>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-3 pt-3 border-t border-military-gray">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <Signal className="w-4 h-4 text-hud-green mx-auto mb-1" />
              <span className="text-military-white text-xs font-mono">SIGNAL</span>
              <div className="text-hud-green text-xs font-mono font-bold">100%</div>
            </div>
            
            <div className="text-center">
              <Battery className="w-4 h-4 text-hud-green mx-auto mb-1" />
              <span className="text-military-white text-xs font-mono">BATTERY</span>
              <div className="text-hud-green text-xs font-mono font-bold">87%</div>
            </div>
            
            <div className="text-center">
              <Zap className="w-4 h-4 text-hud-blue mx-auto mb-1" />
              <span className="text-military-white text-xs font-mono">POWER</span>
              <div className="text-hud-blue text-xs font-mono font-bold">ON</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
