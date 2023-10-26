import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas, extend, useThree } from '@react-three/fiber'
import Experience from './Experience.jsx'
import { useState, useEffect, useRef } from 'react'
import { Html, OrbitControls, useTexture } from '@react-three/drei'
// import { useSpring, a, animated } from '@react-spring/three';
import { useSpring, animated, useTrail, useSprings } from '@react-spring/web'
import TransShader from './CustomImage.jsx'
import NormImage from './NormImage'
import FadingImage from './CustomImage.jsx'
import * as THREE from 'three'
import Overlay from './Overlay.jsx'
import cn from "classnames";


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
      src: '/nope.jpg',
    },
    {
      id: 4,
      title: 'Top Gun 2',
      type: 'image',
      src: '/nope.jpg',
    },
    {
      id: 5,
      title: 'Margaret',
      type: 'image',
      src: '/nope.jpg',
    },
  ]
  // Current Project State Selection
  const [currentProject, setCurrentProject] = useState(projects[1]);
  const [previousProject, setPreviousProject] = useState(projects[0]);
  const [nextProject, setNextProject] = useState(projects[2]);
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

        {sceneLoaded && <Overlay /> }

        {sceneLoaded && <ProjectMenu
          currentProject={currentProject}
          setCurrentProject={setCurrentProject}
          projects={projects}
          setPreviousProject={setPreviousProject}
          isMobile={isMobile}
          setIsMobile={setIsMobile}
         />
        }
        {/* <MouseTrail /> */}
    </>
  </>
}

// 2D Project Selection Overlay ------------------------------------------------
function ProjectMenu({ currentProject, setCurrentProject, projects, setPreviousProject, isMobile, setIsMobile }) {

  const [activeIndex, setActiveIndex] = useState(0);

  // Used to determine which items appear above the active item
  const halfwayIndex = Math.ceil(projects.length / 2);

  // Usd to determine the height/spacing of each item
  const itemHeight = isMobile ? 45 : 93;

  // Used to determine at what point an item is moved from the top to the bottom
  const shuffleThreshold = halfwayIndex * itemHeight;

  // Used to determine which items should be visible. this prevents the "ghosting" animation
  const visibleStyleThreshold = shuffleThreshold / 2;

  const determinePlacement = (itemIndex) => {
    // If these match, the item is active
    if (activeIndex === itemIndex) {
      if (isMobile) {
        return -5;
      } else {
        return -itemHeight / 6;
      }
    }

    // if the active item is in the top half of the list
    if (itemIndex >= halfwayIndex) {
      if (activeIndex > itemIndex - halfwayIndex) {
        return (itemIndex - activeIndex) * itemHeight;
      } else {
        return -(projects.length + activeIndex - itemIndex) * itemHeight;
      }
    }

    // if the active item is in the bottom half of the list
    if (itemIndex > activeIndex) {
      return (itemIndex - activeIndex) * itemHeight;
    }

    // if the active item is in the bottom half of the list and the item is in the top half
    if (itemIndex < activeIndex) {
      if ((activeIndex - itemIndex) * itemHeight >= shuffleThreshold) { // if the item is below the shuffle threshold
        return (projects.length - (activeIndex - itemIndex)) * itemHeight; // move it to the bottom
      }
      return -(activeIndex - itemIndex) * itemHeight; // otherwise, move it to the top
    }
  };

  const isActive = (itemIndex) => {
    const placement = determinePlacement(itemIndex);
    return activeIndex === itemIndex && Math.abs(placement + 15) < itemHeight / 2;
  };

  const handleProjectClick = (index) => {
    setActiveIndex(index);
    setCurrentProject(projects[index]); // Set the current project based on the clicked item
  };


    return (
        <div className="outer-container">
          <div className="carousel-wrapper">
              <div className="slides">
                  {projects.map((item, i) => (
                    <button
                      type="button"
                      onClick={() => handleProjectClick(i)}
                      className={cn("carousel-item", {
                        active: isActive(i),
                        visible:
                          Math.abs(determinePlacement(i)) <= visibleStyleThreshold
                      })}
                      key={item.id}
                      style={{
                        transform: `translateY(${determinePlacement(i)}px)`
                      }}
                    >
                      {item.title}
                    </button>
                  ))}
            </div>
          </div>
        </div>
    )
}

function MouseTrail() {

  const mouseRef = useRef();

  window.onmousemove = e => {
    const x = e.clientX - mouseRef.current.clientWidth / 2;
    const y = e.clientY - mouseRef.current.clientWidth / 2;

    const keyframes = {
      transform: `translate3d(${x}px, ${y}px, 0)`
    }

    mouseRef.current.animate(keyframes, {
      duration: 400,
      fill: 'forwards',
    })

    // check for data attributes
    const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
    const trailStyle = elementUnderCursor.getAttribute('data-trail-style');
    console.log(trailStyle);

    if (trailStyle) {
      switch (trailStyle) {
        case 'modal':
          mouseRef.current.style.backgroundColor = 'transparent';
          mouseRef.current.style.border = '1px solid black';
          mouseRef.current.style.width = '100px';
          mouseRef.current.style.height = '100px';
          break;
        case 'blue':
          mouseRef.current.style.backgroundColor = 'blue';
          break;
        // ... add more cases as needed
        default:
          mouseRef.current.style.backgroundColor = ''; // default style
      }
    } else {
      mouseRef.current.style.backgroundColor = ''; // default style
      mouseRef.current.style.border = '';
      mouseRef.current.style.width = '';
      mouseRef.current.style.height = '';
    }
  }
  return <>
    <div id="trailer" ref={mouseRef}>

    </div>
  </>
}
