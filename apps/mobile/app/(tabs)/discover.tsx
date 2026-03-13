import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "expo-router";

const SEARCH_FEED = gql`
  query SearchFeed($searchTerm: String) {
    feed(searchTerm: $searchTerm) {
      id
      content
      mediaUrl
      likesCount
      user {
        username
        profilePhoto
      }
    }
  }
`;

const TAGS = ["#Trending", "#Live", "#Muzyka", "#Gaming", "#Fitness", "#Art"];

export default function DiscoverScreen() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const router = useRouter();

  const term = activeTag ? activeTag.replace("#", "") : search;

  const { data, loading } = useQuery(SEARCH_FEED, {
    variables: { searchTerm: term || undefined },
    skip: term.length < 1,
  });

  const { data: trendingData } = useQuery(SEARCH_FEED, {
    variables: {},
    skip: term.length > 0,
  });

  const handleTagPress = (tag: string) => {
    setActiveTag(activeTag === tag ? "" : tag);
    setSearch("");
  };

  const results = term.length > 0 ? (data?.feed || []) : (trendingData?.feed || []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Odkrywaj</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Szukaj użytkowników, treści..."
          placeholderTextColor="#555"
          value={search}
          onChangeText={(v) => { setSearch(v); setActiveTag(""); }}
        />
      </View>

      <FlatList
        horizontal
        data={TAGS}
        keyExtractor={(t) => t}
        style={styles.tagsContainer}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.tag, activeTag === item && styles.tagActive]}
            onPress={() => handleTagPress(item)}
          >
            <Text style={[styles.tagText, activeTag === item && styles.tagTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {loading && <ActivityIndicator color="#a855f7" style={{ marginTop: 40 }} />}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>
              {term ? "Brak wyników" : "Wyszukaj lub przeglądaj trending"}
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/`)}
          >
            {item.mediaUrl ? (
              <Image source={{ uri: item.mediaUrl }} style={styles.cardImage} />
            ) : (
              <View style={[styles.cardImage, styles.cardPlaceholder]}>
                <Text style={styles.placeholderText}>💬</Text>
              </View>
            )}
            <View style={styles.cardInfo}>
              <Text style={styles.cardUser}>@{item.user.username}</Text>
              <Text style={styles.cardContent} numberOfLines={2}>{item.content}</Text>
              <Text style={styles.cardLikes}>❤️ {item.likesCount}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingTop: 50 },
  header: { paddingHorizontal: 16, marginBottom: 16 },
  title: { color: "#fff", fontSize: 28, fontWeight: "bold", marginBottom: 12 },
  searchBar: {
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 12,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  tagsContainer: { paddingHorizontal: 12, marginBottom: 16 },
  tag: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  tagActive: { backgroundColor: "#a855f7", borderColor: "#a855f7" },
  tagText: { color: "#aaa", fontWeight: "600" },
  tagTextActive: { color: "#fff" },
  row: { gap: 8 },
  grid: { paddingHorizontal: 8, paddingBottom: 100 },
  card: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
  },
  cardImage: { width: "100%", height: 160 },
  cardPlaceholder: { backgroundColor: "#1a1a1a", alignItems: "center", justifyContent: "center" },
  placeholderText: { fontSize: 32 },
  cardInfo: { padding: 10 },
  cardUser: { color: "#a855f7", fontWeight: "bold", fontSize: 13 },
  cardContent: { color: "#ccc", fontSize: 12, marginTop: 4 },
  cardLikes: { color: "#666", fontSize: 11, marginTop: 4 },
  emptyText: { color: "#555", textAlign: "center", marginTop: 60, fontSize: 16 },
});
