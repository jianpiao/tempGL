import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity
} from 'react-native';

const searchHeader = ({ onPageSelected, pageSelected }) => {
    return (
        <View style={{ flexDirection: 'row', height: 40, backgroundColor: '#fff', elevation: 3 }}>
            <TouchableOpacity
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderBottomColor: '#000', borderBottomWidth: pageSelected == 0 ? 2 : 0 }}
                activeOpacity={0.8}
                onPress={() => onPageSelected(0)}>
                <Text>账户名</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderBottomColor: '#000', borderBottomWidth: pageSelected == 1 ? 2 : 0 }}
                activeOpacity={0.8}
                onPress={() => onPageSelected(1)}>
                <Text>手机号</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderBottomColor: '#000', borderBottomWidth: pageSelected == 2 ? 2 : 0 }}
                activeOpacity={0.8}
                onPress={() => onPageSelected(2)}>
                <Text>电子邮箱</Text>
            </TouchableOpacity>
        </View>
    )
}


export default searchHeader;