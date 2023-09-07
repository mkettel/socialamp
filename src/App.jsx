import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import { useState, useRef } from 'react'
import Overlay from './Overlay.jsx'
import { CameraControls } from '@react-three/drei'


export default function App() {


  return <>

    <Canvas
        shadows
    >
        <Experience />
    </Canvas>


  </>
}
