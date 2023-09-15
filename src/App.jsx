import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas, extend } from '@react-three/fiber'
import Experience from './Experience.jsx'
import { useState } from 'react'
// import Overlay from './Overlay'
// import { useSpring, a, animated } from '@react-spring/three';
import { useSpring, animated } from '@react-spring/web'



export default function App() {

  // setting the canvas size
  const [canvasSize, setCanvasSize] = useState({
    width: '100%',
    height: '100%'
  })



  return <>
    <>
        <Canvas
            shadows
            camera={{ position: [0, 7, 13] }}
            gl={{ alpha: false }}
        >
            <Experience />
        </Canvas>
        <Overlay
         />

    </>
  </>
}


function Overlay() {

  const [sliderOut, setSliderOut] = useState(false);


  const animation = useSpring({
    transform: sliderOut ? 'translateX(-20%)' : 'translateX(100%)'
  });

  const onAboutClick = () => {
    setSliderOut(!sliderOut);
    console.log(sliderOut);
  };

  return <>
    <animated.div className="overlay-button-container"
    >
      <div className="overlay-button">
        <p onClick={onAboutClick}>about</p>
      </div>
    </animated.div>

    {/* about modal slide out */}
    <animated.div className="about-modal-container" style={animation}>
      <div className="about-modal">
        <div className="about-modal-header">
          <h2>About socialamp</h2>
        </div>
        <div className="about-text">
          <p>SocialAmp can be used to amplify your movies' social media engagement. Using stats from various social media outlets, we give you what you are looking for to analyze your latest media. </p>
        </div>
      </div>
    </animated.div>

  </>
}
