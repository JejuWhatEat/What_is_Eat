
// SignUp/sign_up.tsx
import { Text, View, StyleSheet, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Log_id from '../tabs/Log_id';
import Log_PassWord from '../tabs/Log_PassWord'
import React, { useState } from 'react';

export default function Index() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // DB 저장을 위한 함수 추가
  const handleSignUp = async () => {
    // 비밀번호 확인
    if (password !== confirmPassword) {
      console.log("비밀번호 불일치");
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      console.log("회원가입 시도:", { email, password });

      const response = await fetch('http://127.0.0.1:8000/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();
      console.log("서버 응답:", data);  // 서버 응답 출력

      if (response.ok) {
        console.log("회원가입 성공!");
        Alert.alert('성공', '회원가입이 완료되었습니다.', [
          {
            text: '확인',
            onPress: () => router.replace('../Allergy')

          }
        ]);
      } else {
        console.log("회원가입 실패:", data.error);
        Alert.alert('오류', data.error || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error("서버 연결 오류:", error);
      Alert.alert('오류', '서버 연결에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sign_up_name}>회원가입</Text>

      <Text style={styles.Logcontainer}>아이디</Text>
      <Log_id
        value={email}  // props 추가
        onChangeText={(text) => {
          console.log("이메일 입력:", text);
          setEmail(text);
        }}
      />

      <Text>비밀번호</Text>
      <Log_PassWord
        value={password}  // props 추가
        onChangeText={(text) => {
          console.log("비밀번호 입력:", text);
          setPassword(text);
        }}
      />

      <Text>비밀번호 확인</Text>
      <Log_PassWord
        value={confirmPassword}  // props 추가
        onChangeText={(text) => {
          console.log("비밀번호 확인 입력:", text);
          setConfirmPassword(text);
        }}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>확인</Text>
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

    color: '#000',
    fontSize: 30,
    textAlign: "center",
    marginTop: -400,
    padding: 50,
  },
  Logcontainer: {
    paddingRight: 0,
  },
  text: {
    color: '#fff',
    fontSize: 44,
    textAlign: "right",
  },
  button: {
    width: 200,
    height: 40,
    backgroundColor: "#FFE9AF",
    borderRadius: 100,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: "center",
    marginTop: 8
  },
  sign_up_button: {
    fontSize: 15,
    color: 'gray',
    marginTop: 20
  },
  input: {
    height: 40,
    width: 200,

    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
});