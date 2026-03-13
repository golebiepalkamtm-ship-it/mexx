import React from "react";
import { Stack } from "expo-router";
import { ApolloProvider } from "@apollo/client";
import createApolloClient from "../lib/apollo-client";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  const client = createApolloClient();

  return (
    <ApolloProvider client={client}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="login"
          options={{ presentation: "modal", headerShown: true, title: "Login" }}
        />
        <Stack.Screen
          name="register"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "Register",
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </ApolloProvider>
  );
}
