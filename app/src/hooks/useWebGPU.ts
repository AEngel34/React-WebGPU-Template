import { useEffect, useState } from 'react'

export function useWebGPU(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const [device, setDevice] = useState<GPUDevice | null>(null)
  const [context, setContext] = useState<GPUCanvasContext | null>(null)
  const [canvasFormat, setCanvasFormat] = useState<GPUTextureFormat | null>(null)

  useEffect(() => {
    const resetState = () => {
      setDevice(null) 
      setContext(null)
      setCanvasFormat(null)
    }

    async function init(){
      try {
        if (!canvasRef.current) throw new Error('Canvas ref is null')
        if (!navigator.gpu) throw new Error('WebGPU not supported on this browser.')

        const adapter = await navigator.gpu.requestAdapter()
        if (!adapter) throw new Error('No appropriate GPUAdapter found.')

        const device = await adapter.requestDevice()
        const context = canvasRef.current.getContext('webgpu') as GPUCanvasContext
        if (!context) throw new Error("Failed to get 'webgpu' context from canvas.")

        const canvasFormat = navigator.gpu.getPreferredCanvasFormat()

        const canvasConfig = {
          device,
          format: canvasFormat,
          usage : GPUTextureUsage.RENDER_ATTACHMENT,
          alphaMode: 'opaque'
        } as GPUCanvasConfiguration

        context.configure(canvasConfig)

        setDevice(device)
        setContext(context)
        setCanvasFormat(canvasFormat)
        
      } catch (err) {
        throw new Error(String(err))
      }
    }

    init()

    return () => {
      if (context) {
        context.unconfigure()
      }
      
      resetState()
    } 
  }, [])

  return { device, context, canvasFormat }
}