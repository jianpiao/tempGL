import React, { Component } from 'react';
import {
    Text,
    View,
    FlatList,
    Button,
    Dimensions,
    TouchableHighlight   
} from 'react-native';
import styles from '../style.js';
import preventDoublePress from '../../../global/preventDoublePress';
import { getOrderTypeColor } from '../../../global/global';


const DataList = ({ data, toDetail, PrintOrder, printOpcity, itemSeparatorComponent, listHeaderComponent}) => {
    let screenWidth = Dimensions.get('window').width; 
    return (
        <View style={[styles.FlatList, { width: screenWidth }]}>
            <FlatList
                data={data}
                ItemSeparatorComponent={() => itemSeparatorComponent()}
                ListHeaderComponent={() => listHeaderComponent(data.length)}
                renderItem={({ item, index }) => 
                    <TouchableHighlight
                        key={index}
                        underlayColor="#666"
                        activeOpacity={0.8}
                        onPress={() => preventDoublePress.onPress(() => toDetail(item, index))}>
                        <View style={styles.FlatListItems}>
                            <View style={styles.FlatListGoodsName}>
                                <View style={styles.FlatListGoodsNameItem}>
                                    {
                                        item.order_information.map((m, i) =>
                                            <Text key={i} style={styles.GoodsName} >
                                                {m.goods_name}*{m.number}{m.goods_type > 0 ? '(' + m.goods_type_name + ')' : ''}
                                            </Text>
                                        )
                                    }
                                </View>
                                <View style={styles.OrderType}>
                                    <Text style={[styles.OrderTypeText, { color: getOrderTypeColor(item.order_type) }]}>{getOrderType(item.order_type)}</Text>
                                </View>
                            </View>
                            <Text>总价 &nbsp;￥{getFloatStr(item.order_price / 100)}</Text>
                            <View style={styles.print}>
                                <Text style={styles.orderInfo}>下单时间 &nbsp;{item.date}</Text>
                                {
                                    printOpcity ?
                                        <Button
                                            title={item.order_state != 4 ? '  打印  ' : "  退单  "}
                                            color={item.order_state != 4 ? "#0aa394" : '#f3571f'}
                                            style={{ marginRight: 15 }}
                                            onPress={() => PrintOrder(item, index)} />
                                        :
                                        <Text></Text>
                                }
                            </View>
                        </View>
                    </TouchableHighlight>}
            />
        </View>
    )
}


export default DataList;