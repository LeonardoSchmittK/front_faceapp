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
  import React, { useState } from 'react';
  import DropzoneUserImage from './DropzoneUserImage';
  import UserNameInput from './UserNameInput';
  import ClassNameInput from './ClassNameInput';
  
  const steps = [
    { title: 'Nome da Turma' },
    { title: 'Adicionar Aluno' },
    { title: 'Confirmar' },
  ];
  
  function CreateClassModal({ isOpen, onClose }) {
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
                
                setStudents([...students, newStudent]);
                setCurrentStudentName('');
                setCurrentClassImage(null);
            }
        }catch{

        }
    };
  
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
                {students.length > 0 && (
                  <VStack spacing={2} align="start" width="full">
                    <Text fontWeight="bold">Alunos Adicionados:</Text>
                    {students.map((student, index) => (
                      <Flex key={index} direction="row" align="center" gap={4}>
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
                      </Flex>
                    ))}
                  </VStack>
                )}
                <Button
                  colorScheme="green"
                  onClick={handleAddStudent}
                  isDisabled={!currentStudentName}
                  width="full"
                >
                  Adicionar Aluno
                </Button>
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
                    onClick={onClose}
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