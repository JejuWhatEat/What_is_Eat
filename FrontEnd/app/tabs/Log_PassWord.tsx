import React, {useState} from 'react';
import { View, TextInput, StyleSheet} from 'react-native';

const Log_PassWord =() => {
    const [password, setText] = useState('');

const onChangeText= (inputText) => {
    setText(inputText);

};

return (
    <View style={styles.container}>
        <TextInput
        onChangeText={onChangeText}
        value={password}
        placeholder="비밀번호를 입력하세요..."
        secureTextEntry = {true}
        style={styles.input}
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
        height : 40,
        width : 200,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 8,

    },
});

export default Log_PassWord;