import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

const ALLERGIES = [
  '갑각류', '복숭아', '땅콩', '달걀',
  '견과', '밀', '생선', '우유',
  '조개', '콩', '호두', '잣'
];

const AllergySelection = () => {
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const toggleAllergy = (allergy: string) => {
    if (selectedAllergies.includes(allergy)) {
      setSelectedAllergies(selectedAllergies.filter(a => a !== allergy));
    } else {
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
  };

  const handleConfirm = () => {
    setShowConfirmation(true); // 선택된 항목을 화면에 표시하도록 설정
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>알레르기를 선택하세요.</Text>
      <ScrollView contentContainerStyle={styles.allergyContainer}>
        {ALLERGIES.map((allergy, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.allergyButton,
              selectedAllergies.includes(allergy) && styles.selectedButton
            ]}
            onPress={() => toggleAllergy(allergy)}
          >
            <Text style={styles.allergyText}>{allergy}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Link href ='./Allergy' style={styles.confirmText}>확인</Link>
      </TouchableOpacity>

      {showConfirmation && (
        <View style={styles.confirmationContainer}>
          <Text style={styles.confirmationTitle}>선택된 알레르기:</Text>
          {selectedAllergies.length > 0 ? (
            <Text style={styles.selectedAllergies}>{selectedAllergies.join(', ')}</Text>
          ) : (
            <Text style={styles.selectedAllergies}>선택된 알레르기가 없습니다.</Text>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEBE98',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4A4A4A',
  },
  allergyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
  },
  allergyButton: {
    backgroundColor: '#D3D3D3',
    padding: 10,
    margin: 5,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#8B4513',
  },
  allergyText: {
    color: '#333',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
    borderColor: '#FF0000',
    borderWidth: 1,
  },
  confirmText: {
    color: '#FF0000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmationContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 10,
  },
  selectedAllergies: {
    fontSize: 16,
    color: '#333',
  },
});

export default AllergySelection;