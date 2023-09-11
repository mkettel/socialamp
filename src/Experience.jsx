import { CameraControls, OrbitControls, Caustics, MeshTransmissionMaterial, Text3D, Center, SoftShadows, Html, Text, Environment } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { easing, geometry } from 'maath'
import { useState, ControlledInput, Suspense, useRef, useMemo, useEffect, React } from 'react'
import lenseVertexShader from './shaders/lenseVertexShader'
import lenseFragmentShader from './shaders/lenseFragmentShader'
import Ocean from './Ocean'
import { useSpring, a } from '@react-spring/three';
import { useThree } from '@react-three/fiber'
import { lerp } from 'three/src/math/MathUtils'


extend(geometry)



export default function Experience()
{
  const { camera } = useThree();

  // Scene Resizing for Mobile -----------------------------------------------
  const [wordScale, setWordScale ] = useState(1.5);
  useEffect(() => {
    function handleResize() {
      const { innerWidth } = window;
      const isMobile = innerWidth <= 768; // Adjust the breakpoint for mobile devices
      const wordScale = isMobile ? .60 : 1.5; // Adjust the scale values for mobile
      setWordScale(wordScale);
    }
    window.addEventListener('resize', handleResize);
  handleResize(); // Call the function initially

  return () => {
    window.removeEventListener('resize', handleResize);
  };
  }, []);
  // --------------------------------------------------------------------------
  const [about, setAbout] = useState(false);
  const lenseRef = useRef()
  const [minPolarAngle, setMinPolarAngle] = useState(.7);
  const [maxPolarAngle, setMaxPolarAngle] = useState(Math.PI / 2);

  const cameraRef = useRef(); // reference to the camera

  const startingCameraPosition = [0, 7, 13];
  const startingTarget = [0, 1, 13];
  const endingCameraPosition = [0, 0.3, 4];
  const endingTarget = [0, 0, 0];

  const [animationProgress, setAnimationProgress] = useState(0);

  const setCameraLook = () => { // set the camera position and target based on the animation progress
    const lerpFactor = lerp(0, 1, animationProgress);
    const position = startingCameraPosition.map((start, index) => lerp(start, endingCameraPosition[index], lerpFactor));
    const target = startingTarget.map((start, index) => lerp(start, endingTarget[index], lerpFactor));
    if (cameraRef.current) {
      cameraRef.current.setLookAt(...position, ...target);
    }
  };

  useEffect(() => {
    camera.position.set(...startingCameraPosition);
    camera.lookAt(...startingTarget);
    camera.updateProjectionMatrix();
    setCameraLook();
    setMinPolarAngle(.7);
    setMaxPolarAngle(Math.PI / 2);
  }, []);

  useFrame(() => {
    if (animationProgress < 1) {
      setAnimationProgress(prev => Math.min(prev + 0.0095, 1)); // increase progress towards 1
      setCameraLook();
    }
  });




  const overlayEnter = () => {
    setAnimationProgress(0); // restart the animation progress when the overlay is clicked
  };

  // Function for when the About button is clicked
  const handleAboutClick = () => {
    console.log('About button clicked');
    const aboutModalPosition = [0, 0, 6];
    const aboutModalTarget = [0, 3, 0];
    if (about) {
        // If About is already opened, set camera to starting position
        cameraRef.current.setLookAt(...endingCameraPosition, ...endingTarget, .1);
      } else {
        // If About is closed, set camera to ending position
        cameraRef.current.setLookAt(...aboutModalPosition, ...aboutModalTarget, .1);
    }
    setAbout(prev => !prev);  // Toggle the 'about' state
};


    return <>

    <CameraControls ref={cameraRef} minPolarAngle={minPolarAngle} maxPolarAngle={maxPolarAngle} />

        <Perf position="top-right" />
        <Environment background files="./background/s-1.hdr" />



          {/* 3D TEXT */}
        <group scale={wordScale} position={[0, 0.16, 0]} rotation={[0, 0, 0]}>
          <Center>
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
              position={[-1.35, 0.11, 0]}
              letterSpacing={.001}
          >
              social
              <meshStandardMaterial envMapIntensity={1.2} color={"#001011"} metalness={.8} roughness={.01} />
          </Text3D>
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
              position={[1.65, 0.11, 0]}
              letterSpacing={.001}
          >
              amp
              <meshStandardMaterial envMapIntensity={1.2} color={"red"} metalness={.8} roughness={.01} />
          </Text3D>
          </Center>
        </group>

        <Ocean />

      {/* About Button */}
      {about ? (
        <>
          <AboutModal position={[-1.3, 1.5, 0]} scale={.9}/>
          <Annotation position={[-3.5, 1, .2]} scale={1} onJoinClick={handleAboutClick} >
            <span style={{ fontSize: '1.5em' }}>Close</span>
          </Annotation>
        </>
      ) : (
        <Annotation position={[-3.5, 1, .2]} scale={1} onJoinClick={handleAboutClick}>
          <span style={{ fontSize: '1.5em' }}>About</span>
        </Annotation>
      )}
      {/* <MouseEvents lenseRef={lenseRef} /> */}
      {/* <Lense lenseRef={lenseRef} /> */}
      </>
}

// Buttons
function Annotation({ children,onJoinClick, ...props }) {

  return (
    <Html
      {...props}
      transform
      occlude="blending"
      geometry={
        <roundedPlaneGeometry args={[.9, 0.27, 0.13]} />
      }>
      <div className="annotation" onClick={onJoinClick}>{children}</div>
    </Html>
  )
}


// Modal for About
function AboutModal(props) {

  return (
    <>
      <group {...props}>
        {/* <Text position={[0, 0, 0]} anchorX="0px" font="/Inter-Regular.woff" fontSize={0.2} letterSpacing={-0.0}>
          howdy
          <meshStandardMaterial color="black" />
        </Text> */}
        {/* <mesh position={[0, 0, 0]} scale={[3.9, 0.48, 1]}>
          <planeGeometry />
          <meshBasicMaterial transparent opacity={0.3} depthWrite={false} />
        </mesh> */}
        <Html transform position={[0, 0, 0]}>
           <p className='about-text'>SocialAmp can be used to amplify <br></br> your movies social media engagement</p>
        </Html>

      </group>

    </>
  )
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
function Lense({ lenseRef }) {

  return <>
    <mesh ref={lenseRef} position={[0, 0, 0]} scale={.5} >
      <sphereGeometry />
        <meshPhysicalMaterial
        reflectivity={.05}
        roughness={.15}
        metalness={.1}
        clearcoat={.16}
        transmission={1}
        opacity={0.5}
        thickness={10}
        ior={1.1}
        color={'#ffffff'}
        />
    </mesh>

  </>
}

// Rig to move camera with mouse
function Rig() {

  const vec = new THREE.Vector3();

  return useFrame(({ camera, mouse }) => {
    vec.set(mouse.x * 2, mouse.y * 2, camera.position.z)
    camera.position.lerp(vec, 0.025)
    camera.lookAt(0, 0, 0)
  })
}
