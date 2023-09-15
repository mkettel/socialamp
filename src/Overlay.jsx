
import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas, extend } from '@react-three/fiber'
import Experience from './Experience.jsx'
import { useState } from 'react'


export default function Overlay(onAboutClick, canvasSize, setCanvasSize) {




  return <>
    <div className="overlay-button-container">
      <div className="overlay-button">
        <p onClick={onAboutClick}>about</p>
      </div>
    </div>

  </>
}
