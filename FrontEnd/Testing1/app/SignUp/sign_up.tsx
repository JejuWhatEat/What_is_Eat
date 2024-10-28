import { Text, View, StyleSheet , Button,TouchableOpacity } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import Log_PassWord from '../tabs/Log_PassWord';
import Log_id from '../tabs/Log_id';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style = {styles.sign_up_name}>
        회원가입
      </Text>
      <Text style={styles.Logcontainer}>아이디</Text>
      <Log_id />
      <Text >비밀번호</Text>
      <Log_PassWord />
      <Text>비밀번호 확인</Text>
      <Log_PassWord />
      <TouchableOpacity
        style = {styles.button}>
        <Link href = "../Allergy" style = {styles.buttonText}>확인</Link>
      </TouchableOpacity>


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
  sign_up_name: {
    color : '#000',
    fontSize : 30,
    textAlign : "center",
    marginTop : -400,
    padding : 50,
  },
  Logcontainer : {
    paddingRight : 0,
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
  sign_up_button: {
    fontSize : 15,
    color: 'gray',
    marginTop : 20
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