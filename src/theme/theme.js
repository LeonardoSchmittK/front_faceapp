import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      500: '#241146',
      400: '#3a1d6b',
      600: '#1a0c33',
    },
  },
  styles: {
    global: {
      '::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
        backgroundColor: 'transparent', // Ensure the scrollbar container is transparent
      },
      '::-webkit-scrollbar-track': {
        background: 'transparent', // Track is fully transparent
      },
      '::-webkit-scrollbar-thumb': {
        background: '#888', // Visible thumb color
        borderRadius: '4px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: '#555', // Darker thumb on hover
      },
      '*': {
        scrollbarWidth: 'thin', // Firefox: thin scrollbar
        scrollbarColor: '#888 transparent', // Firefox: visible thumb, transparent track
      },
    },
  },
});

export default theme;