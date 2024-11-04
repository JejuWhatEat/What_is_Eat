/* import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

const RECOMMENDED_FOOD = [
  { id: '1', image: 'https://via.placeholder.com/300?text=Food+1' },
  { id: '2', image: 'https://via.placeholder.com/300?text=Food+2' },
  { id: '3', image: 'https://via.placeholder.com/300?text=Food+3' },
];

const POPULAR_TODAY = '1. 돈까스 2. 비빔밥 3. 냉면';
const POPULAR_YESTERDAY = '1. 마라탕 2. 짬뽕 3. 순대국밥';

const RecommendedFoodScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Text style={styles.imageText}>{item.image}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity>
          <Text style={styles.menuIcon}>≡</Text>
        </TouchableOpacity>
        <Text style={styles.title}>오늘의 추천 음식은 ?</Text>
      </View>
      <Carousel
        data={RECOMMENDED_FOOD}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth - 60}
        loop={true}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>오늘 제일 많이 고른 음식은 ?</Text>
        <Text style={styles.infoText}>{POPULAR_TODAY}</Text>
        <Text style={styles.infoTitle}>어제 제일 많이 고른 음식은 ?</Text>
        <Text style={styles.infoText}>{POPULAR_YESTERDAY}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4A79A',
    paddingTop: 20,
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  menuIcon: {
    fontSize: 24,
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  carouselItem: {
    backgroundColor: '#D3D3D3',
    borderRadius: 10,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageText: {
    fontSize: 18,
    color: '#000',
  },
  infoContainer: {
    backgroundColor: '#FFE9AF',
    borderRadius: 10,
    width: '90%',
    padding: 20,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 15,
  },
});

export default RecommendedFoodScreen; */