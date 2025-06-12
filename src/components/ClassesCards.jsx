import {
  Flex,
  Heading,
  useColorModeValue,
  Tooltip,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import useStore from '../store/store.js';
import useClassRollstore from '../store/rollStore.js';
import useClassrooms from '../hooks/useClassrooms.js';
import useCustomToast from '../hooks/useCustomToast.js';
import axios from 'axios';
import ConfirmDeleteDialog from '../components/ConfirmDialog.jsx';
import RollsHistory from '../components/RollsHistory.jsx'

function ClassesCards({ onSelectClass }) {
  const activeId = useStore((state) => state.activeId);
  const setActiveId = useStore((state) => state.setActiveId);
  const setActiveClass = useClassRollstore((state) => state.setActiveClass);
  const activeClass = useClassRollstore((state) => state.activeClass);
  const rollsHistory = useDisclosure();

  const { classes, setClasses } = useClassrooms();
  const showToast = useCustomToast();

  const [isOpen, setIsOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const cancelRef = useRef();

  const activeBg = useColorModeValue('cyan.400', 'cyan.300');
  const inactiveBg = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.800');
  const inactiveTextColor = useColorModeValue('gray', 'white');

  const handleClick = (classItem) => {
    const newActiveId = activeId === classItem._id ? null : classItem._id;
    setActiveId(newActiveId);
    onSelectClass(newActiveId ? classItem : null);
    setActiveClass(classItem);
  };

  const openConfirmDialog = (id) => {
    document.activeElement?.blur();
    setClassToDelete(id);
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setClassToDelete(null);
  };

  useEffect(() => {
    console.log("activeClass");
    console.log(activeClass);
  }, [activeClass]);

  const handleRemoveClass = async (id) => {
    try {
      await axios.delete(process.env.REACT_APP_PROD_URL_API_BASE + `api/v1/Classrooms/${id}`);
      setClasses(classes.filter((classItem) => classItem._id !== id));
      if (activeId === id) {
        setActiveId(null);
        onSelectClass(null);
      }
      showToast({
        title: 'Turma deletada com sucesso!',
        description: '',
        status: 'success',
      });
    } catch (err) {
      console.error('Erro ao deletar sala: ', err);
      showToast({
        title: 'Erro',
        description: 'Houve um erro ao remover sala. Tente mais tarde.',
        status: 'error',
      });
    } finally {
      onClose();
    }
  };

  return (
    <>
      <Flex gap="4" mt={8} w={300} maxW={500} direction="column">
        {classes.length === 0 && (
          <Text fontSize="md" color="gray.500">
            Não há turmas criadas. Crie uma e ela aparecerá aqui :)
          </Text>
        )}

        {classes.map((classItem) => (
          <Flex
            key={classItem._id}
            direction="row"
            align="center"
            justify="space-between"
            bg={activeId === classItem._id ? activeBg : inactiveBg}
            p={4}
            borderRadius="md"
            cursor="pointer"
            boxShadow="sm"
            role="group"
            transition="background-color 0.2s ease"
            onClick={() => handleClick(classItem)}
            _hover={{
              '& > .menu-button': {
                opacity: 1,
              },
            }}
          >
            <Heading
              as="h1"
              size="md"
              color={activeId === classItem._id ? textColor : inactiveTextColor}
              noOfLines={1}
            >
              {classItem.name}
            </Heading>

            <Menu>
              <MenuButton
                className="menu-button"
                as={IconButton}
                icon={<MoreVertical />}
                color={activeId === classItem._id ? textColor : inactiveTextColor}
                size="sm"
                variant="ghost"
                onClick={(e) => e.stopPropagation()}
                opacity={0}
                transition="opacity 0.2s ease"
                _hover={{ opacity: 1 }}
                _focus={{ opacity: 1 }}
              />
              <MenuList>
                <MenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    rollsHistory.onOpen();
                  }}
                >
                  Acessar chamadas
                </MenuItem>
                <MenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    openConfirmDialog(classItem._id);
                  }}
                  color="red.500"
                >
                  Remover turma
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        ))}
      </Flex>

      <ConfirmDeleteDialog
        isOpen={isOpen}
        onClose={onClose}
        cancelRef={cancelRef}
        classToDelete={classToDelete}
        handleRemoveClass={handleRemoveClass}
      />

      <RollsHistory
        isOpen={rollsHistory.isOpen}
        onClose={rollsHistory.onClose}
      />
    </>
  );
}

export default ClassesCards;