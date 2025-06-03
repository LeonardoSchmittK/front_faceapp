// ModalWebcam.jsx
import { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import {
    Button,
    Flex,
    useColorMode,
    Center,
    Tooltip,
    VStack,
    IconButton,
    HStack,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter
  } from '@chakra-ui/react';
function ModalWebcam({ isOpen, onClose, modelsLoaded, labeledDescriptors }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [isMatched, setIsMatched] = useState(false);
  const [nameMatched, setNameMatched] = useState("false");
  const [stream, setStream] = useState(null);

  // Start video when models are loaded and modal opens
  useEffect(() => {
    if (isOpen && modelsLoaded) {
      startVideo();
      const intervalId = faceMyDetect();
      
      return () => {
        // Cleanup on unmount
        if (intervalId) clearInterval(intervalId);
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [isOpen, modelsLoaded]);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
        }
      })
      .catch((err) => {
        console.error('Error accessing webcam:', err);
      });
  };

  const faceMyDetect = () => {
    if (!labeledDescriptors) return null;
    
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
    
    return setInterval(async () => {
      try {
        // Using optional chaining to safely access properties
        const canvas = canvasRef.current;
        const video = videoRef.current;
        
        if (!canvas?.getContext || !video?.videoWidth) return;
  
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
          .withFaceDescriptors();
  
        canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
        const context = canvas?.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        faceapi.matchDimensions(canvas, {
          width: 940,
          height: 650,
        });

        const resizedDetections = faceapi.resizeResults(detections, {
          width: 940,
          height: 650,
        });

        resizedDetections.forEach((detection) => {
          const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
          const box = detection.detection.box;
          const text = bestMatch.toString();
          
          if (!text.startsWith("unknown")) {
            setIsMatched(true);
            setNameMatched(text);
          }

          const drawBox = new faceapi.draw.DrawBox(box, {
            label: text,
            boxColor: 'blue',
          });
          drawBox.draw(canvas);
        });
    } catch (error) {
        // Ignore canvas-related errors
        if (!error.message.includes('canvas')) {
          console.error('Non-canvas error:', error);
        }
      }
    }, 1000);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Face Recognition</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {modelsLoaded ? (
            <div className="appvideo">
              <video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
              
              {isOpen && (  // Only render canvas when modal is open
            <canvas
              ref={canvasRef}
              width="940"
              height="650"
              style={{ display: 'none' }}
            />
          )}
            </div>
          ) : (
            <div>Loading models...</div>
          )}
          {isMatched && <h1>Olá, {nameMatched}!</h1>}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ModalWebcam;