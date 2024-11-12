import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, StatusBar, TouchableOpacity, TextInput, Switch } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

const DATA = [
  { id: '1', title: '알러지 유무' },
  { id: '2', title: '비건인가요 ?' },
  { id: '3', title: '성별' },
  { id: '4', title: '랜덤 이름' },
  { id: '5', title: '닉네임 설정' },
  { id: '6', title: '닉네임 입력' },
];

type ItemProps = { id: string, title: string };

const Item = ({ id, title }: ItemProps) => {
  const [isOn, setIsOn] = useState(false);
  const [nickname, setNickname] = useState('');

  // 비건 선택 상태 (true/false)
  const [veganChoice, setVeganChoice] = useState<boolean | null>(null);

  // 성별 선택 상태
  const [gender, setGender] = useState<string | null>(null);

  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
      {id === '1' ? (
        <TouchableOpacity style={styles.arrowButton}>
          <Link href='./Allergic' style={styles.arrowText}>→</Link>
        </TouchableOpacity>
      ) : id === '2' ? (
        <View style={styles.yesNoButtons}>
          <TouchableOpacity
            style={[styles.yesButton, veganChoice === true && styles.selectedButton]}
            onPress={() => setVeganChoice(veganChoice === true ? null : true)} // toggle between true and null
          >
            <Text style={styles.buttonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.noButton, veganChoice === false && styles.selectedButton]}
            onPress={() => setVeganChoice(veganChoice === false ? null : false)} // toggle between false and null
          >
            <Text style={styles.buttonText}>No</Text>
          </TouchableOpacity>
        </View>
      ) : id === '3' ? (
        <View style={styles.genderButtons}>
          <TouchableOpacity
            style={[styles.genderButton_man, gender === 'male' && styles.selectedButton]}
            onPress={() => setGender(gender === 'male' ? null : 'male')} // toggle between 'male' and null
          >
            <Text style={styles.buttonText}>남성</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderButton_woman, gender === 'female' && styles.selectedButton]}
            onPress={() => setGender(gender === 'female' ? null : 'female')} // toggle between 'female' and null
          >
            <Text style={styles.buttonText}>여성</Text>
          </TouchableOpacity>
        </View>
      ) : id === '4' ? (
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>{isOn ? 'On' : 'Off'}</Text>
          <Switch
            value={isOn}
            onValueChange={(value) => setIsOn(value)}
          />
        </View>
      ) : id === '6' ? (
        <TextInput
          style={styles.textInput}
          placeholder="닉네임을 입력하세요"
          value={nickname}
          onChangeText={(text) => setNickname(text)}
        />
      ) : (
        <TouchableOpacity
          style={styles.itemButton}
          onPress={() => alert(`${title} 버튼 클릭됨`)}>
          <Text style={styles.buttonText}>선택</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const Allergy = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={({ item }) => <Item id={item.id} title={item.title} />}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity
        style={styles.button}>
        <Link href='./PreferedFood' style={styles.buttonText}> 확인 </Link>
      </TouchableOpacity>
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    alignItems: 'center',
    backgroundColor: '#FEBE98',
  },
  item: {
    backgroundColor: '#F1B198',
    padding: 20,
    width: 300,
    marginHorizontal: 10,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
  },
  arrowButton: {
    backgroundColor: '#FEBE98',
    borderRadius: 20,
    padding: 5,
  },
  arrowText: {
    fontSize: 15,
    color: '#000',
  },
  yesNoButtons: {
    flexDirection: 'row',
  },
  yesButton: {
    backgroundColor: '#32CD32',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  noButton: {
    backgroundColor: '#FF6347',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  genderButtons: {
    flexDirection: 'row',
  },
  genderButton_man: {
    backgroundColor: '#0000FF',
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginHorizontal: 5,
  },
  genderButton_woman: {
    backgroundColor: '#FF0000',
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginHorizontal: 5,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    marginRight: 10,
    fontSize: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: 200,
    borderRadius: 5,
  },
  button: {
    width: 200,
    height: 40,
    backgroundColor: "#FFE9AF",
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 15,
  },
  itemButton: {
    backgroundColor: '#FEBE98',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  selectedButton: {
    opacity: 0.5, // 선택된 버튼을 반투명하게 만듦
  },
});

export default Allergy;