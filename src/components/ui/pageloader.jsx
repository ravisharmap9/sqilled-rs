import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ClipLoader from 'react-spinners/ClipLoader';

const styles = () => ( {
  loader: {
    '& div': {
      margin: '0 auto ',
    },
    width: '100%',
    height: '100%',
    position: 'fixed',
    background: 'rgba(0,0,0,0.8)',
    zIndex: '9999',
    top: '0',
    left: '0',
    display: 'flex',
    alignItems: 'center',
  },
} );

const Pageloader = ( props ) => {
  const { classes, loading } = props;

  return (
    <div className={classes.loader}>
      <ClipLoader
        sizeUnit="px"
        size={50}
        color="#00ADE2"
        loading={loading}
      />
    </div>
  );
};

Pageloader.propTypes = {
  classes: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default withStyles( styles )( Pageloader );
