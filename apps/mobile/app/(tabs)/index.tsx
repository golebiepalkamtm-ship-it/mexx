import React, { useState, useRef } from "react";
import { View, FlatList, Dimensions, StatusBar, StyleSheet, ActivityIndicator, Text } from "react-native";
import { useQuery, gql } from "@apollo/client";
import PostItem from "../../components/PostItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

const GET_FEED = gql`
  query GetFeed {
    feed {
      id
      content
      mediaUrl
      likesCount
      commentsCount
      isLiked
      isLocked
      unlockPrice
      isUnlocked
      user {
        username
        profilePhoto
      }
    }
  }
`;

export default function HomeScreen() {
  const { data, loading, error, refetch } = useQuery(GET_FEED, {
      pollInterval: 5000
  });
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActivePostId(viewableItems[0].item.id);
    }
  }).current;

  if (loading && !data) {
      return (
          <View style={[styles.center, {paddingTop: insets.top}]}>
              <ActivityIndicator size="large" color="#fff" />
          </View>
      );
  }

  if (error) {
      return (
          <View style={[styles.center, {paddingTop: insets.top}]}>
              <Text style={{color: 'red'}}>Błąd: {error.message}</Text>
          </View>
      )
  }

  const posts = data?.feed || [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostItem item={item} isActive={item.id === activePostId} />
        )}
        keyExtractor={(item) => item.id}
        pagingEnabled
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        contentContainerStyle={{ paddingBottom: 0 }} // Ensure full screen take up
        getItemLayout={(data, index) => (
            {length: height - 70, offset: (height - 70) * index, index}
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  center: {
      flex: 1,
      backgroundColor: "black",
      alignItems: 'center',
      justifyContent: 'center'
  }
});
