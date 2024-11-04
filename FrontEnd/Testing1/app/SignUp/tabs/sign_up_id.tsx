// Testing1/app/SignUp/tabs/sign_up_id.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface Props {
  onChangeText: (text: string) => void;
  value: string;
}

const Sign_up_id: React.FC<Props> = ({ onChangeText, value }) => {
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={onChangeText}
        value={value}
        placeholder="이메일을 입력하세요..."
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 46,
    paddingTop: 10,
    paddingBottom: 20,
  },
  input: {
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
});

export default Sign_up_id;