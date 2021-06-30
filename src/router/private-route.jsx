import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { Authenticated } from '../components/auth';

const PrivateRoute = ( {
  component, layout, allowedRoles, ...rest
} ) => (
  <Route {...rest}>
    <Authenticated component={component} layout={layout} allowedRoles={allowedRoles} />
  </Route>
);

PrivateRoute.propTypes = {
  component: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  allowedRoles: PropTypes.arrayOf( PropTypes.string ).isRequired,
};

export default PrivateRoute;
