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
        {/* Header */}
        <Header isConnected={isConnected} currentFile={currentFile} />
        
        {/* Main Dashboard - Only Data Analysis */}
        <div className="flex-1 overflow-hidden">
          <VisualizationPanel activeTab={activeTab} />
        </div>
        
        {/* Status Bar */}
        <StatusBar isConnected={isConnected} />
      </div>
    </div>
  )
}
