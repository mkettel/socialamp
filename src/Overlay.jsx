import React from 'react';
// import './Overlay.css';
import './style.css';
import * as THREE from 'three';
import { MeshTransmissionMaterial, Html, Text3D } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';

function Overlay({ onEnter }) {

  const enterRef = useRef()

  // make hover pointer change to a hand
  const [hovered, setHovered] = useState(false)
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
  }, [hovered])


  return (
    <group position={[0, 19.5, 27]}>

      <Text3D
          ref={enterRef}
          castShadow
          font="./fonts/Fontana_Bold.json"
          size={ 1 }
          height={ 0.2 }
          curveSegments={ 12 }
          bevelEnabled
          bevelThickness={ 0.02 }
          bevelSize={ 0.01 }
          bevelOffset={ 0 }
          bevelSegments={ 5 }
          position={[-1.35, 0.11, 0]}
          letterSpacing={.001}
          onClick={onEnter}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}

      >
          enter
          <meshStandardMaterial envMapIntensity={1.2} color={"#001011"} metalness={.8} roughness={.01} />
      </Text3D>
    </group>

  );
}

export default Overlay;
