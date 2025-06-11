import {
    Button, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    VStack, Text, useToast, Spinner, Accordion, AccordionItem, AccordionButton,
    AccordionPanel, AccordionIcon, Box, Avatar, HStack
  } from '@chakra-ui/react';
  import useClassRollstore from '../store/rollStore.js';
  import useStore from '../store/store.js';
  import useClassroomStore from '../store/classStore.js';
  import { useEffect, useState } from 'react';
  import axios from 'axios';
  import { CircleCheckBig  } from 'lucide-react';
  
  function RollsHistory({ isOpen, onClose, onNext }) {
    const [rollsHistory, setRollsHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
  
    const activeClass = useClassRollstore((state) => state.activeClass);
    const teacherLoggedIn = useStore((state) => state.teacherLoggedIn);
  
    useEffect(() => {
      if (isOpen && activeClass && teacherLoggedIn) {
        fetchRollsHistory();
      }
    }, [isOpen, activeClass, teacherLoggedIn]);
  
    const fetchRollsHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://ec2-18-231-123-33.sa-east-1.compute.amazonaws.com:3001/api/v1/rolls/classroom-teacher', {
          params: {
            classroom: activeClass._id,
            teacher: teacherLoggedIn.id,
          }
        });
        setRollsHistory(response.data.data.rolls);
      } catch (error) {
        console.error('Error fetching rolls history:', error);
        toast({
          title: 'Erro ao carregar histórico.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
  
    return activeClass && (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Histórico de chamadas de {activeClass.name}</ModalHeader>
          <ModalBody>
            {loading ? (
              <Flex justify="center" align="center" minH="150px">
                <Spinner />
              </Flex>
            ) : rollsHistory.length === 0 ? (
              <Text>Nenhum histórico encontrado.</Text>
            ) : (
              <Accordion allowMultiple width="100%">
                {rollsHistory.map((roll) => (
                  <AccordionItem key={roll._id} border="1px solid #E2E8F0" borderRadius="md" mb={3}>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          Data: {new Date(roll.date).toLocaleString()} — Alunos: {roll.students.length}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      {roll.students.length === 0 ? (
                        <Text>Nenhum aluno registrado nesta chamada.</Text>
                      ) : (
                        <VStack align="start" spacing={2}>
                          {roll.students.map((studentEntry, index) => (
                            <Flex
                              key={studentEntry.student._id || index}
                              justify="space-between"
                              align="center"
                              width="100%"
                              p={2}
                            >
                              <HStack spacing={3}>
                                <Avatar
                                  size="sm"
                                  src={studentEntry.student.image} // Student image
                                  name={studentEntry.student.name} // Fallback initials
                                />
                                <Text>{studentEntry.student.name}</Text>
                                </HStack>
                                <HStack spacing={1} align="center">
                                <Text>Status: {studentEntry.status == "present" ? "presente" : ""}</Text>
                                <CircleCheckBig size={18} color='green'/>
                                </HStack>
                            </Flex>
                          ))}
                        </VStack>
                      )}
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </ModalBody>
          <ModalFooter display="flex" gap={2}>
            <Button variant="ghost" onClick={onClose}>
              Voltar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  
  export default RollsHistory;
  