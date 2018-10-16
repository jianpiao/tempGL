import React, { Component } from 'react';
import {
    Text,
    View,
} from 'react-native';
import styles from './style'



const empty = ({ content }) => {
    return (
        <View style={styles.empty}>
            <Text style={styles.emptyText}>{content == null || content == undefined ? '暂无内容' : content}</Text>
        </View>
    )
}

export default empty;


