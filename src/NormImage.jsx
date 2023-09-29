import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { Image } from '@react-three/drei';


/* ORIGINAL IMAGE COMPONENT JUST KEEPING FOR NOW IN CASE I NEED TO REFERENCE IT
*/

export default function NormImage({ currentProject, setCurrentProject, projects, previousProject, setPreviousProject, setSceneLoaded, sceneLoaded={sceneLoaded} }) {


  const [imageScale, setImageScale] = useState([7, 4, 1]);
  const [imagePositon, setImagePosition] = useState([0, 0.6, 0]);
  useEffect(() => {
    function handleResize() {
      const { innerWidth } = window;
      const isMobile = innerWidth <= 768; // Adjust the breakpoint for mobile devices
      const imageScale = isMobile ? [4.5, 2.5, 1] : [7, 4, 1];
      const imagePosition = isMobile ? [0, 0.3, 0] : [0, 0.8, 0];
      setImageScale(imageScale);
      setImagePosition(imagePosition);
    }
    window.addEventListener('resize', handleResize);
  handleResize(); // Call the function initially

  return () => {
    window.removeEventListener('resize', handleResize);
  };
  }, []);

  //----------------------------- IMAGE ----------------------------------------
  const imageV = useRef();
  // console.log(imageV.current);
  const [isMounted, setIsMounted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const currentImagePositions = imageV.current;
    console.log(currentImagePositions);

    setIsMounted(false);
    // Reset the animation state
    const timeout = setTimeout(() => setIsMounted(true), 600); // you can adjust the delay if needed
    return () => clearTimeout(timeout);
  }, [currentProject]);

  // Creating the react animated component--------
  const AnimatedImage = animated(Image);

  // Image Adjustments------
  useFrame(() => {
    if (!imageV.current) {
      return;
    } else {
      imageV.current.material.zoom = 1 // 1 and higher
      imageV.current.material.grayscale = 0 // between 0 and 1
      imageV.current.material.color.set('#C6C8EE') // mix-in color
      imageV.current.className = 'imageV'
    }
  })
  console.log(imageV.current);
  const fade = useSpring({
    position: isMounted  ? imagePositon : [0, -7, 0],
    config: { mass: 1, tension: 500, friction: 300 },
  });

  return <>
    {/* image */}
    {currentProject.type === 'image' && (
      <AnimatedImage
        key={currentProject.id}
        ref={imageV}
        url={isMounted ? currentProject.src : previousProject.src}
        transparent
        opacity={0.9}
        scale={imageScale}
        position={fade.position}
        toneMapped={true}
        visible={true}
      />
      // add Video mesh logic
      )
    }
  </>
}
