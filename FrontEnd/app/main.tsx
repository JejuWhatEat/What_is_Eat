import React, { useRef, useState, useEffect } from 'react';
import {
  ScrollView, Text, StyleSheet, View, ImageBackground,
  Animated, useWindowDimensions, TouchableWithoutFeedback,
  TouchableOpacity, Alert, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const BASE_URL = Platform.select({
  ios: 'http://127.0.0.1:8000',
  android: 'http://172.18.102.72:8000',
  default: 'http://127.0.0.1:8000',
});

const popularToday = '1. 돈까스\n2. 비빔밥\n3. 냉면';
const popularYesterday = '1. 마라탕\n2. 짬뽕\n3. 순대국밥';

const restaurantRecommendations = {
  0: ['레스토랑 A', '레스토랑 B', '레스토랑 C'],
  1: ['레스토랑 D', '레스토랑 E', '레스토랑 F'],
  2: ['레스토랑 G', '레스토랑 H', '레스토랑 I'],
  3: ['레스토랑 J', '레스토랑 K', '레스토랑 L'],
  4: ['레스토랑 M', '레스토랑 N', '레스토랑 O'],
};

const FlipCard = ({ image, width, height, onFlip, onUnflip, index }) => {
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
          <ImageBackground source={{ uri: image.image_url }} style={styles.card} />
        </Animated.View>

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
          <ImageBackground source={{ uri: image.image_url }} style={styles.card}>
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
  const cardWidth = windowWidth * 0.8;
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastActiveTime = useRef(Date.now());
  const accumulatedTimes = useRef({});
  const [userEmail, setUserEmail] = useState(global.userEmail || null);

  useEffect(() => {
    if (global.userEmail) {
      setUserEmail(global.userEmail);
      console.log('Global email loaded:', global.userEmail);
    }
  }, [global.userEmail]);

  const updateDwellTime = async (dwellTimes) => {
    try {
      console.log('현재 저장된 이메일:', global.userEmail);

      if (!global.userEmail) {
        console.error('사용자 이메일을 찾을 수 없습니다');
        return;
      }

      const mappedTimes = {};
      Object.entries(dwellTimes).forEach(([index, time]) => {
        const image = images[parseInt(index)];
        if (image) {
          mappedTimes[image.id] = time;
        }
      });

      const requestData = {
        dwell_times: mappedTimes,
        email: global.userEmail
      };
      console.log('요청 데이터:', requestData);

      const response = await fetch(`${BASE_URL}/api/update-dwell-time/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('체류시간 업데이트 성공:', responseData);
      return responseData;
    } catch (error) {
      console.error('체류시간 업데이트 실패:', error);
      throw error;
    }
  };

  const fetchFoodImages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/api/food-images/?type=preferred`);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.status === 'success') {
        setImages(data.images);
      } else {
        throw new Error(data.message || '이미지 로드 실패');
      }
    } catch (error) {
      console.error('이미지 로드 중 에러:', error);
      Alert.alert('오류', '서버 연결에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMomentumScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / (cardWidth + 20));

    if (newIndex !== currentIndex) {
      const currentTime = Date.now();
      const duration = currentTime - lastActiveTime.current;
      const image = images[currentIndex];

      if (image) {
        console.log(`Image ${image.id} was viewed for ${duration}ms`);
        accumulatedTimes.current[currentIndex] =
          (accumulatedTimes.current[currentIndex] || 0) + duration;

        setCurrentIndex(newIndex);
        lastActiveTime.current = currentTime;

        if (global.userEmail) {
          updateDwellTime(accumulatedTimes.current);
        }
      }
    }
  };

  useEffect(() => {
    fetchFoodImages();
    return () => {
      const currentTime = Date.now();
      const duration = currentTime - lastActiveTime.current;
      if (currentIndex >= 0 && currentIndex < images.length) {
        accumulatedTimes.current[currentIndex] =
          (accumulatedTimes.current[currentIndex] || 0) + duration;
        if (global.userEmail) {
          updateDwellTime(accumulatedTimes.current);
        }
      }
    };
  }, []);

  // FlipCard 컴포넌트 수정
  const FlipCard = ({ image, width, height, onFlip, onUnflip, index, flipped }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [isFlipped, setIsFlipped] = useState(false);
  
    const frontInterpolate = animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg'],
    });
  
    const backInterpolate = animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg'],
    });
  
    const flipCard = () => {
      if (isFlipped) {
        setIsFlipped(false);
        Animated.spring(animatedValue, {
          toValue: 0,
          friction: 8,
          tension: 10,
          useNativeDriver: true,
        }).start(() => {
          onUnflip(index);
        });
      } else {
        setIsFlipped(true);
        Animated.spring(animatedValue, {
          toValue: 180,
          friction: 8,
          tension: 10,
          useNativeDriver: true,
        }).start(() => {
          onFlip(index);
        });
      }
    };
  
    const [nutritionInfo, setNutritionInfo] = useState(null);
  
    const fetchNutritionInfo = async () => {
      try {
        const response = await fetch(`/api/nutrition/${image.original_id}`);
    
        // 응답 코드 확인
        if (!response.ok) {
          let errorMessage;
          if (response.status === 404) {
            errorMessage = '해당 음식 정보를 찾을 수 없습니다.';
          } else {
            const data = await response.json();
            errorMessage = data.message || '영양 정보 가져오기에 실패했습니다.';
          }
          console.error('영양 정보 가져오기 실패:', errorMessage);
          return;
        }
    
        const data = await response.json();
        setNutritionInfo(data.data);
      } catch (error) {
        console.error('영양 정보 가져오기 실패:', error);
      }
    };
  
    useEffect(() => {
      if (flipped) {
        fetchNutritionInfo();
      }
    }, [flipped, image.original_id]);
  
    return (
      <TouchableWithoutFeedback onPress={flipCard}>
        <View style={{ width, height, marginHorizontal: 10 }}>
          <Animated.View
            style={[
              styles.flipCard,
              {
                transform: [{ rotateY: frontInterpolate }],
                width: '100%',
                height: '100%',
                position: 'absolute',
                opacity: isFlipped ? 0.6 : 1,
              },
            ]}>
            <ImageBackground source={{ uri: image.image_url }} style={styles.card} />
          </Animated.View>
  
          <Animated.View
            style={[
              styles.flipCard,
              {
                transform: [{ rotateY: backInterpolate }],
                width: '100%',
                height: '100%',
                position: 'absolute',
                opacity: isFlipped ? 0.6 : 1,
              },
            ]}>
            <ImageBackground source={{ uri: image.image_url }} style={styles.card}>
              {nutritionInfo && (
                <View style={styles.backOverlay}>
                  <Text style={styles.backText}>
                    칼로리: {nutritionInfo.calories}
                    {'\n'}
                    탄수화물: {nutritionInfo.carbohydrates}
                    {'\n'}
                    단백질: {nutritionInfo.protein}
                    {'\n'}
                    지방: {nutritionInfo.fat}
                  </Text>
                </View>
              )}
            </ImageBackground>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
 
 // Main 컴포넌트의 나머지 코드는 동일하게 유지
 const handleFlip = (index) => {
  const currentImage = images[index];
  if (currentImage) {
    const currentTime = Date.now();
    const duration = currentTime - lastActiveTime.current;
 
    accumulatedTimes.current[index] =
      (accumulatedTimes.current[index] || 0) + duration;
 
    lastActiveTime.current = currentTime;
 
    if (global.userEmail) {
      updateDwellTime(accumulatedTimes.current);
    }
  }
 };

  const handleUnflip = (index) => {
    const currentImage = images[index];
    if (currentImage) {
      const currentTime = Date.now();
      lastActiveTime.current = currentTime;
    }
  };

  const handleRestaurantPress = (restaurant) => {
    Alert.alert('추천 식당 선택', `${restaurant}를 선택하셨습니다.`);
  };

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size="large" color="#FFE9AF" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>오늘의 추천 음식은?</Text>

        <View style={styles.scrollContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: (windowWidth - cardWidth) / 2,
            }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            snapToInterval={cardWidth + 20}
            decelerationRate="fast"
            overScrollMode="never"
          >
            {images.map((image, index) => (
              <FlipCard
                key={index}
                image={image}
                width={cardWidth}
                height={250}
                onFlip={handleFlip}
                onUnflip={handleUnflip}
                index={index}
                flipped={index === currentIndex}
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

        <View style={styles.recommendationContainer}>
          <Text style={styles.recommendationTitle}>추천 식당</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            overScrollMode="never"
          >
            {(restaurantRecommendations[currentIndex] || []).map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.restaurantButton}
                onPress={() => handleRestaurantPress(item)}
              >
                <Text style={styles.restaurantButtonText}>{item}</Text>
              </TouchableOpacity>
            ))}
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
  flipCardBack: {
    backgroundColor: '#CCCCCC',
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