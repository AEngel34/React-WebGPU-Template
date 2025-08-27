# React + WebGPU Template

A minimal starter template for building React apps with WebGPU, TypeScript, and Vite.

## Features

- ⚛️ React 19 + TypeScript
- ⚡️ Fast development with Vite
- 🎨 WebGPU ready (renders a triangle by default)
- 🧩 Custom hooks for WebGPU initialization and shader modules
- 📝 ESLint preconfigured

## Structure

```
app/
  src/
    App.tsx              # Main component, minimal WebGPU pipeline
    hooks/
      useWebGPU.ts         # WebGPU initialization hook
      useShaderModule.ts   # Shader module hook
    shaders/
      vertex.wgsl          # Vertex shader (WGSL)
      fragment.wgsl        # Fragment shader (WGSL)
  public/
  package.json
  vite.config.ts
  tsconfig.app.json
  ...
```

## Getting Started

```sh
cd app
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Customization

- Edit shaders in `src/shaders/` to change the rendering.
- Adjust the pipeline in [`App.tsx`](src/App.tsx) as needed.

## Requirements

- WebGPU-compatible browser ([see compatibility](https://caniuse.com/webgpu))
- Node.js ≥ 18

---

MIT License ©
