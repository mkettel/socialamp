import React from 'react';
// import './Overlay.css';
import './style.css';
import * as THREE from 'three';

function Overlay({ onEnter }) {
  return (
    <mesh onClick={onEnter} position={[0, 1, -4]}  rotation={[1, 0, 0]}>
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <meshBasicMaterial side={THREE.DoubleSide} attach="material" color="black" opacity={.7} transparent />
    </mesh>

  );
}

export default Overlay;
