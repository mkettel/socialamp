import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas, extend } from '@react-three/fiber'
import Experience from './Experience.jsx'
import { useState, useEffect } from 'react'
import { Html, OrbitControls } from '@react-three/drei'
// import { useSpring, a, animated } from '@react-spring/three';
import { useSpring, animated, useTrail } from '@react-spring/web'



export default function App() {

  // setting the canvas size
  const [canvasSize, setCanvasSize] = useState({
    width: '100%',
    height: '100%'
  })

  // -------------------------- MOBILE RESIZING FUNCTION -----------------------
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
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
            <Experience currentProject={currentProject} setCurrentProject={setCurrentProject} projects={projects} previousProject={previousProject} setPreviousProject={setPreviousProject} sceneLoaded={sceneLoaded} setSceneLoaded={setSceneLoaded} />
        </Canvas>
        <Overlay />
        {sceneLoaded && <ProjectMenu currentProject={currentProject} setCurrentProject={setCurrentProject} projects={projects} setPreviousProject={setPreviousProject} />
        }
    </>
  </>
}

// 2D Project Selection Overlay
function ProjectMenu({ currentProject, setCurrentProject, projects, setPreviousProject, setSelectedIndex, selectedIndex, isMobile, setIsMobile }) {



  // Get the center index
  const centerIndex = Math.floor(projects.length / 2);

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
          config: { mass: 4.5, tension: 350, friction: 40 }
        };

        switch(index) {
          case 0: // first index
          if (!isMobile) {
            animation.transform = isActive ? 'translateX(0%)' : 'translateX(0%)';
            animation.transform = isActive ? 'rotateZ(-2deg)' : 'rotateZ(0deg)';
            animation.scale = isActive ? 1.2 : 0.9;
            animation.opacity = isActive ? 1 : 0.5;
            animation.marginRight = isActive ? '40px' : '0px';
          }
          animation.scale = isActive ? 1.2 : 0.9;
          animation.opacity = isActive ? 1 : 0.5;
          animation.margin = isActive ? '0px 0px' : '0px 0px';
          break;

          case centerIndex: // center index
            animation.transform = isActive ? 'translateY(0%)' : 'translateY(0%)';
            animation.scale = isActive ? 1.2 : 0.9;
            animation.opacity = isActive ? 1 : 0.5;
            animation.margin = isActive ? '0px 40px' : '0px 0px';
            break;

          case projects.length - 1: // last index
          if (!isMobile) {
            animation.transform = isActive ? 'rotateZ(2deg)' : 'rotateZ(0deg)';
            animation.scale = isActive ? 1.2 : 0.9;
            animation.opacity = isActive ? 1 : 0.5;
            animation.marginLeft = isActive ? '30px' : '0px';
          }
          animation.scale = isActive ? 1.2 : 0.9;
          animation.opacity = isActive ? 1 : 0.5;
          animation.margin = isActive ? '0px 0px' : '0px 0px';
          break;

          default: // all other indexes
            animation.scale = isActive ? 1.2 : 0.9;
            animation.opacity = isActive ? 1 : 0.5;
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
              setSelectedIndex(index);
            }}
          >
            <p>{project.title}</p>
          </animated.button>
        );
      })}
    </div>
  );
}


function Overlay() {

  // About animation -----------------------------------------------------
  const [sliderOut, setSliderOut] = useState(false);
  const animation = useSpring({
    transform: sliderOut ? 'translateX(0%)' : 'translateX(100%)',
    config: { mass: 1.2, tension: 50, friction: 15 },
  });

  const onAboutClick = () => {
    setSliderOut(!sliderOut);
    console.log(sliderOut);
    setCaseSliderOut(false);
    setContactSliderOut(false);
  };
  // ---------------------------------------------------------------------

  // Case Study animation ------------------------------------------------
  const [caseSliderOut, setCaseSliderOut] = useState(false);
  const caseAnimation = useSpring({
    transform: caseSliderOut ? 'translateY(-60%)' : 'translateY(100%)',
    config: { mass: 2, tension: 80, friction: 15 },
  });

  const onCaseClick = () => {
    setCaseSliderOut(!caseSliderOut);
    console.log(caseSliderOut);
    setSliderOut(false);
    setContactSliderOut(false);
  };

  // ---------------------------------------------------------------------

  // Contact animation ------------------------------------------------
  const [contactSliderOut, setContactSliderOut] = useState(false);
  const contactAnimation = useSpring({
    transform: contactSliderOut ? 'translateY(0%)' : 'translateY(-100%)',
    // rotateZ: contactSliderOut ? '-180deg' : '0deg',
    config: { mass: 1.2, tension: 50, friction: 15 },
  });

  const onContactClick = () => {
    setContactSliderOut(!contactSliderOut);
    console.log(contactSliderOut);
    setSliderOut(false);
    setCaseSliderOut(false);
  };




  return <>
    <animated.div className="overlay-button-container">
      <div className="overlay-button">
        <p onClick={onAboutClick}>about</p>
      </div>
      {/* <div className="overlay-button">
        <p onClick={onCaseClick}>case studies</p>
      </div> */}
      <div className="overlay-button">
        <p onClick={onContactClick}>contact</p>
      </div>
    </animated.div>

    {/* about modal slide out */}
    <animated.div className="about-modal-container" style={animation}>
      <div className="about-modal">
      <div className="closing-button" onClick={onAboutClick} >
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

    {/* Case Study Modal with IFrames? */}
    <animated.div className="case-study-modal-container" style={caseAnimation}>
      <div className="modal-blur-filter"></div>
      <div className="case-study-modal">
      <div className="closing-button" onClick={onCaseClick} >
        <p>+</p>
      </div>
        <div className="case-study-modal-header">
          <h2>Case Studies</h2>
        </div>
        <div className="case-study-grid">
          <div className="case-study-card">
            <div className="case-study-title">
              <h3>Movie Title</h3>
            </div>
            <div className="case-study-iframe">
              <Canvas className="case-study-canvas" camera={{ position: [0, 0, 1] }}>
                <ambientLight intensity={0.5} />
                  <OrbitControls />
                  <Html position={[-1.5, .8, 0]}>
                    <iframe src="" width="300px" height="150px" />
                  </Html>
              </Canvas>
            </div>
          </div>
        </div>
      </div>
    </animated.div>

    {/* Contact Us Modal */}
    <animated.div className="contact-modal-container" style={contactAnimation} >
      <div className="contact-modal">
      <div className="closing-button" onClick={onContactClick} >
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
