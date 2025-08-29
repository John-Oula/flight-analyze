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
        
        {/* Main Dashboard - Only Data Analysis */}
        <div className="flex-1 overflow-hidden">
          <VisualizationPanel activeTab={activeTab} />
        </div>
        
        {/* Status Bar */}
        <StatusBar isConnected={isConnected} />
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
