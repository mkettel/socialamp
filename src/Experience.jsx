import { CameraControls, Environment, Image, useTexture } from '@react-three/drei'
import './style.css'
import { Perf } from 'r3f-perf'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { easing, geometry, three } from 'maath'
import { useState, Suspense, useRef, useMemo, useEffect, React, useCallback } from 'react'
import Ocean from './Ocean'
import { useThree } from '@react-three/fiber'
import { lerp } from 'three/src/math/MathUtils'
import { Vector2, Vector3, MathUtils } from 'three';
import { EffectComposer, GodRays, Vignette } from '@react-three/postprocessing'


extend(geometry)


export default function Experience( { projects, setSceneLoaded, sceneLoaded={sceneLoaded} } )
{
  const { camera } = useThree();

  // Scene Resizing for Mobile -----------------------------------------------
  useEffect(() => {
    function handleResize() {
      const { innerWidth } = window;
      const isMobile = innerWidth <= 768; // Adjust the breakpoint for mobile devices
    }
    window.addEventListener('resize', handleResize);
  handleResize(); // Call the function initially

  return () => {
    window.removeEventListener('resize', handleResize);
  };
  }, []);
  // --------------------------------------------------------------------------



  // STATES & OPENING ANIMATION------------------------------------------------
  const [minPolarAngle, setMinPolarAngle] = useState(.7);
  const [maxPolarAngle, setMaxPolarAngle] = useState(Math.PI / 2);
  const [minAzimuthAngle, setMinAzimuthAngle] = useState(-.05);
  const [maxAzimuthAngle, setMaxAzimuthAngle] = useState(.05);

  const cameraRef = useRef(); // reference to the camera

  const startingCameraPosition = [0, 7, 12];
  const startingTarget = [0, 1, 12];
  const endingCameraPosition = [0, 1.3, 5.5];
  const endingTarget = [0, 1, 0];

  const [animationProgress, setAnimationProgress] = useState(0);

  const setCameraLook = () => { // set the camera position and target based on the animation progress
    const lerpFactor = lerp(0, 1, animationProgress);
    const position = startingCameraPosition.map((start, index) => lerp(start, endingCameraPosition[index], lerpFactor));
    const target = startingTarget.map((start, index) => lerp(start, endingTarget[index], lerpFactor));
    if (cameraRef.current) {
      cameraRef.current.setLookAt(...position, ...target);
    }
  };
  // setting the starting camera position and target
  useEffect(() => {
    camera.position.set(...startingCameraPosition);
    camera.lookAt(...startingTarget);
    camera.updateProjectionMatrix();
    setCameraLook();
    setMinPolarAngle(1.45);
    setMaxPolarAngle(Math.PI / 2);
  }, []);

  useFrame(() => {
    if (animationProgress < 1) {
      setAnimationProgress(prev => Math.min(prev + 0.0098, 1)); // increase progress towards 1
      setCameraLook();
    } else {
      setSceneLoaded(true);
    }
  }, []);


    return <>
    <EffectComposer>
      <Vignette />

      <CameraControls ref={cameraRef} minPolarAngle={minPolarAngle} maxPolarAngle={maxPolarAngle} minAzimuthAngle={minAzimuthAngle} maxAzimuthAngle={maxAzimuthAngle} minDistance={5} maxDistance={6} />

      {/* <Perf position="top-right" /> */}
      <Environment background files='./background/eveninghdr.hdr' />

      <Ocean />

      {/* Don't use Rig on mobile */}
      {window.innerWidth > 768 &&
        <Rig
        animationProgress={animationProgress}
        cameraRef={cameraRef}
        />
      }

      </EffectComposer>
    </>
}

// Getting mouse position
function MouseEvents({ lenseRef }) {
  const vec = new THREE.Vector3();

  return useFrame(({ mouse }) => {
    if (lenseRef.current) {
      vec.set(mouse.x * 3, mouse.y * 3, 0)
      lenseRef.current.position.lerp(vec, 0.1)
    }

  })
}




function Rig({ animationProgress, cameraRef }) {
  const wobbleAngleRef = useRef(MathUtils.degToRad(Math.random() * 360));
  const moveRef = useRef(new Vector3());
  const positionRef = useRef(new Vector3());

  useFrame(({ mouse, clock }) => {
      if (animationProgress >= 1 && cameraRef.current && cameraRef.current.camera) {
          const wobble = new Vector3();
          const wobbleStrength = 0.001;
          const wobbleSpeed = 75e-2;
          const strength = 3;
          const moveXY = new Vector2(9, 4);

          const t = clock.elapsedTime;
          const mouseX = (mouse.x + 1) / 2;  // Convert mouse range [-1, 1] to [0, 1]
          const mouseY = (mouse.y + 1) / 2;

          moveRef.current.x = MathUtils.mapLinear(mouseX, 0, 1, -1, 1) * strength * moveXY.x;
          moveRef.current.y = MathUtils.mapLinear(mouseY, 0, 1, -1, 1) * strength * moveXY.y;
          positionRef.current.lerp(moveRef.current, 0.04);

          // Wobbling effect
          wobble.x = Math.cos(wobbleAngleRef.current + t * wobbleSpeed) * (wobbleAngleRef.current + 100 * Math.sin(t * 95e-4));
          wobble.y = Math.sin(Math.asin(Math.cos(wobbleAngleRef.current + t * 85e-5))) * (150 * Math.sin(wobbleAngleRef.current + t * 75e-5));
          wobble.z = Math.sin(wobbleAngleRef.current + 0.025 * wobble.x) * 100;
          wobble.multiplyScalar(wobbleStrength);
          cameraRef.current.camera.position.add(wobble);

          cameraRef.current.camera.position.lerp(positionRef.current, 0.04);
          cameraRef.current.camera.lookAt(0, 1, 0);
      }
  });

  return null;
}
