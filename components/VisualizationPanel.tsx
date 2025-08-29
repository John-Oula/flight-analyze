'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Globe, 
  BarChart3, 
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
  Maximize2,
  Grid3X3,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Activity,
  Upload,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  BarChart3 as BarChart3Icon,
  Plus,
  X,
  Grid,
  Columns,
  Square,
  MessageSquare,
  Search,
  PanelLeft,
  PanelTop
} from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import Plotly with better error handling
const Plot = dynamic(
  () => import('react-plotly.js').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-64 text-dark-text-secondary">Loading chart...</div>
  }
)

// Fallback component for when Plotly fails to load
const PlotFallback = ({ data, layout }: { data: any[], layout: any }) => {
  return (
    <div className="flex items-center justify-center h-full bg-dark-surface-light rounded-lg border border-dark-border">
      <div className="text-center">
        <BarChart3Icon className="w-16 h-16 text-dark-text-secondary mx-auto mb-4" />
        <h3 className="text-dark-text text-lg font-semibold mb-2">Chart Unavailable</h3>
        <p className="text-dark-text-secondary text-sm mb-4">
          Unable to load the plotting library. Please refresh the page.
        </p>
        <div className="text-left text-xs text-dark-text-secondary">
          <p>Data points: {data.length}</p>
          <p>Topics: {data.map((trace: any) => trace.name).join(', ')}</p>
        </div>
      </div>
    </div>
  )
}

interface Plot {
  id: string
  title: string
  data: any[]
  layout: any
  topics: string[]
}

interface Tab {
  id: string
  name: string
  selectedTopics: string[]
  plotData: any[]
  plotLayout: any
  timeRange: [number, number]
  layoutColumns: number
  plots: Plot[]
}

interface VisualizationPanelProps {
  activeTab: string
}

export default function VisualizationPanel({ activeTab }: VisualizationPanelProps) {
  const renderContent = () => {
    switch (activeTab) {
      case 'data':
        return <DataAnalysisView />
      case 'telemetry':
        return <TelemetryView />
      default:
        return <DataAnalysisView />
    }
  }

  return (
    <motion.div 
      key={activeTab}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full w-full"
    >
      {renderContent()}
    </motion.div>
  )
}

function DashboardView() {
  return (
    <div className="h-full p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-dark-text text-xl font-semibold">Flight Analysis Dashboard</h1>
            <p className="text-dark-text-secondary text-sm">Real-time flight data monitoring and analysis</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-dark-text-secondary text-sm">Refreshed 5 sec ago</span>
            <select 
              className="bg-dark-surface border border-dark-border text-dark-text px-3 py-1 rounded text-sm"
              title="Time range selector"
              aria-label="Select time range"
            >
              <option>Last 1 hour</option>
              <option>Last 6 hours</option>
              <option>Last 24 hours</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-dark-text-secondary text-sm">Altitude</h3>
            <span className="text-chart-blue text-2xl font-bold">127.3m</span>
          </div>
          <div className="w-full bg-dark-surface-light rounded-full h-2">
            <div className="bg-chart-blue h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-dark-text-secondary text-sm">Ground Speed</h3>
            <span className="text-chart-green text-2xl font-bold">12.4m/s</span>
          </div>
          <div className="w-full bg-dark-surface-light rounded-full h-2">
            <div className="bg-chart-green h-2 rounded-full" style={{ width: '45%' }}></div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-dark-text-secondary text-sm">Battery</h3>
            <span className="text-chart-yellow text-2xl font-bold">87%</span>
          </div>
          <div className="w-full bg-dark-surface-light rounded-full h-2">
            <div className="bg-chart-yellow h-2 rounded-full" style={{ width: '87%' }}></div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6 h-96">
        {/* Altitude Over Time */}
        <div className="panel">
          <div className="panel-header">
            <h3 className="text-dark-text font-semibold">Altitude Over Time</h3>
          </div>
          <div className="p-4 h-full">
            <div className="h-full bg-dark-surface-light rounded flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-accent-primary mx-auto mb-3" />
                <p className="text-dark-text-secondary text-sm">Altitude trend chart</p>
                <p className="text-dark-text-muted text-xs">Line graph showing altitude changes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Speed Analysis */}
        <div className="panel">
          <div className="panel-header">
            <h3 className="text-dark-text font-semibold">Speed Analysis</h3>
          </div>
          <div className="p-4 h-full">
            <div className="h-full bg-dark-surface-light rounded flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-12 h-12 text-chart-green mx-auto mb-3" />
                <p className="text-dark-text-secondary text-sm">Speed performance</p>
                <p className="text-dark-text-muted text-xs">Velocity and acceleration data</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="panel">
          <div className="panel-header">
            <h3 className="text-dark-text font-semibold">System Health</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-dark-text-secondary text-sm">GPS Signal</span>
                <span className="status-indicator status-success">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-dark-text-secondary text-sm">IMU Status</span>
                <span className="status-indicator status-success">Calibrated</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-dark-text-secondary text-sm">Compass</span>
                <span className="status-indicator status-warning">Warning</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-dark-text-secondary text-sm">Radio Link</span>
                <span className="status-indicator status-success">Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Flight Path */}
        <div className="panel">
          <div className="panel-header">
            <h3 className="text-dark-text font-semibold">3D Flight Path</h3>
          </div>
          <div className="p-4 h-full">
            <div className="h-full bg-dark-surface-light rounded flex items-center justify-center">
              <div className="text-center">
                <Globe className="w-12 h-12 text-chart-purple mx-auto mb-3" />
                <p className="text-dark-text-secondary text-sm">3D Visualization</p>
                <p className="text-dark-text-muted text-xs">Interactive flight trajectory</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ThreeDView() {
  return (
    <div className="h-full p-6">
      <div className="bg-military-black rounded-lg h-full flex items-center justify-center">
        <div className="text-center">
          <Globe className="w-16 h-16 text-military-orange mx-auto mb-4" />
          <h3 className="text-military-orange text-lg font-bold mb-2">3D FLIGHT VISUALIZATION</h3>
          <p className="text-military-white text-sm font-mono mb-4">Interactive 3D flight path with real-time data</p>
          <div className="flex space-x-4 justify-center">
            <button className="px-4 py-2 text-xs font-mono font-medium text-military-orange uppercase tracking-wider bg-transparent border border-military-orange hover:bg-military-orange hover:text-military-black transition-all duration-200 focus:outline-none focus:ring-1 active:scale-95">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset View
            </button>
            <button className="px-4 py-2 text-xs font-mono font-medium text-military-orange uppercase tracking-wider bg-transparent border border-military-orange hover:bg-military-orange hover:text-military-black transition-all duration-200 focus:outline-none focus:ring-1 active:scale-95">
              <Maximize2 className="w-4 h-4 mr-2" />
              Fullscreen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlaybackView() {
  return (
    <div className="h-full p-6">
      <div className="bg-military-black rounded-lg h-full flex items-center justify-center">
        <div className="text-center">
          <Play className="w-16 h-16 text-military-orange mx-auto mb-4" />
          <h3 className="text-military-orange text-lg font-bold mb-2">FLIGHT REPLAY</h3>
          <p className="text-military-white text-sm font-mono mb-4">Step-through flight data with time controls</p>
          <div className="flex space-x-4 justify-center">
            <button className="px-4 py-2 text-xs font-mono font-medium text-military-orange uppercase tracking-wider bg-transparent border border-military-orange hover:bg-military-orange hover:text-military-black transition-all duration-200 focus:outline-none focus:ring-1 active:scale-95">
              <RotateCcw className="w-4 h-4 mr-2" />
              Rewind
            </button>
            <button className="relative inline-flex items-center justify-center px-6 py-3 text-sm font-mono font-semibold text-white uppercase tracking-wider bg-military-dark border-2 border-military-orange transition-all duration-200 ease-in-out hover:bg-military-orange hover:text-military-black focus:outline-none focus:ring-2 focus:ring-military-orange focus:ring-offset-2 focus:ring-offset-military-black active:scale-95">
              <Play className="w-4 h-4 mr-2" />
              Play
            </button>
            <button className="px-4 py-2 text-xs font-mono font-medium text-military-orange uppercase tracking-wider bg-transparent border border-military-orange hover:bg-military-orange hover:text-military-black transition-all duration-200 focus:outline-none focus:ring-1 active:scale-95">
              <Square className="w-4 h-4 mr-2" />
              Stop
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DataAnalysisView() {
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set())
  const [sidebarWidth, setSidebarWidth] = useState(400)
  const [isDragging, setIsDragging] = useState(false)
  const [isFileDragging, setIsFileDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<any>(null)
  const [isParsing, setIsParsing] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)
  
  // Tab system state
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: '1',
      name: 'Analysis 1',
      selectedTopics: [],
      plotData: [],
      plotLayout: {},
      timeRange: [0, 100],
      layoutColumns: 2,
      plots: []
    }
  ])
  const [activeTabId, setActiveTabId] = useState<string>('1')
  const [isPlotDragging, setIsPlotDragging] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [headerCollapsed, setHeaderCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Get current active tab
  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0]

  const addNewTab = () => {
    const newTabId = (tabs.length + 1).toString()
    const newTab: Tab = {
      id: newTabId,
      name: `Analysis ${newTabId}`,
      selectedTopics: [],
      plotData: [],
      plotLayout: {},
      timeRange: [0, 100],
      layoutColumns: 2,
      plots: []
    }
    setTabs(prev => [...prev, newTab])
    setActiveTabId(newTabId)
  }

  const removeTab = (tabId: string) => {
    if (tabs.length <= 1) return // Don't remove the last tab
    
    setTabs(prev => prev.filter(tab => tab.id !== tabId))
    
    // If we're removing the active tab, switch to the first available tab
    if (activeTabId === tabId) {
      const remainingTabs = tabs.filter(tab => tab.id !== tabId)
      setActiveTabId(remainingTabs[0] && remainingTabs[0].id || '1')
    }
  }

  const updateTab = (tabId: string, updates: Partial<Tab>) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, ...updates } : tab
    ))
  }

  const addPlotToTab = (tabId: string, topics: string[]) => {
    const plotId = Date.now().toString()
    const plotData = topics.length > 0 ? generatePlotData(topics) : []
    const newPlot: Plot = {
      id: plotId,
      title: generatePlotTitle(topics),
      data: plotData,
      layout: {
        // title: { text: 'Flight Data', font: { color: '#E5E7EB', size: 16 } },
        xaxis: { 
          title: { text: 'Time', font: { color: '#9CA3AF', size: 12 } }, 
          gridcolor: '#374151', 
          color: '#9CA3AF', 
          showgrid: true,
          tickfont: { size: 10 }
        },
        yaxis: { 
          title: { text: 'Value', font: { color: '#9CA3AF', size: 12 } }, 
          gridcolor: '#374151', 
          color: '#9CA3AF', 
          showgrid: true,
          tickfont: { size: 10 }
        },
        plot_bgcolor: '#1F2937',
        paper_bgcolor: '#1F2937',
        font: { color: '#E5E7EB' },
        margin: { l: 60, r: 30, t: 60, b: 60 },
        showlegend: true,
        legend: { 
          x: 0.02, 
          y: 0.98, 
          bgcolor: 'rgba(31, 41, 55, 0.9)', 
          bordercolor: '#374151', 
          borderwidth: 1, 
          font: { color: '#E5E7EB', size: 10 } 
        },
        hovermode: 'closest',
        dragmode: 'pan'
      },
      topics: topics
    }
    
    updateTab(tabId, { 
      plots: [...tabs.find(t => t.id === tabId)?.plots || [], newPlot]
    })
  }

  // Generate data for individual plots
  const generatePlotData = (topics: string[]) => {
    if (!parsedData || !parsedData.messages) return []

    const traces: any[] = []
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316']

    topics.forEach((topicId, index) => {
      const parts = topicId.split('.')
      const messageId = parts[0]
      const fieldName = parts[1] || null
      const componentLabel = parts[2] || null
      const message = parsedData.messages[messageId]
      
      if (message && message.data && message.data.length > 0) {
        const color = colors[index % colors.length]
        
        if (fieldName) {
          // Plot specific field
          const xData = message.data.map((sample: any, i: number) => {
            if (typeof sample.timestampMs === 'number') {
              return new Date(sample.timestampMs)
            }
            return i
          })
          const yData = message.data.map((sample: any) => {
            const value = sample[fieldName]
            if (Array.isArray(value)) {
              const idx = getComponentIndex(fieldName, componentLabel || '0', value.length)
              return typeof value[idx] === 'number' ? value[idx] : 0
            }
            return typeof value === 'number' ? value : 0
          }).filter((v: number) => !isNaN(v))

          if (yData.length > 0) {
            traces.push({
              x: xData.slice(0, yData.length),
              y: yData,
              type: 'scatter',
              mode: 'lines',
              name: componentLabel ? `${messageId}.${fieldName}.${componentLabel}` : `${messageId}.${fieldName}`,
              line: { color, width: 2 },
              hovertemplate: 
                '<b>%{fullData.name}</b><br>' +
                'Time: %{x:.1f} ms<br>' +
                'Value: %{y:.4f}<br>' +
                '<extra></extra>'
            })
          }
        } else {
          // Plot all numeric fields in the message
          const sample = message.data[0]
          if (sample) {
            Object.keys(sample).forEach((key, fieldIndex) => {
              if (key !== 'timestampMs' && typeof sample[key] === 'number') {
                const xData = message.data.map((s: any, i: number) => {
                  if (typeof s.timestampMs === 'number') {
                    return new Date(s.timestampMs)
                  }
                  return i
                })
                const yData = message.data.map((s: any) => typeof s[key] === 'number' ? s[key] : 0)
                
                traces.push({
                  x: xData,
                  y: yData,
                  type: 'scatter',
                  mode: 'lines',
                  name: `${messageId}.${key}`,
                  line: { color: colors[(index + fieldIndex) % colors.length], width: 2 },
                  hovertemplate: 
                    '<b>%{fullData.name}</b><br>' +
                    'Time: %{x:.1f} ms<br>' +
                    'Value: %{y:.4f}<br>' +
                    '<extra></extra>'
                })
              }
            })
          }
        }
      }
    })

    return traces
  }

  // Add topic to specific plot
  const addTopicToPlot = (plotId: string, topicId: string) => {
    const tab = tabs.find(t => t.id === activeTabId)
    if (!tab) return

    const plot = tab.plots.find(p => p.id === plotId)
    if (!plot) return

    // Don't add if already exists
    if (plot.topics.includes(topicId)) return

    const updatedTopics = [...plot.topics, topicId]
    const updatedPlot = { 
      ...plot, 
      topics: updatedTopics, 
      data: generatePlotData(updatedTopics),
      title: generatePlotTitle(updatedTopics)
    }
    
    const updatedPlots = tab.plots.map(p => p.id === plotId ? updatedPlot : p)
    updateTab(activeTabId, { plots: updatedPlots })
  }

  // Remove topic from specific plot
  const removeTopicFromPlot = (plotId: string, topicId: string) => {
    const tab = tabs.find(t => t.id === activeTabId)
    if (!tab) return

    const plot = tab.plots.find(p => p.id === plotId)
    if (!plot) return

    const updatedTopics = plot.topics.filter(t => t !== topicId)
    const updatedPlot = { 
      ...plot, 
      topics: updatedTopics, 
      data: generatePlotData(updatedTopics),
      title: generatePlotTitle(updatedTopics)
    }
    
    const updatedPlots = tab.plots.map(p => p.id === plotId ? updatedPlot : p)
    updateTab(activeTabId, { plots: updatedPlots })
  }

  // Generate plot title based on topics
  const generatePlotTitle = (topics: string[]) => {
    if (topics.length === 0) return 'New Plot'
    if (topics.length === 1) {
      const parts = topics[0].split('.')
      return parts.length > 1 ? parts[1] : parts[0]
    }
    return `${topics.length} Topics`
  }

  const toggleMessage = (messageId: string) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(messageId)) {
        newSet.delete(messageId)
      } else {
        newSet.add(messageId)
      }
      return newSet
    })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    
    const newWidth = e.clientX
    if (newWidth > 200 && newWidth < 600) {
      setSidebarWidth(newWidth)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging])

  // Handle topic selection for plotting (supports message, field, and component)
  const handleTopicSelect = (topicOrMessageId: string, fieldName?: string, componentLabel?: string) => {
    const fullTopicId = fieldName
      ? (componentLabel ? `${topicOrMessageId}.${fieldName}.${componentLabel}` : `${topicOrMessageId}.${fieldName}`)
      : topicOrMessageId

    const newSelectedTopics = activeTab.selectedTopics.includes(fullTopicId)
      ? activeTab.selectedTopics.filter(t => t !== fullTopicId)
      : [...activeTab.selectedTopics, fullTopicId]

    updateTab(activeTabId, { selectedTopics: newSelectedTopics })
  }

  // Generate time-series data for plotting
  const generateTimeSeriesData = () => {
    if (!parsedData || !parsedData.messages) return []

    const traces: any[] = []
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316']

    activeTab.selectedTopics.forEach((topicId, index) => {
      const parts = topicId.split('.')
      const messageId = parts[0]
      const fieldName = parts[1] || null
      const componentLabel = parts[2] || null
      const message = parsedData.messages[messageId]
      
      if (message && message.data && message.data.length > 0) {
        const color = colors[index % colors.length]
        
        if (fieldName) {
          // Plot specific field
          const xData = message.data.map((sample: any, i: number) => {
            if (typeof sample.timestampMs === 'number') {
              // Plotly expects JS Date or ISO string when xaxis.type is 'date'
              return new Date(sample.timestampMs)
            }
            return i
          })
          const yData = message.data.map((sample: any) => {
            const value = sample[fieldName]
            if (Array.isArray(value)) {
              const idx = getComponentIndex(fieldName, componentLabel || '0', value.length)
              return typeof value[idx] === 'number' ? value[idx] : 0
            }
            return typeof value === 'number' ? value : 0
          }).filter((v: number) => !isNaN(v))

          if (yData.length > 0) {
            traces.push({
              x: xData.slice(0, yData.length),
              y: yData,
              type: 'scatter',
              mode: 'lines',
              name: componentLabel ? `${messageId}.${fieldName}.${componentLabel}` : `${messageId}.${fieldName}`,
              line: { color, width: 2 },
              hovertemplate: 
                '<b>%{fullData.name}</b><br>' +
                'Time: %{x:.1f} ms<br>' +
                'Value: %{y:.4f}<br>' +
                '<extra></extra>'
            })
          }
        } else {
          // Plot all numeric fields in the message
          const sample = message.data[0]
          if (sample) {
            Object.keys(sample).forEach((key, fieldIndex) => {
              if (key !== 'timestampMs' && typeof sample[key] === 'number') {
                const xData = message.data.map((s: any, i: number) => {
                  if (typeof s.timestampMs === 'number') {
                    return new Date(s.timestampMs)
            }
            return i
          })
                const yData = message.data.map((s: any) => typeof s[key] === 'number' ? s[key] : 0)

          traces.push({
            x: xData,
            y: yData,
            type: 'scatter',
            mode: 'lines',
                  name: `${messageId}.${key}`,
                  line: { color: colors[(index + fieldIndex) % colors.length], width: 2 },
            hovertemplate: 
              '<b>%{fullData.name}</b><br>' +
              'Time: %{x:.1f} ms<br>' +
                    'Value: %{y:.4f}<br>' +
              '<extra></extra>'
          })
              }
            })
          }
        }
      }
    })

    return traces
  }

    // Update plot data when selected topics change
  useEffect(() => {
    if (parsedData && activeTab.selectedTopics.length > 0) {
      const traces = generateTimeSeriesData()
      const layout = {
        title: { text: 'Flight Data Analysis', font: { color: '#E5E7EB', size: 20 } },
        xaxis: {
          title: { text: 'Time', font: { color: '#9CA3AF', size: 14 } }, 
          gridcolor: '#374151',
          color: '#9CA3AF',
          showgrid: true,
          type: 'date',
          tickformat: '%H:%M:%S',
          tickfont: { size: 12 }
        },
        yaxis: {
          title: { text: 'Value', font: { color: '#9CA3AF', size: 14 } }, 
          gridcolor: '#374151',
          color: '#9CA3AF',
          showgrid: true,
          tickfont: { size: 12 }
        },
        plot_bgcolor: '#1F2937',
        paper_bgcolor: '#1F2937',
        font: { color: '#E5E7EB' },
        margin: { l: 80, r: 40, t: 80, b: 80 },
        showlegend: true,
        legend: {
          x: 0.02,
          y: 0.98,
          bgcolor: 'rgba(31, 41, 55, 0.9)', 
          bordercolor: '#374151',
          borderwidth: 1,
          font: { color: '#E5E7EB', size: 12 } 
        },
        hovermode: 'closest',
        dragmode: 'pan'
      }
      
      updateTab(activeTabId, { plotData: traces, plotLayout: layout })
    } else {
      updateTab(activeTabId, { plotData: [], plotLayout: {} })
    }
  }, [activeTab.selectedTopics, parsedData, activeTabId])

  // Update individual plot data when parsed data changes
  useEffect(() => {
    if (parsedData && activeTab.plots.length > 0) {
      const updatedPlots = activeTab.plots.map(plot => ({
        ...plot,
        data: generatePlotData(plot.topics)
      }))
      updateTab(activeTabId, { plots: updatedPlots })
    }
  }, [parsedData, activeTabId])

  const handleFileDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsFileDragging(true)
  }

  const handleFileDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsFileDragging(false)
  }

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsFileDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    const ulogFile = files.find(file => file.name.endsWith('.ulg') || file.name.endsWith('.tlog'))
    
    if (ulogFile) {
      setUploadedFile(ulogFile)
      parseULogFile(ulogFile)
    } else {
      alert('Please upload a ULOG (.ulg) or TLOG (.tlog) file')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setUploadedFile(f)
      parseULogFile(f)
    }
    e.target.value = ''
  }

  const parseULogFile = async (file: File) => {
    setIsParsing(true)
    try {
      console.log('Uploading ULOG file to API for parsing...')
      
      // Create FormData to send file to API
      const formData = new FormData()
      formData.append('file', file)
      
      // Send file to API for parsing
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
      
      const parsedData = result.data
      
      setParsedData(parsedData)
      console.log('Successfully parsed ULOG file via API:', {
        fileSize: file.size,
        messageCount: Object.keys(parsedData.messages).length,
        messages: Object.keys(parsedData.messages),
        totalMessages: parsedData.header.messageCount
      })
      
    } catch (error) {
      console.error('Error parsing ULOG file:', error)
      
      // Provide more specific error messages
      let errorMessage = 'Error parsing ULOG file. '
      if (error instanceof Error) {
        if (error.message.includes('not a valid ULog file')) {
          errorMessage += 'This file does not appear to be a valid ULOG file. Please ensure you are uploading a PX4 ULOG (.ulg) file.'
        } else if (error.message.includes('corrupted')) {
          errorMessage += 'The ULOG file appears to be corrupted or incomplete.'
        } else if (error.message.includes('Failed to parse')) {
          errorMessage += error.message
        } else {
          errorMessage += error.message
        }
      } else {
        errorMessage += 'Please check if the file is valid and not corrupted.'
      }
      
      alert(errorMessage)
    } finally {
      setIsParsing(false)
    }
  }

  const getFieldDescription = (fieldName: string, fieldType: string): string => {
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

  const parseMessageData = (data: any, fields: any[]): any => {
    // Foxglove ULOG library provides structured data, so we can return it directly
    return data
  }

  const parseValue = (data: any, offset: number, type: string): any => {
    // Foxglove ULOG library provides parsed values, so we can access them directly
    return data
  }

  const getTypeSize = (type: string): number => {
    // Not needed with Foxglove library as data is already parsed
    return 0
  }

  // Helpers for vector/array fields to expose components (e.g., x, y, z)
  const isArrayField = (fieldType: string): number => {
    const match = /\[(\d+)\]/.exec(fieldType)
    return match ? parseInt(match[1], 10) : 0
  }

  const getComponentLabels = (fieldName: string, count: number): string[] => {
    if (count === 3) return ['x', 'y', 'z']
    if (count === 2) return ['x', 'y']
    if (count === 4) return fieldName === 'q' ? ['q0', 'q1', 'q2', 'q3'] : ['x', 'y', 'z', 'w']
    return Array.from({ length: count }, (_, i) => String(i))
  }

  const getComponentIndex = (fieldName: string, label: string, length: number): number => {
    const lower = label.toLowerCase()
    if (lower === 'x') return 0
    if (lower === 'y') return 1
    if (lower === 'z') return 2
    if (lower === 'w') return 3
    // quaternion labels
    if (lower === 'q0') return 0
    if (lower === 'q1') return 1
    if (lower === 'q2') return 2
    if (lower === 'q3') return 3
    const asNum = Number.parseInt(lower, 10)
    if (!Number.isNaN(asNum)) return Math.max(0, Math.min(length - 1, asNum))
    return 0
  }

  const getSampleValues = (message: any): any => {
    if (message.data.length === 0) return null
    
    // Foxglove ULOG library provides structured data, so we can return the first message directly
    try {
      return message.data[0]
    } catch (error) {
      console.error('Error accessing sample data:', error)
      return null
    }
  }

  // Group uORB messages by commonality
  const groupMessages = (messages: any) => {
    const groups: any = {
      'Sensors & IMU': [],
      'Position & Navigation': [],
      'System Status': [],
      'Power & Battery': [],
      'Other Messages': []
    }
    
    Object.entries(messages).forEach(([msgName, msgData]: [string, any]) => {
      const message = {
        id: msgName,
        name: msgName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: `uORB message: ${msgName}`,
        fields: msgData.fields || [],
        messageCount: msgData.messageCount || 0,
        frequency: msgData.frequency || 0,
        lastUpdate: msgData.lastUpdate || new Date().toISOString(),
        data: msgData.data || []
      }
      
      // Categorize messages
      if (msgName.includes('sensor') || msgName.includes('imu') || msgName.includes('accel') || msgName.includes('gyro') || msgName.includes('mag')) {
        groups['Sensors & IMU'].push(message)
      } else if (msgName.includes('position') || msgName.includes('attitude') || msgName.includes('gps') || msgName.includes('nav')) {
        groups['Position & Navigation'].push(message)
      } else if (msgName.includes('status') || msgName.includes('vehicle') || msgName.includes('system')) {
        groups['System Status'].push(message)
      } else if (msgName.includes('battery') || msgName.includes('power') || msgName.includes('voltage')) {
        groups['Power & Battery'].push(message)
      } else {
        groups['Other Messages'].push(message)
      }
    })
    
    return groups
  }

  // Filter messages based on search term
  const filterMessages = (messages: any, searchTerm: string) => {
    if (!searchTerm.trim()) return messages
    
    const filteredGroups: any = {}
    
    Object.entries(messages).forEach(([groupName, groupMessages]: [string, any]) => {
      const filteredGroupMessages = groupMessages.filter((message: any) => {
        const searchLower = searchTerm.toLowerCase()
        
        // Search in message name
        if (message.name.toLowerCase().includes(searchLower)) return true
        
        // Search in message ID
        if (message.id.toLowerCase().includes(searchLower)) return true
        
        // Search in message description
        if (message.description.toLowerCase().includes(searchLower)) return true
        
        // Search in field names
        if (message.fields.some((field: any) => field.name.toLowerCase().includes(searchLower))) return true
        
        // Search in field descriptions
        if (message.fields.some((field: any) => field.description.toLowerCase().includes(searchLower))) return true
        
        return false
      })
      
      if (filteredGroupMessages.length > 0) {
        filteredGroups[groupName] = filteredGroupMessages
      }
    })
    
    return filteredGroups
  }

  const rawMessageGroups = parsedData ? groupMessages(parsedData.messages) : {
    'Sensors & IMU': [
      {
        id: 'sensor_combined',
        name: 'Sensor Combined',
        description: 'Combined sensor data from IMU, magnetometer, and barometer',
        fields: [
          { name: 'timestamp', type: 'uint64_t', description: 'Timestamp in microseconds' },
          { name: 'gyro_rad', type: 'float[3]', description: 'Angular velocity in rad/s' },
          { name: 'gyro_integral_dt', type: 'uint32_t', description: 'Integration time for gyro' },
          { name: 'accelerometer_timestamp_relative', type: 'int32_t', description: 'Relative timestamp for accelerometer' },
          { name: 'accelerometer_m_s2', type: 'float[3]', description: 'Acceleration in m/s²' },
          { name: 'accelerometer_integral_dt', type: 'uint32_t', description: 'Integration time for accelerometer' },
          { name: 'accelerometer_clipping', type: 'uint8_t', description: 'Accelerometer clipping flags' },
          { name: 'magnetometer_timestamp_relative', type: 'int32_t', description: 'Relative timestamp for magnetometer' },
          { name: 'magnetometer_ga', type: 'float[3]', description: 'Magnetic field in Gauss' },
          { name: 'baro_timestamp_relative', type: 'int32_t', description: 'Relative timestamp for barometer' },
          { name: 'baro_alt_meter', type: 'float', description: 'Barometric altitude in meters' },
          { name: 'baro_temp_celcius', type: 'float', description: 'Barometric temperature in Celsius' }
        ],
        messageCount: 15420,
        frequency: 250.0,
        lastUpdate: '2024-01-15 14:32:45'
      }
    ],
    'Position & Navigation': [
      {
        id: 'vehicle_attitude',
        name: 'Vehicle Attitude',
        description: 'Vehicle attitude in quaternion form',
        fields: [
          { name: 'timestamp', type: 'uint64_t', description: 'Timestamp in microseconds' },
          { name: 'q', type: 'float[4]', description: 'Quaternion representing vehicle attitude' },
          { name: 'delta_q_reset', type: 'float[4]', description: 'Quaternion reset delta' },
          { name: 'quat_reset_counter', type: 'uint8_t', description: 'Quaternion reset counter' }
        ],
        messageCount: 15420,
        frequency: 250.0,
        lastUpdate: '2024-01-15 14:32:45'
      },
      {
        id: 'vehicle_local_position',
        name: 'Vehicle Local Position',
        description: 'Vehicle local position in NED frame',
        fields: [
          { name: 'timestamp', type: 'uint64_t', description: 'Timestamp in microseconds' },
          { name: 'timestamp_sample', type: 'uint64_t', description: 'Timestamp of the sensor sample' },
          { name: 'xy_valid', type: 'bool', description: 'True if x and y are valid' },
          { name: 'z_valid', type: 'bool', description: 'True if z is valid' },
          { name: 'v_xy_valid', type: 'bool', description: 'True if vx and vy are valid' },
          { name: 'v_z_valid', type: 'bool', description: 'True if vz is valid' },
          { name: 'x', type: 'float', description: 'X position in meters' },
          { name: 'y', type: 'float', description: 'Y position in meters' },
          { name: 'z', type: 'float', description: 'Z position in meters' },
          { name: 'vx', type: 'float', description: 'X velocity in m/s' },
          { name: 'vy', type: 'float', description: 'Y velocity in m/s' },
          { name: 'vz', type: 'float', description: 'Z velocity in m/s' },
          { name: 'ax', type: 'float', description: 'X acceleration in m/s²' },
          { name: 'ay', type: 'float', description: 'Y acceleration in m/s²' },
          { name: 'az', type: 'float', description: 'Z acceleration in m/s²' },
          { name: 'heading', type: 'float', description: 'Heading in radians' },
          { name: 'heading_good_for_control', type: 'bool', description: 'True if heading is good for control' }
        ],
        messageCount: 15420,
        frequency: 50.0,
        lastUpdate: '2024-01-15 14:32:45'
      },
      {
        id: 'vehicle_global_position',
        name: 'Vehicle Global Position',
        description: 'Vehicle global position in WGS84 coordinates',
        fields: [
          { name: 'timestamp', type: 'uint64_t', description: 'Timestamp in microseconds' },
          { name: 'timestamp_sample', type: 'uint64_t', description: 'Timestamp of the sensor sample' },
          { name: 'lat', type: 'double', description: 'Latitude in degrees' },
          { name: 'lon', type: 'double', description: 'Longitude in degrees' },
          { name: 'alt', type: 'float', description: 'Altitude in meters' },
          { name: 'alt_ellipsoid', type: 'float', description: 'Ellipsoid altitude in meters' },
          { name: 'delta_alt', type: 'float', description: 'Altitude change' },
          { name: 'eph', type: 'float', description: 'Estimated horizontal position error' },
          { name: 'epv', type: 'float', description: 'Estimated vertical position error' },
          { name: 'terrain_alt', type: 'float', description: 'Terrain altitude in meters' },
          { name: 'terrain_alt_valid', type: 'bool', description: 'True if terrain altitude is valid' },
          { name: 'dead_reckoning', type: 'bool', description: 'True if using dead reckoning' }
        ],
        messageCount: 15420,
        frequency: 10.0,
        lastUpdate: '2024-01-15 14:32:45'
      }
    ],
    'System Status': [
      {
        id: 'vehicle_status',
        name: 'Vehicle Status',
        description: 'Vehicle status information',
        fields: [
          { name: 'timestamp', type: 'uint64_t', description: 'Timestamp in microseconds' },
          { name: 'nav_state', type: 'uint8_t', description: 'Navigation state' },
          { name: 'nav_state_timestamp', type: 'uint64_t', description: 'Navigation state timestamp' },
          { name: 'arming_state', type: 'uint8_t', description: 'Arming state' },
          { name: 'hil_state', type: 'uint8_t', description: 'HIL state' },
          { name: 'failsafe', type: 'bool', description: 'Failsafe state' },
          { name: 'failsafe_and_user_took_over', type: 'bool', description: 'Failsafe and user took over' },
          { name: 'failsafe_defer_state', type: 'uint8_t', description: 'Failsafe defer state' },
          { name: 'gcs_connection_lost', type: 'bool', description: 'GCS connection lost' },
          { name: 'gcs_connection_lost_counter', type: 'uint8_t', description: 'GCS connection lost counter' },
          { name: 'high_latency_data_link_lost', type: 'bool', description: 'High latency data link lost' },
          { name: 'is_vtol', type: 'bool', description: 'True if vehicle is VTOL' },
          { name: 'is_vtol_tailsitter', type: 'bool', description: 'True if vehicle is VTOL tailsitter' },
          { name: 'in_transition_mode', type: 'bool', description: 'True if in transition mode' },
          { name: 'in_transition_to_fw', type: 'bool', description: 'True if transitioning to fixed wing' },
          { name: 'rc_signal_lost', type: 'bool', description: 'RC signal lost' },
          { name: 'rc_input_mode', type: 'uint8_t', description: 'RC input mode' },
          { name: 'data_link_lost', type: 'bool', description: 'Data link lost' },
          { name: 'data_link_lost_counter', type: 'uint8_t', description: 'Data link lost counter' },
          { name: 'engine_failure', type: 'bool', description: 'Engine failure detected' },
          { name: 'mission_failure', type: 'bool', description: 'Mission failure detected' },
          { name: 'geofence_violated', type: 'bool', description: 'Geofence violated' },
          { name: 'failure_detector_status', type: 'uint8_t', description: 'Failure detector status' },
          { name: 'onboard_control_sensors_present', type: 'uint32_t', description: 'Onboard control sensors present' },
          { name: 'onboard_control_sensors_enabled', type: 'uint32_t', description: 'Onboard control sensors enabled' },
          { name: 'onboard_control_sensors_health', type: 'uint32_t', description: 'Onboard control sensors health' },
          { name: 'latest_arming_reason', type: 'uint8_t', description: 'Latest arming reason' },
          { name: 'latest_disarming_reason', type: 'uint8_t', description: 'Latest disarming reason' },
          { name: 'armed_time', type: 'uint64_t', description: 'Armed time' },
          { name: 'takeoff_time', type: 'uint64_t', description: 'Takeoff time' },
          { name: 'system_type', type: 'uint8_t', description: 'System type' },
          { name: 'system_id', type: 'uint8_t', description: 'System ID' },
          { name: 'component_id', type: 'uint8_t', description: 'Component ID' },
          { name: 'safety_button_available', type: 'bool', description: 'Safety button available' },
          { name: 'safety_off', type: 'bool', description: 'Safety off' },
          { name: 'auto_mission_available', type: 'bool', description: 'Auto mission available' },
          { name: 'auto_mission_land_available', type: 'bool', description: 'Auto mission land available' },
          { name: 'pre_flight_checks_pass', type: 'bool', description: 'Pre-flight checks pass' }
        ],
        messageCount: 15420,
        frequency: 10.0,
        lastUpdate: '2024-01-15 14:32:45'
      }
    ],
    'Power & Battery': [
      {
        id: 'battery_status',
        name: 'Battery Status',
        description: 'Battery status information',
        fields: [
          { name: 'timestamp', type: 'uint64_t', description: 'Timestamp in microseconds' },
          { name: 'voltage_v', type: 'float', description: 'Battery voltage in volts' },
          { name: 'voltage_filtered_v', type: 'float', description: 'Filtered battery voltage in volts' },
          { name: 'current_a', type: 'float', description: 'Battery current in amperes' },
          { name: 'current_filtered_a', type: 'float', description: 'Filtered battery current in amperes' },
          { name: 'current_average_a', type: 'float', description: 'Average battery current in amperes' },
          { name: 'discharged_mah', type: 'float', description: 'Discharged capacity in mAh' },
          { name: 'remaining', type: 'float', description: 'Remaining capacity percentage' },
          { name: 'scale', type: 'float', description: 'Battery scale factor' },
          { name: 'temperature', type: 'float', description: 'Battery temperature in Celsius' },
          { name: 'cell_count', type: 'uint8_t', description: 'Number of battery cells' },
          { name: 'source', type: 'uint8_t', description: 'Battery data source' },
          { name: 'priority', type: 'uint8_t', description: 'Battery priority' },
          { name: 'capacity', type: 'uint16_t', description: 'Battery capacity in mAh' },
          { name: 'cycle_count', type: 'uint16_t', description: 'Battery cycle count' },
          { name: 'run_time_to_empty', type: 'uint32_t', description: 'Run time to empty in minutes' },
          { name: 'average_time_to_empty', type: 'uint32_t', description: 'Average time to empty in minutes' },
          { name: 'serial_number', type: 'uint16_t', description: 'Battery serial number' },
          { name: 'manufacture_date', type: 'uint16_t', description: 'Battery manufacture date' },
          { name: 'state_of_health', type: 'uint16_t', description: 'Battery state of health' },
          { name: 'max_error', type: 'uint16_t', description: 'Maximum error' },
          { name: 'id', type: 'uint8_t', description: 'Battery ID' },
          { name: 'interface_error', type: 'uint16_t', description: 'Interface error' },
          { name: 'voltage_cell_v', type: 'float[14]', description: 'Individual cell voltages in volts' },
          { name: 'max_cell_voltage_delta', type: 'float', description: 'Maximum cell voltage delta' },
          { name: 'is_powering_off', type: 'bool', description: 'True if battery is powering off' },
          { name: 'is_required', type: 'bool', description: 'True if battery is required' },
          { name: 'faults', type: 'uint32_t', description: 'Battery faults' },
          { name: 'custom_faults', type: 'uint32_t', description: 'Custom battery faults' },
          { name: 'warning', type: 'uint8_t', description: 'Battery warning' }
        ],
        messageCount: 15420,
        frequency: 1.0,
        lastUpdate: '2024-01-15 14:32:45'
      }
    ]
  }

  // Apply search filter to message groups
  const messageGroups = filterMessages(rawMessageGroups, searchTerm)

  // Helper function to generate trajectory plot data
  const generateTrajectoryPlotData = (topics: string[]) => {
    const trajectoryData: any[] = []
    
    // Check if we have position data
    const hasPositionData = topics.some(topic => 
      topic.includes('vehicle_local_position') || 
      topic.includes('vehicle_global_position')
    )
    
    if (hasPositionData) {
      // Generate 2D trajectory plot
      trajectoryData.push({
        type: 'scatter',
        mode: 'lines+markers',
        x: [], // Will be populated with X coordinates
        y: [], // Will be populated with Y coordinates
        name: 'Flight Path',
        line: {
          color: '#3B82F6',
          width: 2
        },
        marker: {
          size: 4,
          color: '#10B981'
        },
        hovertemplate: 
          '<b>Position</b><br>' +
          'X: %{x:.2f} m<br>' +
          'Y: %{y:.2f} m<br>' +
          '<extra></extra>'
      })
    }
    
    return trajectoryData
  }

  return (
    <div className="h-full w-full bg-dark-bg flex flex-col">
      {/* Tab Bar - Compact and Below Layout Controls */}
      <div className={`flex-shrink-0 bg-dark-surface border-b border-dark-border transition-all duration-300 ${
        headerCollapsed ? 'h-6' : 'h-auto'
      }`}>
        <div className="flex items-center px-4 py-1">
          {/* Left side - Tabs */}
          <div className="flex items-center space-x-1 flex-1 overflow-x-auto">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`flex items-center space-x-1 px-2 py-1 rounded-t-lg cursor-pointer transition-colors ${
                  activeTabId === tab.id
                    ? 'bg-dark-bg text-dark-text border-b-2 border-accent-primary'
                    : 'bg-dark-surface-light text-dark-text-secondary hover:bg-dark-surface hover:text-dark-text'
                }`}
                onClick={() => setActiveTabId(tab.id)}
              >
                <span className="text-xs font-medium whitespace-nowrap">{tab.name}</span>
                {tabs.length > 1 && (
                  <button
                    className="text-dark-text-muted hover:text-dark-text transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeTab(tab.id)
                    }}
                    title="Close tab"
                  >
                    <X className="w-2 h-2" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* Right side - Controls */}
          <div className="flex items-center space-x-1 ml-2">
            {/* Add Tab Button */}
            <button
              className={`flex items-center justify-center w-6 h-6 rounded bg-dark-surface-light hover:bg-dark-surface transition-colors text-dark-text-secondary hover:text-dark-text transition-all duration-300 ${
                headerCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
              onClick={addNewTab}
              title="Add new analysis tab"
            >
              <Plus className="w-3 h-3" />
            </button>
            
            {/* Header Toggle Button */}
            <button
              className="flex items-center justify-center w-6 h-6 rounded bg-dark-surface-light hover:bg-dark-surface transition-colors text-dark-text-secondary hover:text-dark-text"
              onClick={() => setHeaderCollapsed(!headerCollapsed)}
              title={headerCollapsed ? 'Show header' : 'Hide header'}
            >
              {headerCollapsed ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronUp className="w-3 h-3" />
              )}
            </button>
          </div>
          
          {/* Compact Status Info - shown when header collapsed */}
          <div className={`flex items-center space-x-2 ml-2 text-xs text-dark-text-secondary transition-all duration-300 ${
            headerCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <span>DISCONNECTED</span>
            <span>100%</span>
            <span>87%</span>
            <span>ACTIVE</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

              {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
      {/* Left Side - Message List */}
      <div 
            className={`flex flex-col border-r border-dark-border transition-all duration-300 ${
              sidebarCollapsed ? 'w-12' : ''
            }`}
            style={{ width: sidebarCollapsed ? '48px' : `${sidebarWidth}px` }}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-dark-border">
            <div className="flex items-center justify-between">
              <div className={sidebarCollapsed ? 'hidden' : 'block'}>
                <div className="flex items-center space-x-2 mb-1">
                  <MessageSquare className="w-5 h-5 text-accent-primary" />
          <h2 className="text-dark-text text-lg font-semibold">uORB Messages</h2>
                </div>
          <p className="text-dark-text-secondary text-sm">Select a message to analyze</p>
                
                {/* Search Input */}
                <div className="mt-3 relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-text-muted" />
                    <input
                      type="text"
                      placeholder="Search topics..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-dark-surface-light border border-dark-border rounded-lg text-sm text-dark-text placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-colors"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-text-muted hover:text-dark-text transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <button
                className={`p-2 rounded-lg hover:bg-dark-surface-light transition-colors ${
                  sidebarCollapsed ? 'w-full' : ''
                }`}
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? (
                  <div className="flex flex-col items-center space-y-1">
                    <MessageSquare className="w-4 h-4 text-accent-primary" />
                    <ChevronRight className="w-3 h-3 text-dark-text-secondary" />
                  </div>
                ) : (
                  <ChevronLeft className="w-4 h-4 text-dark-text-secondary" />
                )}
              </button>
            </div>
        </div>

        {/* Message List */}
          <div className={`flex-1 overflow-y-auto ${sidebarCollapsed ? 'hidden' : 'block'}`}>
          <div className="p-4 space-y-2">
            {parsedData ? (
              <>
                {/* Show search results count if searching */}
                {searchTerm && (
                  <div className="mb-3 p-2 bg-dark-surface-light rounded-lg border border-dark-border">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-dark-text-secondary">
                        Search results for "{searchTerm}"
                      </span>
                      <span className="text-accent-primary font-medium">
                        {Object.values(messageGroups).flat().length} topics found
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Show no results message if search returns no matches */}
                {Object.keys(messageGroups).length === 0 ? (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-dark-text-muted mx-auto mb-3" />
                    <h3 className="text-dark-text font-medium text-sm mb-2">No topics found</h3>
                    <p className="text-dark-text-secondary text-xs mb-4">
                      No uORB topics match your search for "{searchTerm}"
                    </p>
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="btn-secondary text-xs flex items-center justify-center mx-auto"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear Search
                    </button>
                  </div>
                ) : (
                  /* Show parsed messages */
                  <div>
                    {Object.entries(messageGroups).map(([groupName, messages]) => (
                <div key={groupName} className="space-y-2">
                  <h3 className="text-dark-text font-medium text-sm text-accent-primary">{groupName}</h3>
                  {messages.map((message: any) => (
                    <div key={message.id} className="space-y-1">
                      {/* Parent Message */}
                      <div 
                        className={`bg-dark-surface rounded-lg p-3 cursor-pointer hover:bg-dark-surface-light transition-colors ${
                          selectedMessage === message.id ? 'ring-2 ring-accent-primary' : ''
                        }`}
                        onClick={() => {
                          setSelectedMessage(message.id);
                          toggleMessage(message.id);
                        }}
                        title="Click to select message and expand/collapse fields"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-dark-text font-medium text-sm">{message.name}</h4>
                            <span className="text-chart-green text-xs">{message.frequency || 'N/A'} Hz</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-chart-blue text-xs">{message.messageCount.toLocaleString()} msgs</span>
                            <div className="text-dark-text-secondary transition-colors">
                              {expandedMessages.has(message.id) ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-dark-text-secondary text-xs mb-2">{message.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-dark-text-muted">ID: {message.id}</span>
                          <span className="text-dark-text-secondary">{message.fields.length} fields</span>
                        </div>
                      </div>

                      {/* Child Fields - Expanded View */}
                      {expandedMessages.has(message.id) && (
                        <div className="ml-4 space-y-1">
                          {message.fields.map((field: any, fieldIndex: number) => {
                            const sampleValues = getSampleValues(message)
                            const sampleValue = sampleValues ? sampleValues[field.name] : null
                            
                            return (
                              <div 
                                key={fieldIndex} 
                                className={`bg-dark-surface-light rounded p-2 cursor-grab hover:bg-dark-surface transition-colors border-l-2 border-accent-primary ${
                                  activeTab.selectedTopics.includes(`${message.id}.${field.name}`) ? 'ring-2 ring-chart-green' : ''
                                }`}
                                draggable
                                onDragStart={(e) => {
                                  e.dataTransfer.setData('text/plain', `${message.id}.${field.name}`)
                                  e.dataTransfer.effectAllowed = 'copy'
                                }}
                                onClick={() => handleTopicSelect(message.id, field.name)}
                                title="Drag to plot or click to toggle"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-dark-text font-medium text-xs">{field.name}</span>
                                    <span className="text-accent-primary text-xs font-mono">{field.type}</span>
                                    {activeTab.selectedTopics.includes(`${message.id}.${field.name}`) && (
                                      <span className="text-chart-green text-xs">●</span>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    {sampleValue !== null && (
                                      <span className="text-chart-green text-xs font-mono">
                                        {Array.isArray(sampleValue) 
                                          ? `[${sampleValue.slice(0, 3).map(v => typeof v === 'number' ? v.toFixed(2) : v).join(', ')}${sampleValue.length > 3 ? '...' : ''}]`
                                          : typeof sampleValue === 'number' 
                                            ? sampleValue.toFixed(2)
                                            : typeof sampleValue === 'boolean'
                                              ? sampleValue ? 'true' : 'false'
                                              : String(sampleValue)
                                        }
                                      </span>
                                    )}
                                    <span className="text-chart-blue text-xs">{message.messageCount.toLocaleString()}</span>
                                    <span className="text-dark-text-muted text-xs">samples</span>
                                  </div>
                                </div>
                                {/* Component chips for vector/array fields */}
                                {(() => {
                                  const len = isArrayField(field.type)
                                  if (len > 1) {
                                    const labels = getComponentLabels(field.name, len)
                                    return (
                                      <div className="mt-2 flex flex-wrap gap-2">
                                        {labels.map((label, i) => {
                                          const topicId = `${message.id}.${field.name}.${label}`
                                          const isSelected = activeTab.selectedTopics.includes(topicId)
                                          return (
                                            <div
                                              key={`${field.name}-${label}`}
                                              className={`px-2 py-1 rounded text-xs border ${isSelected ? 'border-chart-green text-chart-green bg-dark-surface' : 'border-dark-border text-dark-text-secondary bg-dark-surface'}`}
                                              draggable
                                              onDragStart={(e) => {
                                                e.dataTransfer.setData('text/plain', topicId)
                                                e.dataTransfer.effectAllowed = 'copy'
                                              }}
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                handleTopicSelect(message.id, field.name, label)
                                              }}
                                              title={`Drag to plot ${field.name}.${label}`}
                                            >
                                              {label.toUpperCase()}
                                            </div>
                                          )
                                        })}
                                      </div>
                                    )
                                  }
                                  return null
                                })()}
                                <p className="text-dark-text-secondary text-xs mt-1">
                                  {field.description.split(/(\s+[a-zA-Z\/²°]+)/).map((part: string, index: number) => {
                                    // Check if this part is an SI unit (contains /, ², °, or common units)
                                    const isUnit = /[\/²°]|(m\/s|rad\/s|Gauss|Celsius|degrees|meters|amperes|volts|mAh|minutes|seconds)/.test(part)
                                    return isUnit ? (
                                      <span key={index} className="text-chart-yellow font-medium">{part}</span>
                                    ) : (
                                      <span key={index}>{part}</span>
                                    )
                                  })}
                                </p>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
                  </div>
                )}
              </>
            ) : (
              // No Data State
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-dark-text-muted mx-auto mb-3" />
                <h3 className="text-dark-text font-medium text-sm mb-2">No Flight Data Loaded</h3>
                <p className="text-dark-text-secondary text-xs mb-4">
                  Upload a flight log to see available uORB messages and their fields
                </p>
                
                <div className="space-y-3">
                  <div className="bg-dark-surface-light rounded p-3">
                    <h4 className="text-dark-text font-medium text-xs mb-2">Example Messages You'll See:</h4>
                    <div className="space-y-1 text-xs text-dark-text-secondary">
                      <div>• sensor_combined - IMU and sensor data</div>
                      <div>• vehicle_local_position - Position and velocity</div>
                      <div>• vehicle_attitude - Orientation data</div>
                      <div>• battery_status - Power monitoring</div>
                    </div>
                  </div>
                  
                  <button className="btn-secondary text-xs w-full flex items-center justify-center">
                    <FileText className="w-3 h-3 mr-1" />
                    Load Flight Log
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resize Handle */}
      <div 
        className="w-1 bg-dark-border hover:bg-accent-primary cursor-col-resize transition-colors"
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'col-resize' : 'col-resize' }}
      />

      {/* Right Side - Rich Line Plot */}
      <div className="flex-1 flex flex-col">
        {/* Plot Header */}
        <div className="flex-shrink-0 p-3 border-b border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-dark-text text-lg font-semibold">Flight Data Analysis</h2>
              <p className="text-dark-text-secondary text-sm">Interactive line plot with analysis tools</p>
            </div>
                         <div className="flex items-center space-x-3">
               <select 
                 className="bg-dark-surface border border-dark-border text-dark-text px-3 py-1 rounded text-sm"
                 title="Time range selector"
                 aria-label="Select time range"
               >
                 <option>Last 1 hour</option>
                 <option>Last 6 hours</option>
                 <option>Last 24 hours</option>
               </select>
              <button className="btn-primary text-sm">
                <Database className="w-4 h-4 mr-2" />
                Export Data
              </button>
              <div className="flex items-center space-x-1 border-l border-dark-border pl-2">
                <span className="text-dark-text-secondary text-xs mr-1">Layout:</span>
                <button
                  className={`flex items-center justify-center w-6 h-6 rounded transition-colors ${
                    activeTab.layoutColumns === 2
                      ? 'bg-accent-primary text-white'
                      : 'bg-dark-surface-light hover:bg-dark-surface text-dark-text-secondary hover:text-dark-text'
                  }`}
                  onClick={() => updateTab(activeTabId, { layoutColumns: 2 })}
                  title="2 column vertical split"
                >
                  <Columns className="w-3 h-3" />
                </button>
                <button
                  className={`flex items-center justify-center w-6 h-6 rounded transition-colors ${
                    activeTab.layoutColumns === -2
                      ? 'bg-accent-primary text-white'
                      : 'bg-dark-surface-light hover:bg-dark-surface text-dark-text-secondary hover:text-dark-text'
                  }`}
                  onClick={() => updateTab(activeTabId, { layoutColumns: -2 })}
                  title="2 row horizontal split"
                >
                  <PanelTop className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>



        {/* Main Plot Area */}
        <div className="flex-1 p-2">
          <div 
            className={`h-full bg-dark-surface rounded-lg border-2 border-dashed transition-colors ${
              isFileDragging 
                ? 'border-accent-primary bg-dark-surface-light' 
                : 'border-dark-border'
            }`}
            onDragOver={(e) => {
              e.preventDefault()
              if (e.dataTransfer.types.includes('text/plain')) {
                setIsPlotDragging(true)
              } else {
                handleFileDragOver(e)
              }
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setIsPlotDragging(false)
                handleFileDragLeave(e)
              }
            }}
            onDrop={(e) => {
              e.preventDefault()
              setIsPlotDragging(false)
              
              if (e.dataTransfer.types.includes('text/plain')) {
                const topicId = e.dataTransfer.getData('text/plain')
                handleTopicSelect(topicId)
              } else {
                handleFileDrop(e)
              }
            }}
          >
            {isParsing ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <Database className="w-16 h-16 text-chart-yellow mx-auto mb-4 animate-pulse" />
                  <h3 className="text-dark-text text-lg font-semibold mb-2">Parsing ULOG File...</h3>
                  <div className="bg-dark-surface-light rounded-lg p-4 border border-dark-border mb-4">
                    <h4 className="text-dark-text font-medium text-sm mb-2">Processing Steps:</h4>
                    <div className="space-y-2 text-xs text-dark-text-secondary">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-chart-green rounded-full"></div>
                        <span>Reading file structure</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-chart-yellow rounded-full animate-pulse"></div>
                        <span>Extracting uORB messages</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-dark-text-muted rounded-full"></div>
                        <span>Loading flight data</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : uploadedFile && parsedData ? (
              <div className="h-full flex flex-col">
                {/* Plot Header */}
                <div className="flex-shrink-0 p-4 border-b border-dark-border">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-dark-text text-lg font-semibold">Time Series Analysis</h3>
                      <p className="text-dark-text-secondary text-sm">{uploadedFile.name}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-chart-green text-sm font-medium">
                        {activeTab.selectedTopics.length} topics selected
                      </span>
                      <button 
                        className="btn-secondary text-xs"
                        onClick={() => updateTab(activeTabId, { selectedTopics: [] })}
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                  
                  {activeTab.selectedTopics.length === 0 && (
                    <div className="bg-dark-surface-light rounded-lg p-3 border border-dark-border">
                      <div className="flex items-center space-x-2">
                        <BarChart3Icon className="w-4 h-4 text-chart-yellow" />
                        <span className="text-dark-text text-sm font-medium">Drag & Drop Topics to Plot</span>
                      </div>
                      <p className="text-dark-text-secondary text-xs mt-1">
                        Drag any field from the left panel to visualize it against time. You can select multiple topics for comparison.
                      </p>
                    </div>
                  )}
                </div>

                {/* Plot Area */}
                <div className={`h-96 p-4 overflow-y-auto transition-all duration-300 ${
                  sidebarCollapsed ? 'ml-0' : ''
                } ${headerCollapsed ? 'pt-1' : ''}`}>
                  {activeTab.selectedTopics.length > 0 ? (
                    <div className="min-h-full pb-4">
                      {/* Grid Layout based on selected columns */}
                      <div className={`grid gap-4 ${
                        activeTab.layoutColumns === 2 ? 'grid-cols-1 lg:grid-cols-2' :
                        activeTab.layoutColumns === -2 ? 'grid-rows-2' :
                        'grid-cols-1 lg:grid-cols-2'
                      }`}>
                        
                        {/* Show existing plots or create new plot */}
                        {activeTab.plots.length > 0 ? (
                          activeTab.plots.map((plot, index) => (
                            <div 
                              key={plot.id}
                              className={`bg-dark-surface-light rounded-lg border border-dark-border p-2 min-h-[300px] overflow-hidden ${
                                activeTab.layoutColumns === 2 ? 'col-span-1' :
                                activeTab.layoutColumns === -2 ? 'row-span-1' :
                                'col-span-1'
                              }`}
                              onDragOver={(e) => {
                                e.preventDefault()
                                e.currentTarget.classList.add('border-accent-primary', 'bg-dark-surface')
                              }}
                              onDragLeave={(e) => {
                                e.currentTarget.classList.remove('border-accent-primary', 'bg-dark-surface')
                              }}
                              onDrop={(e) => {
                                e.preventDefault()
                                e.currentTarget.classList.remove('border-accent-primary', 'bg-dark-surface')
                                
                                if (e.dataTransfer.types.includes('text/plain')) {
                                  const topicId = e.dataTransfer.getData('text/plain')
                                  addTopicToPlot(plot.id, topicId)
                                }
                              }}
                            >
                              <div className="flex items-center justify-end mb-1">
                                <button
                                  className="text-dark-text-muted hover:text-dark-text transition-colors p-1 rounded"
                                  onClick={() => {
                                    const updatedPlots = activeTab.plots.filter(p => p.id !== plot.id)
                                    updateTab(activeTabId, { plots: updatedPlots })
                                  }}
                                  title="Remove plot"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              
                              {/* Topic list - compact */}
                              {plot.topics.length > 0 && (
                                <div className="mb-1">
                                  <div className="flex flex-wrap gap-1">
                                    {plot.topics.map((topic, topicIndex) => (
                                      <div
                                        key={topicIndex}
                                        className="flex items-center space-x-1 bg-dark-surface rounded px-1 py-0.5 text-xs"
                                      >
                                        <span className="text-dark-text-secondary">{topic.split('.').pop()}</span>
                                        <button
                                          className="text-dark-text-muted hover:text-dark-text transition-colors"
                                          onClick={() => removeTopicFromPlot(plot.id, topic)}
                                          title={`Remove ${topic}`}
                                        >
                                          <X className="w-2 h-2" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <div className="h-full flex-1">
                                {plot.data.length > 0 ? (
                                  <React.Suspense fallback={<PlotFallback data={plot.data} layout={plot.layout} />}>
                        <Plot
                                      data={plot.data}
                          layout={{
                                        ...plot.layout,
                                        width: undefined,
                                        height: undefined,
                                        autosize: true,
                                        plot_bgcolor: 'rgba(0,0,0,0)',
                                        paper_bgcolor: 'rgba(0,0,0,0)',
                                        font: { color: '#E5E7EB' },
                                        margin: { l: 60, r: 40, t: 50, b: 80 },
                                        xaxis: { 
                                          ...plot.layout.xaxis,
                                          gridcolor: '#374151',
                                          color: '#9CA3AF',
                                          showgrid: true,
                                          tickfont: { size: 10 },
                                          title: { 
                                            ...plot.layout.xaxis?.title,
                                            font: { color: '#9CA3AF', size: 12 }
                                          }
                                        },
                                        yaxis: { 
                                          ...plot.layout.yaxis,
                                          gridcolor: '#374151',
                                          color: '#9CA3AF',
                                          showgrid: true,
                                          tickfont: { size: 10 },
                                          title: { 
                                            ...plot.layout.yaxis?.title,
                                            font: { color: '#9CA3AF', size: 12 }
                                          }
                                        }
                                      }}
                                      config={{
                                        responsive: true,
                                        displayModeBar: true,
                                        modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                                        displaylogo: false
                                      }}
                                      style={{ width: '100%', height: '100%' }}
                                      useResizeHandler={true}
                                      onError={() => <PlotFallback data={plot.data} layout={plot.layout} />}
                                    />
                                  </React.Suspense>
                                ) : (
                                  <div className="h-full flex items-center justify-center">
                                    <div className="text-center">
                                      <BarChart3Icon className="w-8 h-8 text-dark-text-secondary mx-auto mb-2" />
                                      <p className="text-dark-text-secondary text-xs mb-2">No data</p>
                                      <p className="text-dark-text-muted text-xs">Drag topics here to add data</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          /* Show main plot if no individual plots exist */
                          <div className={`min-h-[350px] ${
                            activeTab.layoutColumns === 2 ? 'col-span-1 lg:col-span-2' :
                            activeTab.layoutColumns === 3 ? 'col-span-1 md:col-span-2 lg:col-span-3' :
                            activeTab.layoutColumns === 4 ? 'col-span-1 md:col-span-2 row-span-2' :
                            activeTab.layoutColumns === 6 ? 'col-span-1 md:col-span-2 lg:col-span-3 row-span-2' : 'col-span-1 lg:col-span-2'
                          }`}>
                            {activeTab.plotData.length > 0 ? (
                              <React.Suspense fallback={<PlotFallback data={activeTab.plotData} layout={activeTab.plotLayout} />}>
                                <Plot
                                  data={activeTab.plotData}
                                  layout={{
                                    ...activeTab.plotLayout,
                            width: undefined,
                            height: undefined,
                            autosize: true
                          }}
                          config={{
                            responsive: true,
                            displayModeBar: true,
                            modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
                            displaylogo: false
                          }}
                          style={{ width: '100%', height: '100%' }}
                          useResizeHandler={true}
                                  onError={() => <PlotFallback data={activeTab.plotData} layout={activeTab.plotLayout} />}
                        />
                      </React.Suspense>
                            ) : (
                              <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                  <BarChart3Icon className="w-16 h-16 text-chart-yellow mx-auto mb-4" />
                                  <h3 className="text-dark-text text-lg font-semibold mb-2">Ready to Plot</h3>
                                  <p className="text-dark-text-secondary text-sm mb-4 max-w-md">
                                    Select topics from the left panel to start visualizing your flight data.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Add Plot Button */}
                        <div className={`flex items-center justify-center ${
                          activeTab.layoutColumns === 2 ? 'col-span-1' :
                          activeTab.layoutColumns === 3 ? 'col-span-1' :
                          activeTab.layoutColumns === 4 ? 'col-span-1' :
                          activeTab.layoutColumns === 6 ? 'col-span-1' : 'col-span-1'
                        }`}>
                          <button
                            className="w-full h-full min-h-[300px] border-2 border-dashed border-dark-border rounded-lg flex flex-col items-center justify-center text-dark-text-secondary hover:text-dark-text hover:border-accent-primary transition-colors p-2"
                            onClick={() => addPlotToTab(activeTabId, activeTab.selectedTopics)}
                            title="Add new plot"
                          >
                            <Plus className="w-8 h-8 mb-2" />
                            <span className="text-sm font-medium">Add Plot</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`h-full flex items-center justify-center transition-colors ${
                      isPlotDragging ? 'bg-dark-surface-light' : ''
                    }`}>
                      <div className="text-center">
                        <BarChart3Icon className="w-16 h-16 text-chart-yellow mx-auto mb-4" />
                        <h3 className="text-dark-text text-lg font-semibold mb-2">
                          {isPlotDragging ? 'Drop to Plot' : 'Ready to Plot'}
                        </h3>
                        <p className="text-dark-text-secondary text-sm mb-4 max-w-md">
                          {isPlotDragging 
                            ? 'Release to add this topic to your time series plot'
                            : 'Drag any field from the left panel to start visualizing your flight data. The plot will show real-time values over the flight duration.'
                          }
                        </p>
                        
                        {!isPlotDragging && (
                          <div className="bg-dark-surface-light rounded-lg p-4 border border-dark-border max-w-sm mx-auto">
                            <h4 className="text-dark-text font-medium text-sm mb-2">Available Topics:</h4>
                            <div className="space-y-1 text-xs text-dark-text-secondary">
                              <div>• sensor_combined.gyro_rad - Angular velocity</div>
                              <div>• vehicle_local_position.x - X position</div>
                              <div>• vehicle_attitude.q - Quaternion attitude</div>
                              <div>• battery_status.voltage_v - Battery voltage</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Plot Controls */}
                {activeTab.selectedTopics.length > 0 && (
                  <div className="flex-shrink-0 p-4 border-t border-dark-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-dark-text-secondary text-sm">Time Range:</span>
                          <select 
                            className="bg-dark-surface border border-dark-border text-dark-text px-2 py-1 rounded text-xs"
                            title="Time range selector"
                            aria-label="Select time range"
                          >
                            <option>Full Flight</option>
                            <option>Last 30s</option>
                            <option>Last 1min</option>
                            <option>Custom...</option>
                          </select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-dark-text-secondary text-sm">Plot Type:</span>
                          <select 
                            className="bg-dark-surface border border-dark-border text-dark-text px-2 py-1 rounded text-xs"
                            title="Plot type selector"
                            aria-label="Select plot type"
                          >
                            <option>Line Plot</option>
                            <option>Scatter Plot</option>
                            <option>Bar Chart</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="btn-secondary text-xs">
                          <Download className="w-3 h-3 mr-1" />
                          Export
                        </button>
                        <button className="btn-primary text-xs">
                          <BarChart3Icon className="w-3 h-3 mr-1" />
                          Analyze
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : uploadedFile ? (
              <>
                <Database className="w-16 h-16 text-chart-green mx-auto mb-4" />
                <h3 className="text-dark-text text-lg font-semibold mb-2">File Uploaded Successfully!</h3>
                <p className="text-dark-text-secondary text-sm mb-4">
                  {uploadedFile.name}
                </p>
                <div className="bg-dark-surface-light rounded-lg p-4 border border-dark-border mb-4">
                  <h4 className="text-dark-text font-medium text-sm mb-2">Processing...</h4>
                  <div className="space-y-2 text-xs text-dark-text-secondary">
                    <div>• Parsing ULOG file structure</div>
                    <div>• Extracting uORB messages</div>
                    <div>• Loading flight data</div>
                  </div>
                </div>
                <button 
                  className="btn-secondary text-sm w-full flex items-center justify-center"
                  onClick={() => setUploadedFile(null)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Upload Different File
                </button>
              </>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <div className="w-full max-w-3xl p-6">
                  <div className="bg-dark-surface-light rounded-lg p-6 border border-dark-border text-center">
                    <Database className="w-16 h-16 text-accent-primary mx-auto mb-4" />
                    <h3 className="text-dark-text text-xl font-semibold mb-2">No Flight Data Available</h3>
                    <p className="text-dark-text-secondary text-sm mb-6">
                      Upload a ULOG or TLOG file to begin analyzing your flight data. Supported formats include PX4 ULOG files and MAVLink TLOG files.
                    </p>
                    <div className="bg-dark-surface rounded-md p-4 border border-dark-border mb-5 text-left">
                      <h4 className="text-dark-text font-medium text-sm mb-2">Supported File Types</h4>
                      <div className="space-y-2 text-xs text-dark-text-secondary">
                        <div className="flex items-center space-x-2">
                          <span className="text-chart-blue">•</span>
                          <span>ULOG files (.ulg) - PX4 native logging format</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-chart-green">•</span>
                          <span>TLOG files (.tlog) - MAVLink telemetry logs</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-chart-yellow">•</span>
                          <span>UDP streams - Real-time telemetry data</span>
                        </div>
                      </div>
                    </div>
                    <input ref={fileInputRef} type="file" accept=".ulg,.tlog" onChange={handleFileSelect} className="hidden" title="Upload flight log" />
                    <button 
                      className="btn-primary text-sm w-full flex items-center justify-center mb-3"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Upload Flight Log
                    </button>
                    <div className="text-xs text-dark-text-muted">Drag and drop files anywhere in this area or click to browse</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Plot Statistics */}
        <div className="flex-shrink-0 p-4 border-t border-dark-border">
          <div className="grid grid-cols-4 gap-4">
            {parsedData ? (
              <>
                <div className="text-center">
                  <div className="text-chart-blue text-lg font-bold">
                    {parsedData.fileSize ? `${(parsedData.fileSize / 1024 / 1024).toFixed(1)}MB` : 'N/A'}
                  </div>
                  <div className="text-dark-text-secondary text-xs">File Size</div>
                </div>
                <div className="text-center">
                  <div className="text-chart-green text-lg font-bold">
                    {parsedData.messageCount || 0}
                  </div>
                  <div className="text-dark-text-secondary text-xs">Messages</div>
                </div>
                <div className="text-center">
                  <div className="text-chart-yellow text-lg font-bold">
                    {parsedData.header ? parsedData.header.version : 'N/A'}
                  </div>
                  <div className="text-dark-text-secondary text-xs">Version</div>
                </div>
                <div className="text-center">
                  <div className="text-chart-purple text-lg font-bold">
                    {selectedMessage ? 'Selected' : 'None'}
                  </div>
                  <div className="text-dark-text-secondary text-xs">Active Message</div>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="text-chart-blue text-lg font-bold">--</div>
                  <div className="text-dark-text-secondary text-xs">Max Altitude</div>
                </div>
                <div className="text-center">
                  <div className="text-chart-green text-lg font-bold">--</div>
                  <div className="text-dark-text-secondary text-xs">Avg Speed</div>
                </div>
                <div className="text-center">
                  <div className="text-chart-yellow text-lg font-bold">--</div>
                  <div className="text-dark-text-secondary text-xs">Battery</div>
                </div>
                <div className="text-center">
                  <div className="text-chart-purple text-lg font-bold">--</div>
                  <div className="text-dark-text-secondary text-xs">Duration</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      </div>
      
      {/* Floating Status Indicator - shown when header collapsed */}
      {headerCollapsed && (
        <div className="fixed top-2 right-4 bg-dark-surface-light border border-dark-border rounded-lg px-3 py-1 text-xs text-dark-text-secondary shadow-lg z-50">
          <div className="flex items-center space-x-3">
            <span>DISCONNECTED</span>
            <span>•</span>
            <span>100%</span>
            <span>•</span>
            <span>87%</span>
            <span>•</span>
            <span>ACTIVE</span>
            <span>•</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Telemetry view: mirrors DataAnalysis layout, subscribes to server-sent events
function TelemetryView() {
  const [connected, setConnected] = useState(false)
  const [lastMsgTime, setLastMsgTime] = useState<number | null>(null)
  const [liveMessages, setLiveMessages] = useState<Record<string, any[]>>({})
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [plotData, setPlotData] = useState<any[]>([])
  const [plotLayout, setPlotLayout] = useState<any>({})
  const [isDragging, setIsDragging] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(400)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    const newWidth = e.clientX
    if (newWidth > 200 && newWidth < 600) setSidebarWidth(newWidth)
  }
  const handleMouseUp = () => setIsDragging(false)
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging])

  useEffect(() => {
    const es = new EventSource('/api/telemetry/stream')
    es.onopen = () => {
      setConnected(true)
    }
    es.onerror = (error) => {
      setConnected(false)
    }
    es.onmessage = (evt) => {
      try {
        const payload = JSON.parse(evt.data)
        const { topic, data } = payload
        setLastMsgTime(Date.now())
        setLiveMessages(prev => {
          const arr = prev[topic] ? [...prev[topic]] : []
          arr.push(data)
          if (arr.length > 5000) arr.shift()
          return { ...prev, [topic]: arr }
        })
      } catch (error) {
        // Silent error handling
      }
    }
    return () => {
      es.close()
    }
  }, [])

  useEffect(() => {
    // Build Plotly traces from selected topics
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316']
    const traces: any[] = []
    selectedTopics.forEach((topic, i) => {
      const samples = liveMessages[topic] || []
      if (samples.length === 0) return
      const x = samples.map((s: any) => new Date(s.timestampMs ?? Date.now()))
      const y = samples.map((s: any) => typeof s.value === 'number' ? s.value : 0)
      traces.push({ x, y, type: 'scatter', mode: 'lines', name: topic, line: { color: colors[i % colors.length], width: 2 } })
    })
    setPlotData(traces)
    setPlotLayout({
      title: { text: 'Telemetry Time Series', font: { color: '#E5E7EB', size: 18 } },
      xaxis: { title: { text: 'Time', font: { color: '#9CA3AF' } }, gridcolor: '#374151', color: '#9CA3AF', showgrid: true, tickformat: '%H:%M:%S', type: 'date' },
      yaxis: { title: { text: 'Value', font: { color: '#9CA3AF' } }, gridcolor: '#374151', color: '#9CA3AF', showgrid: true },
      plot_bgcolor: '#1F2937', paper_bgcolor: '#1F2937', font: { color: '#E5E7EB' }, margin: { l: 60, r: 30, t: 60, b: 60 }, showlegend: true,
      legend: { x: 0.02, y: 0.98, bgcolor: 'rgba(31, 41, 55, 0.8)', bordercolor: '#374151', borderwidth: 1, font: { color: '#E5E7EB' } },
      hovermode: 'closest', dragmode: 'pan',
    })
  }, [selectedTopics, liveMessages])

  const topics = Object.keys(liveMessages)

  return (
    <div className="h-full w-full bg-dark-bg flex">
      {/* Left list */}
      <div className="flex flex-col border-r border-dark-border" style={{ width: `${sidebarWidth}px` }}>
        <div className="flex-shrink-0 p-4 border-b border-dark-border">
          <h2 className="text-dark-text text-lg font-semibold">Telemetry</h2>
          <p className="text-dark-text-secondary text-sm">{connected ? 'Connected (UDP via mavlink-router)' : 'Waiting for data...'}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {topics.length > 0 ? topics.map((t) => (
            <button key={t} className={`w-full text-left bg-dark-surface rounded p-2 border ${selectedTopics.includes(t) ? 'border-chart-green' : 'border-dark-border'} hover:bg-dark-surface-light`} onClick={() => setSelectedTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}>
              <div className="flex items-center justify-between">
                <span className="text-dark-text text-sm">{t}</span>
                <span className="text-dark-text-muted text-xs">{liveMessages[t]?.length ?? 0} samples</span>
              </div>
            </button>
          )) : (
            <div className="text-center py-8">
              <Database className="w-12 h-12 text-dark-text-muted mx-auto mb-3" />
              <h3 className="text-dark-text font-medium text-sm mb-2">No Telemetry Yet</h3>
              <p className="text-dark-text-secondary text-xs">Ensure mavlink-router is streaming UDP to this app.</p>
            </div>
          )}
        </div>
      </div>

      {/* Resize handle */}
      <div className="w-1 bg-dark-border hover:bg-accent-primary cursor-col-resize transition-colors" onMouseDown={handleMouseDown} style={{ cursor: isDragging ? 'col-resize' : 'col-resize' }} />

      {/* Right plot */}
      <div className="flex-1 p-4">
        {plotData.length > 0 ? (
          <React.Suspense fallback={<PlotFallback data={plotData} layout={plotLayout} />}>
            <Plot 
              data={plotData} 
              layout={{ ...plotLayout, autosize: true }} 
              config={{ responsive: true, displayModeBar: true, displaylogo: false }} 
              style={{ width: '100%', height: '100%' }} 
              useResizeHandler={true}
              onError={() => <PlotFallback data={plotData} layout={plotLayout} />}
            />
          </React.Suspense>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <BarChart3Icon className="w-16 h-16 text-chart-yellow mx-auto mb-4" />
              <h3 className="text-dark-text text-lg font-semibold mb-2">Waiting for telemetry</h3>
              <p className="text-dark-text-secondary text-sm">Select topics from the left once data arrives.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ReportsView() {
  return (
    <div className="h-full p-6">
      <div className="bg-military-black rounded-lg h-full flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-military-orange mx-auto mb-4" />
          <h3 className="text-military-orange text-lg font-bold mb-2">REPORT GENERATION</h3>
          <p className="text-military-white text-sm font-mono mb-4">Generate comprehensive flight analysis reports</p>
        </div>
      </div>
    </div>
  )
}

function AIView() {
  return (
    <div className="h-full p-6">
      <div className="bg-military-black rounded-lg h-full flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-16 h-16 text-military-orange mx-auto mb-4" />
          <h3 className="text-military-orange text-lg font-bold mb-2">AI ASSISTANT</h3>
          <p className="text-military-white text-sm font-mono mb-4">AI-powered insights and anomaly detection</p>
        </div>
      </div>
    </div>
  )
}

function CustomFunctionsView() {
  return (
    <div className="h-full p-6">
      <div className="bg-military-black rounded-lg h-full flex items-center justify-center">
        <div className="text-center">
          <Code className="w-16 h-16 text-military-orange mx-auto mb-4" />
          <h3 className="text-military-orange text-lg font-bold mb-2">CUSTOM FUNCTIONS</h3>
          <p className="text-military-white text-sm font-mono mb-4">Create and execute custom data processing functions</p>
        </div>
      </div>
    </div>
  )
}

function MultiView() {
  return (
    <div className="h-full p-6">
      <div className="bg-military-black rounded-lg h-full flex items-center justify-center">
        <div className="text-center">
          <Layers className="w-16 h-16 text-military-orange mx-auto mb-4" />
          <h3 className="text-military-orange text-lg font-bold mb-2">MULTI-VIEW DASHBOARD</h3>
          <p className="text-military-white text-sm font-mono mb-4">Customizable dashboard layouts with drag-and-drop</p>
        </div>
      </div>
    </div>
  )
}

function ExportView() {
  return (
    <div className="h-full p-6">
      <div className="bg-military-black rounded-lg h-full flex items-center justify-center">
        <div className="text-center">
          <Download className="w-16 h-16 text-military-orange mx-auto mb-4" />
          <h3 className="text-military-orange text-lg font-bold mb-2">EXPORT DATA</h3>
          <p className="text-military-white text-sm font-mono mb-4">Export processed data in various formats</p>
        </div>
      </div>
    </div>
  )
}

function ShareView() {
  return (
    <div className="h-full p-6">
      <div className="bg-military-black rounded-lg h-full flex items-center justify-center">
        <div className="text-center">
          <Share2 className="w-16 h-16 text-military-orange mx-auto mb-4" />
          <h3 className="text-military-orange text-lg font-bold mb-2">SHARE ANALYSIS</h3>
          <p className="text-military-white text-sm font-mono mb-4">Share analysis results with team members</p>
        </div>
      </div>
    </div>
  )
}

function SettingsView() {
  return (
    <div className="h-full p-6">
      <div className="bg-military-black rounded-lg h-full flex items-center justify-center">
        <div className="text-center">
          <Settings className="w-16 h-16 text-military-orange mx-auto mb-4" />
          <h3 className="text-military-orange text-lg font-bold mb-2">SETTINGS</h3>
          <p className="text-military-white text-sm font-mono mb-4">Configure analysis parameters and preferences</p>
        </div>
      </div>
    </div>
  )
}
