import lenseFragmentShader from './shaders/lenseFragmentShader'
import lenseVertexShader from './shaders/lenseVertexShader'
import { Color } from 'three'
import { useFrame, extend } from '@react-three/fiber'
import { useRef, useEffect, useMemo, useCallback, useState } from 'react'
import * as THREE from 'three'
import { useTexture, shaderMaterial } from '@react-three/drei'
import { EffectComposer, GodRays, Vignette } from '@react-three/postprocessing'
import { useSpring, animated } from '@react-spring/three'


export const ImageFadeMaterial = shaderMaterial(
  {
    effectFactor: 1.2,
    dispFactor: 0.0,
    tex: undefined,
    tex2: undefined,
    disp: undefined,
    generalOpacity: 0.9,
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
  uniform float generalOpacity;
  void main() {
    vec2 uv = vUv;
    vec4 disp = texture2D(disp, uv);
    vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r*effectFactor), uv.y);
    vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (disp.r*effectFactor), uv.y);
    vec4 _texture = texture2D(tex, distortedPosition);
    vec4 _texture2 = texture2D(tex2, distortedPosition2);
    vec4 finalTexture = mix(_texture, _texture2, dispFactor);

    // Calculate fade effect based on vUv.y for bottom fade
    // float fadeFactor = pow(vUv.y, 4.0);
    float startFade = 0.1; // Start fading from 20% of the way down
    float fadeRange = 0.45 - startFade; // Calculate the range over which to fade
    float normalizedFade = clamp((vUv.y - startFade) / fadeRange, 0.0, 1.0); // Normalize and clamp the fade value to [0, 1]
    float fadeFactor = pow(normalizedFade, 6.5);

    // If you have an alpha channel, use this:
    finalTexture.a *= fadeFactor * generalOpacity;
    gl_FragColor = finalTexture;

    // If you don't have an alpha channel and need to mix with a background color (e.g., white), use this:
    // vec4 backgroundColor = vec4(1.0, 1.0, 1.0, 1.0); // White background
    // gl_FragColor = mix(backgroundColor, finalTexture, fadeFactor);

    #include <tonemapping_fragment>
    #include <encodings_fragment>
  }
  `
)

extend({ ImageFadeMaterial })


export default function FadingImage({ currentProject, setCurrentProject, projects, previousProject, setPreviousProject, sceneLoaded }) {
  const ref = useRef()
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [texture1, texture2, dispTexture] = useTexture([previousProject.src, currentProject.src, "/shader-img/shader-fade-2.jpeg"])

  // Scene Resizing for Mobile -----------------------------------------------
  const [imageSize, setImageSize] = useState([7, 5, 1]);
  const [imagePosition, setImagePosition] = useState([0, 0, 0]);
  useEffect(() => {
    function handleResize() {
      const { innerWidth } = window;
      const isMobile = innerWidth <= 768; // Adjust the breakpoint for mobile devices
      const imageSize = isMobile ? [4.6, 3.5, 1] : [7, 5, 1]; // Adjust the scale values for mobile
      const imagePosition = isMobile ? [0, -0.2, 0] : [0, 0, 0]; // Adjust the position values for mobile
      setImageSize(imageSize);
      setImagePosition(imagePosition);
    }
    window.addEventListener('resize', handleResize);
  handleResize(); // Call the function initially

  return () => {
    window.removeEventListener('resize', handleResize);
  };
  }, []);
  // --------------------------------------------------------------------------

  const fadeProps = useSpring({
    from: { opacity: 0 },
    to: { opacity: 0.86 },
    config: { duration: 1000 }, // adjust the duration as needed
  });

  useFrame(() => {
    if (ref.current) {
      ref.current.uniforms.generalOpacity.value = fadeProps.opacity.get();
    }

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
    <>
      <animated.mesh position={imagePosition} >
          <planeGeometry args={imageSize} />
          <imageFadeMaterial ref={ref} tex={texture1} tex2={texture2} disp={dispTexture} toneMapped={false} transparent />
      </animated.mesh>

    </>
  )
}
