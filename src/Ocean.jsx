import { Water } from 'three-stdlib'
import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree, useLoader, extend } from '@react-three/fiber'
import * as THREE from 'three'

extend({ Water })

export default function Ocean() {
  const ref = useRef()
  const gl = useThree((state) => state.gl)
  const waterNormals = useLoader(THREE.TextureLoader, '/waternormals.jpg')
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping
  const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), [])
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: "#F3C98B",
      waterColor: "#264185",
      distortionScale: 1.3,
      fog: false,
      format: gl.encoding
    }),
    [waterNormals]
  )
  useFrame((state, delta) => (ref.current.material.uniforms.time.value += delta * .06))
  return <water ref={ref} args={[geom, config]} position-y={-.8} rotation-x={-Math.PI / 2} />
}
