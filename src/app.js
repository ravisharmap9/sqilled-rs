import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks';
import { SnackbarProvider } from 'notistack';
import client from './apollo/apollo-client';
import Router from './router';

const App = () => (
 
      <ApolloProvider client={client}>
	<ApolloHooksProvider client={client}>
	  <SnackbarProvider maxSnack={3}>
	    <Router />
	  </SnackbarProvider>
	</ApolloHooksProvider>
	</ApolloProvider>
);

export default App;
