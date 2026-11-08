import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";

import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import {
  getVideos,
  VideoRecord,
} from "../database/database";

export default function HomeScreen() {
  const [videos, setVideos] = useState<VideoRecord[]>([]);

  async function loadVideos() {
    try {
      const result = await getVideos();
      setVideos(result);
    } catch (error) {
      console.error("Could not load videos:", error);
    }
  }

  useFocusEffect(
      useCallback(() => {
        loadVideos();
      }, [])
  );

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Video Library</Text>

        <View style={styles.content}>
          <FlatList
              data={videos}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyTitle}>
                    No videos yet
                  </Text>

                  <Text style={styles.emptyText}>
                    Add your first labelled video.
                  </Text>
                </View>
              }
              renderItem={({ item }) => (
                  <Pressable style={styles.videoCard}>
                    <Text style={styles.videoLabel}>
                      {item.label}
                    </Text>

                    {item.notes ? (
                        <Text style={styles.videoNotes}>
                          {item.notes}
                        </Text>
                    ) : null}

                    <Text style={styles.videoDate}>
                      {new Date(item.created_at).toLocaleString()}
                    </Text>
                  </Pressable>
              )}
          />
        </View>

        <Pressable
            style={styles.addButton}
            onPress={() => router.push("/add")}
        >
          <Text style={styles.addButtonText}>
            + Add Video
          </Text>
        </Pressable>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },

  content: {
    flex: 1,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "600",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 16,
    opacity: 0.6,
  },

  videoCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },

  videoLabel: {
    fontSize: 18,
    fontWeight: "700",
  },

  videoNotes: {
    marginTop: 6,
    fontSize: 15,
    opacity: 0.7,
  },

  videoDate: {
    marginTop: 10,
    fontSize: 12,
    opacity: 0.5,
  },

  addButton: {
    backgroundColor: "#111",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 10,
  },

  addButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
});