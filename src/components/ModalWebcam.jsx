import { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Spinner,
  Box,
  Flex
} from '@chakra-ui/react';
import useCustomToast from '../hooks/useCustomToast';
import useClassRollstore from '../store/rollStore.js';
import useStore from '../store/store.js';
import { useFaceModels } from '../hooks/useFaceModels.js';
import useClassroomStore from '../store/classStore.js';
import LoadingMessage from "../components/LoadingMessage.jsx";
import axios from "axios"

function ModalWebcam({ isOpen, onClose }) {
  const videoRef = useRef();
  const canvasRef = useRef();

  const [matchedStudent, setMatchedStudent] = useState(null);
  const [isCompleted, setCompleted] = useState(false);
  const [prevMatchedStudent, setPrevMatchedStudent] = useState(null);
  const [recognizedStudents, setRecognizedStudents] = useState(new Set());
  const [stream, setStream] = useState(null);
  const [detectionInterval, setDetectionInterval] = useState(null);
  const [triggerLoad, setTriggerLoad] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const deadline = useStore((state) => state.deadline)
  const teacherLoggedIn = useStore((state) => state.teacherLoggedIn)
  const setRoll = useClassroomStore((state) => state.setRoll)
  const setActiveClass = useClassRollstore((state) => state.setActiveClass)
  const setActiveId = useStore((state) => state.setActiveId)
  const setDeadline = useStore((state) => state.setDeadline)
  
  const activeClass = useClassRollstore((state) => state.activeClass?.students);
  const activeClassAllObj = useClassRollstore((state) => state.activeClass);
  const roll = useClassroomStore((state) => state.initRoll);
  const showToast = useCustomToast();

  const { modelsLoaded, labeledDescriptors, loadingError } = useFaceModels(activeClass, roll, triggerLoad);

  useEffect(() => {
    document.activeElement?.blur();

    if (isOpen && !triggerLoad) setTriggerLoad(true);
  }, [isOpen, triggerLoad]);

  useEffect(() => {
    if (!deadline) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = deadline - now;
      if (diff <= 0) {
        setTimeLeft('Tempo esgotado');
        clearInterval(interval);
        setDeadline(null)

        onClose();
        return;
      }

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline, onClose]);

  useEffect(() => {
    if (isOpen && modelsLoaded && !loadingError) {
      startVideo();
      const interval = faceMyDetect();
      setDetectionInterval(interval);
  
      return () => {
        if (interval) clearInterval(interval);
        if (stream) {
          stream.getTracks().forEach((track) => {
            track.stop(); 
          });
        }
        setStream(null); 
        setDetectionInterval(null); 
        setMatchedStudent(null); 
        setCompleted(false);
        setPrevMatchedStudent(null); 
        setRecognizedStudents(new Set());
      };
    }
  }, [isOpen, modelsLoaded, loadingError, labeledDescriptors]);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (videoRef.current) videoRef.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.error('Webcam error:', err);
        showToast({
          title: 'Erro na Webcam',
          description: 'Não foi possível acessar a webcam.',
          status: 'error',
        });
      });
  };

  const faceMyDetect = () => {
    if (!labeledDescriptors || labeledDescriptors.length === 0) {
      showToast({
        title: 'Sem Descritores Faciais',
        description: 'Nenhum descritor facial válido encontrado.',
        status: 'error',
      });
      return null;
    }

    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);

    return setInterval(async () => {
      try {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas?.getContext || !video?.videoWidth) return;

        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        faceapi.matchDimensions(canvas, {
          width: video.videoWidth,
          height: video.videoHeight,
        });

        const resizedDetections = faceapi.resizeResults(detections, {
          width: video.videoWidth,
          height: video.videoHeight,
        });

        resizedDetections.forEach((detection) => {
          const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
          const box = detection.detection.box;

          if (bestMatch.distance < 0.5) {
            setMatchedStudent({ name: bestMatch.label, distance: bestMatch.distance });
            setRecognizedStudents((prev) => new Set([...prev, bestMatch.label]));
          }

          const drawBox = new faceapi.draw.DrawBox(box, {
            label: bestMatch.toString(),
            boxColor: bestMatch.distance < 0.5 ? 'green' : 'red',
          });
          drawBox.draw(canvas);
        });
      } catch (error) {
        console.error('Detection error:', error);
        showToast({
          title: 'Erro na Detecção',
          description: 'Erro durante a detecção facial.',
          status: 'error',
        });
      }
    }, 1000);
  };

  const createRoll = async (rollData) => {
   
    try {
      const response = await axios.post( process.env.REACT_APP_PROD_URL_API_BASE + "/api/v1/Rolls", rollData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      console.log("Roll created successfully:", response.data.data.roll);
      return response.data.data.roll;
    } catch (error) {
      console.error("Error creating roll:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  useEffect(() => {
    if (matchedStudent && matchedStudent.name !== prevMatchedStudent?.name) {
      showToast({
        title: matchedStudent.name,
        description: 'Presença contabilizada',
        status: 'success',
      });
      setPrevMatchedStudent(matchedStudent);
    }

    if (recognizedStudents.size > 0 && recognizedStudents.size === activeClass.length) {
      if (!isCompleted) {
        
        
        showToast({
          title: 'Chamada finalizada',
          description: 'Todos os alunos estão presentes',
          status: 'success',
          duration: null,
        });
        setCompleted(true);
        setRoll(false); 
        const allStudentsPresence = activeClass.map((student) => ({
          student: student._id,
          status: recognizedStudents.has(student.name) ? 'present' : 'absent',
        }));
        createRoll({
          classroom: activeClassAllObj._id,
          teacher: teacherLoggedIn.id,
          date: new Date().toISOString(),
          students: allStudentsPresence,
        });
        // Don't reset these if you want to be able to restart
        // setActiveClass(null);
        // setActiveId(false);
      }
      onClose();
    }
  }, [matchedStudent, prevMatchedStudent, recognizedStudents, activeClass, showToast, isCompleted, onClose]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="full" 
      returnFocusOnClose={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent 
        bg="transparent"
        boxShadow="none"
        maxW="100vw"
        maxH="100vh"
      >
        {/* Video background - takes full screen */}
        <Box 
          position="fixed"
          top={0}
          left={0}
          w="100vw"
          h="100vh"
          zIndex={-1}
        >
          {loadingError ? (
            <Box bg="black" w="100%" h="100%" display="flex" alignItems="center" justifyContent="center">
              <Text color="white">Erro ao carregar modelos: {loadingError.message}</Text>
            </Box>
          ) : !modelsLoaded ? (
            <Box bg="black" w="100%" h="100%" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
              <LoadingMessage />
              <Spinner color="cyan" mt={4} />
            </Box>
          ) : (
            <Box position="relative" w="100%" h="100%">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }}
              />
              <canvas
                ref={canvasRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              />
            </Box>
          )}
        </Box>

        {/* Controls overlay - positioned absolutely over the video */}
        <Box position="absolute" top={0} left={0} w="100%" h="100%">
          <ModalHeader 
            bg="rgba(0, 0, 0, 0.5)" 
            color="white"
            borderRadius="md"
            m={4}
            width="auto"
            display="inline-block"
          >
            <Flex align="center">
              <Text>Reconhecimento Facial de Alunos</Text>
              <ModalCloseButton 
                position="relative"
                top={0}
                right={0}
                ml={2}
                color="white"
                isDisabled={!modelsLoaded}
              />
            </Flex>
          </ModalHeader>

          <Box position="absolute" top={4} right={4}>
            <Text 
              bg="rgba(0, 0, 0, 0.5)"
              color="white"
              px={3}
              py={1}
              borderRadius="md"
              fontSize="sm"
            >
              Tempo restante: <strong>{timeLeft}</strong>
            </Text>
          </Box>

          <ModalFooter 
            position="absolute"
            bottom={4}
            right={4}
            bg="rgba(0, 0, 0, 0.5)"
            borderRadius="md"
            p={2}
          >
            <Button 
              colorScheme="blue" 
              onClick={onClose} 
              isDisabled={!modelsLoaded}
            >
              Fechar
            </Button>
          </ModalFooter>
        </Box>
      </ModalContent>
    </Modal>
  );
}

export default ModalWebcam;