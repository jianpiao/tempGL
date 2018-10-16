import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import styles from '../style';
import preventDoublePress from '../../../global/preventDoublePress';

const refund = ({ jumpRefund, refund,allRefund }) => {
    let list = [
        { title: '待处理', tag: '用户退单待处理', length: refund.length},
        { title: '已经处理', tag: '用户退单已经处理', length: allRefund.length}
    ]
    return (
        <View style={styles.refundBody}>
            <Text>退单/售后</Text>
            <View style={styles.refundContent}>
            {
                list.map((item,index) => {
                    return (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.8}
                            onPress={() => preventDoublePress.onPress(() => jumpRefund(index))}
                            style={styles.refundTouch}>
                            <Text style={styles.refundLength}>{item.length}</Text>
                            <Text style={styles.refundWait}>{item.title}</Text>
                            <Text>{item.tag}</Text>
                        </TouchableOpacity>
                    )
                })
            }
            </View>
        </View>
    )
}

export default refund;