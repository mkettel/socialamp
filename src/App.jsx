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
        camera={ {
            fov: 45,
            near: 0.1,
            far: 200,
            position: [0, 4, -10],
            lookat: [0, 4, 0]
        } }
    >
        <Experience />
    </Canvas>


  </>
}
