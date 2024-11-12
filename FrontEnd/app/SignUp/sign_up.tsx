import { Text, View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function Index() {
  // 상태 관리
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // `useRouter` 훅을 사용하여 페이지 이동
  const router = useRouter();

  // 입력 값 검증 함수
  const handleSubmit = () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert('알림', '모든 필드를 채워주세요.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }

    router.push('/Allergy');  
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sign_up_name}>회원가입</Text>
      
      <Text style={styles.Logcontainer}>아이디</Text>
      <TextInput
        style={styles.input}
        placeholder="아이디를 입력하세요"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.Logcontainer}>비밀번호</Text>
      <TextInput
        style={styles.input}
        placeholder="비밀번호를 입력하세요"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.Logcontainer}>비밀번호 확인</Text>
      <TextInput
        style={styles.input}
        placeholder="비밀번호를 확인하세요"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
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
    paddingHorizontal: 20,  // 화면 크기 조정을 위한 패딩
  },
  sign_up_name: {
    color: '#000',
    fontSize: 30,
    textAlign: 'center',
    margin: 50,  // 제목과 입력란 간의 간격 조정
  },
  Logcontainer: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  button: {
    width: 200,
    height: 40,
    backgroundColor: "#FFE9AF",
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#000',
    fontSize: 20,
  },
  input: {
    height: 40,
    width: 250,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20, // 각 입력란 사이 간격
  },
});