import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ALLERGIES = [
  '갑각류', '복숭아', '땅콩', '달걀',
  '견과', '밀', '생선', '우유',
  '조개', '콩', '호두', '잣'
];

const AllergySelection = () => {
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

  const toggleAllergy = (allergy: string) => {
    if (selectedAllergies.includes(allergy)) {
      setSelectedAllergies(selectedAllergies.filter(a => a !== allergy));
    } else {
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
  };

  const handleConfirm = () => {
    alert(`선택된 알레르기: ${selectedAllergies.join(', ')}`);
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
        <Text style={styles.confirmText}>확인</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4A79A',
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
});

export default AllergySelection;