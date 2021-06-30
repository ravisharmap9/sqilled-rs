const globalStyles = ( theme ) => ( {
  defaultLinkButton: {
    border: 0,
    backgroundColor: 'transparent',
    color: '#000',
    padding: 0,
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  defaultCloseButton: {
    color: '#153180',
    fontSize: 20,
    float: 'right',
    margin: '10px 8px 0 0',
    padding: '0',
    '&:hover': {
      background: 'transparent',
    },
  },
  defaultAlertDialog: {
    '& button': {
      color: theme.palette.common.white,
      borderRadius: '0px',
      '&:hover': {
        color: theme.palette.common.darkBlue,
        background: theme.palette.common.white,
      },
      '&:focus': {
        background: theme.palette.common.white,
        color: theme.palette.common.darkBlue,
      },
    },
  },
  defaultDialogContainer: {
    padding: '30px 30px 30px 30px',
    [theme.breakpoints.down( 'sm' )]: {
      padding: '10px',
    },
  },
  defaultIconButton: {
    borderRadius: '0',
  },
} );

export default globalStyles;
