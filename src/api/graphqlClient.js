// src/api/graphqlClient.js
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const uri = import.meta.env.VITE_GRAPHQL_URL || "https://localhost:7040";

const client = new ApolloClient({
  link: new HttpLink({ uri }),
  cache: new InMemoryCache(),
});

export default client;
