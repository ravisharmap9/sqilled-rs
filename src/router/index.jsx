import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { publicRoutes, privateRoutes } from './routes';
import PublicRoute from './public-route';
import PrivateRoute from './private-route';

const Router = () => (
  <BrowserRouter>
    <Switch>
      {publicRoutes.map( ( {
        key, exact, path, component, layout, allowedRoles,
      } ) => (
        <PublicRoute
          key={key}
          exact={exact}
          path={path}
          component={component}
          layout={layout}
          allowedRoles={allowedRoles}
        />
      ) )}
      {privateRoutes.map( ( {
        key, exact, path, component, layout, allowedRoles,
      } ) => (
        <PrivateRoute
          key={key}
          exact={exact}
          path={path}
          component={component}
          layout={layout}
          allowedRoles={allowedRoles}
        />
      ) )}
    </Switch>
  </BrowserRouter>
);

export default Router;
