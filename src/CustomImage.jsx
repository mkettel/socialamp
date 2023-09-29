import lenseFragmentShader from './shaders/lenseFragmentShader'
import lenseVertexShader from './shaders/lenseVertexShader'
import { Color } from 'three'
import { useFrame, extend } from '@react-three/fiber'
import { useRef, useEffect, useMemo, useCallback, useState } from 'react'
import * as THREE from 'three'
import { useTexture, shaderMaterial } from '@react-three/drei'


export const ImageFadeMaterial = shaderMaterial(
  {
    effectFactor: 1.2,
    dispFactor: 0.0,
    tex: undefined,
    tex2: undefined,
    disp: undefined,
  },
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }`,
  `
  varying vec2 vUv;
  uniform sampler2D tex;
  uniform sampler2D tex2;
  uniform sampler2D disp;
  uniform float _rot;
  uniform float dispFactor;
  uniform float effectFactor;
  void main() {
    vec2 uv = vUv;
    vec4 disp = texture2D(disp, uv);
    vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r*effectFactor), uv.y);
    vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (disp.r*effectFactor), uv.y);
    vec4 _texture = texture2D(tex, distortedPosition);
    vec4 _texture2 = texture2D(tex2, distortedPosition2);
    vec4 finalTexture = mix(_texture, _texture2, dispFactor);
    gl_FragColor = finalTexture;
    #include <tonemapping_fragment>
    #include <encodings_fragment>
  }`
)

extend({ ImageFadeMaterial })

export default function FadingImage({ currentProject, setCurrentProject, projects, previousProject, setPreviousProject, sceneLoaded }) {
  const ref = useRef()
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [texture1, texture2, dispTexture] = useTexture([previousProject.src, currentProject.src, "/shader-img/shader-fade-2.jpeg"])

  useFrame(() => {
    if (isTransitioning) {
      ref.current.dispFactor += 0.055;
      if (ref.current.dispFactor >= 1) {
        setIsTransitioning(false);
      }
    }
  });

  useEffect(() => {
    if (!isTransitioning && currentProject.id !== previousProject.id) {
      setIsTransitioning(true);
    }
  }, [currentProject, previousProject]);

  useEffect(() => {
    if (!isTransitioning) {
      setPreviousProject(currentProject);
      ref.current.dispFactor = 0;  // reset for the next transition
    }
  }, [isTransitioning, currentProject, setPreviousProject]);

  return (
    <mesh>
      <planeGeometry args={[6, 4, 1]} />
      <imageFadeMaterial ref={ref} tex={texture1} tex2={texture2} disp={dispTexture} toneMapped={false} />
    </mesh>
  )
}


// export default function TransShader({ sceneLoaded }) {
//   const image = useRef()
//   const [santa] = useTexture(['./VN.jpg'])

//   const mousePosition = useRef({ x: 0, y: 0 });

//   const updateMousePosition = useCallback((e) => {
//     mousePosition.current = { x: e.pageX, y: e.pageY };
//   }, []);

//   const uniforms = useMemo(() => ({
//     u_time: { value: 0.0 },
//     u_colorA: { value: new Color('#FFFFFF') },
//     u_colorB: { value: new Color('#FFFFFF') },
//     u_texture: { value: santa },
//     u_mouse: { value: new THREE.Vector2(0, 0) },
//     u_opacity: { value: 0.9 },
//   }))

//   useEffect(() => {
//     window.addEventListener("mousemove", updateMousePosition, false);

//     return () => {
//       window.removeEventListener("mousemove", updateMousePosition, false);
//     };
//   }, [updateMousePosition]);

//   useFrame((state) => {
//     if (sceneLoaded) {
//       const { clock } = state
//       image.current.material.uniforms.u_time.value = clock.getElapsedTime()
//       image.current.material.uniforms.u_mouse.value.y = mousePosition.current.y;
//       image.current.material.uniforms.u_mouse.value.x = mousePosition.current.x;
//       image.current.material.uniforms.u_opacity.value += 0.01;
//     }
//   })

//   return (
//     <mesh ref={image} rotation={[0, 0, 0]} position={[0, .7, .2]}>
//       <planeGeometry args={[6.5, 3.5, 32, 32]} />
//       <shaderMaterial
//         vertexShader={lenseVertexShader}
//         fragmentShader={lenseFragmentShader}
//         uniforms={uniforms}
//         side={THREE.DoubleSide}
//         transparent
//         lights={false}
//       />
//     </mesh>
//   )
// }
