// UnPreferedFood.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// 최대 선택 가능한 음식 수를 상수로 정의
const MAX_SELECTION = 10;

// 이미지 ID에 따라 이미지를 반환하는 함수
const getImageById = (id) => {
  switch (id) {
    case '1':
      return require('./images/image21.jpeg');
    case '2':
      return require('./images/image22.jpeg');
    case '3':
      return require('./images/image23.jpeg');
    case '4':
      return require('./images/image24.jpeg');
    case '5':
      return require('./images/image25.jpeg');
    case '6':
      return require('./images/image6.jpeg');
    case '7':
      return require('./images/image26.jpeg');
    case '8':
      return require('./images/image27.jpeg');
    case '9':
      return require('./images/image28.jpeg');
    case '10':
      return require('./images/image10.jpeg');
    case '11':
      return require('./images/image11.jpeg');
    case '12':
      return require('./images/image12.jpeg');
    case '13':
      return require('./images/image1.jpeg');
    case '14':
      return require('./images/image14.jpeg');
    case '15':
      return require('./images/image15.jpeg');
    case '16':
      return require('./images/image2.jpeg');

  }
};

// 초기 음식 데이터 생성
const FOOD_DATA = Array.from({ length: 16 }, (_, index) => ({
  id: `${index + 1}`,
  image: getImageById(`${index + 1}`),
  selected: false,
}));

const UnPreferedFood = () => {
  const router = useRouter();
  const [selectedCount, setSelectedCount] = useState(0);
  const [foodData, setFoodData] = useState(FOOD_DATA);
  const [searchText, setSearchText] = useState('');

  // 음식 선택/해제 함수
  const toggleSelection = (id) => {
    const updatedData = foodData.map((item) => {
      if (item.id === id) {
        const isSelected = !item.selected;
        if (isSelected) {
          if (selectedCount < MAX_SELECTION) {
            setSelectedCount((prevCount) => prevCount + 1);
          } else {
            Alert.alert('알림', `최대 ${MAX_SELECTION}개까지 선택할 수 있습니다.`);
            return item; // 선택 제한 초과 시 변경하지 않음
          }
        } else {
          setSelectedCount((prevCount) => prevCount - 1);
        }
        return { ...item, selected: isSelected };
      }
      return item;
    });

    setFoodData(updatedData);
  };

  // 선택된 음식 저장 함수
  const saveUnpreferredFoods = async () => {
    if (selectedCount === 0) {
      Alert.alert('알림', '최소 1개 이상의 음식을 선택해주세요.');
      return;
    }

    if (selectedCount > MAX_SELECTION) {
      Alert.alert('알림', `최대 ${MAX_SELECTION}개까지만 선택 가능합니다.`);
      return;
    }

    const selectedFoods = foodData
      .filter(item => item.selected)
      .map(item => ({
        food_name: `food${item.id}`
      }));

    try {
      const response = await fetch('http://127.0.0.1:8000/api/save-unpreferred-foods/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unpreferred_foods: selectedFoods
        })
      });

      console.log('서버 응답 상태:', response.status);
      const data = await response.json();
      console.log('서버 응답 데이터:', data);

      if (response.ok) {
        try {
          console.log('싫어하는 음식 저장 성공! 페이지 이동 시도');

          if (Platform.OS === 'web') {
            window.alert('싫어하는 음식이 저장되었습니다.');
            router.push('/main');
          } else {
            Alert.alert(
              '성공',
              '싫어하는 음식이 저장되었습니다.',
              [
                {
                  text: '확인',
                  onPress: () => {
                    console.log('main 페이지로 이동 시도');
                    router.push('/main');
                    console.log('이동 명령 실행 완료');
                  },
                },
              ],
              { cancelable: false }
            );
          }

          // 백업 라우팅
          setTimeout(() => {
            if (!router.canGoBack()) {
              router.push('/main');
            }
          }, 1000);

        } catch (routingError) {
          console.error('페이지 이동 중 오류 발생:', routingError);
          // 직접 라우팅 시도
          router.push('/main');
        }
      } else {
        console.log('저장 실패:', data.error);
        Alert.alert('오류', data.error || '싫어하는 음식 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('API 호출 에러:', error);
      Alert.alert('오류', '서버 연결에 실패했습니다.');
    }
  };

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
        {/* 카운터 텍스트를 10개로 업데이트 */}
        <Text style={styles.counterText}>({selectedCount}/{MAX_SELECTION})</Text>
      </View>
      <FlatList
        data={foodData}
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
          onPress={saveUnpreferredFoods}
        >
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