const style = {
  palette: {
    common: {
      black: '#000',
      white: '#fff',
      darkGray: '#a1a1a1',
      darkBlue: '#153180',
      gainsboro: '#e4e4e4',
      dimGray: '#666666',
      whiteSmoke: '#f8f8f8',
      tropicalBlue: '#b4d1ee',
      sushi: '#70a438',
      cinnabar: '#dd4247',
    },
  },
  typography: {
    useNextVariants: true,   
    fontSize: 14,
    lineHeight: '20px',
    color: '#666666',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
    button: {
      background: '#153180',
      border: '2px solid #153180',
      color: '#fff',
      padding: '10px 15px',
      cursor: 'pointer',
      textAlign: 'center',
      textTransform: 'inherit',
      fontSize: 16,
      '&:hover': {
        background: '#fff',
        border: '2px solid #153180',
        color: '#153180',
      },
    },
    body1: {
      fontSize: 14,
      color: '#666',
      width: '100%',
    },
    h1: {
      fontSize: 40,
    },
    h2: {
      fontSize: 36,
      fontWeight: '800',
      lineHeight: '40px',
    },
    h3: {
      fontSize: 25,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600',
    },
    h5: {
      fontSize: 18,
    },
    h6: {
      fontSize: 16,
    },
  },
};

export default style;
