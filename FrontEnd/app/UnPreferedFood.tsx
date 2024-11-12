import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

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

const FOOD_DATA = Array.from({ length: 16 }, (_, index) => ({
  id: `${index + 1}`,
  image: getImageById(`${index + 1}`),
  selected: false,
}));

const UnPreferedFood = () => {
  const [selectedCount, setSelectedCount] = useState(0);
  const [foodData, setFoodData] = useState(FOOD_DATA);

  const toggleSelection = (id) => {
    const updatedData = foodData.map((item) => {
      if (item.id === id) {
        const isSelected = !item.selected;
        
        // Check if the selected count exceeds 10
        if (isSelected && selectedCount >= 10) {
          Alert.alert('알림', '최대 10개까지 선택할 수 있습니다.');
          return item;
        }

        // Update selected count
        setSelectedCount((prevCount) => isSelected ? prevCount + 1 : prevCount - 1);
        return { ...item, selected: isSelected };
      }
      return item;
    });

    setFoodData(updatedData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>싫어하는 음식</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="음식을 검색하세요"
        />
        <TouchableOpacity style={styles.searchIcon}>
          <Text>🔍</Text>
        </TouchableOpacity>
        <Text style={styles.counterText}>({selectedCount}/10)</Text>
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
              source={item.image} // getImageById 함수로 가져온 이미지
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
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>뒤로가기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Link href="./main" style={styles.buttonText}>
            다음
          </Link>
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