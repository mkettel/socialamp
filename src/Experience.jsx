import { OrbitControls, Caustics, MeshTransmissionMaterial, Text3D, Center, SoftShadows, Html, Text, Environment } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { easing, geometry } from 'maath'
import { useState, ControlledInput, Suspense, useRef, useMemo } from 'react'
import lenseVertexShader from './shaders/lenseVertexShader'
import lenseFragmentShader from './shaders/lenseFragmentShader'
import Ocean from './Ocean'
import { useSpring, a } from '@react-spring/three';
import { useThree } from '@react-three/fiber'


extend(geometry)



export default function Experience()
{
  const [about, setAbout] = useState(false);
  const lenseRef = useRef()
    return <>

        {/* <Perf position="top-left" /> */}

        <OrbitControls makeDefault />

        <directionalLight castShadow position={ [ .5, 1, 3 ] } intensity={ 1.2 } />
        <ambientLight intensity={ 0.1 } />
        <Environment background files="./background/s-1.hdr" />
        <Environment files="./background/s-1.hdr" />

        {/* <Center> */}
        <group scale={1.5} position={[0, 0.16, 0]} rotation={[0, 0, 0]}>
          <Center>
            <Text3D
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
              castShadow
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
          <Annotation position={[-3.5, -1, .2]} scale={1} onJoinClick={() => setAbout(false)}>
            <span style={{ fontSize: '1.5em' }}>Close</span>
          </Annotation>
        </>
      ) : (
        <Annotation position={[-3.5, -1, .2]} scale={1} onJoinClick={() => setAbout(true)}>
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
