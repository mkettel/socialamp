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

  const [sliderOut, setSliderOut] = useState(false);


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
         canvasSize={canvasSize}
         setCanvasSize={setCanvasSize}
         sliderOut={sliderOut}
          setSliderOut={setSliderOut}
         />

    </>
  </>
}


function Overlay({sliderOut, setSliderOut, canvasSize, setCanvasSize}) {

  const animation = useSpring({
    transform: sliderOut ? 'translateX(0%)' : 'translateX(0%)'
  });

  const onAboutClick = () => {
    setSliderOut(!sliderOut);
  };

  return <>
    <animated.div className="overlay-button-container"
      // style={{ width: canvasSize.width, height: canvasSize.height }}
      style={animation}
    >
      <div className="overlay-button">
        <p onClick={onAboutClick}>about</p>
      </div>
    </animated.div>

  </>
}
