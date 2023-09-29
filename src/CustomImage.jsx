import lenseFragmentShader from './shaders/lenseFragmentShader'
import lenseVertexShader from './shaders/lenseVertexShader'
import { Color } from 'three'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect, useMemo, useCallback } from 'react'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'


export default function TransShader({ sceneLoaded }) {
  const image = useRef()
  const [santa] = useTexture(['./VN.jpg'])

  const mousePosition = useRef({ x: 0, y: 0 });

  const updateMousePosition = useCallback((e) => {
    mousePosition.current = { x: e.pageX, y: e.pageY };
  }, []);

  const uniforms = useMemo(() => ({
    u_time: { value: 0.0 },
    u_colorA: { value: new Color('#FFFFFF') },
    u_colorB: { value: new Color('#FFFFFF') },
    u_texture: { value: santa },
    u_mouse: { value: new THREE.Vector2(0, 0) },
    u_opacity: { value: 0.9 },
  }))

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition, false);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition, false);
    };
  }, [updateMousePosition]);

  useFrame((state) => {
    if (sceneLoaded) {
      const { clock } = state
      image.current.material.uniforms.u_time.value = clock.getElapsedTime()
      image.current.material.uniforms.u_mouse.value.y = mousePosition.current.y;
      image.current.material.uniforms.u_mouse.value.x = mousePosition.current.x;
      image.current.material.uniforms.u_opacity.value += 0.01;
    }
  })

  return (
    <mesh ref={image} rotation={[0, 0, 0]} position={[0, .7, .2]}>
      <planeGeometry args={[6.5, 3.5, 32, 32]} />
      <shaderMaterial
        vertexShader={lenseVertexShader}
        fragmentShader={lenseFragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        transparent
        lights={false}
      />
    </mesh>
  )
}
