// Testing1/app/SignUp/tabs/sign_up_password.tsx
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface Props {
  onChangeText: (text: string) => void;
  value: string;
  placeholder?: string;
}

const Sign_up_password: React.FC<Props> = ({ 
  onChangeText, 
  value,
  placeholder = "비밀번호를 입력하세요..." 
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        style={styles.input}
        secureTextEntry={true}
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

export default Sign_up_password;