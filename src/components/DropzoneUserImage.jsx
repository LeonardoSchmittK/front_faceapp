import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Box, Image, Text, Flex, IconButton } from '@chakra-ui/react';
import { X as CloseIcon } from 'lucide-react';
import useStore from "../store/store.js"
import useCustomToast from '../hooks/useCustomToast.js';

function DropzoneUserImage({ onImageUpload,clearPreview }) {

  const preview = useStore((state) => state.previewUserImage);
  const setPreview = useStore((state) => state.setPreviewUserImage);
  const showToast = useCustomToast();

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      // Handle accepted file (only one)
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        onImageUpload(file);
      }

      // Handle rejected files
      rejectedFiles.forEach(({ file, errors }) => {
        if (errors.some((e) => e.code === 'file-too-large')) {
          showToast({
            title:`Arquivo ${file.name} excede o limite de 5MB .`,
            status: 'warning',
          });
        } else if (errors.some((e) => e.code === 'file-invalid-type')) {
          showToast({
            title: `File ${file.name} não é válido como .png ou .jpg`,
            status: 'warning',
          });
        } else if (errors.some((e) => e.code === 'too-many-files')) {
          showToast({
            title: 'Selecione somente um arquivo',
            status: 'warning',
          });
        }
      });
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxFiles: 1, // Restrict to one file
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop,
  });

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onImageUpload(null); // Notify parent that image is removed
  };

  // Cleanup object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <Box width="100%" mb={4}>
      <Text mb="12px" width={"100%"}>Foto do aluno:</Text>

      <Box
        {...getRootProps()}
        border="2px dashed"
        borderColor={isDragActive ? 'blue.500' : 'gray.300'}
        borderRadius="md"
        p={6}
        textAlign="center"
        cursor="pointer"
        _hover={{ borderColor: 'blue.300' }}
        transition="border-color 0.2s"
      >
        <input {...getInputProps()} />
        <Upload size={24} style={{ margin: '0 auto', color: '#718096' }} />
        <Text mt={2} color="gray.600">
            {
                preview ? "Arquivo carregado com sucesso!" : "Arraste e solte a foto facial do aluno nesta área"  
            }
        </Text>
        <Text fontSize="sm" color="gray.500">
          .png, .jpg até 5MB
        </Text>
        {
          preview &&

        <Box position="relative" width={100} margin={"auto"}>
              <Image
                src={preview}
                margin={"auto"}
                marginTop={4}
                marginBottom={4}
                alt="Preview"
                boxSize="80px"
                objectFit="cover"
                borderRadius="100%"
                />
              <IconButton
                aria-label="Remover imagem"
                icon={<CloseIcon />}
                size="xs"
                borderRadius={"100%"}
                position="absolute"
                top={-1}
                right={-1}
                colorScheme="red"
                onClick={handleRemove}
                />
            </Box>
              }
      
      </Box>

      {/* {preview && (
        <Box mt={4}>
          <Text fontWeight="bold" mb={2}>
            Prévia da foto:
          </Text>
          <Flex align="center" gap={4}>
            <Box position="relative">
              <Image
                src={preview}
                alt="Preview"
                boxSize="100px"
                objectFit="cover"
                borderRadius="md"
              />
              <IconButton
                aria-label="Remover imagem"
                icon={<CloseIcon />}
                size="xs"
                position="absolute"
                top={-2}
                right={-2}
                colorScheme="red"
                onClick={handleRemove}
              />
            </Box>
          </Flex>
        </Box>
      )} */}
    </Box>
  );
}

export default DropzoneUserImage;