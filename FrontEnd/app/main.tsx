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
 FlatList,
 TouchableOpacity,
 Alert,
 Platform,
 ActivityIndicator,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

// API URL 상수 정의
const BASE_URL = Platform.select({
  ios: 'http://127.0.0.1:8000',
  android: 'http://172.18.102.72:8000',
  default: 'http://127.0.0.1:8000'
});

const IMAGES_URL = `${BASE_URL}/api/food-images/`;

// 오늘과 어제의 인기 음식 데이터
const popularToday = '1. 돈까스\n2. 비빔밥\n3. 냉면';
const popularYesterday = '1. 마라탕\n2. 짬뽕\n3. 순대국밥';

// 추천 식당 데이터
const restaurantRecommendations = {
 0: ['레스토랑 A', '레스토랑 B', '레스토랑 C'],
 1: ['레스토랑 D', '레스토랑 E', '레스토랑 F'],
 2: ['레스토랑 G', '레스토랑 H', '레스토랑 I'],
 3: ['레스토랑 J', '레스토랑 K', '레스토랑 L'],
 4: ['레스토랑 M', '레스토랑 N', '레스토랑 O'],
};

// FlipCard 컴포넌트
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
     <View style={{ width, height }}>
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
         <ImageBackground source={{ uri: imageUrl }} style={styles.card}>
         </ImageBackground>
       </Animated.View>

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
 const [selectedImageIndex, setSelectedImageIndex] = useState(null);
 const [images, setImages] = useState([]);
 const [isLoading, setIsLoading] = useState(true);

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
         .map(img => img.image_url);
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
   setSelectedImageIndex(index);
 };

 const handleUnflip = (index) => {
   if (selectedImageIndex === index) {
     setSelectedImageIndex(null);
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
           onScroll={Animated.event(
             [{ nativeEvent: { contentOffset: { x: scrollX } } }],
             { useNativeDriver: false }
           )}
           scrollEventThrottle={16}
         >
           {images.map((imageUrl, imageIndex) => (
             <FlipCard
               key={imageIndex}
               imageUrl={imageUrl}
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
             const width = scrollX.interpolate({
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
                 style={[styles.normalDot, { width }]}
               />
             );
           })}
         </View>
       </View>

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
