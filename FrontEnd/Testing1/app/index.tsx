import { Text, View, StyleSheet , TextInput, Button,TouchableOpacity } from 'react-native';
import React, {useState } from 'react';
import Log_id from './tabs/Log_id';
import Log_PassWord from './tabs/Log_PassWord'

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style = {styles.loginname}>
        로그인
      </Text>
      <Text style={styles.Logcontainer}>아이디</Text>
      <Log_id />
      <Text>비밀번호</Text>
      <Log_PassWord />
      <TouchableOpacity
        style = {styles.button}>
        <Text style = {styles.buttonText}> 로그인</Text>
      </TouchableOpacity>
      <Button
        title = "Google"
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEBE98',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginname: {
    color : '#000',
    fontSize : 45,
    textAlign : "center",
    marginTop : -400,
    padding : 50,
  },
  Logcontainer : {
    padding : 0,
  },
  text: {
    color: '#fff',
    fontSize : 44,
    textAlign : "right" ,
  },
  button: {
    width : 200,
    height : 40,
    backgroundColor: "#FFE9AF",
    borderRadius : 100,
  },
  buttonText: {
    color : '#fff',
    fontSize: 20,
    textAlign : "center",
    marginTop : 8
  },
  input: {
    height : 40,
    width : 200,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
});