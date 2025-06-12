import {
  Button,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepTitle,
  Box,
  StepIcon,
  StepNumber,
  StepSeparator,
  useSteps,
  Text,
  Avatar,
  Heading,
  Flex,
  Image,
  Tooltip,
  IconButton
} from '@chakra-ui/react';

import React, { useState, useEffect } from 'react';
import { X as RemoveIcon } from 'lucide-react';
import DropzoneUserImage from './DropzoneUserImage';
import UserNameInput from './UserNameInput';
import ClassNameInput from './ClassNameInput';
import useStore from '../store/store.js';
import useClassroomStore from '../store/classStore.js';
import useCustomToast from '../hooks/useCustomToast';
import axios from 'axios';

const steps = [
  { title: 'Nome da Turma' },
  { title: 'Adicionar Aluno' },
  { title: 'Confirmar' },
];

function CreateClassModal({ isOpen, onClose }) {
  const setPreviewImage = useStore((state) => state.setPreviewUserImage);
  const previewImage = useStore((state) => state.previewUserImage);
  const teacherLoggedIn = useStore((state) => state.teacherLoggedIn);
  const fetchClasses = useClassroomStore((state) => state.fetchClasses);
  const showToast = useCustomToast();

  const [students, setStudents] = useState([]);
  const [currentStudentName, setCurrentStudentName] = useState('');
  const [currentClassImage, setCurrentClassImage] = useState(null);
  const [className, setClassName] = useState('');
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  useEffect(() => {
    return () => {
      if (currentClassImage?.previewUrl) {
        URL.revokeObjectURL(currentClassImage.previewUrl);
      }
      students.forEach(student => {
        if (student.previewUrl) {
          URL.revokeObjectURL(student.previewUrl);
        }
      });
    };
  }, [currentClassImage, students]);

  const handleNext = () => {
    setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setActiveStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleStudentNameChange = (name) => {
    setCurrentStudentName(name);
  };

  const handleImageUpload = (file) => {
    // Clean up previous image URL if exists
    if (currentClassImage?.previewUrl) {
      URL.revokeObjectURL(currentClassImage.previewUrl);
    }

    setCurrentClassImage({
      file,
      previewUrl: file ? URL.createObjectURL(file) : null
    });
  };

  const handleClassNameChange = (name) => {
    setClassName(name);
  };

  const handleAddStudent = () => {
    if (currentStudentName && currentClassImage?.file) {
      const newStudent = {
        name: currentStudentName,
        file: currentClassImage.file,
        previewUrl: currentClassImage.previewUrl,
      };
      setStudents([newStudent, ...students]);
      setCurrentStudentName('');
      setCurrentClassImage(null);
      setPreviewImage(null);
    } else {
      showToast({
        title: 'Erro',
        description: 'Por favor, forneça um nome e uma imagem para o aluno.',
        status: 'warning',
      });
    }
  };

  const handleRemoveStudent = (indexToRemove) => {
    const studentToRemove = students[indexToRemove];
    if (studentToRemove.previewUrl) {
      URL.revokeObjectURL(studentToRemove.previewUrl);
    }
    setStudents(students.filter((_, index) => index !== indexToRemove));
  };

  const handleCreateClass = async () => {
    if (!className || students.length === 0) {
      showToast({
        title: 'Erro',
        description: 'Por favor, forneça um nome para a turma e adicione pelo menos um aluno.',
        status: 'warning',
      });
      return;
    }

    const formData = new FormData();
    formData.append('teacherId', teacherLoggedIn.id);
    formData.append('className', className);
    
    students.forEach((student, index) => {
      formData.append(`students[${index}][name]`, student.name);
      formData.append(`students[${index}][image]`, student.file);
    });


    console.log("formdata")
    console.log(formData)

    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
      if (pair[1] instanceof File) {
        console.log('File:', pair[1].name, pair[1].size, pair[1].type);
      }
    }
    try {
      const response = await axios.post(process.env.REACT_APP_PROD_URL_API_BASE + '/api/v1/Classrooms/createWithImages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await fetchClasses(teacherLoggedIn.id);
      showToast({
        title: 'Turma criada com sucesso!',
        status: 'success',
      });

      // Reset form
      setClassName('');
      setStudents([]);
      setCurrentStudentName('');
      setCurrentClassImage(null);
      setPreviewImage(null);
      setActiveStep(0);
      onClose();
    } catch (error) {
      console.error('Erro ao criar turma:', error.response?.data || error.message);
      showToast({
        title: 'Erro ao criar turma',
        description: error.response?.data?.message || 'Por favor, tente novamente mais tarde.',
        status: 'error',
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <VStack align="stretch" spacing={4}>
            <Heading size="md">Criar turma</Heading>
            <Stepper index={activeStep} size="sm">
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>
                  <Box flexShrink="0">
                    <StepTitle>{step.title}</StepTitle>
                  </Box>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {activeStep === 0 && (
            <VStack spacing={4}>
              <ClassNameInput value={className} onClassNameChange={handleClassNameChange} />
              <Button 
                colorScheme="blue" 
                onClick={handleNext} 
                width="full" 
                isDisabled={!className.trim()}
              >
                Próximo
              </Button>
            </VStack>
          )}

          {activeStep === 1 && (
            <VStack spacing={4}>
              <UserNameInput 
                onNameChange={handleStudentNameChange} 
                currentStudentName={currentStudentName} 
              />
              <DropzoneUserImage onImageUpload={handleImageUpload} />
              
              <Button
                colorScheme="green"
                onClick={handleAddStudent}
                isDisabled={!currentStudentName.trim() || !currentClassImage?.file}
                width="full"
              >
                Adicionar Aluno
              </Button>

              {students.length > 0 && (
                <Box width="full" mt={4}>
                  <Text fontWeight="bold" mb={2}>Alunos Adicionados ({students.length}):</Text>
                  <Box maxH="150px" overflowY="scroll" width={"100%"}>
                    {students.map((student, index) => (
                      <Flex 
                        key={index} 
                        align="center" 
                        justify="space-between" 
                        p={2}
                      >
                        <Flex align="center" gap={3} border="1px solid" borderColor={"gray.600"} padding={2}  borderRadius={4} width={"100%"}>
                          {student.previewUrl ? (
                            <Image
                              src={student.previewUrl}
                              alt={student.name}
                              boxSize="40px"
                              objectFit="cover"
                              borderRadius="full"
                            />
                          ) : (
                            <Avatar name={student.name} size="sm" />
                          )}
                          <Text flex={1}>{student.name}</Text>
                          <IconButton
                            aria-label="Remover aluno da lista"
                            icon={
                              <Tooltip label="Remover aluno da lista" hasArrow>
                                <span>
                                  <RemoveIcon size={16} color="#ff5252" />
                                </span>
                              </Tooltip>
                            }
                            variant="ghost"
                            colorScheme="gray"
                            isRound
                            size="sm"
                            onClick={() => handleRemoveStudent(index)}
                          />
                          
                        </Flex>
                       
                      </Flex>
                    ))}
                  </Box>
                </Box>
              )}

              <Flex width="full" justify="space-between" mt={4}>
                <Button onClick={handlePrev}>Voltar</Button>
                <Button 
                  colorScheme="blue" 
                  onClick={handleNext} 
                  isDisabled={students.length === 0}
                >
                  Próximo
                </Button>
              </Flex>
            </VStack>
          )}

          {activeStep === 2 && (
            <VStack spacing={4} align="stretch">
              <Text fontSize="lg" fontWeight="bold">Confirme os dados da turma:</Text>
              
              <Box>
                <Text fontWeight="bold">Nome da Turma:</Text>
                <Text>{className}</Text>
              </Box>

              <Box>
                <Text fontWeight="bold">Alunos ({students.length}):</Text>
                <Box maxH="300px" overflowY="auto" mt={2}>
                  {students.map((student, index) => (
                    <Flex key={index} align="center" gap={3} p={2}>
                      {student.previewUrl ? (
                        <Image
                          src={student.previewUrl}
                          alt={student.name}
                          boxSize="50px"
                          objectFit="cover"
                          borderRadius="full"
                        />
                      ) : (
                        <Avatar name={student.name} size="md" />
                      )}
                      <Text>{student.name}</Text>
                    </Flex>
                  ))}
                </Box>
              </Box>

              <Flex width="full" justify="space-between" mt={4}>
                <Button onClick={handlePrev}>Voltar</Button>
                <Button
                  colorScheme="green"
                  onClick={handleCreateClass}
                >
                  Confirmar e Criar Turma
                </Button>
              </Flex>
            </VStack>
          )}
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}

export default CreateClassModal;