import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X as CloseIcon } from 'lucide-react';
import { Box, Image, Text, IconButton } from '@chakra-ui/react';
import useStore from '../store/store.js';
import useCustomToast from '../hooks/useCustomToast.js';

function DropzoneUserImage({ onImageUpload }) {
  const preview = useStore((state) => state.previewUserImage);
  const setPreview = useStore((state) => state.setPreviewUserImage);
  const showToast = useCustomToast();

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const previewUrl = URL.createObjectURL(file); // Create preview URL
        setPreview(previewUrl);
        onImageUpload(file); // Pass the File object directly
      }

      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach((e) => {
          if (e.code === 'file-too-large') {
            showToast({
              title: `Arquivo ${file.name} excede o limite de 5MB.`,
              status: 'warning',
            });
          } else if (e.code === 'file-invalid-type') {
            showToast({
              title: `Arquivo ${file.name} não é um .png ou .jpg válido.`,
              status: 'warning',
            });
          } else if (e.code === 'too-many-files') {
            showToast({
              title: 'Selecione apenas um arquivo.',
              status: 'warning',
            });
          }
        });
      });
    },
    [onImageUpload, setPreview, showToast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop,
  });

  const handleRemove = () => {
    setPreview(null);
    onImageUpload(null);
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview); // Clean up object URL
      }
    };
  }, [preview]);

  return (
    <Box width="100%" mb={4}>
      <Text mb="12px">Foto do aluno:</Text>
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
          {preview ? 'Arquivo carregado com sucesso!' : 'Arraste e solte a foto facial do aluno aqui'}
        </Text>
        <Text fontSize="sm" color="gray.500">
          .png, .jpg até 5MB
        </Text>
        {preview && (
          <Box position="relative" width={100} margin="auto" mt={4} mb={4}>
            <Image
              src={preview}
              alt="Preview"
              boxSize="80px"
              objectFit="cover"
              borderRadius="100%"
            />
            <IconButton
              aria-label="Remover imagem"
              icon={<CloseIcon />}
              size="xs"
              borderRadius="100%"
              position="absolute"
              top={-1}
              right={-1}
              colorScheme="red"
              onClick={handleRemove}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default DropzoneUserImage;