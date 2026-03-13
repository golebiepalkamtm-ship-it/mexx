import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// Use local network IP for Android/iOS, localhost for web
// Replace with your machine's IP if testing on device
const API_URL = "http://localhost:3001/graphql";

const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: API_URL,
    }),
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
