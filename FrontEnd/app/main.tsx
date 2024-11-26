
// Main.tsx
import React, { useRef, useState } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  ImageBackground,
  Animated,
  useWindowDimensions,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

// 이미지 배열
const images = [
  require('./images/image1.jpeg'),
  require('./images/image3.jpeg'),
  require('./images/image5.jpeg'),
  require('./images/image7.jpeg'),
  require('./images/image10.jpeg'),
];

// 오늘과 어제의 인기 음식 데이터
const popularToday = '1. 돈까스\n2. 비빔밥\n3. 냉면';
const popularYesterday = '1. 마라탕\n2. 짬뽕\n3. 순대국밥';

// 추천 식당 데이터 (예시)
const restaurantRecommendations = {
  0: ['레스토랑 A', '레스토랑 B', '레스토랑 C'],
  1: ['레스토랑 D', '레스토랑 E', '레스토랑 F'],
  2: ['레스토랑 G', '레스토랑 H', '레스토랑 I'],
  3: ['레스토랑 J', '레스토랑 K', '레스토랑 L'],
  4: ['레스토랑 M', '레스토랑 N', '레스토랑 O'],
};

// FlipCard 컴포넌트
const FlipCard = ({ image, width, height, onFlip, onUnflip, index }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  // 회전 애니메이션을 위한 보간기 설정
  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  // 카드 뒤집기 함수
  const flipCard = () => {
    if (flipped) {
      Animated.spring(animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start(() => {
        setFlipped(false);
        onUnflip(index); // 카드가 뒤집혔을 때 호출
      });
    } else {
      Animated.spring(animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start(() => {
        setFlipped(true);
        onFlip(index); // 카드가 앞면에서 뒷면으로 뒤집혔을 때 호출
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={flipCard}>
      <View style={{ width, height }}>
        {/* 앞면 */}
        <Animated.View
          style={[
            styles.flipCard,
            {
              transform: [{ rotateY: frontInterpolate }],
              width,
              height,
              position: 'absolute',
            },
          ]}
        >
          <ImageBackground source={image} style={styles.card}>
            {/* 필요에 따라 앞면에 추가적인 내용을 넣을 수 있습니다 */}
          </ImageBackground>
        </Animated.View>

        {/* 뒷면 */}
        <Animated.View
          style={[
            styles.flipCard,
            styles.flipCardBack,
            {
              transform: [{ rotateY: backInterpolate }],
              width,
              height,
              position: 'absolute',
            },
          ]}
        >
          <View style={styles.backSide}>
            <Text style={styles.backText}>추천 식당을 확인하세요!</Text>
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const Main = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const { width: windowWidth } = useWindowDimensions();

  // 추천 식당을 표시할 이미지 인덱스 상태
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // FlipCard에서 호출되는 핸들러
  const handleFlip = (index) => {
    setSelectedImageIndex(index);
  };

  const handleUnflip = (index) => {
    if (selectedImageIndex === index) {
      setSelectedImageIndex(null);
    }
  };

  // 추천 식당 버튼 클릭 시 동작 함수 (예시)
  const handleRestaurantPress = (restaurant) => {
    Alert.alert('추천 식당 선택', `${restaurant}를 선택하셨습니다.`);
    // 여기에 원하는 동작을 추가하세요. 예: 상세 페이지로 이동
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>오늘의 추천 음식은?</Text>

        <View style={styles.scrollContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          >
            {images.map((image, imageIndex) => (
              <FlipCard
                key={imageIndex}
                image={image}
                width={windowWidth}
                height={250}
                onFlip={handleFlip}
                onUnflip={handleUnflip}
                index={imageIndex}
              />
            ))}
          </ScrollView>
          <View style={styles.indicatorContainer}>
            {images.map((_, imageIndex) => {
              const dotWidth = scrollX.interpolate({
                inputRange: [
                  windowWidth * (imageIndex - 1),
                  windowWidth * imageIndex,
                  windowWidth * (imageIndex + 1),
                ],
                outputRange: [8, 16, 8],
                extrapolate: 'clamp',
              });
              return (
                <Animated.View
                  key={imageIndex}
                  style={[styles.normalDot, { width: dotWidth }]}
                />
              );
            })}
          </View>
        </View>

        {/* 추천 식당 목록을 조건부로 렌더링 */}
        {selectedImageIndex !== null && (
          <View style={styles.recommendationContainer}>
            <Text style={styles.recommendationTitle}>추천 식당</Text>
            <FlatList
              data={restaurantRecommendations[selectedImageIndex] || []}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.restaurantButton}
                  onPress={() => handleRestaurantPress(item)}
                >
                  <Text style={styles.restaurantButtonText}>{item}</Text>
                </TouchableOpacity>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>오늘의 인기 음식은?</Text>
          <Text style={styles.infoText}>{popularToday}</Text>
          <Text style={styles.infoTitle}>어제의 인기 음식은?</Text>
          <Text style={styles.infoText}>{popularYesterday}</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEBE98',
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 20,
  },
  scrollContainer: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipCard: {
    backfaceVisibility: 'hidden', // 뒷면이 보이지 않도록 설정
  },
  flipCardBack: {
    backgroundColor: '#CCCCCC', // 뒷면의 회색 배경
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 10,
  },
  backSide: {
    flex: 1,
    backgroundColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 20,
    color: '#333333',
    fontWeight: 'bold',
  },
  normalDot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'silver',
    marginHorizontal: 4,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  recommendationContainer: {
    width: '90%',
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  restaurantButton: {
    backgroundColor: '#FFE0B2',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  restaurantButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#FFE9AF',
    borderRadius: 10,
    width: '90%',
    padding: 20,
    marginTop: 30,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  infoText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
  },
});

export default Main;
