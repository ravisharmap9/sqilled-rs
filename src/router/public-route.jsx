import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

const PublicRoute = ( {
  component, layout: Layout, ...rest
} ) => (
  <Route {...rest}>
    <Layout component={component} />
  </Route>
);

PublicRoute.propTypes = {
  component: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
};

export default PublicRoute;
