import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableHighlight,
} from 'react-native';
import styles from '../style';

//  历史搜索记录
const searchHistory = ({ searchHistory, selectHisItem,deleteItem }) => {
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
                                <View key={index} style={styles.historyList}>
                                    <TouchableHighlight 
                                        style={{ flex: 1, justifyContent: 'center' }}
                                        activeOpacity={1}
                                        underlayColor="#eee"
                                        onPress={() => selectHisItem(item.data)}>
                                        <Text>{item.data}</Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight
                                        style={{ alignItems: 'flex-end', width: 30 }}
                                        activeOpacity={1}
                                        underlayColor="#ccc"
                                        onPress={() => deleteItem(index)}>
                                        <Text style={{ fontSize: 25 }}>×</Text>
                                    </TouchableHighlight>
                                </View>
                            )
                        }) :
                        <View style={styles.historyEmpty}>
                            <Text style={styles.historyEmptyText}>暂无搜索记录</Text>
                        </View>
                }
            </View>
        </View>
    )
}


export default searchHistory;