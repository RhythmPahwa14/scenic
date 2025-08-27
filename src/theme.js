import { createTheme } from '@mantine/core';

export const theme = createTheme({
  fontFamily: 'Inter, sans-serif',
  primaryColor: 'blue',
  defaultRadius: 'md',
  
  colors: {
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5C5F66',
      '#373A40',
      '#2C2E33',
      '#25262B',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
  },

  components: {
    TextInput: {
      styles: {
        input: {
          '&:focus': {
            borderColor: 'var(--mantine-color-blue-6)',
            boxShadow: '0 0 0 2px var(--mantine-color-blue-1)',
          },
        },
      },
    },
    Button: {
      defaultProps: {
        size: 'md',
      },
      styles: {
        root: {
          '--button-translate-y': '0',
          transform: 'translateY(var(--button-translate-y))',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          
          '&:hover': {
            '--button-translate-y': '-2px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  },
});
