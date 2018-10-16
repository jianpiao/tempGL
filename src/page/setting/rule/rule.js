import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    Image,
    TouchableOpacity
} from 'react-native';
import styles from './style'
import { StackNavigator } from 'react-navigation';


export default class ruleContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    //  请求数据


    render() {
        return (
            <View style={styles.container}>
                <Text>参与我们公司，公司调理...........</Text>
            </View>
        )
    }
}

