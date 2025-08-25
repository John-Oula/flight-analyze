'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { 
  Upload, 
  FileText, 
  Database, 
  Trash2, 
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock,
  HardDrive,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface DataPanelProps {
  currentFile: string | null
  setCurrentFile: (file: string | null) => void
}

export default function DataPanel({ currentFile, setCurrentFile }: DataPanelProps) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsProcessing(true)
    
    // Simulate file processing
    setTimeout(() => {
      const newFiles = acceptedFiles.map(file => file.name)
      setUploadedFiles(prev => [...prev, ...newFiles])
      if (newFiles.length > 0) {
        setCurrentFile(newFiles[0])
      }
      setIsProcessing(false)
    }, 2000)
  }, [setCurrentFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/octet-stream': ['.ulg', '.tlog'],
      'text/plain': ['.txt', '.log']
    }
  })

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f !== fileName))
    if (currentFile === fileName) {
      setCurrentFile(null)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel-military rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-military-orange font-semibold text-sm uppercase tracking-wider">
            <Database className="inline w-4 h-4 mr-2" />
            DATA MANAGEMENT
          </h3>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-military-gray rounded transition-colors"
            title={isCollapsed ? "Expand panel" : "Collapse panel"}
          >
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4 text-military-orange" />
            ) : (
              <ChevronUp className="w-4 h-4 text-military-orange" />
            )}
          </button>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 text-xs font-mono font-medium text-military-orange uppercase tracking-wider bg-transparent border border-military-orange hover:bg-military-orange hover:text-military-black transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-military-orange active:scale-95">
            <Eye className="w-3 h-3 mr-1" />
            Preview
          </button>
        </div>
      </div>

      {/* File Upload Area */}
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragActive 
            ? 'border-military-orange bg-military-orange bg-opacity-10' 
            : 'border-military-gray hover:border-military-orange'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 text-military-orange mx-auto mb-3" />
        <p className="text-military-white text-sm font-mono mb-2">
          {isDragActive ? 'DROP FILES HERE' : 'DRAG & DROP FLIGHT LOGS'}
        </p>
        <p className="text-military-white text-xs opacity-70">
          Supports ULOG, TLOG, UDP streams
        </p>
        {isProcessing && (
          <div className="mt-3 flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-military-orange"></div>
            <span className="text-military-orange text-xs font-mono">PROCESSING...</span>
          </div>
        )}
      </div>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-military-white text-xs font-semibold uppercase tracking-wider mb-3">
            UPLOADED FILES
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {uploadedFiles.map((fileName, index) => (
              <motion.div
                key={fileName}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-2 rounded border ${
                  currentFile === fileName 
                    ? 'border-military-orange bg-military-orange bg-opacity-10' 
                    : 'border-military-gray bg-military-darker'
                }`}
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <FileText className="w-3 h-3 text-military-orange flex-shrink-0" />
                  <span className="text-military-white text-xs font-mono truncate">
                    {fileName}
                  </span>
                  {currentFile === fileName && (
                    <CheckCircle className="w-3 h-3 text-hud-green flex-shrink-0" />
                  )}
                </div>
                <button
                  onClick={() => removeFile(fileName)}
                  className="p-1 hover:bg-military-gray rounded transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="w-3 h-3 text-hud-red" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Data Statistics */}
      <div className="mt-4 pt-4 border-t border-military-gray">
        <h4 className="text-military-white text-xs font-semibold uppercase tracking-wider mb-3">
          DATA STATISTICS
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-military-darker rounded p-2">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-3 h-3 text-military-orange" />
              <span className="text-military-white text-xs font-mono">FILES:</span>
            </div>
            <span className="text-hud-green text-xs font-mono font-bold">
              {uploadedFiles.length}
            </span>
          </div>
          
          <div className="bg-military-darker rounded p-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3 text-military-orange" />
              <span className="text-military-white text-xs font-mono">PROCESSED:</span>
            </div>
            <span className="text-hud-blue text-xs font-mono font-bold">
              {uploadedFiles.length > 0 ? 'READY' : 'NONE'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
