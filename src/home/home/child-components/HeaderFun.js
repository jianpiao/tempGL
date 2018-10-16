import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    TouchableNativeFeedback
} from 'react-native';
import styles from '../style.js';
import preventDoublePress from '../../../global/preventDoublePress';
//  图标
const icon = i => {
    switch (i) {
        case 0:
            return <Text style={styles.headerFunIcon}>&#xe602;</Text>
            break; 
        case 1:
            return <Text style={styles.headerFunIcon}>&#xe672;</Text>
            break;
        default:
            return <Text style={styles.headerFunIcon}>&#xe60b;</Text>
            break;
    }
} 
//  组件
const CleanWare = ({ search, notice,noticeView,completed, ware, table, headerIconPress }) => {
    let List = [
        { "title": '待收餐具', data: ware },
        { "title": '待上菜', data: table },
        { "title": '已处理', data: completed }
    ]
    return (
        <View>
            <View style={styles.header}>
                <TouchableOpacity 
                    activeOpacity={1}
                    onPress={() => preventDoublePress.onPress(() => search())}
                    style={styles.headerSearch}>
                    <Text style={styles.headerSearchIcon}>&#xe627;</Text>
                    <Text style={styles.headerSearchText}>搜索订单号/日期/手机号/用户名</Text>
                </TouchableOpacity>
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple('#eee', true)}
                    onPress={() => preventDoublePress.onPress(() => notice())}>
                    <View style={styles.headerNotice}>
                        <Text style={styles.headerNoticeIcon}>&#xe669;</Text>
                        <View style={[styles.headerNoticeView, { width: noticeView > 0 ? 16 : 0, height: noticeView > 0 ? 16 : 0, marginLeft: noticeView>0 ? -10 : 0}]}>
                            <Text style={styles.headerNoticeText}>{noticeView > 0 ? noticeView : ''}</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>
            </View>
            <View style={styles.headerFun}>
                {
                    List.map((m, i) =>
                        <TouchableOpacity
                            key={i}
                            style={styles.headerFunList}
                            activeOpacity={1}
                            onPress={() => preventDoublePress.onPress(() => headerIconPress(i))}>
                            {icon(i)}
                            <Text style={styles.headerFunText1}>{m.title}</Text>
                            <Text style={styles.headerFunText1}>{m.data}{i == 2 ? '单' : '份'}</Text>
                        </TouchableOpacity >
                    )
                }
            </View>
        </View>
    )
}

export default CleanWare;



