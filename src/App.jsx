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

// MODAL BUTTONS ---------------------------------------------------------------
function Overlay() {

  const [activeModal, setActiveModal] = useState(null);
  console.log(activeModal);

  const openAboutModal = () => {
    setActiveModal(activeModal === 'about' ? null : 'about');
  };

  const openContactModal = () => {
    setActiveModal(activeModal === 'contact' ? null : 'contact');
  };

  const animation = useSpring({
    transform: activeModal === 'about' ? 'translateX(0%)' : 'translateX(0%)',
    opacity: activeModal === 'about' ? 1 : 0,
    config: { mass: 2.8, tension: 50, friction: 15 },
  });

  const contactAnimation = useSpring({
    transform: activeModal === 'about' ? 'translateY(-100%)' : 'translateY(0%)',
    opacity: activeModal === 'contact' ? 1 : 0,
    config: { mass: 2.8, tension: 50, friction: 15 },
  });

  const pointerEvents = useSpring({
    pointerEvents: activeModal === 'about' ? 'auto' : 'none',
  })
  const contactPointerEvents = useSpring({
    pointerEvents: activeModal === 'contact' ? 'auto' : 'none',
  })

  // 2D button interaction on mousemove -------
  const [springProps, setSpring] = useSpring(() => ({
    transform: 'translate(0px, 0px)'
  }));
  const [springProps2, setSpring2] = useSpring(() => ({
    transform: 'translate(0px, 0px)'
  }));

  const aboutButtonRef = useRef(null);
  const contactButtonRef = useRef(null);

  // Refactored the mouse move handler to handle both buttons
  const handleMouseMove = (e) => {
    [aboutButtonRef, contactButtonRef].forEach(buttonRef => {
      const button = buttonRef.current;
      const bounds = button.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;

      const deltaX = mouseX - centerX;
      const deltaY = mouseY - centerY;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 1300;
      const minPullDistance = 50;  // Within this distance, the pull effect is minimal

      if (distance < maxDistance) {
        // Quadratic decrease in pullAmount as we get closer to the button
        const pullAmount = 0.2 * Math.pow((distance - minPullDistance) / (maxDistance - minPullDistance), 2);
        const pullX = (deltaX / distance) * (maxDistance - distance) * pullAmount;
        const pullY = (deltaY / distance) * (maxDistance - distance) * pullAmount;

        setSpring({ transform: `translate(${pullX}px, ${pullY}px)` });
        setSpring2({ transform: `translate(${-pullX}px, ${-pullY}px)` });
      } else {
        setSpring({ transform: 'translate(0px, 0px)' });
        setSpring2({ transform: 'translate(0px, 0px)' });
      }
    });
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);


  return <>
    <animated.div className="overlay-button-container">
      <animated.div ref={aboutButtonRef} style={springProps} onMouseMove={handleMouseMove}  className="overlay-button">
        <p onClick={openAboutModal}>about</p>
      </animated.div>
      <animated.div ref={contactButtonRef} style={springProps2} onMouseMove={handleMouseMove} className="overlay-button">
        <p onClick={openContactModal}>contact</p>
      </animated.div>
    </animated.div>

    {/* about modal slide out */}
    <animated.div className="about-modal-container" style={animation}>
      <div className="about-modal" style={pointerEvents}>
        <div className="closing-button" onClick={openAboutModal} >
          <p>+</p>
        </div>
        <div className="about-modal-header">
          <h2>About SocialAmp</h2>
        </div>
        <div className="about-text">
          <p>SocialAmp can be used to amplify your movie's social media engagement. We use Twitter and other social media outlets to curate short video clips in response to user comments. Giving fans a deep sense of engagement to the movie they love.</p>
        </div>
      </div>
    </animated.div>


    {/* Contact Us Modal */}
    <animated.div className="contact-modal-container" style={contactAnimation} >
      <div className="contact-modal" style={contactPointerEvents}>
      <div className="closing-button" onClick={openContactModal} >
        <p>+</p>
      </div>
        <div className="contact-modal-header">
          <h2>Contact Us</h2>
        </div>
        <div className="contact-entity">
          <div className="contact-entity-title">
            <h3>Phone</h3>
          </div>
        </div>
      </div>
    </animated.div>

  </>
}
