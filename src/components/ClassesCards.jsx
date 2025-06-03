import { Flex, Heading, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';
import useStore from '../store/store.js';

function ClassesCards() {
  const activeId = useStore((state) => state.activeId);
  const setActiveId = useStore((state) => state.setActiveId);
  
  const activeBg = useColorModeValue('cyan.500', 'cyan.500');
  const inactiveBg = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const inactiveTextColor = useColorModeValue('gray', 'white');
  
  const classes = [
    { title: "Aula Unisul I" },
    { title: "Aula Unisul II" },
    { title: "Aula Unisul III" },
    { title: "Aula Unisul IV" }
  ];

  const handleClick = (id) => {
    setActiveId(activeId === id ? null : id); // Toggle selection
  };

  return (
    <Flex gap="4" mt={8} w={300} maxW={500} direction="column">
      {classes.map((classItem, id) => (
        <Heading 
          key={id}
          as="h1" 
          size="md" 
          bg={activeId === id ? activeBg : inactiveBg}
          p={4}          
          borderRadius="md" 
          textAlign="left"
          color={activeId === id ? textColor : inactiveTextColor}
          boxShadow="sm"
          cursor="pointer"
          transition="background-color 0.2s ease"
       
          onClick={() => handleClick(id)}
        >
          {classItem.title}  
        </Heading>
      ))}
    </Flex>
  );
}

export default ClassesCards;