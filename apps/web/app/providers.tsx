"use client";

import { ApolloProvider } from "@apollo/client";
import createApolloClient from "@/lib/apollo-client";

export function Providers({ children }: { children: React.ReactNode }) {
  const client = createApolloClient();
  return <ApolloProvider client={client}>{children as any}</ApolloProvider>;
}
