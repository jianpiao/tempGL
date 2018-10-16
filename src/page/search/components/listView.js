import React, { Component } from 'react';
import {
    Text,
    View,
    FlatList,
    ScrollView,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import styles from '../style'
import Empty from '../../../global/components/empty';
import preventDoublePress from '../../../global/preventDoublePress';
import { getOrderTypeColor } from '../../../global/global';
import {empty} from '../../../global/global';

const listView = ({ data, onRefresh, refreshing, onPressItem, showType, loadMore, itemSeparatorComponent, emptyComponent, footer }) => {
    return (
        <View>
            <FlatList
                initialNumToRender={8}
                refreshing={refreshing}
                onRefresh={() => onRefresh()}
                onEndReachedThreshold={0.5}
                ItemSeparatorComponent={() => itemSeparatorComponent()}
                ListEmptyComponent={() => emptyComponent()}
                ListFooterComponent={() => footer()}
                onEndReached={(info) => loadMore()}
                data={data}
                renderItem={({ item, index }) =>
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.8}
                        onPress={() => preventDoublePress.onPress(() => onPressItem(item, index))}>
                        <View style={styles.FlatListItems}>
                            <View style={styles.FlatListGoodsName}>
                                <View style={styles.FlatListGoodsNameItem}>
                                    {
                                        item.order_information.map((m, i) =>
                                            <Text key={i} style={styles.GoodsName} >
                                                {m.goods_name}*{m.number}
                                            </Text>
                                        )
                                    }
                                </View>
                                <View style={styles.OrderType}>
                                    <Text style={[styles.OrderTypeText, { color: getOrderTypeColor(item.order_type) }]}>{getOrderType(item.order_type)}</Text>
                                </View>
                            </View>
                            <Text>总价 &nbsp;￥{getFloatStr(item.order_price / 100)}</Text>
                            <Text>状态 &nbsp;{getOrderState(item.order_state)}</Text>
                            {showType(item.order_number, item.phone_number, item.user_name)}
                            <Text style={styles.orderInfo}>下单时间 &nbsp;{item.date}</Text>
                        </View>
                    </TouchableOpacity>
                }
            />
        </View>
    )
}


export default listView;