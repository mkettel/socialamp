import React from 'react';
// import './Overlay.css';
import './style.css';
import * as THREE from 'three';
import { MeshTransmissionMaterial, Html, Text3D } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';

function Overlay({ onEnter, ...props }) {

  const enterRef = useRef()

  // make hover pointer change to a hand
  const [hovered, setHovered] = useState(false)
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
  }, [hovered])


  return (
    <>
    <directionalLight color={'#E6FDFF'} position={[2, 3, 8]} lookAt={enterRef} intensity={2} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-camera-far={50} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10} />

    <group position={[0, -1, 14]} rotation={[-Math.PI / 2, 0, 0]} scale={props.enterScale}>

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
          <meshStandardMaterial envMapIntensity={1.2} color={"#E6FDFF"} metalness={.8} roughness={.01} />
      </Text3D>
    </group>
    </>
  );
}

export default Overlay;
