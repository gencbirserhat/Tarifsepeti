import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { firebase } from "../../firebase";

export default function PostDetails({ route }) {
  const { item } = route.params;
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    firebase
      .firestore()
      .collection("usernames")
      .doc(item.user_id)
      .get()
      .then((doc) => {
        const data = doc.data();
        if (data && data.username) {
          setUsername(data.username);
        } else {
          setUsername("Unknown");
        }
      })
      .catch((error) => {
        console.error("Error fetching username:", error);
        setUsername("Unknown");
      });
  }, [item.user_id]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("profile-photos")
      .doc(item.user_id)
      .get()
      .then((aa) => {
        const data = aa.data();
        if (data) {
          setImage(data.url);
        } else {
          setImage(null);
        }
      });
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FCECDA" }}>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          {image === null ? (
            <Image
              style={styles.profileImage}
              source={{
                uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
              }}
            />
          ) : (
            <Image source={{ uri: image }} style={styles.profileImage} />
          )}
          <Text style={styles.user}>{username}</Text>
        </View>

        <View>
          <Text style={styles.title}>{item.title}</Text>

          <Image style={styles.image} source={{ uri: item.image_url }} />

          <Text style={styles.description}>{item.description}</Text>

          <View style={styles.ingredientsContainer}>
            <Text style={styles.ingredientsTitle}>Malzemeler</Text>
            <View style={styles.ingredientsWrapper}>
              {item.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientCard}>
                  <Text style={styles.ingredient}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FCECDA",
    justifyContent: "flex",
    paddingTop: 10,
    padding: 16,
  },
  profileContainer: {
    backgroundColor: "#EE4F35",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    paddingVertical: 20,
    marginTop: -10,
    marginRight: -20,
    marginLeft: -20,
    paddingBottom: 20,
    marginBottom: 20,
    elevation: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 18,
  },
  user: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    marginBottom: 20,
    borderRadius: 20,
  },
  ingredientsContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "red",
    paddingTop: 16,
    width: "100%",
  },
  ingredientsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  ingredientsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  ingredientCard: {
    backgroundColor: "#FFDAB9",
    padding: 10,
    margin: 5,
    borderRadius: 10,
    elevation: 3,
  },
  ingredient: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});
