// Allergic.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { setGlobalAllergies } from './Allergy';

// API URL 상수 정의
const API_URL = Platform.select({
    ios: 'http://127.0.0.1:8000/api/save-allergies/',
    android: 'http://172.18.102.72:8000/api/save-allergies/',
    default: 'http://127.0.0.1:8000/api/save-allergies/'
});

const ALLERGIES = [
  '갑각류', '복숭아', '땅콩', '달걀',
  '견과', '밀', '생선', '우유',
  '조개', '콩', '호두', '잣'
];

const AllergySelection = () => {
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const router = useRouter();

  const toggleAllergy = (allergy: string) => {
    if (selectedAllergies.includes(allergy)) {
      setSelectedAllergies(selectedAllergies.filter(a => a !== allergy));
    } else {
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
  };

  const handleConfirm = async () => {
    try {
      console.log('API 요청 URL:', API_URL);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          allergies: selectedAllergies
        })
      });

      console.log('서버 응답 상태:', response.status);
      const data = await response.json();
      console.log('서버 응답 데이터:', data);

      if (response.ok) {
        setGlobalAllergies(selectedAllergies);
        
        if (Platform.OS === 'web') {
          window.alert('알러지 정보가 저장되었습니다.');
          router.back();
        } else {
          Alert.alert(
            '성공',
            '알러지 정보가 저장되었습니다.',
            [
              {
                text: '확인',
                onPress: () => {
                  console.log('Allergy 페이지로 돌아가기 시도');
                  router.back();
                }
              }
            ],
            { cancelable: false }
          );
        }

        setTimeout(() => {
          if (!router.canGoBack()) {
            router.back();
          }
        }, 1000);

      } else {
        console.log('저장 실패:', data.error);
        Alert.alert('오류', data.error || '알러지 정보 저장에 실패했습니다.');
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

  // ... return 부분은 그대로 유지 ...

 return (
   <SafeAreaView style={styles.container}>
     <Text style={styles.title}>알레르기를 선택하세요.</Text>
     <ScrollView contentContainerStyle={styles.allergyContainer}>
       {ALLERGIES.map((allergy, index) => (
         <TouchableOpacity
           key={index}
           style={[
             styles.allergyButton,
             selectedAllergies.includes(allergy) && styles.selectedButton
           ]}
           onPress={() => toggleAllergy(allergy)}
         >
           <Text style={[
             styles.allergyText,
             selectedAllergies.includes(allergy) && styles.selectedAllergyText
           ]}>
             {allergy}
           </Text>
         </TouchableOpacity>
       ))}
     </ScrollView>
     <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
       <Text style={styles.confirmText}>확인</Text>
     </TouchableOpacity>
   </SafeAreaView>
 );


};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEBE98',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4A4A4A',
  },
  allergyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
  },
  allergyButton: {
    backgroundColor: '#D3D3D3',
    padding: 10,
    margin: 5,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#8B4513',
  },
  allergyText: {
    color: '#333',
    fontSize: 16,
  },
  selectedAllergyText: {
    color: '#FFF',
  },
  confirmButton: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
    borderColor: '#FF0000',
    borderWidth: 1,
  },
  confirmText: {
    color: '#FF0000',
    fontSize: 18,
    fontWeight: 'bold',
  },

  confirmationContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 10,
  },
  selectedAllergies: {
    fontSize: 16,
    color: '#333',
  },
});

export default AllergySelection;
