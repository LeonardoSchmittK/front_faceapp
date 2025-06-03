import React from 'react';
import { Input, Text } from '@chakra-ui/react';

function ClassNameInput({ value, onClassNameChange }) {
  return (
    <>
      <Text mb="8px">Nome da turma</Text>
      <Input
        value={value || ''} // Ensure value is always a string
        onChange={(e) => {
          const inputValue = e.target.value || ''; // Default to empty string
          onClassNameChange(inputValue.trim());
        }}
        placeholder="Turma da pesada"
        size="sm"
        marginBottom={4}
      />
    </>
  );
}

export default ClassNameInput;