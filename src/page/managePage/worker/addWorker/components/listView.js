import React, { Component } from 'react';
import {
    Text,
    View,
    FlatList,
    ScrollView,
    RefreshControl,
    TouchableHighlight
} from 'react-native';
import styles from '../style'
import Empty from '../../../../../global/components/empty';
import preventDoublePress from '../../../../../global/preventDoublePress';
import {empty} from '../../../../../global/global';

const listView = ({ data, onRefresh, refreshing, onPressItem }) => {
    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => onRefresh()}
                    enabled={true}
                    colors={refreshColor}
                    progressBackgroundColor="#ffffff"
                />
            }
            scrollEventThrottle={50}>
        {
            data.length > 0 ? 
                <FlatList
                    data={data}
                    renderItem={({ item, index }) =>
                        <TouchableHighlight
                            key={index}
                            underlayColor="#eee"
                            activeOpacity={1}
                            onPress={() => preventDoublePress.onPress(() => onPressItem(item, index))}>
                            <View style={styles.listView}>
                                <ListViewItem title="账户名称" data={item.account_name} />
                                <ListViewItem title="真实姓名" data={item.real_name} />
                                <ListViewItem title="手机号码" data={item.phone_number} />
                                <ListViewItem title="邮箱" data={item.email} />
                            </View>
                        </TouchableHighlight>
                    }
                /> :
            <Empty content={empty(refreshing, data,'暂无内容')} />
        }
        </ScrollView>
    )
}  


const ListViewItem = ({ title, data }) => {
    return (
        <View style={styles.listViewItem}>
            <View>
                <Text style={styles.rightText}>{title}</Text>
            </View>
            <View style={styles.leftView}>
                <Text>{data}</Text>
            </View>
        </View>
    )
}

export default listView;