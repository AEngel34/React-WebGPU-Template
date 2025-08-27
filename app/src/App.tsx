import styles from './App.module.css'
import { useEffect, useMemo, useRef } from 'react'
import { useWebGPU } from './hooks/useWebGPU'
import { useShaderModule } from './hooks/useShaderModule'
import fragmentShader from "./shaders/fragment.wgsl?raw"
import vertexShader from "./shaders/vertex.wgsl?raw"

function App() {
  const canvas = useRef<HTMLCanvasElement | null>(null)

  const { device, context, canvasFormat } = useWebGPU(canvas)

  const vertexModule = useShaderModule(device, "Vertex Triangle Shader", vertexShader)
  const fragmentModule = useShaderModule(device, "Fragment Triangle Shader", fragmentShader)

  const encoder = useMemo(()=>{
    if(!device) return null
    return device.createCommandEncoder({ label: 'encoder'})
  },[device])

  const pipeline = useMemo(()=>{
    if(!device || !vertexModule || !fragmentModule || !canvasFormat) return null

    const pipelineLayoutDesc = {
      bindGroupLayouts: []
    }

    const layout = device.createPipelineLayout(pipelineLayoutDesc)
    const colorState = { format : 'bgra8unorm' } as GPUColorTargetState

    const pipelineDesc: GPURenderPipelineDescriptor = {
      label : "Triangle Pipeline",
      layout : layout,
      vertex : {
        module : vertexModule,
        entryPoint : "vs_main",
        buffers : []
      },
      fragment : {
        module : fragmentModule,
        entryPoint : "fs_main",
        targets : [colorState]
      },
      primitive : {
        topology : 'triangle-list',
        frontFace : 'ccw',
        cullMode : 'back'
      }
    }

    return device.createRenderPipeline(pipelineDesc)
  },[device, vertexModule, fragmentModule, canvasFormat]) 

  useEffect(() => {
    if (!device || !context || !encoder || !pipeline) return

    const render = () => {    
      const colorTexture = context.getCurrentTexture()
      const colorTextureView = colorTexture.createView()

      const colorAttachment: GPURenderPassColorAttachment = {
        view: colorTextureView,
        clearValue: { r : 1, g: 0, b: 0, a: 1 },
        loadOp: 'clear',
        storeOp: 'store'
      }

      const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [colorAttachment]
      }  

      const passEncoder = encoder.beginRenderPass(renderPassDescriptor)
      passEncoder.setViewport(0, 0, canvas.current?.width || 1, canvas.current?.height || 1, 0, 1)
      passEncoder.setPipeline(pipeline)
      passEncoder.draw(3, 1)
      passEncoder.end()

      device.queue.submit([encoder.finish()])
    }

    render()
  }, [device, context, encoder, pipeline])

  return (
    <main className={styles.main} >
      <canvas ref={canvas} className={styles.canvas}></canvas>
    </main>
  )
}

export default App
