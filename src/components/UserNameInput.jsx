import React from 'react';
import { Input, Text, Box } from '@chakra-ui/react';

function UserNameInput({ onNameChange, currentStudentName }) {
  return (
    <Box textAlign="left" width={"full"}> 
      <Text mb="8px">
        Nome do aluno
      </Text>
      <Input
        onChange={(e) => {
          const inputValue = e.target.value || ''; 
          onNameChange(inputValue.trim());
        }}
        placeholder="Nome do aluno"
        size="sm"
        borderRadius={4}
        padding={4}
        value={currentStudentName}
        mb={4}
      />
    </Box>
  );
}

export default UserNameInput;
