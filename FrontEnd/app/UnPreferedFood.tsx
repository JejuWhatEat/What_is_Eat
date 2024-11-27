// UnPreferedFood.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Alert, 
  Platform,
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// API URL 상수들 정의
const BASE_URL = Platform.select({
   ios: 'http://127.0.0.1:8000',
   android: 'http://172.18.102.72:8000',
   default: 'http://127.0.0.1:8000'
});

const SAVE_URL = `${BASE_URL}/api/save-unpreferred-foods/`;
const IMAGES_URL = `${BASE_URL}/api/food-images/`;

const UnPreferedFood = () => {
  const router = useRouter();
  const [selectedCount, setSelectedCount] = useState(0);
  const [foodData, setFoodData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFoodImages();
  }, []);

  const fetchFoodImages = async () => {
    try {
      setIsLoading(true);
      console.log('이미지 요청 URL:', `${IMAGES_URL}?type=unpreferred`);
      
      const response = await fetch(`${IMAGES_URL}?type=unpreferred`);
      const data = await response.json();
      
      console.log('서버 응답:', data);

      if (data.status === 'success') {
        const formattedData = data.images.map(img => ({
          id: img.id.toString(),
          image_url: img.image_url,
          food_name: img.food_name,
          selected: false
        }));
        setFoodData(formattedData);
      } else {
        console.error('이미지 로드 실패:', data.message);
        Alert.alert('오류', '이미지를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('이미지 로드 중 에러:', error);
      Alert.alert('오류', '서버 연결에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

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

  const saveUnpreferredFoods = async () => {
    if (selectedCount === 0) {
      Alert.alert('알림', '최소 1개 이상의 음식을 선택해주세요.');
      return;
    }

    if (selectedCount > 5) {
      Alert.alert('알림', '최대 5개까지만 선택 가능합니다.');
      return;
    }

    const selectedFoods = foodData
      .filter(item => item.selected)
      .map(item => ({
        food_name: item.food_name
      }));

    try {
      console.log('비선호 음식 저장 요청:', selectedFoods);
      
      const response = await fetch(SAVE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unpreferred_foods: selectedFoods
        })
      });

      const data = await response.json();
      console.log('서버 응답:', data);

      if (response.ok) {
        Alert.alert(
          '성공',
          '싫어하는 음식이 저장되었습니다.',
          [
            {
              text: '확인',
              onPress: () => router.push('/main')
            }
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert('오류', data.error || '음식 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('API 호출 에러:', error);
      Alert.alert('오류', '서버 연결에 실패했습니다.');
    }
  };

  const filteredFoodData = searchText
    ? foodData.filter(item =>
        item.food_name.toLowerCase().includes(searchText.toLowerCase())
      )
    : foodData;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#FFE9AF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>싫어하는 음식</Text>
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
              source={{ uri: item.image_url }}
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
        <TouchableOpacity style={styles.button} onPress={saveUnpreferredFoods}>
          <Text style={styles.buttonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
 
 // 스타일 시트
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
 
 export default UnPreferedFood;