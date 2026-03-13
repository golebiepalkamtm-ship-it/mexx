import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { useQuery, gql } from "@apollo/client";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";

const GET_SERVICE = gql`
  query GetService($id: String!) {
    service(id: $id) {
      id
      title
      description
      price
      location
      category
      status
      createdAt
      user {
        username
      }
    }
  }
`;

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_SERVICE, {
    variables: { id },
  });

  if (loading)
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Ładowanie...</Text>
      </View>
    );
  if (error || !data?.service)
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Błąd: {error?.message || "Nie znaleziono oferty"}
        </Text>
      </View>
    );

  const { service } = data;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Szczegóły",
          headerBackTitle: "Wróć",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imagePlaceholder}>
          <FontAwesome name="tag" size={60} color="#555" />
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>{service.price} PLN</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{service.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {service.category || "OGÓLNE"}
              </Text>
            </View>
            <Text style={styles.dateText}>
              {new Date(service.createdAt).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.userInfo}>
            <View style={styles.avatarPlaceholder} />
            <View>
              <Text style={styles.username}>
                @{service.user?.username || "Anonim"}
              </Text>
              {service.location && (
                <Text style={styles.location}>📍 {service.location}</Text>
              )}
            </View>
          </View>

          <Text style={styles.sectionTitle}>OPIS</Text>
          <Text style={styles.description}>
            {service.description || "Brak opisu."}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => router.push("/messages")}
        >
          <Text style={styles.contactButtonText}>Napisz do sprzedającego</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  text: {
    color: "#fff",
  },
  errorText: {
    color: "red",
  },
  content: {
    paddingBottom: 100,
  },
  imagePlaceholder: {
    height: 250,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    position: "relative",
  },
  priceBadge: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#059669",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  priceText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  categoryBadge: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    color: "#BFDBFE",
    fontWeight: "bold",
    fontSize: 12,
  },
  dateText: {
    color: "#666",
    fontSize: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#222",
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    marginRight: 10,
  },
  username: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  location: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    color: "#888",
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 12,
    textTransform: "uppercase",
  },
  description: {
    color: "#ddd",
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#000",
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  contactButton: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  contactButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
