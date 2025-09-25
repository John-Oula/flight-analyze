'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Play, 
  Pause, 
  Square, 
  Settings, 
  BarChart3, 
  Globe, 
  Zap, 
  Cpu, 
  Database,
  FileText,
  Bot,
  Layers,
  Code,
  Eye,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import DataPanel from '@/components/DataPanel'
import VisualizationPanel from '@/components/VisualizationPanel'
import ControlPanel from '@/components/ControlPanel'
import StatusBar from '@/components/StatusBar'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isConnected, setIsConnected] = useState(false)
  const [currentFile, setCurrentFile] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [headerCollapsed, setHeaderCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-dark-bg overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header - Hidden in Data Analysis */}
        {activeTab !== 'data' && (
          <Header 
            isConnected={isConnected} 
            currentFile={currentFile} 
            headerCollapsed={headerCollapsed}
            onHeaderToggle={() => setHeaderCollapsed(!headerCollapsed)}
          />
        )}
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'dashboard' ? (
            <div className="h-full w-full bg-dark-bg p-4">
              {/* Grid Layout */}
              <div className="grid grid-cols-3 gap-x-4 h-full">
                
                {/* Container 1 - Flight Mode */}
                <div className="bg-dark-surface border border-dark-border p-3">
                  <div className="mb-2">
                    <h3 className="text-dark-text text-sm font-semibold">FLIGHT MODE</h3>
                    <p className="text-dark-text-secondary text-xs">Manual, stabilized or position hold modes</p>
                  </div>
                </div>

                {/* Container 2 - Attitude Control */}
                <div className="bg-dark-surface border border-dark-border p-3">
                  <div className="mb-2">
                    <h3 className="text-dark-text text-sm font-semibold">ATTITUDE CONTROL</h3>
                    <p className="text-dark-text-secondary text-xs">Roll, pitch, yaw rates and hover stability</p>
                  </div>
                </div>

                {/* Container 3 - Motor Status */}
                <div className="bg-dark-surface border border-dark-border p-3">
                  <div className="mb-2">
                    <h3 className="text-dark-text text-sm font-semibold">MOTOR STATUS</h3>
                    <p className="text-dark-text-secondary text-xs">ESC feedback and thrust distribution</p>
                  </div>
                </div>

                {/* Container 4 - Position Control */}
                <div className="bg-dark-surface border border-dark-border p-3">
                  <div className="mb-2">
                    <h3 className="text-dark-text text-sm font-semibold">POSITION CONTROL</h3>
                    <p className="text-dark-text-secondary text-xs">Local position and velocity estimates</p>
                  </div>
                </div>

                {/* Container 5 - Battery Status */}
                <div className="bg-dark-surface border border-dark-border p-3">
                  <div className="mb-2">
                    <h3 className="text-dark-text text-sm font-semibold">BATTERY STATUS</h3>
                    <p className="text-dark-text-secondary text-xs">Voltage, current and remaining capacity</p>
                  </div>
                </div>

                {/* Container 6 - Optical Flow */}
                <div className="bg-dark-surface border border-dark-border p-3">
                  <div className="mb-2">
                    <h3 className="text-dark-text text-sm font-semibold">OPTICAL FLOW</h3>
                    <p className="text-dark-text-secondary text-xs">Ground velocity and flow quality</p>
                  </div>
                </div>

                {/* Container 7 - System Health */}
                <div className="bg-dark-surface border border-dark-border p-3">
                  <div className="mb-2">
                    <h3 className="text-dark-text text-sm font-semibold">SYSTEM HEALTH</h3>
                    <p className="text-dark-text-secondary text-xs">CPU usage, memory and sensor status</p>
                  </div>
                </div>

                {/* Container 8 - RC Input */}
                <div className="bg-dark-surface border border-dark-border p-3">
                  <div className="mb-2">
                    <h3 className="text-dark-text text-sm font-semibold">RC INPUT</h3>
                    <p className="text-dark-text-secondary text-xs">Radio control channel values and failsafe</p>
                  </div>
                </div>

                {/* Container 9 - Telemetry */}
                <div className="bg-dark-surface border border-dark-border p-3">
                  <div className="mb-2">
                    <h3 className="text-dark-text text-sm font-semibold">TELEMETRY</h3>
                    <p className="text-dark-text-secondary text-xs">Data link quality and transmission rates</p>
                  </div>
                </div>

              </div>
            </div>
          ) : activeTab === 'trajectory' ? (
            <div className="h-full w-full">
              <iframe 
                src="/trajectory" 
                className="w-full h-full border-0"
                title="Trajectory Analyzer"
              />
            </div>
          ) : (
            <VisualizationPanel activeTab={activeTab} />
          )}
        </div>
        
        {/* Status Bar */}
        {/* <StatusBar isConnected={isConnected} /> */}
      </div>
      
      {/* Floating Status Indicator - shown when header collapsed */}
      {headerCollapsed && activeTab !== 'data' && (
        <div className="fixed top-2 right-4 bg-military-darker border border-military-gray rounded-lg px-3 py-1 text-xs text-military-white shadow-lg z-50">
          <div className="flex items-center space-x-3">
            <span>{isConnected ? 'CONNECTED' : 'DISCONNECTED'}</span>
            <span>•</span>
            <span>100%</span>
            <span>•</span>
            <span>87%</span>
            <span>•</span>
            <span>ACTIVE</span>
            <span>•</span>
            <span>{new Date().toLocaleTimeString('en-US', { 
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}</span>
          </div>
        </div>
      )}
    </div>
  )
}
