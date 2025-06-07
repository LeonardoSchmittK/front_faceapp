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
  } from '@chakra-ui/react';
  import React, { useEffect, useState } from 'react';
  import DropzoneUserImage from './DropzoneUserImage';
  import UserNameInput from './UserNameInput';
  import ClassNameInput from './ClassNameInput';
  import { X as RemoveIcon } from 'lucide-react';
  import useStore from "../store/store.js"
  import axios from "axios";
  import useClassroomStore from "../store/classStore.js"
  import useCustomToast from '../hooks/useCustomToast'; 

  const steps = [
    { title: 'Nome da Turma' },
    { title: 'Adicionar Aluno' },
    { title: 'Confirmar' },
  ];
  
  function CreateClassModal({ isOpen, onClose }) {
    const setPreviewImage = useStore((state) => state.setPreviewUserImage);
    const teacherLoggedIn = useStore((state) => state.teacherLoggedIn);
    const fetchClasses = useClassroomStore((state) => state.fetchClasses)

    const showToast = useCustomToast();
    
    const [students, setStudents] = useState([]);
    const [currentStudentName, setCurrentStudentName] = useState('');
    const [currentClassImage, setCurrentClassImage] = useState(null);
    const [className, setClassName] = useState('');
    const { activeStep, setActiveStep } = useSteps({
      index: 0,
      count: steps.length,
    });

  
    const handleNext = () => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    };
  
    const handlePrev = () => {
      setActiveStep((prev) => (prev > 0 ? prev - 1 : prev));
    };
  
    const handleStudentNameChange = (name) => {
      setCurrentStudentName(name);
    };
  
    const handleImageUpload = (image) => {
      setCurrentClassImage(image);
    };
  
    const handleClassNameChange = (name) => {
      setClassName(name);
    };
  
    const handleAddStudent = () => {
        try{

            if (currentStudentName && URL.createObjectURL(currentClassImage) ) {
                const newStudent = {
                    name: currentStudentName,
                    image: URL.createObjectURL(currentClassImage) ,
                };
                
                setStudents([newStudent,...students]);
                setCurrentStudentName('');
                setCurrentClassImage(null);
                setPreviewImage(false)
            }
        }catch{

        }
    };


    function handleRemoveStudent(indexToRemove) {
      const newStudents = students.filter((_, index) => index !== indexToRemove);
      setStudents(newStudents);
    }

    async function handleCreateClass() {
     
      const classJson = {
        teacher: teacherLoggedIn.id, 
        name: className,
        students: students, 
      };

      try {
        const response = await axios.post("http://localhost:3001/api/v1/Classrooms", classJson);

        fetchClasses(teacherLoggedIn.id)

        showToast({
          title: 'Turma criada com sucesso!',
          description: '',
          status: 'success',
        });
        console.log("Classroom created:", response.data);
        onClose()
        
      } catch (error) {
        console.error("Erro ao criar turma:", error.response?.data || error.message);
        showToast({
          title: 'Erro ao criar turma',
          description: 'Por favor tente mais tarde',
          status: 'error',
        });
      }
    }

    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
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
                <ClassNameInput
                  value={className}
                  onClassNameChange={handleClassNameChange}
                />
                <Button
                  colorScheme="blue"
                  onClick={handleNext}
                  width="full"
                  isDisabled={!className}
                >
                  Próximo
                </Button>
              </VStack>
            )}
  
            {activeStep === 1 && (
              <VStack spacing={4}>
                <UserNameInput onNameChange={handleStudentNameChange} currentStudentName={currentStudentName}/>
             
                <DropzoneUserImage onImageUpload={handleImageUpload}/>
                <Button
                  colorScheme="green"
                  onClick={handleAddStudent}
                  isDisabled={!currentStudentName}
                  width="full"
                >
                  Adicionar Aluno
                </Button>
                {students.length > 0 && (
                  <VStack spacing={2} overflow={"scroll"}  colorScheme={"cyan"} height={100} align="start" width="full" >
                    <Text mb={4}>Alunos Adicionados:</Text>
                    {students.map((student, index) => (
                      <Flex key={index} direction="row" align="center" gap={4} >
                        {student.image ? (
                          <Image
                            src={student.image}
                            alt={student.name}
                            boxSize="40px"
                            objectFit="cover"
                            borderRadius="full"
                          />
                        ) : (
                          <Avatar name={student.name} size="sm" />
                        )}
                        <Text>{student.name}</Text>
                        <RemoveIcon size={16} cursor={"pointer"} onClick={()=>handleRemoveStudent(index)}/>
                        
                      </Flex>
                    ))}
                  </VStack>
                )}
               
                <Flex width="full" justify="space-between">
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
              <VStack spacing={4}>
                <Text fontSize="lg" fontWeight="bold">Confirme os dados da turma:</Text>
                <VStack spacing={2} align="start" width="full">
                  <Text fontWeight="bold">Nome da Turma:</Text>
                  <Text>{className || 'Não especificado'}</Text>
                </VStack>
                {students.length > 0 && (
                  <VStack spacing={2} align="start" width="full">
                    <Text fontWeight="bold">Alunos ({students.length}):</Text>
                    {students.map((student, index) => (
                      <Flex key={index} direction="row" align="center" gap={4}>
                        {student.image ? (
                          <Image
                            src={student.image}
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
                  </VStack>
                )}
                <Flex width="full" justify="space-between" mt={4}>
                  <Button onClick={handlePrev}>Voltar</Button>
                  <Button
                    colorScheme="green"
                    onClick={()=>handleCreateClass()}
                    isDisabled={!className || students.length === 0}
                  >
                    Confirmar e Criar Turma
                  </Button>
                </Flex>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            {/* Additional footer content if needed */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  
  export default CreateClassModal;