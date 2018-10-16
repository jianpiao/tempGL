import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import styles from '../style';
import preventDoublePress from '../../../global/preventDoublePress';

export const Promption1 = ({ item, index, pager,jumpAdvertised}) => {
    return (
        <TouchableOpacity  
            activeOpacity={1}
            onPress={() => preventDoublePress.onPress(() => jumpAdvertised(item,index))}>
            <ImageBackground style={styles.promotion} source={{ uri: item.img }} resizeMode='cover'>
                <Text style={styles.promotionTitle}>{item.date}</Text>
                <View style={styles.promotionContent}>
                    <Text 
                        numberOfLines={3}
                        ellipsizeMode='tail'
                        style={styles.promotionContentTitle}>{item.title}
                    </Text>
                </View>
            </ImageBackground>
            <View style={styles.promotionBottom}>
                <View style={{ flexDirection: 'row' }}>
                    {
                        pager.map((m, i) => {
                            return (
                                <View key={i} style={[styles.promotionBottomTag, { backgroundColor: index == i ? '#fed016' : '#ccc', width: index == i ? 15 : 10}]}></View>
                            )
                        })
                    }
                </View>
            </View>
        </TouchableOpacity>
    )
}

export const Promption2 = ({ item, index, pager, jumpAdvertised }) => {
    return (
        <TouchableOpacity 
                activeOpacity={1}
                onPress={() => preventDoublePress.onPress(() => jumpAdvertised(item, index))}>
            <View style={styles.promotion}>
                <Text style={styles.promotionTitle}>{item.date}</Text>
                <View style={styles.promotionContent}>
                    <Text style={styles.promotionContentTitle}>{item.title}</Text>
                </View>
                <View style={styles.promotionBottom}>
                    <View style={{ flexDirection: 'row' }}>
                        {
                            pager.map((m, i) => {
                                return (
                                    <View key={i} style={[styles.promotionBottomTag, { backgroundColor: index == i ? '#fff' : '#ccc' }]}></View>
                                )
                            })
                        }
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}
