import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableNativeFeedback
} from 'react-native';
import styles from '../style';

const searchHeader = ({ onPageSelected, pageSelected }) => {
    let list = ['订单号','日期','手机号','用户名']
    return (
        <View style={styles.searchHeader}>
            {
                list.map((item,index) => {
                    return(
                        <TouchableNativeFeedback
                            key={index}
                            background={TouchableNativeFeedback.Ripple('#ccc', false)}
                            onPress={() => onPageSelected(index)}>
                            <View style={[styles.headerBar, { borderBottomWidth: pageSelected == index ? 2 : 0 }]}>
                                <Text>{item}</Text>
                            </View>
                        </TouchableNativeFeedback>
                    )
                })
            }
        </View>
    )
}


export default searchHeader;