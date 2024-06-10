import {
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Keyboard, 
} from "react-native";
import React, { useState, useEffect } from "react";
import SignUpStyles from "../styles/SignUpStyles";
import { auth,firebase } from "../../firebase";
import { Link, useNavigation } from "@react-navigation/native";

export default function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false); 
  const navigation = useNavigation();
  const windowWidth = Dimensions.get("window").width;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      Alert.alert(
        "Şifreler Eşleşmiyor",
        "Girilen şifreler eşleşmiyor. Lütfen tekrar deneyin.",
        [{ text: "Tamam", onPress: () => console.log("OK Pressed") }]
      );
      return;
    }

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        const userId = user.uid;
        console.log("User", user.email);
        firebase.firestore().collection("usernames").doc(userId).set({
          username: username,
        })
        .then(()=>console.log("kullanıcı adı kaydedildi")).catch((error)=>console.log("error saving username:",error));
        Alert.alert(
          "Kayıt Başarılı",
          "Başarılı bir biçimde kaydoldunuz.",
          [{ text: "Tamam", onPress: () => console.log("OK Pressed") }]
        );
        navigation.navigate("Login");
      })
      .catch((error) => {
        console.log("Error code:", error.code);
        console.log("Error message:", error.message);
        
        let errorMessage = "Bir hata oluştu. Lütfen tekrar deneyin.";
  
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "Bu e-posta adresi zaten kullanılıyor. Lütfen başka bir e-posta deneyin.";
            break;
          case "auth/invalid-email":
            errorMessage = "Geçerli bir e-posta adresi girin.";
            break;
          case "auth/operation-not-allowed":
            errorMessage = "E-posta ile kayıt olma şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.";
            break;
          case "auth/weak-password":
            errorMessage = "Şifreniz çok zayıf. Lütfen daha güçlü bir şifre seçin.";
            break;
          case "auth/missing-password":
            errorMessage = "Bir şifre oluşturunuz."
            break;
          default:
            errorMessage = error.message; 
        }
        Alert.alert("Hata:", errorMessage);
      });
  };

  return (
    <KeyboardAvoidingView style={SignUpStyles.container} behavior="padding">
      <Image
        source={require("../assets/logo.png")}
        style={{
          resizeMode: "contain",
          height: 65,
          marginBottom: 20,
        }}
      />
      <View style={SignUpStyles.SignUpSection}>
        <TextInput
          autoCapitalize="none"
          style={SignUpStyles.input}
          placeholder="İsim Soyisim"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />

        <TextInput
          autoCapitalize="none"
          style={SignUpStyles.input}
          placeholder="E-Posta"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <TextInput
          autoCapitalize="none"
          style={SignUpStyles.input}
          placeholder="Şifre"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <TextInput
          autoCapitalize="none"
          style={SignUpStyles.input}
          placeholder="Şifrenizi Onaylayın"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />

        <View style={SignUpStyles.buttonContainer}>
          <TouchableOpacity onPress={handleSignUp} style={SignUpStyles.button}>
            <Text style={SignUpStyles.buttonText}>Kaydol</Text>
          </TouchableOpacity>
        </View>
      </View>
      {!isKeyboardVisible && ( 
        <View style={SignUpStyles.createSection}>
          <View
            style={{
              flex: 1,
              height: 1,
              width: windowWidth,
              backgroundColor: "white",
              marginBottom: 10,
            }}
          />
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <View style={{ alignItems: "center" }}>
              <Text style={SignUpStyles.outLineButtonText}>Zaten Üye Misin?</Text>
              <Link to={{ screen: "Login" }}>
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                    borderBottomWidth: 0,
                  }}
                >
                  Giriş Yap
                </Text>
              </Link>
            </View>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
