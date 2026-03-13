import {
  ActionSheetIOS,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { useLocalSearchParams, Stack } from "expo-router";
import { useQuery, useMutation, gql } from "@apollo/client";
import React, { useState, useRef, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";

const GET_MESSAGES = gql`
  query GetMessages($otherUserId: String!) {
    messages(otherUserId: $otherUserId) {
      id
      content
      senderId
      createdAt
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(sendMessageInput: $input) {
      id
      content
      createdAt
    }
  }
`;

export default function ChatScreen() {
  const { id: otherUserId } = useLocalSearchParams();
  const [text, setText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const { data, loading, error, refetch } = useQuery(GET_MESSAGES, {
    variables: { otherUserId: otherUserId as string },
    pollInterval: 3000,
  });

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: () => {
      setText("");
      refetch();
    },
  });

  const handleSend = async () => {
    if (!text.trim()) return;
    await sendMessage({
      variables: {
        input: {
          receiverId: otherUserId,
          content: text,
        },
      },
    });
  };

  const isMe = (senderId: string) => senderId !== otherUserId;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Chat",
          headerBackTitle: "Wróć",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
        }}
      />

      <FlatList
        ref={flatListRef}
        data={data?.messages || []}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const me = isMe(item.senderId);
          return (
            <View
              style={[
                styles.bubbleWrapper,
                me ? styles.meWrapper : styles.otherWrapper,
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  me ? styles.meBubble : styles.otherBubble,
                ]}
              >
                <Text style={styles.msgText}>{item.content}</Text>
              </View>
              <Text style={styles.timestamp}>
                {new Date(item.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          );
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Wiadomość..."
          placeholderTextColor="#666"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <FontAwesome name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  bubbleWrapper: {
    marginBottom: 12,
    maxWidth: "80%",
  },
  meWrapper: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  otherWrapper: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  bubble: {
    padding: 12,
    borderRadius: 20,
  },
  meBubble: {
    backgroundColor: "#2563EB",
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: "#333",
    borderBottomLeftRadius: 4,
  },
  msgText: {
    color: "#fff",
    fontSize: 16,
  },
  timestamp: {
    color: "#666",
    fontSize: 10,
    marginTop: 4,
    marginHorizontal: 4,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#111",
    borderTopWidth: 1,
    borderTopColor: "#222",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
});
