import React, { useEffect, useState} from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from "react-native";
import { firebase} from "../../firebase";
import { useNavigation } from "@react-navigation/native";

export default function Posts({ filters, textFilter }) {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, [filters, textFilter]);

  const fetchRecipes = async () => {
    try {
      const querySnapshot = await firebase
        .firestore()
        .collection("recipes")
        .get();
      let recipeList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));


      if (textFilter.length > 0 || filters.length > 0) {
        let result = recipeList;

        if (textFilter.length > 0) {
          result = recipeList.filter((item) => {
            const regex = new RegExp(textFilter, "i");

            return regex.test(item.title);
          });
        }

        if (filters.length > 0) {
          function filterAlgotihm(item) {
            return item.ingredients.every((element) =>
              filters.includes(element)
            );
          }

          result = result.filter((item) => filterAlgotihm(item));
        }

        setRecipes(result);
        return;
      }

      setRecipes(recipeList);
    } catch (error) {
      console.error("Error fetching recipes: ", error);
    }
  };

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    fetchRecipes().then(() => setRefreshing(false));
  };

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {recipes.map((item, index) => {
          return <Lel item={item} key={index} />;
        })}
      </ScrollView>
    </>
  );
}
function Lel({ item }) {
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState("");
  const navigation = useNavigation();

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
  });

  const handlePostDetail = (item) => {
    navigation.navigate("PostDetails", { item: item });
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.99}
        style={styles.touchable}
        onPress={() => handlePostDetail(item)}
        key={item.id}
      >
        <View style={styles.postContainer}>
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Image
                style={styles.userImage}
                source={{
                  uri: image
                    ? image
                    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                }}
              />
              <Text style={styles.usernameText}>{username}</Text>
            </View>
          </View>
          <Text style={styles.postTitle}>{item.title}</Text>
          <Image style={styles.postImage} source={{ uri: item.image_url }} />
          <Text style={styles.postContext}>Tarif içeriği için tıklayın --{">"} </Text>
        </View>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  touchable: {
    marginVertical: 0,
  },
  postContainer: {
    borderBottomWidth: 0.2,
    borderBottomColor: "#716A62",
    backgroundColor: "#FCEFE1",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FCECDA",
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2.84,
    elevation: 5,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    resizeMode: "cover",
  },
  usernameText: {
    marginLeft: 10,
    fontWeight: "bold",
    color: "#3c3c3c",
  },
  postTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    marginHorizontal: 10,
  },
  postContext: {
    textAlign: "right",
    fontSize: 15,
    fontWeight: "normal",
    fontStyle: "italic",
    color:"grey",
    marginVertical: 10,
    marginHorizontal: 10,
  },
  postImage: {
    height: 250,
    width: "100%",
    resizeMode: "cover",
    marginVertical: 0,
  },
});
