// app/RestaurantDetail.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';

type RestaurantDetails = {
  name: string;
  location: string;
  menu: string[];
};

// 예시 식당 데이터
const restaurantDetailsData: { [key: string]: RestaurantDetails } = {
  '레스토랑 A': {
    name: '레스토랑 A',
    location: '서울시 강남구 역삼동 123-45',
    menu: ['돈까스 세트', '비빔밥', '냉면'],
  },
  '레스토랑 B': {
    name: '레스토랑 B',
    location: '부산시 해운대구 좌동 678-90',
    menu: ['마라탕', '짬뽕', '순대국밥'],
  },
  '레스토랑 C': {
    name: '레스토랑 C',
    location: '대구시 중구 동성로 11-22',
    menu: ['비빔밥', '냉면', '김치찌개'],
  },
  // 필요한 만큼 식당 데이터를 추가하세요.
};

const RestaurantDetail = () => {
  const router = useRouter();
  const { restaurant } = useSearchParams();

  const details = restaurantDetailsData[restaurant as string];

  if (!details) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>해당 식당 정보를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{details.name}</Text>
      <Text style={styles.locationTitle}>위치</Text>
      <Text style={styles.locationText}>{details.location}</Text>
      <Text style={styles.menuTitle}>메뉴</Text>
      <FlatList
        data={details.menu}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>{item}</Text>
          </View>
        )}
        style={styles.menuList}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  locationTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#555',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#555',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  menuList: {
    width: '100%',
  },
  menuItem: {
    backgroundColor: '#FFE0B2',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default RestaurantDetail;