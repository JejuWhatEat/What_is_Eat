import { Text, View, StyleSheet, TextInput, Button, TouchableOpacity, Alert, Platform } from 'react-native';
import React, { useState } from 'react';
import Log_id from './tabs/Log_id';
import Log_PassWord from './tabs/Log_PassWord';
import { Link, useRouter } from 'expo-router';

declare global {
  var userEmail: string;
}
global.userEmail = '';

const API_URL = Platform.select({
  ios: 'http://127.0.0.1:8000/api/login/',
  android: 'http://172.18.102.72:8000/api/login/',
  default: 'http://127.0.0.1:8000/api/login/'
});

export default function Index() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      console.log('로그인 시도 - 입력값:', { email, password });
      console.log('API 요청 URL:', API_URL);
  
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
  
      console.log('서버 응답 상태:', response.status);
      
      // 응답을 한 번만 읽도록 수정
      const data = await response.json();
      console.log('서버 응답 데이터:', data);
  
      if (response.ok) {
        try {
          // 서버에서 받은 이메일로 저장
          global.userEmail = data.email;
          console.log('저장된 이메일:', global.userEmail);
          
          console.log('로그인 성공! 페이지 이동 시도');
          
          if (Platform.OS === 'web') {
            window.alert('로그인 되었습니다.');
            router.push('/Allergy');
          } else {
            Alert.alert(
              '로그인 성공',
              '로그인 되었습니다.',
              [
                {
                  text: '확인',
                  onPress: () => {
                    console.log('Allergy 페이지로 이동 시도');
                    router.push('/Allergy');
                    console.log('이동 명령 실행 완료');
                  },
                },
              ],
              { cancelable: false }
            );
          }
        } catch (error) {
          console.error('이메일 저장 또는 페이지 이동 중 오류:', error);
          router.push('/Allergy');
        }
      } else {
        console.log('로그인 실패:', data.error);
        Alert.alert('오류', data.error || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('API 호출 에러:', error);
      Alert.alert(
        '오류', 
        Platform.OS === 'ios' 
          ? 'iOS 서버 연결에 실패했습니다.' 
          : 'Android 서버 연결에 실패했습니다.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.loginname}>
        로그인
      </Text>
      <Text style={styles.Logcontainer}>아이디</Text>
      <Log_id
        value={email}
        onChangeText={setEmail}
      />
      <Text>비밀번호</Text>
      <Log_PassWord
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
      <Link href="./SignUp/sign_up" style={styles.sign_up_button}>
        회원가입 시작하기
      </Link>
      <Link href="./main" style={styles.sign_up_button}>
        Test
      </Link>
      <Button
        title="Google"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEBE98',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginname: {
    color: '#000',
    fontSize: 45,
    textAlign: "center",
    marginTop: -280,
    padding: 50,
  },
  Logcontainer: {
    padding: 0,
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