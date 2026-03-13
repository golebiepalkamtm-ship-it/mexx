import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { useQuery, gql } from "@apollo/client";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";

const GET_SERVICES = gql`
  query GetServices($search: String) {
    services(search: $search) {
      id
      title
      price
      category
      location
      user {
        username
      }
    }
  }
`;

export default function MarketplaceScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data, loading } = useQuery(GET_SERVICES, {
    variables: { search },
    pollInterval: 5000,
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Marketplace",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
        }}
      />

      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Szukaj usług..."
          placeholderTextColor="#666"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={data?.services || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/marketplace/${item.id}`)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.badge}>
                <Text style={styles.category}>{item.category || "Inne"}</Text>
              </View>
              <Text style={styles.price}>{item.price} 💎</Text>
            </View>

            <Text style={styles.title}>{item.title}</Text>

            <View style={styles.cardFooter}>
              <Text style={styles.author}>@{item.user.username}</Text>
              <Text style={styles.location}>{item.location}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Text style={{ color: "#666", marginTop: 50 }}>
              Wow, takie pustki...
            </Text>
          </View>
        )}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/marketplace/create")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    padding: 15,
    backgroundColor: "#111",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  searchInput: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 8,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#333",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    padding: 15,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#222",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  badge: {
    backgroundColor: "#222",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  category: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#A78BFA",
    textTransform: "uppercase",
  },
  price: {
    fontWeight: "bold",
    color: "#FCD34D",
    fontSize: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#222",
    paddingTop: 8,
  },
  author: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  location: {
    fontSize: 12,
    color: "#6B7280",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  fabText: {
    color: "#fff",
    fontSize: 30,
    marginTop: -4,
  },
});
