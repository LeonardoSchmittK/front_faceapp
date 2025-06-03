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
import React from 'react'

import DropzoneUserImage from "./DropzoneUserImage"
import UserNameInput from "./UserNameInput"
import ClassNameInput from "./ClassNameInput"

function CreateClassNameModal({isOpen, onClose}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Criar turma</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        <ClassNameInput/>
        <UserNameInput/>
        <DropzoneUserImage/>
                <Button colorScheme="blue" onClick={onClose}>
                    Cadastrar aluno
                </Button>
        </ModalBody>
        <ModalFooter>
        
        
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CreateClassModal