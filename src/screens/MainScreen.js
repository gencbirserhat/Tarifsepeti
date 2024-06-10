import {
  StyleSheet,
  View,
  Animated,
  BackHandler,
  Alert,
} from "react-native";
import React, { useState, useLayoutEffect, useRef} from "react";
import Search from "../components/Search";
import Posts from "../components/Posts";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

export default function MainScreen() {
  const [filters, setFilters] = useState([]);
  const [textFilter, setTextFilter] = useState("");
  const [isSearchVisible, setSearchVisible] = useState(false);

  const route = useRoute();
  const navigation = useNavigation();

  const searchSlideAnim = useRef(new Animated.Value(-100)).current;
  const postsSlideAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        Alert.alert(
          "Çıkmak Üzeresiniz!",
          "Uygulamadan çıkmak istediğinize emin misiniz?",
          [
            {
              text: "Hayır",
              onPress: () => null,
              style: "cancel",
            },
            { text: "Evet", onPress: () => BackHandler.exitApp() },
          ]
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [])
  );

  useLayoutEffect(() => {
    if (route.params?.toggleSearch) {
      setSearchVisible((prevState) => !prevState);
      navigation.setParams({ toggleSearch: false });
    }
  }, [route.params?.toggleSearch]);

  useLayoutEffect(() => {
    Animated.parallel([
      Animated.timing(searchSlideAnim, {
        toValue: isSearchVisible ? 0 : -100,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(postsSlideAnim, {
        toValue: isSearchVisible ? 100 : 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isSearchVisible]);

  useLayoutEffect(() => {
    navigation.setParams({ isSearchVisible });
  }, [isSearchVisible]);


  const closeSearch = () => {
    setSearchVisible(false);
  };

  return (
    <View style={{ flex: 1 , backgroundColor: "#FCECDA"
    }}>
      <Animated.View
        style={{
          ...customStyles.searchContainer,
          transform: [{ translateY: searchSlideAnim }],
        }}
      >
        {isSearchVisible && (
          <Search
            setFilters={setFilters}
            filters={filters}
            setTextFilter={setTextFilter}
            textFilter={textFilter}
            onClose={closeSearch} 
          />
        )}
      </Animated.View>
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateY: postsSlideAnim }],
          marginTop: isSearchVisible ? -100 : 0,
        }}
      >
        <Posts filters={filters} textFilter={textFilter} />
      </Animated.View>
    </View>
  );
}

const customStyles = StyleSheet.create({
  button: {
    backgroundColor: "orange",
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
    flex: 1,
  },
  buttomButtons: {
    marginTop: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  searchContainer: {
    width: "100%",
    top: 0,
    left: 0,
  },
});
