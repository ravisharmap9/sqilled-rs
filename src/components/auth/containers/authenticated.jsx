import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import Gate from './gate';

const renderGateComponent = ( data, props ) => {
  const { component, layout, allowedRoles } = props;

  return (
    <Gate
      component={component}
      layout={layout}
      allowedRoles={allowedRoles}
      loggedInUser={data.me}
    />
  );
};

const renderAuthenticated = ( props ) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return renderGateComponent( props );
};

const Authenticated = ( props ) => ( renderAuthenticated( props ) );

renderGateComponent.propTypes = {
  component: PropTypes.func.isRequired,
  layout: PropTypes.func.isRequired,
  allowedRoles: PropTypes.arrayOf( PropTypes.string ).isRequired,
};

Authenticated.propTypes = {
  component: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  allowedRoles: PropTypes.arrayOf( PropTypes.string ).isRequired,
};

const enhance = compose(
  withRouter,
);

export default enhance( Authenticated );
