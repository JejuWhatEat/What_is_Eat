// Allergy.tsx
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
 Platform
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';


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
 const router = useRouter();
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

 const handleSubmit = async () => {
  if (!formData.nickname) {
    Alert.alert('알림', '닉네임을 입력해주세요.');
    return;
  }

  const finalData = {
    user_info: {
      nickname: formData.nickname,
      is_vegan: formData.is_vegan,
      gender: formData.gender,
      random_name: formData.random_name_enabled
    },
    allergies: globalAllergies
  };

  try {
    const baseUrl = Platform.select({
      android: 'http://10.0.2.2:8000',
      ios: 'http://localhost:8000',
      default: 'http://127.0.0.1:8000'
    });

    const response = await fetch(`${baseUrl}/api/save-profile/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalData)
    });

    if (response.ok) {
      if (Platform.OS === 'web') {
        window.alert('프로필이 저장되었습니다.');
        router.push('/PreferedFood');
      } else {
        Alert.alert(
          '성공',
          '프로필이 저장되었습니다.',
          [
            {
              text: '확인',
              onPress: () => {
                console.log('PreferedFood 페이지로 이동 시도');
                router.push('/PreferedFood');
              }
            }
          ],
          { cancelable: false }
        );
      }

      // fallback
      setTimeout(() => {
        if (!router.canGoBack()) {
          router.push('/PreferedFood');
        }
      }, 1000);

    } else {
      throw new Error('서버 응답 오류');
    }
  } catch (error) {
    console.error('API 오류:', error);
    Alert.alert('오류', '프로필 저장에 실패했습니다.');
  }
};

 return (
   <SafeAreaProvider>
     <SafeAreaView style={styles.container}>
       <FlatList
         data={DATA}
         renderItem={({ item }) => (
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
         onPress={handleSubmit}
       >
         <Text style={styles.buttonText}>확인</Text>
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
   backgroundColor : '#FEBE98'
 },
 item: {
   backgroundColor: '#F1B198',
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
   width: 170,
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

export default Allergy;``