import React, { Component } from 'react';
import {
    Text,
    View,
    TextInput,
} from 'react-native';
import styles from '../style';

const ModalInput = ({ goodsType, placeholder, keyboardType, changeText, value, index, tag }) => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, height: 40, justifyContent: 'center' }}>
                <Text>{goodsType}</Text>
            </View>
            <TextInput
                style={{ flex: 1, height: 40, borderWidth: 0 }}
                multiline={true}
                placeholder={placeholder}
                numberOfLines={1}
                keyboardType={keyboardType}
                underlineColorAndroid='transparent'
                onChangeText={(text) => changeText(text, index, tag)}
                value={value}
            />
        </View>
    )
}

export default ModalInput;