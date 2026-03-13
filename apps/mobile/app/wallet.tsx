import { StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Text, View } from "../../components/Themed";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Stack } from "expo-router";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";

const GET_WALLET = gql`
  query GetMyWallet {
    myWallet {
      balance
      updatedAt
    }
    myTransactions {
      id
      type
      amount
      createdAt
    }
  }
`;

const DEPOSIT_TOKENS = gql`
  mutation DepositTokens($amount: Int!) {
    depositTokens(amount: $amount) {
      balance
    }
  }
`;

export default function WalletScreen() {
  const { data, loading, refetch } = useQuery(GET_WALLET);
  const [depositTokens] = useMutation(DEPOSIT_TOKENS);

  const handleDeposit = async (amount: number) => {
    try {
      await depositTokens({ variables: { amount } });
      refetch();
      Alert.alert("Sukces", `Doładowano ${amount} tokenów!`);
    } catch (e: any) {
      Alert.alert("Błąd", e.message);
    }
  };

  if (loading && !data)
    return (
      <View style={styles.center}>
        <Text>Ładowanie portfela...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Portfel",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>TWOJE SALDO</Text>
          <Text style={styles.balanceValue}>
            {data?.myWallet?.balance || 0} 🪙
          </Text>
          <Text style={styles.balanceDate}>
            Ostatnia operacja:{" "}
            {data?.myWallet?.updatedAt
              ? new Date(data.myWallet.updatedAt).toLocaleDateString()
              : "-"}
          </Text>
        </View>

        {/* Actions */}
        <Text style={styles.sectionTitle}>DOŁADUJ KONTO</Text>
        <View style={styles.grid}>
          {[100, 500, 1000, 5000].map((amount) => (
            <TouchableOpacity
              key={amount}
              style={styles.gridItem}
              onPress={() => handleDeposit(amount)}
            >
              <FontAwesome
                name="diamond"
                size={24}
                color="#A78BFA"
                style={{ marginBottom: 8 }}
              />
              <Text style={styles.amountText}>{amount}</Text>
              <Text style={styles.priceText}>
                {(amount / 10).toFixed(2)} zł
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* History */}
        <Text style={styles.sectionTitle}>HISTORIA</Text>
        <View style={styles.historyList}>
          {data?.myTransactions?.map((tx: any) => (
            <View key={tx.id} style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <View
                  style={[
                    styles.iconBox,
                    tx.amount > 0 ? styles.iconGreen : styles.iconRed,
                  ]}
                >
                  <FontAwesome
                    name={tx.amount > 0 ? "arrow-down" : "arrow-up"}
                    size={12}
                    color="#fff"
                  />
                </View>
                <View>
                  <Text style={styles.txType}>{tx.type}</Text>
                  <Text style={styles.txDate}>
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.txAmount,
                  tx.amount > 0 ? styles.textGreen : styles.textRed,
                ]}
              >
                {tx.amount > 0 ? "+" : ""}
                {tx.amount}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
  content: {
    padding: 20,
    paddingBottom: 50,
  },
  balanceCard: {
    backgroundColor: "#4C1D95",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    marginBottom: 30,
  },
  balanceLabel: {
    color: "#C4B5FD",
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 10,
  },
  balanceValue: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 10,
  },
  balanceDate: {
    color: "#A78BFA",
    fontSize: 12,
  },
  sectionTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 15,
    marginTop: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  gridItem: {
    width: "48%",
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#374151",
  },
  amountText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  priceText: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 4,
  },
  historyList: {
    backgroundColor: "#111",
    borderRadius: 12,
    overflow: "hidden",
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  historyLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconGreen: {
    backgroundColor: "#065F46",
  },
  iconRed: {
    backgroundColor: "#7F1D1D",
  },
  txType: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  txDate: {
    color: "#666",
    fontSize: 10,
  },
  txAmount: {
    fontWeight: "bold",
    fontSize: 16,
  },
  textGreen: {
    color: "#34D399",
  },
  textRed: {
    color: "#F87171",
  },
});
