import { useMemo } from "react"

export const useShaderModule = (device: GPUDevice | null, label: string, shader: string)=>{
    const module = useMemo(()=>{
        if(!device) return null
        return device.createShaderModule({
            label,
            code: shader
        })
    }, [device, label, shader])

    return module
}