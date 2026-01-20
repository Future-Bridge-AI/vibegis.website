import { useState, useEffect } from 'react'
import { Download, CheckCircle2 } from 'lucide-react'
import Editor from '@monaco-editor/react'
import type { GeneratorStepProps } from '../types'
import { buildWidgetZip } from '@lib/widget-builder'

/**
 * Step 04: GENERATE
 * Developer Agent UI - Displays generated code and allows download
 */
export default function GenerateStep({ onBack, data, updateData }: GeneratorStepProps) {
  const [generatedCode, setGeneratedCode] = useState(data?.generatedCode || '')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)

  useEffect(() => {
    if (!generatedCode && data?.architecture) {
      handleGenerateCode()
    }
  }, [])

  const handleGenerateCode = async () => {
    setIsGenerating(true)
    // TODO: Call Developer Agent API with architecture from previous step
    // const code = await generateWidgetCode(data.architecture, data.prd)
    
    // Simulate code generation
    setTimeout(() => {
      const mockCode = `import { React } from 'jimu-core'
import { JimuMapView } from 'jimu-arcgis'

interface WidgetProps {
  id: string
}

const Widget = (props: WidgetProps) => {
  const handleMapClick = async (view: __esri.MapView) => {
    // Generated widget logic
    console.log('Map clicked', view)
  }

  return (
    <div className="widget-container">
      <JimuMapView onViewCreated={(view) => {
        view.on('click', handleMapClick)
      }}>
        {/* Your custom UI */}
      </JimuMapView>
    </div>
  )
}

export default Widget`
      
      setGeneratedCode(mockCode)
      updateData({ generatedCode: mockCode })
      setIsGenerating(false)
    }, 3000)
  }

  const handleDownload = async () => {
    if (!generatedCode) return

    setIsDownloading(true)
    try {
      // Build widget ZIP package
      const zipBlob = await buildWidgetZip({
        widgetName: data?.widgetName || 'generated-widget',
        code: generatedCode,
        config: data?.config || {},
      })

      // Trigger download
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${data?.widgetName || 'widget'}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setDownloadComplete(true)
      setTimeout(() => setDownloadComplete(false), 3000)
    } catch (error) {
      console.error('Failed to build widget ZIP:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-lg flex items-center justify-center text-cyan-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <div className="text-sm font-mono text-cyan-400 mb-1">STEP 04</div>
          <h2 className="text-2xl font-black">GENERATE</h2>
          <p className="text-gray-400 text-sm">Developer Agent creates production-ready widget code. Download & install.</p>
        </div>
      </div>

      <div className="bg-geodark-secondary border border-cyan-500/20 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="ml-2 text-gray-500 text-xs font-mono">widget.tsx</span>
          </div>
          {isGenerating && (
            <div className="text-cyan-400 text-xs font-mono flex items-center gap-2">
              <span className="animate-spin">⟳</span>
              Generating code...
            </div>
          )}
        </div>
        
        {generatedCode ? (
          <Editor
            height="500px"
            defaultLanguage="typescript"
            value={generatedCode}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'JetBrains Mono',
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
            }}
          />
        ) : (
          <div className="h-[500px] flex items-center justify-center text-gray-500 font-mono">
            {isGenerating ? 'Generating widget code...' : 'Code will appear here'}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-800 text-gray-400 rounded-lg hover:border-gray-700 hover:text-gray-300 transition-colors font-bold"
        >
          Back
        </button>
        <div className="flex items-center gap-4">
          {downloadComplete && (
            <div className="text-green-400 text-sm font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Download complete!
            </div>
          )}
          <button
            onClick={handleDownload}
            disabled={!generatedCode || isDownloading}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:shadow-neon-cyan-lg transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            {isDownloading ? 'Building ZIP...' : 'Download Widget'}
          </button>
        </div>
      </div>
    </div>
  )
}
