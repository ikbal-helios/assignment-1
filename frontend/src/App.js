import React from "react";
import {Routes, Route, Navigate} from 'react-router-dom';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';

import Login from "./pages/login";
import Register from "./pages/register";
import Products from "./pages/products";
import { base_url } from "./api";



const httpLink = createUploadLink({
  uri: `${base_url}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('auth-token');
  return {
    headers: {
      ...headers,
      Authorization: token ? `JWT ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});




function PrivateRoute({ children }) {
  const token = localStorage.getItem('auth-token')
  return token ? children : <Navigate to="/login" />;
}


function App() {
  return (
    <ApolloProvider client={client}>
      <div className='container'>
        <Routes>
          <Route path='login' element={<Login/>}/>
          <Route path="register" element={<Register/>} />
          <Route path="" element={<PrivateRoute>
                                    <Products/>
                                  </PrivateRoute>} />
        </Routes>
      </div>
    </ApolloProvider>
  );
}

export default App;
