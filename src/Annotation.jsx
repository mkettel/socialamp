import React, { useState, useEffect, useMemo } from 'react';
import { Text3D, MeshDistortMaterial } from '@react-three/drei';
import { useSpring, a, animated } from '@react-spring/three';


// Buttons
export default function Annotation({ children, onJoinClick, ...props }) {

  // HOVERED STATE POINTER -----------------------------------------------------
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    console.log(document.body.style);
  }, [hovered])


  const AnimatedText = animated(MeshDistortMaterial);
  const springs = useSpring({
    color: hovered ? '#F6908E' : '#D64933',
    config: { mass: 1, tension: 500, friction: 100 },
  })

  // Performance Optimization
  const threeDButton = useMemo(() => {
    return (
      <Text3D
        font="./fonts/Fontana_Bold.json"
        size={ 1 }
        height={ 0.2 }
        curveSegments={ 12 }
        bevelEnabled
        bevelThickness={ 0.02 }
        bevelSize={ 0.01 }
        bevelOffset={ 0 }
        bevelSegments={ 5 }
        letterSpacing={.001}
        onClick={onJoinClick}
        {...props}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        >
        {children}
        <AnimatedText
          envMapIntensity={.9}
          metalness={.3}
          roughness={.3}
          speed={5}
          distort={.17}
          color={springs.color}
        />
      </Text3D>
    )
  })

  return (
    <>
      {threeDButton}
    </>
  )
}
