import {
  Button, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  VStack, Text, FormControl, FormLabel, Input
} from '@chakra-ui/react';
import useClassRollstore from '../store/rollStore.js';
import useStore from '../store/store.js';
import useClassroomStore from '../store/classStore.js';
import { useEffect, useState } from 'react';

function CallRollModal({ isOpen, onClose, onNext }) {
  const [timeLimit, setTimeLimit] = useState('');
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const activeClass = useClassRollstore((state) => state.activeClass);
  const setRoll = useClassroomStore((state) => state.setRoll);
  const setDeadline = useStore((state) => state.setDeadline)

  const [durationText, setDurationText] = useState('');

  useEffect(() => {
    document.activeElement?.blur();

    if (!timeLimit) return setDurationText('');
  
    const now = new Date();
    const [limitHour, limitMinute] = timeLimit.split(':').map(Number);
    let limit = new Date(now.getFullYear(), now.getMonth(), now.getDate(), limitHour, limitMinute);
  
    if (limit <= now) {
      limit.setDate(limit.getDate() + 1);
    }
  
    const diffMs = limit - now;
  
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
    const textParts = [];
    if (diffHours > 0) textParts.push(`${diffHours} hora${diffHours > 1 ? 's' : ''}`);
    if (diffMinutes > 0) textParts.push(`${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`);
  
    setDurationText(`A chamada durará ${textParts.join(' e ')}`);
  }, [timeLimit]);

  useEffect(()=>{
    setDeadline(null)
  },[])

  const handleNext = () => {
    const now = new Date();
    const [limitHour, limitMinute] = timeLimit.split(':').map(Number);
    let deadline = new Date(now.getFullYear(), now.getMonth(), now.getDate(), limitHour, limitMinute);
    if (deadline <= now) {
      deadline.setDate(deadline.getDate() + 1);
    }
    
    setRoll(true);
    onNext(); 
    onClose();
    setDeadline(deadline)
  };

  return activeClass ? (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Iniciar chamada de {activeClass.name}</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <Text>Hora atual:</Text>
              <Text>{currentTime}</Text>
            </FormControl>
            <FormControl>
              <FormLabel>Até que horário a chamada contabilizará?</FormLabel>
              <Input
                type="time"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                placeholder="Selecione o horário limite"
              />
              {durationText && (
                <Text mt={2} color="gray.600" fontSize="sm">
                  {durationText}
                </Text>
              )}
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter display="flex" gap={2}>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="cyan" onClick={handleNext} isDisabled={!timeLimit}>
            Iniciar chamada
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ) : (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Erro</ModalHeader>
        <ModalBody>
          <Text>
            Nenhuma turma selecionada. Por favor, selecione uma turma antes de iniciar a chamada.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CallRollModal;
