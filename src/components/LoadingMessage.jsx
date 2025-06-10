import React, { useEffect, useState } from 'react';
import { Heading } from '@chakra-ui/react';

function LoadingMessage() {
    const possibleQuotes = [
        'Carregando...',
        'Espere um pouco...',
        'Carregando faces...',
        'Preparando tudo para você...',
        'Quase lá...',
        'Analisando dados...',
        'Estabilizando conexões...',
        'Otimizando performance...',
        'Detectando sorrisos...',
        'Verificando expressões...',
        'Organizando arquivos...',
        'Configurando ambiente...',
        'Iniciando sistema...',
        'Ajeitando os últimos detalhes...',
        'Pintando pixels...',
        'Trazendo informações...',
        'Sincronizando com o servidor...',
        'Respire fundo, estamos quase prontos...',
        'O futuro está sendo processado...',
        'Só mais um instante...'
      ];
      
  const [activeMessage, setActiveMessage] = useState(possibleQuotes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMessage((currentMessage) => {
        const currentIndex = possibleQuotes.indexOf(currentMessage);
        const nextIndex = (currentIndex + Math.floor(Math.random()*possibleQuotes.length)) % possibleQuotes.length;
        return possibleQuotes[nextIndex];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []); 

  return (
    <Heading size="md" as="h5">
      {activeMessage}
    </Heading>
  );
}

export default LoadingMessage;