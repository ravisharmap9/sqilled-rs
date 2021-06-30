import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import filter from 'lodash/filter';
import intersectionBy from 'lodash/intersectionBy';
import Unauthorized from '../../ui/unauthorized';

const isAllRoute = ( allowedRoles ) => {
  const isAll = filter( allowedRoles, ( item ) => item === 'ALL' );
  return isAll.length === 1;
};

const validateRouteRole = ( allowedRoles, loggedInUser ) => {
  const userRoles = loggedInUser.roles.map( ( item ) => item.name );
  const userHasRole = intersectionBy( userRoles, allowedRoles );
  return userHasRole.length >= 1;
};

const renderComponent = ( component, Layout, loggedInUser ) => (
  <Layout component={component} loggedInUser={loggedInUser} />
);

const Gate = ( {
  allowedRoles, loggedInUser, component, layout: Layout,
} ) => {
  if ( isAllRoute( allowedRoles ) ) {
    return renderComponent( component, Layout, loggedInUser );
  }
  if ( validateRouteRole( allowedRoles, loggedInUser ) ) {
    return renderComponent( component, Layout, loggedInUser );
  }
  return <Unauthorized />;
};

Gate.propTypes = {
  component: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  allowedRoles: PropTypes.arrayOf( PropTypes.string ).isRequired,
};

const enhance = compose(
  withRouter,
);

export default enhance( Gate );
