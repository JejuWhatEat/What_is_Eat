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
  ActivityIndicator,
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const BASE_URL = Platform.select({
   ios: 'http://127.0.0.1:8000',
   android: 'http://172.18.102.72:8000',
   default: 'http://127.0.0.1:8000'
});

const SAVE_URL = `${BASE_URL}/api/save-preferred-foods/`;
const IMAGES_URL = `${BASE_URL}/api/food-images/`;

const { width: screenWidth } = Dimensions.get('window');
const numColumns = 3;
const itemSpacing = 10;
const itemWidth = (screenWidth - (itemSpacing * (numColumns + 1))) / numColumns;

const PreferedFood = () => {
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
      const response = await fetch(IMAGES_URL);  // type 쿼리 제거
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

    setFoodData(prevData => 
      prevData.map(item => {
        if (item.id === id) {
          const newSelected = !item.selected;
          setSelectedCount(prev => newSelected ? prev + 1 : prev - 1);
          return { ...item, selected: newSelected };
        }
        return item;
      })
    );
  };

  const savePreferredFoods = async () => {  // 함수 이름만 다름
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
      console.log('선호 음식 저장 요청:', selectedFoods);  // 로그 메시지만 다름
      
      const response = await fetch(SAVE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferred_foods: selectedFoods  // 이 부분만 다름
        })
      });

      const data = await response.json();
      console.log('서버 응답:', data);

      if (response.ok) {
        Alert.alert(
          '성공',
          '좋아하는 음식이 저장되었습니다.',  // 메시지만 다름
          [
            {
              text: '확인',
              onPress: () => router.push('/UnPreferedFood')  // 여기만 다름
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

  const renderFoodItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.foodItem, item.selected && styles.selectedItem]}
      onPress={() => toggleSelection(item.id)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.image_url }}
        style={styles.foodImage}
        resizeMode="cover"
      />
      {item.selected && (
        <View style={styles.checkMark}>
          <Text style={styles.checkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#FFE9AF" />
      </SafeAreaView>
    );
  }

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
        <Text style={styles.counterText}>({selectedCount}/5)</Text>
      </View>

      <FlatList
        data={filteredFoodData}
        renderItem={renderFoodItem}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.foodList}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.back()}
        >
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