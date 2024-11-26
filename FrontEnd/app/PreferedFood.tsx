// PreferedFood.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const getImageById = (id) => {
 switch (id) {
   case '1':
     return require('./images/image1.jpeg');
   case '2':
     return require('./images/image2.jpeg');
   case '3':
     return require('./images/image3.jpeg');
   case '4':
     return require('./images/image4.jpeg');
   case '5':
     return require('./images/image5.jpeg');
   case '6':
     return require('./images/image6.jpeg');
   case '7':
     return require('./images/image7.jpeg');
   case '8':
     return require('./images/image8.jpeg');
   case '9':
     return require('./images/image9.jpeg');
   case '10':
     return require('./images/image10.jpeg');
   case '11':
     return require('./images/image11.jpeg');
   case '12':
     return require('./images/image12.jpeg');
   case '13':
     return require('./images/image13.jpeg');
   case '14':
     return require('./images/image14.jpeg');
   case '15':
     return require('./images/image15.jpeg');
   case '16':
     return require('./images/image16.jpeg');
 }
};

const FOOD_DATA = Array.from({ length: 16 }, (_, index) => ({
 id: `${index + 1}`,
 image: getImageById(`${index + 1}`),
 selected: false,
}));

const PreferedFood = () => {
 const router = useRouter();
 const [selectedCount, setSelectedCount] = useState(0);
 const [foodData, setFoodData] = useState(FOOD_DATA);
 const [searchText, setSearchText] = useState('');

 const toggleSelection = (id) => {
   if (selectedCount >= 5 && !foodData.find(item => item.id === id).selected) {
     Alert.alert('알림', '최대 5개까지만 선택할 수 있습니다.');
     return;
   }

   const updatedData = foodData.map((item) => {
     if (item.id === id) {
       const isSelected = !item.selected;
       setSelectedCount((prevCount) =>
         isSelected ? prevCount + 1 : prevCount - 1
       );
       return { ...item, selected: isSelected };
     }
     return item;
   });
   setFoodData(updatedData);
 };

 const savePreferredFoods = async () => {
   if (selectedCount === 0) {
     Alert.alert('알림', '최소 1개 이상의 음식을 선택해주세요.');
     return;
   }

   if (selectedCount > 5) {
     Alert.alert('알림', '최대 5개까지만 선택 가능합니다.');
     return;
   }

   const selectedFoods = foodData.filter(item => item.selected).map(item => ({
     food_name: `food${item.id}`
   }));

   try {
     const response = await fetch('http://127.0.0.1:8000/api/save-preferred-foods/', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         preferred_foods: selectedFoods
       })
     });

     console.log('서버 응답 상태:', response.status);
     const data = await response.json();
     console.log('서버 응답 데이터:', data);

     if (response.ok) {
       try {
         console.log('선호 음식 저장 성공! 페이지 이동 시도');
         
         if (Platform.OS === 'web') {
           window.alert('선호하는 음식이 저장되었습니다.');
           router.push('/UnPreferedFood');
         } else {
           Alert.alert(
             '성공',
             '선호하는 음식이 저장되었습니다.',
             [
               {
                 text: '확인',
                 onPress: () => {
                   console.log('UnPreferedFood 페이지로 이동 시도');
                   router.push('/UnPreferedFood');
                   console.log('이동 명령 실행 완료');
                 },
               },
             ],
             { cancelable: false }
           );
         }

         // fallback
         setTimeout(() => {
           if (!router.canGoBack()) {
             router.push('/UnPreferedFood');
           }
         }, 1000);

       } catch (routingError) {
         console.error('페이지 이동 중 오류 발생:', routingError);
         // 직접 라우팅 시도
         router.push('/UnPreferedFood');
       }
     } else {
       console.log('저장 실패:', data.error);
       Alert.alert('오류', data.error || '선호 음식 저장에 실패했습니다.');
     }
   } catch (error) {
     console.error('API 호출 에러:', error);
     Alert.alert('오류', '서버 연결에 실패했습니다.');
   }
 };

 const filteredFoodData = searchText
   ? foodData.filter(item =>
     `food${item.id}`.toLowerCase().includes(searchText.toLowerCase())
   )
   : foodData;

 return (
   <SafeAreaView style={styles.container}>
     <Text style={styles.title}>좋아하는 음식</Text>
     <View style={styles.searchContainer}>
       <TextInput
         style={styles.searchInput}
         placeholder="음식을 검색하세요"
         value={searchText}
         onChangeText={setSearchText}
       />
       <TouchableOpacity style={styles.searchIcon}>
         <Text>🔍</Text>
       </TouchableOpacity>
       <Text style={styles.counterText}>({selectedCount}/5)</Text>
     </View>
     <FlatList
       data={filteredFoodData}
       keyExtractor={(item) => item.id}
       numColumns={3}
       renderItem={({ item }) => (
         <TouchableOpacity
           style={[styles.foodItem, item.selected && styles.selectedItem]}
           onPress={() => toggleSelection(item.id)}
         >
           <Image
             source={item.image}
             style={styles.foodImage}
             resizeMode="cover"
           />
           {item.selected && (
             <View style={styles.checkMark}>
               <Text style={styles.checkText}>✔</Text>
             </View>
           )}
         </TouchableOpacity>
       )}
       contentContainerStyle={styles.foodList}
     />
     <View style={styles.buttonContainer}>
       <TouchableOpacity style={styles.button} onPress={() => router.back()}>
         <Text style={styles.buttonText}>뒤로가기</Text>
       </TouchableOpacity>
       <TouchableOpacity
         style={styles.button}
         onPress={savePreferredFoods}
       >
         <Text style={styles.buttonText}>다음</Text>
       </TouchableOpacity>
     </View>
   </SafeAreaView>
 );

};

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#FEBE98',
   alignItems: 'center',
   paddingTop: 20,
 },
 title: {
   fontSize: 24,
   fontWeight: 'bold',
   marginBottom: 20,
 },
 searchContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 20,
   backgroundColor: '#fff',
   borderRadius: 10,
   paddingHorizontal: 10,
   width: '80%',
   justifyContent: 'space-between',
 },
 searchInput: {
   flex: 1,
   paddingVertical: 8,
 },
 searchIcon: {
   marginLeft: 10,
 },
 counterText: {
   marginLeft: 10,
   fontSize: 16,
 },
 foodList: {
   alignItems: 'center',
 },
 foodItem: {
   width: 100,
   height: 100,
   margin: 5,
   borderRadius: 10,
   overflow: 'hidden',
   position: 'relative',
 },
 selectedItem: {
   opacity: 0.6,
 },
 foodImage: {
   width: '100%',
   height: '100%',
 },
 checkMark: {
   position: 'absolute',
   top: 5,
   right: 5,
   backgroundColor: 'rgba(0, 0, 0, 0.5)',
   borderRadius: 15,
   width: 30,
   height: 30,
   justifyContent: 'center',
   alignItems: 'center',
 },
 checkText: {
   color: '#fff',
   fontSize: 18,
 },
 buttonContainer: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   width: '80%',
   marginTop: 20,
   marginBottom: 20,
 },
 button: {
   backgroundColor: '#FFE9AF',
   paddingVertical: 10,
   paddingHorizontal: 30,
   borderRadius: 20,
   marginHorizontal: 10,
 },
 buttonText: {
   fontSize: 16,
   color: '#000',
 },
});

export default PreferedFood;