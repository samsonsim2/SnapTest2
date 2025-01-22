import { useCallback, useEffect, useRef } from "react";
import { useCameraKit } from "./hooks/useCameraKit";
// import { createMediaStreamSource, Transform2D } from "@snap/camera-kit";
import { createMediaStreamSource  } from "@snap/camera-kit";
function App() {
  const { session, lenses } = useCameraKit();
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  
 
  const startCameraKit = useCallback(async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {  facingMode:"environment"},
      // video: true,
    

    });

    const source = createMediaStreamSource(mediaStream, {
      // transform: Transform2D.MirrorX,
      cameraType:"environment"
    });

    session.setSource(source);
    session.applyLens(lenses[18]);
    session.play("live");
    
  }, [session, lenses]);

  useEffect(() => {
    startCameraKit();
  }, [startCameraKit]);

  useEffect(() => {
    canvasContainerRef?.current?.replaceWith(session.output.live);
  }, [session]);
  //audio
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const navigateToUrl = () => {
    window.location.href = "https://ar-trail.vercel.app";
  };

  return (
    <>
      <audio ref={audioRef}>
        <source src="sound.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "fit-content",
          height: "fit-content",
          overflow: "hidden",
          position: "relative",

          border: "2px solid red",

          margin: "auto",
          padding: "0px",
          boxSizing: "border-box",
        }}
     id="flip" >
        <button
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            margin: "0px",
            padding: "0px",
            boxSizing: "border-box",
          }}

          onClick={navigateToUrl}
        >
          Go Back
        </button>

        <button
          style={{
            position: "absolute",
            bottom: "10px",
           left: "10px",
            margin: "0px",
            padding: "0px",
            boxSizing: "border-box",
          }}
          onClick={playAudio}
        >
          Play Audio
        </button>
        <div
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          ref={canvasContainerRef}
        ></div>
      </div>
    </>
  );
}

export default App;
