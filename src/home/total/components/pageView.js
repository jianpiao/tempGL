import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';
import styles from '../style';
import Empty from '../../../global/components/empty/index';

const pageView = ({ todayData }) => {
    return (
        <View>
            {
                todayData.length > 0 ? 
                todayData.map((item, index) =>
                    <View key={index} style={styles.viewPager}>
                        <Text style={{color: '#333'}}>{item.goods_name}</Text>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text>日销 {item.number}份</Text>
                        </View>
                    </View>
                )
                :
                <View style={{ marginTop: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#aaa', fontSize: 20 }}>暂无商品</Text>
                </View>
            }
        </View>
    )
}

export default pageView;