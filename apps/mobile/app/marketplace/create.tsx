import {
  StyleSheet,
  TextInput,
  Switch,
  ScrollView,
  Button,
  Alert,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { Stack, useRouter } from "expo-router";
import { useMutation, gql } from "@apollo/client";
import React, { useState } from "react";

const CREATE_SERVICE = gql`
  mutation CreateService($input: CreateServiceInput!) {
    createService(createServiceInput: $input) {
      id
    }
  }
`;

export default function CreateServiceScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("IT & Tech");

  const [create, { loading }] = useMutation(CREATE_SERVICE, {
    onCompleted: () => {
      Alert.alert("Sukces", "Ogłoszenie dodane!");
      router.back();
    },
    onError: (e) => Alert.alert("Błąd", e.message),
  });

  const handleSubmit = () => {
    if (!title || !price || !desc) {
      Alert.alert("Błąd", "Wypełnij wymagane pola.");
      return;
    }
    create({
      variables: {
        input: {
          title,
          description: desc,
          price: parseInt(price),
          location,
          category,
        },
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Dodaj Ogłoszenie" }} />

      <View style={styles.form}>
        <Text style={styles.label}>Tytuł ogłoszenia *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Co oferujesz?"
        />

        <Text style={styles.label}>Cena (Tokeny) *</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          placeholder="100"
        />

        <Text style={styles.label}>Kategoria</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder="Dom, IT, itp."
        />

        <Text style={styles.label}>Lokalizacja</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Miasto lub Online"
        />

        <Text style={styles.label}>Opis szczegółowy *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={desc}
          onChangeText={setDesc}
          multiline
          numberOfLines={4}
          placeholder="Opisz swoją usługę..."
        />

        <Button
          title={loading ? "Wysyłanie..." : "Dodaj Ogłoszenie"}
          onPress={handleSubmit}
          color="#4F46E5"
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  form: {
    padding: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 15,
    fontSize: 14,
    color: "#333",
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
});
