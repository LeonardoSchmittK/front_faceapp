import {
  Button, Flex, useColorMode, Center, Tooltip, VStack, Text, IconButton, HStack,
  useDisclosure, Spinner
} from '@chakra-ui/react';
import ModalWebcam from '../components/ModalWebcam.jsx';
import CreateClassModal from '../components/CreateClassModal.jsx';
import { ArrowLeftToLine, Sun, Moon } from 'lucide-react';
import useStore from '../store/store.js';
import { useEffect, useState } from 'react';
import ClassesCards from '../components/ClassesCards.jsx';
import LoadingMessage from '../components/LoadingMessage.jsx';
import { useFaceModels } from '../hooks/useFaceModels.js';
import { useNavigate } from 'react-router-dom';
import useClassrooms from '../hooks/useClassrooms.js';

function Home() {
  const isUserLogged = useStore((state) => state.isUserLogged);
  const teacherLoggedIn = useStore((state) => state.teacherLoggedIn);
  const logout = useStore((state) => state.logout);
  const activeId = useStore((state) => state.activeId);
  const isLoadingModels = useStore((state) => state.isLoadingModels);
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  // 👇 Dois modais separados
  const webcamModal = useDisclosure();
  const createClassModal = useDisclosure();

  const { modelsLoaded, labeledDescriptors, loadingError } = useFaceModels();

  useEffect(() => {
    if (loadingError) {
      console.error('Model loading failed:', loadingError);
    }
    if (modelsLoaded) {
      console.log('Models loaded successfully');
    }
  }, [modelsLoaded, loadingError]);

  function handleLogout() {
    localStorage.removeItem("token");
    logout();
    navigate("/");
  }

  return (
    <div className="App">
      {(modelsLoaded || isLoadingModels) ? (
        <Center mt={24} display="flex" flexDirection="column">
          <Flex gap="4" w={300} maxW={500} direction="column">
            <Flex direction="column" width="100%" gap={4}>
              <HStack spacing={2}>
                <Tooltip label="Sair">
                  <IconButton
                    aria-label="Logout"
                    icon={<ArrowLeftToLine size={20} color="#B0B0B0" />}
                    variant="ghost"
                    colorScheme="gray"
                    isRound
                    size="sm"
                    onClick={handleLogout}
                  />
                </Tooltip>
                <Tooltip label={colorMode === 'light' ? 'Dark mode' : 'Light mode'}>
                  <IconButton
                    aria-label="Toggle theme"
                    icon={colorMode === 'light' ? <Moon size={20} color="#B0B0B0" /> : <Sun size={20} color="#B0B0B0" />}
                    onClick={toggleColorMode}
                    variant="ghost"
                    colorScheme="gray"
                    isRound
                    size="sm"
                  />
                </Tooltip>
              </HStack>
              <Text textAlign="left">Olá, {teacherLoggedIn.name}</Text>
            </Flex>

            <Flex gap="2" direction="row">
              <Button
                colorScheme="cyan"
                onClick={() => Number.isInteger(activeId) && webcamModal.onOpen()}
                isDisabled={!Number.isInteger(activeId)}
              >
                Iniciar sessão
              </Button>

              <Button
                colorScheme="gray"
                isDisabled={!isUserLogged}
                onClick={createClassModal.onOpen}
              >
                Criar turma
              </Button>
            </Flex>
          </Flex>

          <ClassesCards />

          <ModalWebcam
            isOpen={webcamModal.isOpen}
            onClose={webcamModal.onClose}
            modelsLoaded={modelsLoaded}
            labeledDescriptors={labeledDescriptors}
          />

          <CreateClassModal
            isOpen={createClassModal.isOpen}
            onClose={createClassModal.onClose}
          />
        </Center>
      ) : (
        <Center mt={24}>
          <Flex direction="column">
            <Center display="flex" flexDirection="column" gap={8}>
              <LoadingMessage />
              <Spinner color="cyan" />
            </Center>
          </Flex>
        </Center>
      )}
    </div>
  );
}

export default Home;
