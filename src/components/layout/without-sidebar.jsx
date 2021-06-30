import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import Header from '../ui/header/header';
import Footer from '../ui/footer/footer';

const styles = {
  root: {
    display: 'block',
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.white,
    minHeight: 'calc(100vh - 123px)',
  },
};

const LayoutWithoutSidebar = ( { classes, component: Component, loggedInUser } ) => (
  <MuiThemeProvider theme={theme}>
    <Header loggedInUser={loggedInUser} />
    <div className={classes.root}>
      <main className={classes.content}>
        <Component />
      </main>
    </div>
    <Footer />
  </MuiThemeProvider>
);

LayoutWithoutSidebar.defaultProps = {
  loggedInUser: null,
};

LayoutWithoutSidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  component: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object,
};

export default withStyles( styles )( LayoutWithoutSidebar );
