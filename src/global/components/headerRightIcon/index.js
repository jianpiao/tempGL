import React, { Component } from 'react';
import {
    Text,
    View,
} from 'react-native';
import styles from './style'


const headerRightIcon = () => {
    return (
        <View style={styles.headerRightView}>
            <Text style={styles.headerRightIcon}>
                &#xe609;
            </Text>
        </View>
    )
}

export default headerRightIcon;


