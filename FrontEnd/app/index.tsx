// index.tsx
import { Text, View, StyleSheet, TextInput, Button, TouchableOpacity, Alert, Platform } from 'react-native';
import React, { useState } from 'react';
import Log_id from './tabs/Log_id';
import Log_PassWord from './tabs/Log_PassWord';
import { Link, useRouter } from 'expo-router';

export default function Index() {
 const router = useRouter();
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');

 const handleLogin = async () => {
   console.log('로그인 시도 - 입력값:', { email, password });

   try {
     const response = await fetch('http://127.0.0.1:8000/api/login/', {
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
     const data = await response.json();
     console.log('서버 응답 데이터:', data);

     if (response.ok) {
       try {
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

         // Alert가 작동하지 않을 경우를 대비한 fallback
         setTimeout(() => {
           if (!router.canGoBack()) {  // 페이지 이동이 아직 안 된 경우
             router.push('/Allergy');
           }
         }, 1000);

       } catch (routingError) {
         console.error('페이지 이동 중 오류 발생:', routingError);
         // 직접 라우팅 시도
         router.push('/Allergic');
       }
     } else {
       console.log('로그인 실패:', data.error);
       try {
         Alert.alert('오류', data.error || '로그인에 실패했습니다.');
       } catch (alertError) {
         console.error('알림 표시 실패:', alertError);
       }
     }
   } catch (error) {
     console.error('API 호출 에러:', error);
     try {
       Alert.alert('오류', '서버 연결에 실패했습니다.');
     } catch (alertError) {
       console.error('알림 표시 실패:', alertError);
     }
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