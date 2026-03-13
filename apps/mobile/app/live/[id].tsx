import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { useLocalSearchParams, Stack } from "expo-router";
import { useQuery, useMutation, gql } from "@apollo/client";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";

const GET_STREAM = gql`
  query GetStream($id: String!) {
    stream(id: $id) {
      id
      title
      streamer {
        username
      }
    }
    streamTips(streamId: $id) {
      id
      tokenAmount
      message
      sender {
        username
      }
    }
  }
`;

const SEND_TIP = gql`
  mutation SendTip($streamId: String!, $amount: Int!, $message: String) {
    sendStreamTip(streamId: $streamId, amount: $amount, message: $message)
  }
`;

export default function StreamDetailScreen() {
  const { id } = useLocalSearchParams();
  const [msg, setMsg] = useState("");

  const { data, loading } = useQuery(GET_STREAM, {
    variables: { id },
    pollInterval: 2000,
  });

  const [sendTip] = useMutation(SEND_TIP, {
    onCompleted: () => {
      setMsg("");
      Alert.alert("Sukces", "Wysłano napiwek!");
    },
    onError: (e) => Alert.alert("Błąd", e.message),
  });

  const handleTip = (amount: number) => {
    sendTip({
      variables: {
        streamId: id,
        amount,
        message: msg || `Wysyła ${amount} żetonów!`,
      },
    });
  };

  if (loading && !data)
    return (
      <View style={styles.center}>
        <Text>Łączenie...</Text>
      </View>
    );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Fake Video Player */}
      <View style={styles.player}>
        <Text style={styles.playerText}>Sygnał Wideo</Text>
        <View style={styles.overlay}>
          <View style={styles.topBar}>
            <View style={styles.liveChip}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <Text style={styles.streamerName}>
              @{data?.stream?.streamer.username}
            </Text>
          </View>
        </View>
      </View>

      {/* Chat & Events */}
      <ScrollView style={styles.chatContainer}>
        {data?.streamTips?.map((tip: any) => (
          <View key={tip.id} style={styles.tipRow}>
            <Text style={styles.tipUser}>{tip.sender.username}</Text>
            <Text style={styles.tipAmount}>💎 {tip.tokenAmount}</Text>
            <Text style={styles.tipMsg}>{tip.message}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.quickTips}>
          {[10, 50, 100].map((amt) => (
            <TouchableOpacity
              key={amt}
              style={styles.tipBtn}
              onPress={() => handleTip(amt)}
            >
              <Text style={styles.tipBtnText}>💎 {amt}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Napisz wiadomość..."
          placeholderTextColor="#666"
          value={msg}
          onChangeText={setMsg}
        />
      </View>
    </KeyboardAvoidingView>
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
  player: {
    height: 300,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  playerText: {
    color: "#333",
    fontSize: 20,
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 40,
  },
  liveChip: {
    backgroundColor: "red",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 10,
  },
  liveText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  streamerName: {
    color: "#fff",
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  tipUser: {
    color: "#A78BFA",
    fontWeight: "bold",
    fontSize: 12,
    marginRight: 5,
  },
  tipAmount: {
    color: "#FCD34D",
    fontWeight: "bold",
    fontSize: 12,
    marginRight: 5,
  },
  tipMsg: {
    color: "#fff",
    fontSize: 12,
  },
  controls: {
    padding: 10,
    backgroundColor: "#111",
  },
  quickTips: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    gap: 10,
  },
  tipBtn: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  tipBtnText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});
