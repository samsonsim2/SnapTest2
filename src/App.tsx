import { useCallback, useEffect, useRef, useState } from 'react';
import { useCameraKit } from './hooks/useCameraKit';
import { createMediaStreamSource, Transform2D } from '@snap/camera-kit';
import Webcam from "react-webcam";
function App() {
  const { session, lenses } = useCameraKit();
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startCameraKit = useCallback(async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    const source = createMediaStreamSource(mediaStream, {
      transform: Transform2D.MirrorX,
    });

    session.setSource(source);
    session.applyLens(lenses[0]);
    session.play('live');
  }, [session, lenses]);

  useEffect(() => {
    startCameraKit();
  }, [startCameraKit]);

  useEffect(() => {
    canvasContainerRef?.current?.replaceWith(session.output.live);
  }, [session]);
  const handleClick = () => {
    window.location.href = 'https://ar-trail.vercel.app/'; 
  };
  return <>
  <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: windowSize.width,
        height: windowSize.height,
        overflow: "hidden",
      
          border: "2px solid red",
 
        margin:'0px',
        padding:'0px',
        boxSizing:'border-box'
       
      }}>

<div style={{ 
       width: "100%",
       height: "100%",
       objectFit: "cover",
      }}ref={canvasContainerRef}></div>
 </div> 

  
  </>
}

export default App;
