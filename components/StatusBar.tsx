'use client'

import { motion } from 'framer-motion'
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  Clock, 
  Cpu, 
  HardDrive,
  AlertTriangle,
  CheckCircle,
  Info,
  Database
} from 'lucide-react'

interface StatusBarProps {
  isConnected: boolean
}

export default function StatusBar({ isConnected }: StatusBarProps) {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="panel-military border-t border-military-gray px-6 py-3"
    >
      <div className="flex items-center justify-between">
        {/* Left Section - Status Indicators */}
        <div className="flex items-center space-x-6">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="w-3 h-3 text-hud-green" />
            ) : (
              <WifiOff className="w-3 h-3 text-hud-red" />
            )}
            <span className="text-military-white text-xs font-mono">
              {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>

          {/* System Status */}
          <div className="flex items-center space-x-2">
            <Activity className="w-3 h-3 text-hud-green animate-pulse" />
            <span className="text-military-white text-xs font-mono">SYSTEM: OPERATIONAL</span>
          </div>

          {/* Current Time */}
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3 text-military-orange" />
            <span className="text-military-white text-xs font-mono">
              {new Date().toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </div>
        </div>

        {/* Center Section - System Metrics */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Cpu className="w-3 h-3 text-hud-blue" />
            <span className="text-military-white text-xs font-mono">CPU:</span>
            <span className="text-hud-green text-xs font-mono font-bold">23%</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Database className="w-3 h-3 text-hud-yellow" />
            <span className="text-military-white text-xs font-mono">RAM:</span>
            <span className="text-hud-green text-xs font-mono font-bold">1.2GB</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <HardDrive className="w-3 h-3 text-hud-blue" />
            <span className="text-military-white text-xs font-mono">DISK:</span>
            <span className="text-hud-green text-xs font-mono font-bold">45GB</span>
          </div>
        </div>

        {/* Right Section - Notifications */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-3 h-3 text-hud-green" />
            <span className="text-military-white text-xs font-mono">READY</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Info className="w-3 h-3 text-military-orange" />
            <span className="text-military-white text-xs font-mono">v1.0.0</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-2">
        <div className="w-full bg-military-gray rounded-full h-1">
          <div className="bg-military-orange h-1 rounded-full animate-pulse" style={{ width: '67%' }}></div>
        </div>
      </div>
    </motion.footer>
  )
}
