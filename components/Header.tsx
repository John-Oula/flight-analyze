'use client'

import { motion } from 'framer-motion'
import { 
  Wifi, 
  WifiOff, 
  FileText, 
  Clock, 
  Signal, 
  Battery, 
  Activity,
  Settings,
  Plane,
  ChevronUp,
  ChevronDown
} from 'lucide-react'

interface HeaderProps {
  isConnected: boolean
  currentFile: string | null
  headerCollapsed?: boolean
  onHeaderToggle?: () => void
}

export default function Header({ isConnected, currentFile, headerCollapsed = false, onHeaderToggle }: HeaderProps) {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`panel-military border-b border-military-gray px-6 transition-all duration-300 ${
        headerCollapsed ? 'py-2' : 'py-4'
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-military-orange rounded-lg flex items-center justify-center">
              <Plane className="w-5 h-5 text-military-black" />
            </div>
            <div className={`transition-all duration-300 ${headerCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <h1 className="text-military-orange font-bold text-lg tracking-wider">
                FLIGHT LOG ANALYZER
              </h1>
              <p className="text-military-white text-xs font-mono">
                FLIGHT ANALYSIS PLATFORM
              </p>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center space-x-6">
          {/* Connection Status */}
          <div className={`flex items-center space-x-2 transition-all duration-300 ${
            headerCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}>
            {isConnected ? (
              <Wifi className="w-4 h-4 text-hud-green" />
            ) : (
              <WifiOff className="w-4 h-4 text-hud-red" />
            )}
            <span className="text-xs font-mono text-military-white">
              {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>

          {/* Current File */}
          {currentFile && (
            <div className={`flex items-center space-x-2 transition-all duration-300 ${
              headerCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}>
              <FileText className="w-4 h-4 text-military-orange" />
              <span className="text-xs font-mono text-military-white max-w-32 truncate">
                {currentFile}
              </span>
            </div>
          )}

          {/* System Status */}
          <div className={`flex items-center space-x-4 transition-all duration-300 ${
            headerCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}>
            <div className="flex items-center space-x-1">
              <Signal className="w-3 h-3 text-hud-green" />
              <span className="text-xs font-mono text-military-white">100%</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Battery className="w-3 h-3 text-hud-green" />
              <span className="text-xs font-mono text-military-white">87%</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Activity className="w-3 h-3 text-hud-blue animate-pulse" />
              <span className="text-xs font-mono text-military-white">ACTIVE</span>
            </div>
          </div>

          {/* Time */}
          <div className={`flex items-center space-x-2 transition-all duration-300 ${
            headerCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}>
            <Clock className="w-4 h-4 text-military-orange" />
            <span className="text-xs font-mono text-military-white">
              {new Date().toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </div>

          {/* Settings */}
          <button 
            className={`p-2 hover:bg-military-gray rounded transition-colors transition-all duration-300 ${
              headerCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4 text-military-orange" />
          </button>
          
          {/* Header Toggle Button */}
          <button
            className="p-2 hover:bg-military-gray rounded transition-colors"
            onClick={onHeaderToggle}
            title={headerCollapsed ? 'Show header' : 'Hide header'}
          >
            {headerCollapsed ? (
              <ChevronDown className="w-4 h-4 text-military-orange" />
            ) : (
              <ChevronUp className="w-4 h-4 text-military-orange" />
            )}
          </button>
        </div>
      </div>
    </motion.header>
  )
}
