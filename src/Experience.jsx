import { CameraControls, OrbitControls, MeshTransmissionMaterial, Text3D, Center, Html, Text, Environment, Billboard, RoundedBox, MeshDistortMaterial, Image } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { easing, geometry, three } from 'maath'
import { useState, Suspense, useRef, useMemo, useEffect, React } from 'react'
import lenseVertexShader from './shaders/lenseVertexShader'
import lenseFragmentShader from './shaders/lenseFragmentShader'
import Ocean from './Ocean'
import { useSpring, a, animated } from '@react-spring/three';
import { useThree } from '@react-three/fiber'
import { lerp } from 'three/src/math/MathUtils'
import { Vector2, Vector3, MathUtils } from 'three';
import Annotation from './Annotation'


extend(geometry)



export default function Experience()
{
  const { camera } = useThree();

  // Scene Resizing for Mobile -----------------------------------------------
  const [wordScale, setWordScale ] = useState(1.5);
  const [wordPosition, setWordPosition] = useState([0, 0.4, 0]);
  const [imageScale, setImageScale] = useState([4, 2, 1]);
  const [aboutModalScale, setAboutModalScale] = useState(1);
  const [aboutTextScale, setAboutTextScale] = useState(.35);
  useEffect(() => {
    function handleResize() {
      const { innerWidth } = window;
      const isMobile = innerWidth <= 768; // Adjust the breakpoint for mobile devices
      const wordScale = isMobile ? .60 : 1.5;
      const wordPosition = isMobile ? [0, 0, 0] : [0, 0.4, 0];
      const aboutModalScale = isMobile ? .6 : 1;
      const aboutTextScale = isMobile ? .3 : .35;
      const imageScale = isMobile ? [6, 4, 1] : [4, 2, 1];
      setWordScale(wordScale);
      setWordPosition(wordPosition);
      setAboutModalScale(aboutModalScale);
      setAboutTextScale(aboutTextScale);
      setImageScale(imageScale);
    }
    window.addEventListener('resize', handleResize);
  handleResize(); // Call the function initially

  return () => {
    window.removeEventListener('resize', handleResize);
  };
  }, []);
  // --------------------------------------------------------------------------
  // STATES & OPENING ANIMATION------------------------------------------------
  const [about, setAbout] = useState(false);
  const lenseRef = useRef()
  const [minPolarAngle, setMinPolarAngle] = useState(.7);
  const [maxPolarAngle, setMaxPolarAngle] = useState(Math.PI / 2);
  const [minAzimuthAngle, setMinAzimuthAngle] = useState(-.5);
  const [maxAzimuthAngle, setMaxAzimuthAngle] = useState(.5);

  const cameraRef = useRef(); // reference to the camera

  const startingCameraPosition = [0, 7, 13];
  const startingTarget = [0, 1, 13];
  const endingCameraPosition = [0, 0.9, 5];
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
  // setting the starting camera position and target
  useEffect(() => {
    camera.position.set(...startingCameraPosition);
    camera.lookAt(...startingTarget);
    camera.updateProjectionMatrix();
    setCameraLook();
    setMinPolarAngle(1.1);
    setMaxPolarAngle(Math.PI / 2);
    console.log(about);
  }, []);

  useFrame(() => {
    if (animationProgress < 1) {
      setAnimationProgress(prev => Math.min(prev + 0.0098, 1)); // increase progress towards 1
      setCameraLook();
    }
  });

  // ABOUT BUTTON MODAL CAMERA MOVEMENT ---------------------------------------
  // Action when the About Button gets clicked
  const handleAboutClick = () => {
    const newAboutValue = !about;
    setAbout(newAboutValue);
    const aboutModalPosition = [0, 3, 7];
    const aboutModalTarget = [0, 3, 0];
    if (newAboutValue) {
      // If About is already opened, set camera to starting position
      cameraRef.current.azimuthRotateSpeed = 0; // disable camera rotation
      cameraRef.current.polarRotateSpeed = 0; // disable camera rotation
      cameraRef.current.setLookAt(...aboutModalPosition, ...aboutModalTarget, .001);
      console.log(cameraRef);
    } else {
      // If About is closed, set camera to ending position
      cameraRef.current.setLookAt(...endingCameraPosition, ...endingTarget, .1);
      cameraRef.current.azimuthRotateSpeed = 1;
      cameraRef.current.polarRotateSpeed = 1;
    }
  };

  const imageV = useRef();
  console.log(imageV.current);

  useFrame(() => {
    imageV.current.material.zoom = 1 // 1 and higher
    // imageV.current.material.grayscale = ... // between 0 and 1
    imageV.current.material.color.set('#C6C8EE') // mix-in color
  })

  const { width: w, height: h } = useThree((state) => state.viewport)


    return <>

    <CameraControls ref={cameraRef} minPolarAngle={minPolarAngle} maxPolarAngle={maxPolarAngle} minAzimuthAngle={minAzimuthAngle} maxAzimuthAngle={maxAzimuthAngle} />

        {/* <Perf position="top-right" /> */}
        <Environment background files='./background/s-1.hdr' />

          {/* 3D TEXT */}
        <group scale={wordScale} position={wordPosition} rotation={[0, 0, 0]}>
          <Center>


            {/* image */}
            <Image
              ref={imageV}
              url="/VN.jpg"
              transparent
              opacity={0.9}
              scale={imageScale}
              position={[0, 0, 0]}
            />


          </Center>
        </group>

      <Ocean />

      {/* Don't use Rig on mobile */}
      {window.innerWidth > 768 &&
        <Rig
          animationProgress={animationProgress}
          cameraRef={cameraRef}
        />
      }
      {/* <MouseEvents ref={lenseRef} /> */}
    </>

}




// Modal for About
function AboutModal(props) {

  return (
    <>
      <group {...props}>
        <RoundedBox
          args={[6.5, 1.2, .2]} // Width, height, depth. Default is [1, 1, 1]
          radius={0.1} // Radius of the rounded corners. Default is 0.05
          smoothness={4} // The number of curve segments. Default is 4
          bevelSegments={4} // The number of bevel segments. Default is 4, setting it to 0 removes the bevel, as a result the texture is applied to the whole geometry.
          creaseAngle={0.4} // Smooth normals everywhere except faces that meet at an angle greater than the crease angle
        >
          <meshStandardMaterial color="white" />
        </RoundedBox>
        <Html transform position={[0, 0, 0]}>
           <p className='about-text'>SocialAmp can be used to amplify your movies social media engagement. <br></br> Using stats from various social media outlets, we give you what you are <br></br> looking for to analyze your latest media. </p>
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


function Rig({ animationProgress, cameraRef }) {
    const vec = new Vector3();
    const move = new Vector3();
    const position = new Vector3();
    const wobble = new Vector3();
    const wobbleAngle = MathUtils.degToRad(Math.random() * 360);
    const wobbleStrength = 0.001;
    const wobbleSpeed = 75e-2;

    const strength = 3;
    const moveXY = new Vector2(8, 4);
    const deltaRotate = 20;

    if (animationProgress >= 1) {
      const camera = cameraRef.current.camera;
      console.log(camera);

        return useFrame(({ mouse, clock }) => {
            const t = clock.elapsedTime;
            const mouseX = (mouse.x + 1) / 2;  // Convert mouse range [-1, 1] to [0, 1]
            const mouseY = (mouse.y + 1) / 2;

            // Calculate desired movement based on the mouse
            move.x = MathUtils.mapLinear(mouseX, 0, 1, -1, 1) * strength * moveXY.x;
            move.y = MathUtils.mapLinear(mouseY, 0, 1, -1, 1) * strength * moveXY.y;
            position.lerp(move, 0.04);  // Lerp speed for the camera position

            // Wobbling effect
            wobble.x = Math.cos(wobbleAngle + t * (wobbleSpeed)) * (wobbleAngle + 100 * Math.sin(t * (95e-4)));
            wobble.y = Math.sin(Math.asin(Math.cos(wobbleAngle + t * (85e-5)))) * (150 * Math.sin(wobbleAngle + t * (75e-5)));
            wobble.z = Math.sin(wobbleAngle + .025 * wobble.x) * 100;
            wobble.multiplyScalar(wobbleStrength);
            camera.position.add(wobble);

            camera.position.lerp(position, 0.04);
            camera.lookAt(0, 0, 0);
        });
    }
}
