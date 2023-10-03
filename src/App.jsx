import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas, extend, useThree } from '@react-three/fiber'
import Experience from './Experience.jsx'
import { useState, useEffect, useRef } from 'react'
import { Html, OrbitControls, useTexture } from '@react-three/drei'
// import { useSpring, a, animated } from '@react-spring/three';
import { useSpring, animated, useTrail } from '@react-spring/web'
import TransShader from './CustomImage.jsx'
import NormImage from './NormImage'
import FadingImage from './CustomImage.jsx'
import * as THREE from 'three'
import Overlay from './Overlay.jsx'


const MOBILE_BREAKPOINT = 768;

export default function App() {

  // setting the canvas size
  const [canvasSize, setCanvasSize] = useState({
    width: '100%',
    height: '100%'
  })

  // -------------------------- MOBILE RESIZING FUNCTION -----------------------
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Video List Data Structure
  const projects = [
    {
      id: 1,
      title: 'Black Phone',
      type: 'image',
      src: '/BP.jpg',
    },
    {
      id: 2,
      title: 'Violent Night',
      type: 'image',
      src: '/VN.jpg',
    },
    {
      id: 3,
      title: 'NOPE',
      type: 'image',
      src: '/VN.jpg',
    }
  ]
  // Current Project State Selection
  const [currentProject, setCurrentProject] = useState(projects[1]);
  const [previousProject, setPreviousProject] = useState(currentProject);
  const [sceneLoaded, setSceneLoaded] = useState(false);

  return <>
    <>
        <Canvas
            shadows
            camera={{ position: [0, 7, 13] }}
            gl={{ alpha: false }}
        >
          <Experience
            currentProject={currentProject}
            setCurrentProject={setCurrentProject}
            projects={projects}
            previousProject={previousProject}
            setPreviousProject={setPreviousProject}
            sceneLoaded={sceneLoaded}
            setSceneLoaded={setSceneLoaded}
          />

          {/* <NormImage currentProject={currentProject} setCurrentProject={setCurrentProject} projects={projects} previousProject={previousProject} setPreviousProject={setPreviousProject} sceneLoaded={sceneLoaded} setSceneLoaded={setSceneLoaded} /> */}

          {sceneLoaded &&  <FadingImage
            currentProject={currentProject}
            setCurrentProject={setCurrentProject}
            projects={projects}
            previousProject={previousProject}
            setPreviousProject={setPreviousProject}
            sceneLoaded={sceneLoaded}
          />}

        </Canvas>

        <Overlay />
        {sceneLoaded && <ProjectMenu
          currentProject={currentProject}
          setCurrentProject={setCurrentProject}
          projects={projects}
          setPreviousProject={setPreviousProject}
          isMobile={isMobile}
          setIsMobile={setIsMobile}
         />
        }
    </>
  </>
}

// 2D Project Selection Overlay ------------------------------------------------
function ProjectMenu({ currentProject, setCurrentProject, projects, setPreviousProject, isMobile, setIsMobile }) {

  // Get the center index
  const centerIndex = Math.floor(projects.length / 2);

  // Opening animation for project list entering nicely
  const trailAnims = useTrail(projects.length, {
    from: { transform: 'translateY(-50px) rotate(0deg)' }, // Starting state (items slightly above and invisible)
    to: { transform: 'translateY(0px) rotate(0deg)' }, // Ending state (items in position and visible)
  });

  return (
    <div className="project-menu-container">
      {projects.map((project, index) => {
        // Check if this project is the active one
        const isActive = currentProject.id === project.id;

        let animation = {
          transform: 'translateY(0%)',
          scale: 1,
          opacity: 1,
          config: { mass: 4.5, tension: 350, friction: 40 },
          margin: '0px',
          fontSize: '36px',
        };

        switch(index) {
          case 0: // first index
          if (!isMobile) {
            animation.transform = isActive ? 'translateX(0%)' : 'translateX(0%)';
            animation.transform = isActive ? 'rotateZ(-2deg)' : 'rotateZ(0deg)';
            animation.opacity = isActive ? 1 : 0.3;
            animation.marginRight = isActive ? '0px' : '0px';
            animation.fontSize = isActive ? '86px' : '62px';
          } else {
            animation.opacity = isActive ? 1 : 0.3;
            animation.margin = isActive ? '0px 0px' : '0px 0px';
            animation.fontSize = isActive ? '28px' : '24px';
          }
          break;

          case centerIndex: // center index
          if (!isMobile) {
            animation.transform = isActive ? 'translateY(0%)' : 'translateY(0%)';
            animation.opacity = isActive ? 1 : 0.3;
            animation.margin = isActive ? '0px 0px' : '0px 0px';
            animation.fontSize = isActive ? '86px' : '62px';
          } else {
            animation.fontSize = isActive ? '28px' : '24px';
            animation.opacity = isActive ? 1 : 0.3;
            animation.margin = isActive ? '0px 0px' : '0px 0px';
          }
            break;

          case projects.length - 1: // last index
          if (!isMobile) {
            animation.transform = isActive ? 'rotateZ(2deg)' : 'rotateZ(0deg)';
            animation.opacity = isActive ? 1 : 0.3;
            animation.marginLeft = isActive ? '0px' : '0px';
            animation.fontSize = isActive ? '86px' : '62px';
          } else {
            animation.opacity = isActive ? 1 : 0.3;
            animation.margin = isActive ? '0px 0px' : '0px 0px';
            animation.fontSize = isActive ? '30px' : '24px';
          }
          break;

          default: // all other indexes
            animation.opacity = isActive ? 1 : 0.5;
            animation.fontSize = isActive ? '42px' : '36px';
            break;
        }

        const menuAnimation = useSpring(animation);

        const combinedStyles = {
          ...menuAnimation,
          ...trailAnims[index],
        };

        return (
          <animated.button
            style={combinedStyles}
            key={project.id}
            className={isActive ? 'active project-button' : 'project-button'}
            onClick={() => {
              console.log("Setting project: ", project);
              console.log("Setting previous project: ", currentProject);
              setPreviousProject(currentProject);
              setCurrentProject(project);
            }}
          >
            <p>{project.title}</p>
          </animated.button>
        );
      })}
    </div>
  );
}
