import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

// 타입 정의
interface FormData {
  has_allergies: boolean;
  is_vegan: boolean;
  gender: string;
  random_name_enabled: boolean;
  nickname: string;
}

interface ItemProps {
  id: string;
  title: string;
  formData: FormData;
  updateFormData: (key: keyof FormData, value: any) => void;
}

const DATA = [
  { id: '1', title: '알러지 유무' },
  { id: '2', title: '비건인가요 ?' },
  { id: '3', title: '성별' },
  { id: '4', title: '랜덤 이름' },
  { id: '5', title: '닉네임 설정' },
  { id: '6', title: '닉네임 입력' },
];

export let globalAllergies: string[] = [];

export const setGlobalAllergies = (allergies: string[]) => {
  globalAllergies = allergies;
};

const Item: React.FC<ItemProps> = ({ id, title, formData, updateFormData }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
    {id === '1' ? (
      <TouchableOpacity style={styles.arrowButton}>
        <Link href="./Allergic" style={styles.arrowText}>→</Link>
      </TouchableOpacity>
    ) : id === '2' ? (
      <View style={styles.yesNoButtons}>
        <TouchableOpacity
          style={[styles.yesButton, formData.is_vegan && styles.selectedButton]}
          onPress={() => updateFormData('is_vegan', true)}
        >
          <Text style={styles.buttonText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.noButton, !formData.is_vegan && styles.selectedButton]}
          onPress={() => updateFormData('is_vegan', false)}
        >
          <Text style={styles.buttonText}>No</Text>
        </TouchableOpacity>
      </View>
    ) : id === '3' ? (
      <View style={styles.genderButtons}>
        <TouchableOpacity
          style={[styles.genderButton_man, formData.gender === 'M' && styles.selectedButton]}
          onPress={() => updateFormData('gender', 'M')}
        >
          <Text style={styles.buttonText}>남성</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderButton_woman, formData.gender === 'F' && styles.selectedButton]}
          onPress={() => updateFormData('gender', 'F')}
        >
          <Text style={styles.buttonText}>여성</Text>
        </TouchableOpacity>
      </View>
    ) : id === '4' ? (
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>
          {formData.random_name_enabled ? 'On' : 'Off'}
        </Text>
        <Switch
          value={formData.random_name_enabled}
          onValueChange={(value) => updateFormData('random_name_enabled', value)}
        />
      </View>
    ) : id === '6' ? (
      <TextInput
        style={styles.textInput}
        placeholder="닉네임을 입력하세요"
        value={formData.nickname}
        onChangeText={(text) => updateFormData('nickname', text)}
      />
    ) : null}
  </View>
);

const Allergy = () => {
  const [formData, setFormData] = useState<FormData>({
    has_allergies: false,
    is_vegan: false,
    gender: '',
    random_name_enabled: false,
    nickname: '',
  });

  const updateFormData = (key: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleLogin = async () => {
    try {
      // 기본 유효성 검사 추가
      if (!formData.nickname) {
        Alert.alert('알림', '닉네임을 입력해주세요.');
        return;
      }

      const finalData = {
        ...formData,
        allergies: globalAllergies
      };

      console.log('전송할 데이터:', finalData);

      const response = await fetch('http://127.0.0.1:8000/api/save-profile/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData)
      });

      console.log('서버 응답:', response.status);  // 응답 상태 확인용
      
      const result = await response.json();
      
      if (response.ok) {
        Alert.alert('성공', '프로필이 성공적으로 저장되었습니다!');
        console.log('저장된 데이터:', result);
      } else {
        throw new Error(result.message || '서버 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('API 오류:', error);
      Alert.alert('저장 실패', '서버와의 연결에 실패했습니다. 다시 시도해주세요.');
    }
};

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={DATA}
          renderItem={({item}) => (
            <Item
              id={item.id}
              title={item.title}
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          keyExtractor={item => item.id}
        />
        <TouchableOpacity 
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#9CABC2',
    padding: 20,
    width: 300,
    marginHorizontal: 10,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  arrowButton: {
    backgroundColor: '#FFE9AF',
    borderRadius: 20,
    padding: 5,
    width: 40,
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 20,
    color: '#fff',
  },
  yesNoButtons: {
    flexDirection: 'row',
  },
  yesButton: {
    backgroundColor: '#32CD32',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  noButton: {
    backgroundColor: '#FF6347',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  genderButtons: {
    flexDirection: 'row',
  },
  genderButton_man: {
    backgroundColor: '#0000FF',
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  genderButton_woman: {
    backgroundColor: '#FF0000',
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    marginRight: 10,
    fontSize: 16,
    color: '#FFFFFF',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    padding: 10,
    width: 200,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  button: {
    width: 200,
    height: 40,
    backgroundColor: "#FFE9AF",
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedButton: {
    opacity: 0.8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});

export default Allergy;
