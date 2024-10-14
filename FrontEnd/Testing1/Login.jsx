import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useState } from "react";
import { authService } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { updateProfile } from "firebase/auth";
import React from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [newAccount, setNewAccount] = useState();
  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  };

  const SignUp = () => {
    if (newAccount) {
      createUserWithEmailAndPassword(authService, email, password)
        .then(() => {
          updateProfile(authService.currentUser, {
            displayName: displayName,
          });
        })
        .catch((error) => alert(error.message));
      setEmail("");
      setPassword("");
      setDisplayName("");
    } else {
      signInWithEmailAndPassword(authService, email, password).catch((error) =>
        alert(error.message)
      );
      console.log(authService);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.container}>
        <View style={styles.imageview}>
          <Image
            source={require("../assets/todologo.png")}
            style={styles.logoimage}
          />
        </View>
        <View style={styles.inputWrapper}>
          {newAccount ? (
            <TextInput
              placeholder="User NickName"
              style={styles.input}
              autoCapitalize="none"
              value={displayName}
              onChangeText={(text) => setDisplayName(text)}
              autoCorrect={false}
            />
          ) : null}
          <TextInput
            placeholder="User Email"
            style={styles.input}
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => setEmail(text)}
            autoCorrect={false}
          />
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
            textContentType="password"
            placeholder="User Password"
            style={styles.input}
          />
        </View>
        <View style={styles.imageview}></View>
        <View style={styles.tabview}>
          <TouchableOpacity style={styles.tab} onPress={SignUp}>
            <Text style={styles.tabText}>
              {newAccount ? "회원가입" : "로그인"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Google</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={styles.tab2} onPress={toggleAccount}>
            <Text style={styles.tabText2}>
              {newAccount ? "로그인 하시겠습니까?" : "회원가입 하시겠습니까?"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={"transparent"}
        translucent={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  header: {
    marginTop: 10,
    fontSize: 50,
    textAlign: "center",
  },
  imageview: {
    flexDirection: "row",
  },

  logoimage: {
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },

  inputWrapper: {
    paddingVertical: 15,
    marginTop: 30,
    marginBottom: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 15,
  },

  input: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
  },
  tabview: {
    flexDirection: "row",
  },
  tab: {
    marginTop: 30,
    backgroundColor: "black",
    paddingHorizontal: 10,
    paddingVertical: 15,
    width: "30%",
    alignItems: "center",
    borderRadius: 50,
    margin: 37,
  },
  tab2: {
    marginTop: 20,
    borderColor: "black",
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    borderRadius: 50,
  },
  tabText: {
    fontWeight: "600",
    fontSize: 17,
    color: "white",
  },
  tabText2: {
    fontWeight: "600",
    fontSize: 20,
    color: "black",
  },
});
