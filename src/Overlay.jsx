import React from 'react';
// import './Overlay.css';
import './style.css';
import * as THREE from 'three';
import { MeshTransmissionMaterial, Html } from '@react-three/drei';

function Overlay({ onEnter }) {
  return (
    <mesh  position={[0, 1, -3]}  rotation={[0, Math.PI, 0]}>
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <meshBasicMaterial side={THREE.DoubleSide} attach="material" color="black" opacity={.8} transparent />
      <Html transform position={[0, 3, 0]}>
        <div className="overlay">
          <h1 onClick={onEnter} className="overlay-title">ENTER</h1>
        </div>
      </Html>
    </mesh>

  );
}

export default Overlay;
