import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    ScrollView,
    RefreshControl,
    ImageBackground,
    TouchableOpacity,
    TouchableHighlight,
    TouchableNativeFeedback
} from 'react-native';
import styles from './style'
import { StackNavigator } from 'react-navigation';
import preventDoublePress from '../../global/preventDoublePress';
import { connect } from 'react-redux';
import { setShopInfo, isRefreshing } from '../../redux/actions';

//  我的
class meScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [
                { title: '打印机', icon: '\ue601' },
                { title: '设置', icon: '\ue62c' },
                { title: '更换店铺', icon: '\ue72e' },
                { title: '意见反馈', icon: '\ue611' }
            ]
        }
    }

    //  获取店铺信息
    getShop() {
        fetch(getURL + 'GetShop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                this.props.dispatch(setShopInfo(res.data))
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
            this.props.dispatch(isRefreshing(false))
        }).catch((error) => {
            this.props.dispatch(isRefreshing(false))
        })
    }
    //  通知
    notice = () => {
        this.props.counter.isLogin ? this.props.navigation.navigate('Notice') : this.props.navigation.navigate('Login')
    }
    //  通知数量
    noticeView = () => {
        let e = this.props.counter.notice.filter(m => m.read == 0).length
        return e > 0 ? e : ''
    }
    noticeNum = () => {
        let e = this.props.counter.notice.filter(m => m.read == 0).length
        return e > 0 ? 16 : 0
    }
    noticeMar = () => {
        let e = this.props.counter.notice.filter(m => m.read == 0).length
        return e > 0 ? -10 : 0
    }
    //  刷新
    onRefresh = () => {
        this.props.dispatch(isRefreshing(true))
        this.getShop()
    }
    //  跳转到设置
    jumpPage(i) {
        switch (i) {
            case -1:
                this.props.counter.isLogin ? this.props.navigation.navigate('Shop') : this.props.navigation.navigate('Login')
                break;
            case 0:
                this.props.counter.isLogin ? this.props.navigation.navigate('Print'): this.props.navigation.navigate('Login')
                break;
            case 1:
                this.props.counter.isLogin ? this.props.navigation.navigate('Setting') : this.props.navigation.navigate('Login')
                break;
            case 2:
                // webSockConnect.close()
                this.props.counter.isLogin ? this.props.navigation.navigate('SelectShop') : this.props.navigation.navigate('Login')
                break;
            case 3:
                this.props.counter.isLogin ? this.props.navigation.navigate('Feedback') : this.props.navigation.navigate('Login')
                break;
            default:
                break;
        }
    }
    //  查看图片
    checkImg = () => {
        this.props.navigation.navigate('Photo', {
            media: [{ photo: shopImg + 'shop_image/' + this.props.counter.shop.shop_image }],
            index: 0
        })
    }
    //  通知内容
    noticeValue = (index) => {
        switch (index) {
            case 0:
                return ''
                break;
            case 2:
                let [a,b,c] = [
                    this.props.counter.appVersion.current_version.state,
                    this.props.counter.appVersion.current_version.version,
                    this.props.counter.appVersion.your_version.version
                ]
                if (b != c && a == 0) {
                    return 1
                } else if (b != c && a == 1) {
                    return 1
                } else {
                    return ''
                }
                break;
        
            default:
                break;
        }
    }
    //  页面渲染
    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.counter.refreshing}
                            onRefresh={() => this.onRefresh()}
                            enabled={true}
                            colors={refreshColor}
                            progressBackgroundColor="#ffffff"
                        />
                    }
                    scrollEventThrottle={50}>
                    <View style={{backgroundColor: '#fff'}}>
                        <ImageBackground 
                        style={styles.imageBackground} 
                            source={this.props.counter.shop.back_image != null ? { uri: shopImg + 'shop_back_image/' + this.props.counter.shop.back_image} : require('../../static/img/31.png')} resizeMode='cover'>
                            <View style={styles.header}>
                                <View style={styles.headerSearch}></View>
                                <TouchableNativeFeedback
                                    background={TouchableNativeFeedback.Ripple('#aaa', true)}
                                    onPress={() => preventDoublePress.onPress(() => this.notice())}>
                                    <View style={styles.headerNotice}>
                                        <Text style={styles.headerNoticeIcon}>&#xe669;</Text>
                                        <View style={[styles.headerNoticeView, { width: this.noticeNum(), height: this.noticeNum(), marginLeft: this.noticeMar() }]}>
                                            <Text style={styles.headerNoticeText}>{this.noticeView()}</Text>
                                        </View>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        </ImageBackground>
                        <TouchableOpacity
                            activeOpacity={1} onPress={() => preventDoublePress.onPress(() => this.jumpPage(-1))}
                            style={styles.userInfo}>
                            {this.props.counter.shop.shop_image == null || undefined ?
                                <Image style={styles.image} source={require('../../static/img/glsyj.png')} />
                                :
                                <TouchableOpacity activeOpacity={1} onPress={() => preventDoublePress.onPress(() => this.checkImg())}>
                                    <Image style={styles.image} source={{ uri: shopImg + 'shop_image/' + this.props.counter.shop.shop_image }} />
                                </TouchableOpacity>
                            }
                            <Text style={styles.shop_name}>{this.props.counter.shop.shop_name == null || undefined ? '店铺名称' : this.props.counter.shop.shop_name}</Text>
                            <Text style={styles.synopsis}>{this.props.counter.shop.synopsis == null || undefined ? '店铺简介' : this.props.counter.shop.synopsis}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.footer}>
                        {
                            this.state.list.map((item, index) =>
                                <TouchableHighlight
                                    key={index}
                                    underlayColor="#eee"
                                    activeOpacity={1}
                                    onPress={() => preventDoublePress.onPress(() => this.jumpPage(index))}
                                >
                                    <View style={styles.jump}>
                                        <View style={styles.showLeft}>
                                            <Text style={styles.jumpText}>{item.icon} &nbsp;&nbsp; {item.title}</Text>
                                        </View>
                                        <View style={styles.showRight}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={styles.notice}>{this.noticeValue(index)}</Text>
                                                <Text style={styles.iconRight}>&#xe6b9;</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                            )
                        }
                    </View>  
                </ScrollView>         
            </View>
        )
    }
}



const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(meScreen);