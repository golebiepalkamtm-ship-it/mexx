import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/graphql",
    }),
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
