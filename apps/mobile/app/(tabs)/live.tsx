import { StyleSheet, FlatList, TouchableOpacity, View, Text, StatusBar } from "react-native";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "expo-router";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { COLORS, GRADIENT } from "../../constants/theme";

const GET_STREAMS = gql`
  query GetStreams {
    streams {
      id
      title
      category
      viewerCount
      streamer {
        username
      }
    }
  }
`;

const CATEGORIES = ["Wszystkie", "Just Chatting", "Gaming", "Muzyka", "Fitness", "Art"];

export default function LiveScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = React.useState("Wszystkie");
  const { data, loading, refetch } = useQuery(GET_STREAMS, { pollInterval: 5000 });

  const streams = (data?.streams || []).filter((s: any) =>
    activeCategory === "Wszystkie" ? true : s.category === activeCategory
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔴 Na żywo</Text>
        <View style={styles.livePulse}>
          <View style={styles.liveDot} />
          <Text style={styles.liveCount}>{data?.streams?.length ?? 0} streamów</Text>
        </View>
      </View>

      {/* CATEGORY FILTER */}
      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setActiveCategory(item)}
            style={[styles.filterTag, activeCategory === item && styles.filterTagActive]}
          >
            {activeCategory === item ? (
              <LinearGradient colors={GRADIENT as any} style={styles.filterGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={[styles.filterText, { color: "#fff" }]}>{item}</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.filterText}>{item}</Text>
            )}
          </TouchableOpacity>
        )}
      />

      {/* STREAMS LIST */}
      <FlatList
        data={streams}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            {loading ? (
              <Text style={styles.emptyText}>Szukam transmisji...</Text>
            ) : (
              <>
                <Text style={{ fontSize: 48, marginBottom: 12 }}>🎥</Text>
                <Text style={styles.emptyText}>Brak aktywnych transmisji</Text>
              </>
            )}
          </View>
        )}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/live/${item.id}`)}
            activeOpacity={0.85}
          >
            {/* Thumbnail */}
            <View style={styles.thumbnail}>
              <LinearGradient colors={["#1A0A15", "#0B0B0F"]} style={styles.thumbnailBg}>
                <Text style={{ fontSize: 48 }}>🎥</Text>
              </LinearGradient>
              <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.thumbnailOverlay} />
              {/* LIVE badge */}
              <LinearGradient colors={[COLORS.primary, "#FF7A18"]} style={styles.liveBadge} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.liveText}>● LIVE</Text>
              </LinearGradient>
              {/* Viewer count */}
              <View style={styles.viewerBadge}>
                <FontAwesome5 name="eye" size={10} color="#fff" />
                <Text style={styles.viewerText}>{item.viewerCount?.toLocaleString()}</Text>
              </View>
            </View>

            {/* Info row */}
            <View style={styles.info}>
              <LinearGradient colors={GRADIENT as any} style={styles.streamerAvatar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Text style={styles.avatarLetter}>{item.streamer.username?.charAt(0).toUpperCase()}</Text>
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.streamer}>@{item.streamer.username}</Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.category || "Just Chatting"}</Text>
                </View>
              </View>
              <TouchableOpacity activeOpacity={0.85}>
                <LinearGradient colors={GRADIENT as any} style={styles.joinBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.joinText}>Join</Text>
                </LinearGradient>
              </TouchableOpacity>
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
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "bold",
  },
  livePulse: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,46,99,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  liveCount: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  filterList: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  filterTagActive: {
    borderColor: "transparent",
    padding: 0,
  },
  filterGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  empty: {
    alignItems: "center",
    paddingTop: 80,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 16,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  thumbnail: {
    height: 200,
    position: "relative",
  },
  thumbnailBg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  liveBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  liveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  viewerBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  viewerText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
  },
  streamerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
  },
  streamer: {
    color: COLORS.muted,
    fontSize: 12,
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: "rgba(8,217,214,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  categoryText: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: "600",
  },
  joinBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
});
