import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { useQuery, gql } from "@apollo/client";
import { Stack, useRouter } from "expo-router";
import React from "react";

const GET_CONVERSATIONS = gql`
  query GetConversations {
    conversations {
      user {
        id
        username
      }
      lastMessage
      lastMessageAt
    }
  }
`;

export default function MessagesScreen() {
  const router = useRouter();
  const { data, loading, error, refetch } = useQuery(GET_CONVERSATIONS, {
    pollInterval: 5000,
  });
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, []);

  if (loading && !data)
    return (
      <View style={styles.center}>
        <Text>Ładowanie wiadomości...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Wiadomości",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
        }}
      />

      <FlatList
        data={data?.conversations || []}
        keyExtractor={(item) => item.user.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Text style={{ color: "#666", marginTop: 50 }}>
              Brak konwersacji
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => router.push(`/messages/${item.user.id}`)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.user.username?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.content}>
              <View style={styles.row}>
                <Text style={styles.username}>{item.user.username}</Text>
                <Text style={styles.date}>
                  {new Date(item.lastMessageAt).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.message} numberOfLines={1}>
                {item.lastMessage || "Sent a photo"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  username: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  date: {
    color: "#666",
    fontSize: 12,
  },
  message: {
    color: "#aaa",
    fontSize: 14,
  },
});
