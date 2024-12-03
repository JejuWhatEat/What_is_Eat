import React, { useRef, useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  ImageBackground,
  Animated,
  useWindowDimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

// API URL constants
const BASE_URL = Platform.select({
  ios: 'http://127.0.0.1:8000',
  android: 'http://172.18.102.72:8000',
  default: 'http://127.0.0.1:8000',
});

const IMAGES_URL = `${BASE_URL}/api/food-images/`;

// Popular food data for today and yesterday
const popularToday = '1. 돈까스\n2. 비빔밥\n3. 냉면';
const popularYesterday = '1. 마라탕\n2. 짬뽕\n3. 순대국밥';

// Restaurant recommendations data
const restaurantRecommendations = {
  0: ['레스토랑 A', '레스토랑 B', '레스토랑 C'],
  1: ['레스토랑 D', '레스토랑 E', '레스토랑 F'],
  2: ['레스토랑 G', '레스토랑 H', '레스토랑 I'],
  3: ['레스토랑 J', '레스토랑 K', '레스토랑 L'],
  4: ['레스토랑 M', '레스토랑 N', '레스토랑 O'],
};

// FlipCard component
const FlipCard = ({ imageUrl, width, height, onFlip, onUnflip, index }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const flipCard = () => {
    if (flipped) {
      Animated.spring(animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start(() => {
        setFlipped(false);
        onUnflip(index);
      });
    } else {
      Animated.spring(animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start(() => {
        setFlipped(true);
        onFlip(index);
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={flipCard}>
      {/* Adjusted marginHorizontal to center the card and make side images partially visible */}
      <View style={{ width, height, marginHorizontal: 10 }}>
        <Animated.View
          style={[
            styles.flipCard,
            {
              transform: [{ rotateY: frontInterpolate }],
              width: '100%',
              height: '100%',
              position: 'absolute',
            },
          ]}
        >
          <ImageBackground source={{ uri: imageUrl }} style={styles.card} />
        </Animated.View>

        {/* Modified back side to show the image semi-transparently */}
        <Animated.View
          style={[
            styles.flipCard,
            {
              transform: [{ rotateY: backInterpolate }],
              width: '100%',
              height: '100%',
              position: 'absolute',
            },
          ]}
        >
          {/* Use ImageBackground to display the image */}
          <ImageBackground source={{ uri: imageUrl }} style={styles.card}>
            {/* Overlay a semi-transparent view */}
            <View style={styles.backOverlay}>
              <Text style={styles.backText}>영양 성분 추가 예정</Text>
            </View>
          </ImageBackground>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const Main = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const { width: windowWidth } = useWindowDimensions();

  // Reduced state variables by removing selectedImageIndex
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Added currentIndex to track the current active image index
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastActiveTime = useRef(Date.now());
  const accumulatedTimes = useRef({});

  useEffect(() => {
    fetchFoodImages();
  }, []);

  const fetchFoodImages = async () => {
    try {
      setIsLoading(true);
      console.log('이미지 요청 URL:', `${IMAGES_URL}?type=preferred`);

      const response = await fetch(`${IMAGES_URL}?type=preferred`);
      const data = await response.json();

      console.log('서버 응답:', data);

      if (data.status === 'success') {
        const selectedImages = data.images
          .slice(0, 5)
          .map((img) => img.image_url);
        setImages(selectedImages);
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

  const handleFlip = (index) => {
    // No longer need to set selectedImageIndex
  };

  const handleUnflip = (index) => {
    // No longer need to unset selectedImageIndex
  };

  const handleRestaurantPress = (restaurant) => {
    Alert.alert('추천 식당 선택', `${restaurant}를 선택하셨습니다.`);
  };

  // Added handleMomentumScrollEnd to track the current index and accumulate dwell time
  const handleMomentumScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / (cardWidth + 20)); // Adjusted for new card width and margin

    if (newIndex !== currentIndex) {
      const currentTime = Date.now();
      const duration = currentTime - lastActiveTime.current;
      console.log(`Image ${currentIndex + 1} was viewed for ${duration}ms`);

      // Accumulate dwell time for each image
      if (accumulatedTimes.current[currentIndex]) {
        accumulatedTimes.current[currentIndex] += duration;
      } else {
        accumulatedTimes.current[currentIndex] = duration;
      }

      setCurrentIndex(newIndex);
      lastActiveTime.current = currentTime;

      console.log('Accumulated Times:', accumulatedTimes.current);
    }
  };

  // Ensure the last image's dwell time is recorded when component unmounts
  useEffect(() => {
    return () => {
      const currentTime = Date.now();
      const duration = currentTime - lastActiveTime.current;
      if (accumulatedTimes.current[currentIndex]) {
        accumulatedTimes.current[currentIndex] += duration;
      } else {
        accumulatedTimes.current[currentIndex] = duration;
      }
      console.log(`Image ${currentIndex + 1} was viewed for ${duration}ms`);
      console.log('Final Accumulated Times:', accumulatedTimes.current);
    };
  }, []);

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size="large" color="#FFE9AF" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Calculated cardWidth to make side images partially visible
  const cardWidth = windowWidth * 0.8;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>오늘의 추천 음식은?</Text>

        <View style={styles.scrollContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            // Centered the content to make side images partially visible
            contentContainerStyle={{ paddingHorizontal: (windowWidth - cardWidth) / 2 }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            // Added handleMomentumScrollEnd to track image changes
            onMomentumScrollEnd={handleMomentumScrollEnd}
            snapToInterval={cardWidth + 20} // Adjusted snap interval for new card width and margin
            decelerationRate="fast"
            overScrollMode="never"
          >
            {images.map((imageUrl, imageIndex) => (
              <FlipCard
                key={imageIndex}
                imageUrl={imageUrl}
                width={cardWidth}
                height={250}
                onFlip={handleFlip}
                onUnflip={handleUnflip}
                index={imageIndex}
              />
            ))}
          </ScrollView>
          <View style={styles.indicatorContainer}>
            {images.map((_, imageIndex) => {
              const width = scrollX.interpolate({
                inputRange: [
                  (cardWidth + 20) * (imageIndex - 1),
                  (cardWidth + 20) * imageIndex,
                  (cardWidth + 20) * (imageIndex + 1),
                ],
                outputRange: [8, 16, 8],
                extrapolate: 'clamp',
              });
              return (
                <Animated.View
                  key={imageIndex}
                  style={[styles.normalDot, { width }]}
                />
              );
            })}
          </View>
        </View>

        {/* Made recommendation container always visible and based on currentIndex */}
        <View style={styles.recommendationContainer}>
          <Text style={styles.recommendationTitle}>추천 식당</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            overScrollMode="never"
          >
            {(restaurantRecommendations[currentIndex] || []).map(
              (item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.restaurantButton}
                  onPress={() => handleRestaurantPress(item)}
                >
                  <Text style={styles.restaurantButtonText}>{item}</Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>
        </View>

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
    // Centered the items in the scroll container
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    // Removed margins from card to handle spacing via container
  },
  flipCard: {
    backfaceVisibility: 'hidden',
  },
  // Removed flipCardBack style as it's no longer needed
  backOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  backText: {
    fontSize: 20,
    color: '#FFFFFF',
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
    marginBottom: 20,
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