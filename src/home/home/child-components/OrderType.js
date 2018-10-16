import React, { Component } from 'react';
import {
    View,
    Text,
} from 'react-native';
import styles from '../style';
import { getOrderTypeColor } from '../../../global/global';

const OrderType = ({ printOpcity, orderType, PrintOrder}) => {
    return (
        <View>
            <View style={[styles.OrderType, { borderColor: getOrderTypeColor(orderType)}]}>
                <Text style={[styles.OrderTypeText, { color: getOrderTypeColor(orderType) }]}>{getOrderType(orderType)}</Text>
            </View>
            <View style={styles.print}>
                {
                    printOpcity ? 
                        <Text style={{ fontFamily: 'iconfont' }} onPress={() => PrintOrder()}>打印 &#xe6b9;</Text>
                        :
                        <Text></Text>
                    }
            </View>
        </View>
        
    )
}

export default OrderType;


