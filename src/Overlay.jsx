import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import './style.css'

// Modal Overlay ------------------------------------
export default function Overlay() {

  const [activeModal, setActiveModal] = useState(null);

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

  // Button Animation On Load -------------------------------
  const initialButtonAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0.3)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { mass: 1.5, tension: 200, friction: 20 },
    delay: 400 // optional delay to start the animation a little later
  });

  // 2D button interaction on mousemove --------------------
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
      const maxDistance = 1400;
      const minPullDistance = 50;  // Within this distance, the pull effect is minimal

      if (distance < maxDistance) {
        // Quadratic decrease in pullAmount as we get closer to the button
        const pullAmount = 0.15 * Math.pow((distance - minPullDistance) / (maxDistance - minPullDistance), 2);
        const pullX = (deltaX / distance) * (maxDistance - distance) * pullAmount;
        const pullY = (deltaY / distance) * (maxDistance - distance) * pullAmount;

        setSpring({ transform: `translate(${-pullX * 1.5}px, ${-pullY * 1.3}px)` });
        setSpring2({ transform: `translate(${-pullX * 1.2}px, ${-pullY * 1.2}px)` });
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
      <animated.div ref={aboutButtonRef} style={{...initialButtonAnimation, ...springProps}} onMouseMove={handleMouseMove}  className="overlay-button">
        <p onClick={openAboutModal}>about</p>
        <svg onClick={openAboutModal} width="50" height="50" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="25" r="22.5" stroke="white" stroke-width="1" fill="none" />
          <circle cx="25" cy="25" r="2.5" fill="white" />
        </svg>
      </animated.div>
      <animated.div ref={contactButtonRef} style={{...initialButtonAnimation, ...springProps2}} onMouseMove={handleMouseMove} className="overlay-button">
        <p onClick={openContactModal}>contact</p>
        <svg onClick={openContactModal} width="50" height="50" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="25" r="22.5" stroke="white" stroke-width="1" fill="none" />
          <circle cx="25" cy="25" r="2.5" fill="white" />
        </svg>
      </animated.div>
    </animated.div>

    {/* about modal slide out */}
    <animated.div className="about-modal-container" style={animation}>
      <div className="about-modal" style={pointerEvents}>
        <div className="closing-button" onClick={openAboutModal}>
          <p>close</p>
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
        <p>close</p>
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
