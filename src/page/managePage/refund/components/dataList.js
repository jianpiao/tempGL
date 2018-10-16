import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableHighlight,
    FlatList
} from 'react-native';
import styles from '../style';
import preventDoublePress from '../../../../global/preventDoublePress';

const dataList = ({ dataList, refreshing, onRefresh, checkDetail, itemSeparatorComponent, emptyComponent}) => {
    return (
        <View style={{ paddingTop: 8 }}>
            <FlatList
                refreshing={refreshing}
                onRefresh={() => onRefresh()}
                data={dataList}
                ItemSeparatorComponent={() => itemSeparatorComponent()}
                ListEmptyComponent={() => emptyComponent()}
                renderItem={({ item, index }) => 
                <TouchableHighlight
                    activeOpacity={1}
                    underlayColor="#e9e9e9"
                    key={index}
                    onPress={() => preventDoublePress.onPress(() => checkDetail(item, index))}>
                    <View style={styles.refundItem}>
                        <Text style={{ color: '#000', fontWeight: '600', fontSize: 16 }}>
                            {
                                item.order_information.map((m, i) => {
                                    return (
                                        m.goods_name + "*" + m.number
                                    )
                                })
                            }
                        </Text>
                        <Text>总价 &nbsp;{getFloatStr(item.order_price / 100)}</Text>
                        <Text>下单时间 &nbsp;{item.date}</Text>
                    </View>
                </TouchableHighlight>}
            />
        </View>
    )
}

export default dataList;