import React, { Component } from 'react';
import {
    Text,
    View,
} from 'react-native';
import styles from './style'



const noNetwork = () => {
    return (
        <View style={styles.empty}>
            <Text style={styles.emptyText}>似乎出现了些问题</Text>
            <Text style={styles.emptyTextColor}>重新加载</Text>
        </View>
    )
}

export default noNetwork;


