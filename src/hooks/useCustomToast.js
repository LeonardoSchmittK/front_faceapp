// src/hooks/useCustomToast.js
import { position, useToast } from '@chakra-ui/react';

const useCustomToast = () => {
  const toast = useToast();

  const showToast = ({ title, description, status = 'success', duration = 2000, isClosable = true }) => {
    toast({
      title,
      description,
      status,
      duration,
      isClosable,
      position:"top-right"
    });
  };

  return showToast;
};

export default useCustomToast;