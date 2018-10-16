import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import styles from '../style';
import preventDoublePress from '../../../global/preventDoublePress';

const goodsManage = ({ jumpGoodsList, jumpAddGoods}) => {
    return (
        <TouchableOpacity 
            activeOpacity={1}
            onPress={() => preventDoublePress.onPress(() => jumpGoodsList())}
            style={{ backgroundColor: '#fff',padding: 12}}>
            <View style={{flexDirection: 'row'}}>
                <Text>商品管理</Text>
                <View style={{flex: 1,alignItems: 'flex-end'}}>
                    <Text
                        style={{ color: '#0aa394' }}
                        onPress={() => preventDoublePress.onPress(() => jumpAddGoods())}>
                        添加商品
                    </Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', height: 100, borderRadius: 5, marginTop: 10, padding: 12, backgroundColor: '#f3f3f3'}}>
                <View style={{ flex: 1, justifyContent: 'center'}}>
                    <Text style={{ color: '#333',fontSize: 25, fontWeight: '600',marginBottom: 5 }}>商品管理</Text>
                    <Text>进行商品增删改查操作</Text>
                </View>
                <View style={{marginLeft: 10,justifyContent: 'center'}}>
                    <Text style={{ fontFamily: 'iconfont',fontSize: 40}}>&#xe65a;</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default goodsManage;