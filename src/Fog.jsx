import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader, extend } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from './shaders/fogVertexShader';
import fragmentShader from './shaders/fogFragShader';

export default function FogPlane({ textureUrl = null, numInstances = 200 }) {
  const instancedMesh = useRef();

  const texture = textureUrl ? useLoader(THREE.TextureLoader, textureUrl) : null;

  const { geometry, material } = useMemo(() => {
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.PlaneGeometry(1100, 1100, 20, 20);
    geometry.copy(baseGeometry);

    const instancePositions = new THREE.InstancedBufferAttribute(new Float32Array(numInstances * 3), 3);
    const delays = new THREE.InstancedBufferAttribute(new Float32Array(numInstances), 1);
    const rotates = new THREE.InstancedBufferAttribute(new Float32Array(numInstances), 1);

    for (let i = 0; i < numInstances; i++) {
      instancePositions.setXYZ(
        i,
        (Math.random() * 2 - 1) * 850,
        0,
        (Math.random() * 2 - 1) * 300,
      );
      delays.setXYZ(i, Math.random());
      rotates.setXYZ(i, Math.random() * 2 + 1);
    }

    geometry.setAttribute('instancePosition', instancePositions);
    geometry.setAttribute('delay', delays);
    geometry.setAttribute('rotate', rotates);

    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: { value: 0 },
        tex: { value: texture }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { geometry, material };
  }, [texture, numInstances]);

  useFrame(({ clock }) => {
    if (instancedMesh.current) {
      instancedMesh.current.material.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <instancedMesh ref={instancedMesh} args={[geometry, material, numInstances]} />
  );
}
