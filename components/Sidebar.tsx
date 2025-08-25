'use client'

import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Globe, 
  Play, 
  Database, 
  FileText, 
  Bot, 
  Settings,
  Layers,
  Code,
  Eye,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Plane,
  RadioTower
} from 'lucide-react'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const tabs = [
  { id: 'dashboard', label: 'DASHBOARD', icon: BarChart3 },
  { id: '3d-view', label: '3D VISUALIZATION', icon: Globe },
  { id: 'playback', label: 'FLIGHT REPLAY', icon: Play },
  { id: 'data', label: 'DATA ANALYSIS', icon: Database },
  { id: 'telemetry', label: 'TELEMETRY', icon: RadioTower },
  { id: 'reports', label: 'REPORTS', icon: FileText },
  { id: 'ai', label: 'AI ASSISTANT', icon: Bot },
  { id: 'custom', label: 'CUSTOM FUNCTIONS', icon: Code },
  { id: 'multi-view', label: 'MULTI-VIEW', icon: Layers },
  { id: 'export', label: 'EXPORT', icon: Download },
  { id: 'share', label: 'SHARE', icon: Share2 },
  { id: 'settings', label: 'SETTINGS', icon: Settings },
]

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }: SidebarProps) {
  return (
    <motion.aside 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`${collapsed ? 'w-20' : 'w-64'} bg-military-darker border-r border-military-gray flex flex-col transition-all duration-300 ease-in-out overflow-hidden`}
    >
      {/* Logo Section */}
      <div className={`${collapsed ? 'p-2' : 'p-6'} border-b border-military-gray`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-military-orange rounded-lg flex items-center justify-center flex-shrink-0">
              <Plane className="w-6 h-6 text-military-black" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-military-orange font-bold text-sm tracking-wider">
                  FLIGHT ANALYZER
                </h2>
                <p className="text-military-white text-xs font-mono">
                  v1.0.0
                </p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 hover:bg-military-gray rounded transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4 text-military-orange" />
            </button>
          )}
        </div>
        {collapsed && (
          <div className="flex justify-center mt-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 hover:bg-military-gray rounded transition-colors"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4 text-military-orange" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <nav className={`flex-1 ${collapsed ? 'p-2' : 'p-4'} space-y-2`}>
        {tabs.map((tab, index) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} ${collapsed ? 'px-2 py-3' : 'px-4 py-3'} rounded-lg text-left transition-all duration-200 ${
                isActive 
                  ? 'bg-military-orange text-military-black shadow-military-glow' 
                  : 'text-military-white hover:bg-military-gray hover:text-military-orange'
              }`}
              title={collapsed ? tab.label : undefined}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-military-black' : 'text-military-orange'}`} />
              {!collapsed && (
                <span className="text-xs font-mono font-semibold tracking-wider">
                  {tab.label}
                </span>
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* Status Footer */}
      <div className={`${collapsed ? 'p-2' : 'p-4'} border-t border-military-gray`}>
        {!collapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-military-white font-mono">STATUS:</span>
              <span className="text-hud-green font-mono">OPERATIONAL</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-military-white font-mono">MODE:</span>
              <span className="text-military-orange font-mono">ANALYSIS</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-military-white font-mono">UPTIME:</span>
              <span className="text-military-white font-mono">2:34:17</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-3 h-3 bg-hud-green rounded-full"></div>
            <div className="w-3 h-3 bg-military-orange rounded-full"></div>
            <div className="w-3 h-3 bg-military-white rounded-full"></div>
          </div>
        )}
      </div>
    </motion.aside>
  )
}
