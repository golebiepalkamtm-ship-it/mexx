import { StyleSheet, Image, TouchableOpacity, ScrollView, View, Text, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { COLORS, GRADIENT } from "../../constants/theme";

const STATS = [
  { label: "Followers", value: "12.4K" },
  { label: "Tips", value: "340" },
  { label: "Streams", value: "89" },
  { label: "Rating", value: "4.9 ★" },
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" />

      {/* HEADER BANNER */}
      <LinearGradient colors={["#1A0A15", COLORS.bg]} style={styles.banner}>
        <LinearGradient
          colors={GRADIENT as any}
          style={styles.avatarRing}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.avatarInner}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
        </LinearGradient>

        <Text style={styles.displayName}>Mój Profil</Text>
        <Text style={styles.username}>@username</Text>

        <Text style={styles.bio}>Content Creator • Exclusive drops every week 🔥</Text>

        {/* ONLINE BADGE */}
        <View style={styles.onlineBadge}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>Online teraz</Text>
        </View>
      </LinearGradient>

      {/* STATS ROW */}
      <View style={styles.statsContainer}>
        {STATS.map((s) => (
          <View key={s.label} style={styles.stat}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* ACTION BUTTONS */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtnSecondary}>
          <FontAwesome5 name="comment-alt" size={14} color={COLORS.secondary} />
          <Text style={[styles.actionBtnText, { color: COLORS.secondary }]}>Wiadomość</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.85}>
          <LinearGradient colors={GRADIENT as any} style={styles.actionBtnPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <FontAwesome5 name="gem" size={14} color="#fff" />
            <Text style={styles.actionBtnText}>Wyślij Tip</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtnSecondary}>
          <FontAwesome5 name="video" size={14} color={COLORS.muted} />
          <Text style={[styles.actionBtnText, { color: COLORS.muted }]}>Prywatne</Text>
        </TouchableOpacity>
      </View>

      {/* MENU */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/wallet")}>
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: "rgba(255,46,99,0.15)" }]}>
              <FontAwesome5 name="wallet" size={16} color={COLORS.primary} />
            </View>
            <Text style={styles.menuText}>Portfel</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={14} color={COLORS.muted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/marketplace/create")}>
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: "rgba(8,217,214,0.15)" }]}>
              <FontAwesome5 name="plus" size={16} color={COLORS.secondary} />
            </View>
            <Text style={styles.menuText}>Dodaj Ogłoszenie</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={14} color={COLORS.muted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.replace("/login")}>
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: "rgba(248,113,113,0.1)" }]}>
              <FontAwesome5 name="sign-out-alt" size={16} color="#F87171" />
            </View>
            <Text style={[styles.menuText, { color: "#F87171" }]}>Wyloguj</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  banner: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  avatarRing: {
    width: 116,
    height: 116,
    borderRadius: 58,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    padding: 3,
  },
  avatarInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarEmoji: {
    fontSize: 50,
  },
  displayName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  username: {
    color: COLORS.muted,
    fontSize: 14,
    marginBottom: 10,
  },
  bio: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 20,
  },
  onlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,230,118,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0,230,118,0.2)",
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.online,
    marginRight: 6,
  },
  onlineText: {
    color: COLORS.online,
    fontSize: 12,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 20,
    marginTop: -12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    color: COLORS.muted,
    fontSize: 11,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  actionBtnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    gap: 6,
  },
  actionBtnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  menu: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "500",
  },
});
