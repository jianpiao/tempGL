import React from 'react';
import { createMaterialTopTabNavigator, createBottomTabNavigator } from 'react-navigation';
import { StyleSheet, Image, Text, View } from 'react-native';

//  页面
import HomeScreen from '../src/home/home/home';
import ManageScreen from '../src/home/manage/manage';
import totalScreen from '../src/home/total/total';
import MeScreen from '../src/home/me/me';


//  字体和颜色
import { fontsize20 } from '../src/global/fontSize';
import {
    activeColor,
    primary,
    press,//  波纹
    gray, // label和icon的背景色 不活跃状态下（未选中）。
    white,
    border
} from '../src/global/color';

const style = StyleSheet.create({
    footImage: {
        width: 23,
        height: 23
    },
    Icon: {
        fontFamily: 'iconfont',
        fontSize: fontsize20
    }
});  

const headerStyle = {
    backgroundColor: '#fff',
    elevation: 0,
    borderBottomColor:border,
    borderBottomWidth: 1
}



//Tab
export default createMaterialTopTabNavigator({
    //每一个页面的配置
    Home: {
        screen: HomeScreen,
        navigationOptions: () => ({
            tabBarLabel: '订单',
            tabBarIcon: ({ tintColor }) => (
                <Image style={[style.footImage, { tintColor: tintColor }]}
                    source={require('../src/static/icon/new.png')}
                />
            ),
            headerStyle: headerStyle
        })
    },
    Manage: {
        screen: ManageScreen,
        navigationOptions: () => ({
            tabBarLabel: '管理',
            tabBarIcon: ({ tintColor }) => (
                <Image style={[style.footImage, { tintColor: tintColor }]}
                    source={require('../src/static/icon/manage.png')}
                />
            ),
            headerStyle: headerStyle
        })
    },
    Total: {
        screen: totalScreen,
        navigationOptions: () => ({
            tabBarLabel: '统计',
            tabBarIcon: ({ tintColor }) => (
                <Image style={[style.footImage, { tintColor: tintColor }]}
                    source={require('../src/static/icon/total.png')}
                />
            ),
            headerStyle: headerStyle
        })
    },
    Me: {
        screen: MeScreen,
        navigationOptions: () => ({
            tabBarLabel: '我的',
            tabBarIcon: ({ tintColor }) => (
                <Image style={[style.footImage, { tintColor: tintColor }]}
                    source={require('../src/static/icon/me.png')}
                />
            ),
            headerStyle: headerStyle
        })
    }
}, {
        //设置TabNavigator的位置
        tabBarPosition: 'bottom',
        //是否在更改标签时显示动画
        animationEnabled: false,
        //是否允许在标签之间进行滑动
        swipeEnabled: true,
        //按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
        backBehavior: "none",
        //　懒加载
        lazy: false,
        //设置Tab标签的属性
        tabBarOptions: {
            //共有属性
            showLabel: true,//是否显示label，默认开启
            activeBackgroundColor: activeColor,
            activeTintColor: primary,
            inactiveBackgroundColor: activeColor,
            pressColor: press,//  波纹
            inactiveTintColor: gray, // label和icon的背景色 不活跃状态下（未选中）。
            style: { //TabNavigator 的背景颜色
                backgroundColor: white,
                height: 50
            },
            showIcon: true,
            labelStyle: {//文字的样式
                fontSize: 11,
                marginTop: 0
            },
            indicatorStyle: {
                height: 0
            }
        }
    });




