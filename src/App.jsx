import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas, extend } from '@react-three/fiber'
import Experience from './Experience.jsx'
import { useState } from 'react'
import Overlay from './Overlay'



export default function App() {


  return <>
    <>
      <Canvas
          shadows
          camera={{ position: [0, 7, 13] }}
          gl={{ alpha: false }}
      >
          <Experience />
      </Canvas>
      {/* <Overlay /> */}
    </>
  </>
}
