import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';
import preventDoublePress from '../../../../../global/preventDoublePress';


const searchHistory = ({ searchHistory, selectHistory,deleteItem }) => {
    return (
        <View>
            <View style={{ margin: 12 }}>
                <Text style={{ color: '#000' }}>搜索历史</Text>
            </View>
            <View>
                {
                    searchHistory.length > 0 ?
                        searchHistory.map((item, index) => {
                            return (
                                <TouchableHighlight 
                                    key={index} 
                                    activeOpacity={1}
                                    underlayColor="#eee"
                                    onPress={() => preventDoublePress.onPress(() => selectHistory(item.data))}>
                                    <View style={{ padding: 12, borderTopColor: '#e9e9e9', borderTopWidth: 1, flexDirection: 'row' }}>
                                        <View style={{ flex: 1 }}>
                                            <Text>{item.data}</Text>
                                        </View>
                                        <TouchableOpacity
                                            style={{ alignItems: 'flex-end', width: 30 }}
                                            activeOpacity={1}
                                            onPress={() => preventDoublePress.onPress(() => deleteItem(index))}>
                                            <Text style={{ fontSize: 25 }}>×</Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableHighlight>
                            )
                        }) :
                        <View style={{ padding: 12, borderTopColor: '#e9e9e9', borderTopWidth: 1 }}>
                            <Text style={{ color: '#000' }}>暂无搜索记录</Text>
                        </View>
                }
            </View>
        </View>
    )
}


export default searchHistory;