import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  Animated,
} from "react-native";
import { ResizeMode, Video } from "expo-av";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useMutation, gql } from "@apollo/client";
import { COLORS, GRADIENT } from "../constants/theme";

const { width, height } = Dimensions.get("window");
const AnimView = Animated.View as any;

const TOGGLE_LIKE = gql`
  mutation ToggleLike($id: String!) {
    toggleLike(id: $id) {
      id
      likesCount
      isLiked
    }
  }
`;

const UNLOCK_CONTENT = gql`
  mutation UnlockContent($postId: String!) {
    unlockContent(postId: $postId)
  }
`;

interface PostItemProps {
  item: {
    id: string;
    content: string;
    mediaUrl: string;
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
    isLocked?: boolean;
    unlockPrice?: number;
    isUnlocked?: boolean;
    user: {
      username: string;
      profilePhoto?: string;
    };
  };
  isActive: boolean;
}

export default function PostItem({ item, isActive }: PostItemProps) {
  const [toggleLike] = useMutation(TOGGLE_LIKE);
  const [unlock, { loading: unlockLoading }] = useMutation(UNLOCK_CONTENT, {
    refetchQueries: ["GetFeed"],
    onError: (e) => Alert.alert("Błąd", e.message),
  });

  const heartScale = React.useRef(new Animated.Value(0)).current;
  const heartOpacity = React.useRef(new Animated.Value(0)).current;
  const likeScale = React.useRef(new Animated.Value(1)).current;
  const lastTap = React.useRef<number>(0);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!item.isLiked) handleLike();
      Animated.sequence([
        Animated.parallel([
          Animated.spring(heartScale, { toValue: 1.2, useNativeDriver: true, friction: 3 }),
          Animated.timing(heartOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]),
        Animated.delay(600),
        Animated.parallel([
          Animated.spring(heartScale, { toValue: 2, useNativeDriver: true, friction: 5 }),
          Animated.timing(heartOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]),
      ]).start(() => heartScale.setValue(0));
    }
    lastTap.current = now;
  };

  const handleLike = () => {
    Animated.sequence([
      Animated.spring(likeScale, { toValue: 1.4, useNativeDriver: true, friction: 3 }),
      Animated.spring(likeScale, { toValue: 1, useNativeDriver: true, friction: 5 }),
    ]).start();
    toggleLike({
      variables: { id: item.id },
      optimisticResponse: {
        toggleLike: {
          id: item.id,
          likesCount: item.isLiked ? item.likesCount - 1 : item.likesCount + 1,
          isLiked: !item.isLiked,
          __typename: "Post",
        },
      },
    });
  };

  const handleUnlock = () => {
    Alert.alert(
      "🔐 Treść Premium",
      `Odblokuj za ${item.unlockPrice ?? 0} 💎 tokenów`,
      [
        { text: "Anuluj", style: "cancel" },
        { text: "Odblokuj", onPress: () => unlock({ variables: { postId: item.id } }) },
      ]
    );
  };

  const isLocked = item.isLocked && !item.isUnlocked;
  const isVideo = item.mediaUrl?.endsWith(".mp4") || item.mediaUrl?.includes("video");

  return (
    <TouchableWithoutFeedback onPress={handleDoubleTap}>
      <View style={styles.container}>
        {isLocked ? (
          <LinearGradient colors={["#0B0B0F", "#15151A", "#0B0B0F"]} style={styles.lockedBg}>
            <View style={styles.lockedInner}>
              <Text style={styles.lockIcon}>🔐</Text>
              <Text style={styles.lockedTitle}>Treść Premium</Text>
              <Text style={styles.lockedSub}>Odblokuj za {item.unlockPrice ?? 0} 💎</Text>
              <TouchableOpacity onPress={handleUnlock} disabled={unlockLoading} activeOpacity={0.85}>
                <LinearGradient colors={GRADIENT as any} style={styles.unlockBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.unlockBtnText}>{unlockLoading ? "Odblokowuję..." : "✦ Odblokuj teraz"}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        ) : isVideo ? (
          <Video
            source={{ uri: item.mediaUrl }}
            style={styles.media}
            resizeMode={ResizeMode.COVER}
            isLooping
            shouldPlay={isActive}
          />
        ) : (
          <Image source={{ uri: item.mediaUrl }} style={styles.media} />
        )}

        <AnimView
          style={[styles.doubleTapHeart, { opacity: heartOpacity, transform: [{ scale: heartScale }] }]}
          pointerEvents="none"
        >
          <FontAwesome5 name="heart" size={90} color={COLORS.primary} solid />
        </AnimView>

        {!isLocked && (
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.88)"]}
            style={styles.bottomGradient}
            pointerEvents="none"
          />
        )}

        {!isLocked && (
          <View style={styles.uiContainer}>
            <View style={styles.rightSidebar}>
              <View style={styles.avatarWrapper}>
                {item.user.profilePhoto ? (
                  <Image source={{ uri: item.user.profilePhoto }} style={styles.avatar} />
                ) : (
                  <LinearGradient colors={GRADIENT as any} style={styles.avatar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <Text style={styles.avatarLetter}>{item.user.username?.charAt(0).toUpperCase()}</Text>
                  </LinearGradient>
                )}
                <View style={styles.followBadge}>
                  <FontAwesome5 name="plus" size={9} color="#fff" />
                </View>
              </View>

              <TouchableOpacity onPress={handleLike} style={styles.sideAction}>
                <AnimView style={{ transform: [{ scale: likeScale }] }}>
                  <FontAwesome5 name="heart" size={28} color={item.isLiked ? COLORS.primary : "#fff"} solid={item.isLiked} />
                </AnimView>
                <Text style={styles.sideActionText}>{item.likesCount}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sideAction}>
                <FontAwesome5 name="comment-alt" size={26} color="#fff" />
                <Text style={styles.sideActionText}>{item.commentsCount}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sideAction}>
                <FontAwesome5 name="gem" size={24} color={COLORS.accent} />
                <Text style={[styles.sideActionText, { color: COLORS.accent }]}>Tip</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sideAction}>
                <FontAwesome5 name="share" size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.bottomInfo}>
              <Text style={styles.username}>@{item.user.username}</Text>
              <Text style={styles.content} numberOfLines={2}>{item.content}</Text>
            </View>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height: height - 70,
    backgroundColor: COLORS.bg,
  },
  media: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  lockedBg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lockedInner: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  lockIcon: { fontSize: 72, marginBottom: 20 },
  lockedTitle: { color: COLORS.text, fontSize: 26, fontWeight: "bold", marginBottom: 8, letterSpacing: 0.5 },
  lockedSub: { color: COLORS.muted, fontSize: 16, marginBottom: 32 },
  unlockBtn: {
    paddingHorizontal: 36,
    paddingVertical: 16,
    borderRadius: 50,
  },
  unlockBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16, letterSpacing: 0.5 },
  doubleTapHeart: {
    position: "absolute",
    alignSelf: "center",
    top: "35%",
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 280,
  },
  uiContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 28,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  rightSidebar: {
    position: "absolute",
    right: 14,
    bottom: 90,
    alignItems: "center",
    gap: 18,
  },
  avatarWrapper: {
    marginBottom: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarLetter: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  followBadge: {
    position: "absolute",
    bottom: -6,
    alignSelf: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: COLORS.bg,
  },
  sideAction: {
    alignItems: "center",
    gap: 4,
  },
  sideActionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  bottomInfo: {
    flex: 1,
    paddingRight: 80,
    paddingBottom: 8,
  },
  username: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },
  content: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    lineHeight: 20,
  },
});
