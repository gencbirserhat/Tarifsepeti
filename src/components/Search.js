import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { ingredientsList } from "../ingredientData/ingredientsList";
import { Checkbox } from "react-native-paper";

export default function Search({
  setFilters: setSelectedOptions,
  filters: selectedOptions,
  textFilter,
  setTextFilter,
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [filteredIngredients, setFilteredIngredients] = useState(ingredientsList);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const toggleOption = (option) => {
    const index = selectedOptions.indexOf(option);
    if (index !== -1) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
    setTextFilter('');
  };

  const renderOptionItem = (item, index) => (
    <TouchableOpacity
      key={index}
      style={{ flexDirection: "row", alignItems: "center", paddingVertical: 5 }}
      onPress={() => toggleOption(item)}
    >
      <Checkbox
        status={selectedOptions.includes(item) ? "checked" : "unchecked"}
        onPress={() => toggleOption(item)}
        color="white"
      />
      <Text style={styles.searchContainerText}>{item}</Text>
    </TouchableOpacity>
  );

  const handleTextFilterChange = (text) => {
    setTextFilter(text);
    if (showOptions) {
      const filteredList = ingredientsList.filter((ingredient) =>
        ingredient.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredIngredients(filteredList);
    }
  };

  const clearFilters = () => {
    setTextFilter("");
    setSelectedOptions([]);
    setFilteredIngredients(ingredientsList);
  };

  useEffect(() => {
    if (!showOptions) {
      setFilteredIngredients(ingredientsList);
    }
  }, [showOptions]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <AntDesign style={styles.iconStyle} size={30} color="black" />
        <TextInput
          style={styles.inputStyle}
          placeholder={showOptions ? "Malzeme ara..." : "Tarif ara..."}
          autoCapitalize="none"
          value={textFilter}
          onChangeText={handleTextFilterChange}
        />
        {textFilter !== "" || selectedOptions.length > 0 ? (
          <TouchableOpacity onPress={clearFilters}>
            <AntDesign
              style={styles.iconStyle3}
              name="closecircle"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity onPress={toggleOptions}>
          <AntDesign
            style={styles.iconStyle2}
            name={showOptions ? "up" : "down"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>
      {showOptions && (
        <View>
          <TouchableOpacity
            style={styles.overlayBackground}
            onPress={() => setShowOptions(false)}
          />
          <ScrollView style={styles.dropdownContainer}>
            {filteredIngredients.map((a, index) => {
              return renderOptionItem(a, index);
            })}
            <View style={{ padding: 10, color: "white" }} />
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EE4F35",
    paddingTop: 10,
  },
  searchContainerText: {
    color: "white",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FCECDA",
    marginHorizontal: 10,
    marginBottom: 10,
    height: 40,
    borderRadius: 7,
  },
  iconStyle: {
    marginHorizontal: 15,
  },
  inputStyle: {
    flex: 1,
    fontSize: 20,
    marginLeft: -10,
  },
  iconStyle2: {
    marginRight: 10,
  },
  iconStyle3: {
    marginRight: 10,
  },
  dropdownContainer: {
    backgroundColor: "#EE4F35",
    color: "white",
    elevation: 5,
    marginTop: -10,
    padding: 20,
    zIndex: 100,
    overflow: "scroll",
    maxHeight: 300,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  closeButtonText: {
    padding: 10,
    textAlign: "center",
    backgroundColor: "lightgray",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    borderRadius: 10,
  },
});
