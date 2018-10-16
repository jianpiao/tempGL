import React, { Component } from 'react';
import {
    Text,
    View,
    Alert,
    Image,
    Switch,
    Linking,
    ScrollView,
    ToastAndroid,
    TouchableOpacity,
    TouchableHighlight,
    TouchableNativeFeedback,
    
} from 'react-native';
import styles from './style'
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { setShopInfo, isLogin } from '../../../redux/actions';
import preventDoublePress from '../../../global/preventDoublePress';


//  设置
class settingContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            basicSetting: [
                { title:'账户信息'},
                { title: '店铺信息'}
            ],
            takeout_fee: 0,
            packing_fee: 0,
            inputPrice: '',
            inputStatus: 1
        }
    }
    
    
    //  基本设置 的页面跳转
    jumpPage(i) {
        switch (i) {
            case 0:
                this.props.navigation.navigate('Account');
                break;
            case 1:
                this.props.navigation.navigate('Shop');
                break;

            default:
                ToastAndroid.show('没有了~', ToastAndroid.SHORT);
                break;
        }
    }
    //  打包和外卖
    jumpInputText(f, t, i) {
        this.props.navigation.navigate('Textinput', {
            transition: 'forHorizontal',
            title: '修改' + t,
            index: i,
            data: '',
            value: ""+f,
            tag: 'fee',
            keyboardType: 'numeric'
        });
    }
    //  关于和更新
    aboutAndUp = i => {
        switch (i) {
            case 0:
                this.props.navigation.navigate('About');
                break;

            default:
                this.getVersion()
                break;
        }
    }
    //  设置店铺信息
    SetShopInfo(data) {
        fetch(getURL + 'SetShopInfo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then((res) => res.json()).then((res) => {
            if (res.error == 0) {
                ToastAndroid.show('设置成功', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        }).catch((error) => {
                ToastAndroid.show('网络不稳定', ToastAndroid.SHORT);
            }
        )
    }
    //  更新版本
    getVersion() {
        fetch(getURL + 'GetVersion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                platform: 'Android',
                version: APPVersion
            })
        }).then((res) => res.json()).then((res) => {
            if (res.error == 0) {
                if (res.data.your_version.version != res.data.current_version.version && res.data.current_version.state == 0) {
                    Alert.alert(
                        '',
                        '版本更新',
                        [
                            { text: '确认', onPress: () => {
                                Linking.canOpenURL(res.data.current_version.download_url).then(supported => {
                                    if (!supported) {
                                        null
                                    } else {
                                        return Linking.openURL(res.data.download_url);
                                    }
                                }).catch(err => null);
                            }}
                        ],
                        { cancelable: false }
                    )
                } else if (res.data.your_version.version != res.data.current_version.version && res.data.current_version.state == 1){
                    Alert.alert(
                        '',
                        '有新的版本，是否要更新',
                        [
                            { text: '取消', onPress: () => null, style: 'cancel' },
                            { text: '确认', onPress: () => {
                                Linking.openURL(res.data.current_version.download_url).catch((err) => {null})
                            }},
                        ],
                        { cancelable: false }
                    )
                } else {
                    ToastAndroid.show('已经是最新版本', ToastAndroid.SHORT);
                }
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        }).catch((error) => {
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        })
    }
    //  点餐类型
    orderChange = (value,i) => {
        switch (i) {
            case 0:
                this.props.counter.shop.reserve_order = value
                this.SetShopInfo({ reserve_order: value ? 1 : 0 })
                break;
            case 1:
                this.props.counter.shop.online_order = value
                this.SetShopInfo({ online_order: value ? 1 : 0 })
                break;
            case 2:
                this.props.counter.shop.reception_order = value
                this.SetShopInfo({ reception_order: value ? 1 : 0 })
                break;
            case 3:
                this.props.counter.shop.tabletop_order = value
                this.SetShopInfo({ tabletop_order: value ? 1 : 0 })
                break;
            default:
                break;
        }
        this.props.dispatch(setShopInfo(this.props.counter.shop))
    }
    //  官网、公众号地址
    jumpAboutSite = (i) => {
        switch (i) {
            case 0:
                this.props.navigation.navigate('Advertised', {
                    item: { url:'https://wokecp.kuaizhan.com/'},
                    title: 'Wo客官网'
                })
                break;
            case 1:
                this.props.navigation.navigate('Advertised', {
                    item: { url: 'https://wokecp.kuaizhan.com/' },
                    title: '微信公众号'
                })
                break;
            default:
                ToastAndroid.show('等待添加', ToastAndroid.SHORT);
                break;
        }
    }
    //  退出账户登录
    backAccount = () => {
        Alert.alert(
            '',
            '确定退出当前账户吗?',
            [
                { text: '取消', onPress: () => null, style: 'cancel' },
                { text: '退出', onPress: () => this.quit()},
            ],
            { cancelable: false }
        )
    }
    //  退出
    quit () {
        fetch(getURL + 'Quit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }).then((res) => res.json()).then((res) => {
            this.props.dispatch(isLogin(false))
            webSockConnect.close()
        })
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Login' }),
            ],
        });
        this.props.navigation.dispatch(resetAction);
    }
    //  页面渲染
    render() {
        let packAndTake = [
            { title: "打包费", fee: this.props.counter.shop.packing_fee/100 },
            { title: "外卖费", fee: this.props.counter.shop.takeout_fee / 100 },
            { title: "免运费起步金额", fee: this.props.counter.shop.free_amount /100 },
        ]
        let orderTypeList = [
            { title: '预定点餐', order: this.props.counter.shop.reserve_order },
            { title: '线上点餐', order: this.props.counter.shop.online_order },
            { title: '前台点餐', order: this.props.counter.shop.reception_order },
            { title: '桌面点餐', order: this.props.counter.shop.tabletop_order },
            // { title: '店铺最高销量', order: this.props.counter.shop.tabletop_order },
        ]
        let aboutList = [
            { title: '官方网站', img: require('../../../static/img/woke.png') },
            { title: '微信公众号', img: require('../../../static/img/glsyj.png') },
            { title: '电话联系', img: require('../../../static/img/m3.jpg') },
        ]
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.content}>
                        <Text style={styles.type}>基本设置</Text>
                        {
                            this.state.basicSetting.map((m,i) => 
                                <TouchableHighlight style={styles.jump} activeOpacity={0.9} underlayColor="#eee" key={i}
                                        onPress={() => preventDoublePress.onPress(() => this.jumpPage(i))}>
                                    <View style={styles.showLeft}>
                                        <Text style={styles.text}>{m.title}</Text>
                                    </View>
                                </TouchableHighlight>
                            )
                        }

                        <Text style={styles.type}>默认设置</Text>
                            {/** 打包费和外卖费 ↓  **/}
                        {
                            packAndTake.map((m,i) => 
                                <TouchableHighlight 
                                    underlayColor="#eee"
                                    activeOpacity={1} 
                                    key={i}
                                    onPress={() => preventDoublePress.onPress(() =>this.jumpInputText(m.fee, m.title, i))}>
                                    <View style={styles.jump} >
                                        <View style={styles.showLeft}>
                                            <Text style={styles.text}>{m.title}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.text}>{m.fee}元</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                            )
                        }
                        {/** 点餐类型 ↓  **/}
                        {
                            orderTypeList.map((m,i) => 
                                <TouchableHighlight 
                                    activeOpacity={1} 
                                    underlayColor="#eee"
                                    key={i}
                                    onPress={() => preventDoublePress.onPress(() => this.orderChange(!m.order, i))}>
                                    <View style={styles.jump} >
                                        <View style={styles.showLeft}>
                                            <Text style={styles.text}>{m.title}</Text>
                                        </View>
                                        <View>
                                            <Switch value={m.order}
                                                thumbTintColor={m.order ? '#0aa394' : '#f0f0f0'}
                                                onTintColor="#95b9b6"
                                                onValueChange={(value) => this.orderChange(value, i)} />
                                        </View>
                                    </View>
                                </TouchableHighlight>
                            )
                        }

                
                        <Text style={styles.type}>关于和更新</Text>
                        <TouchableHighlight
                            activeOpacity={1}
                            underlayColor="#eee"
                            onPress={() => preventDoublePress.onPress(() => this.aboutAndUp(1))}>
                            <View style={styles.jump}>
                                <View style={styles.showLeft}>
                                    <Text style={styles.text}>软件更新</Text>
                                </View>
                                <View>
                                    <Text>当前版本 V{APPVersion}</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            activeOpacity={1}
                            underlayColor="#eee"
                            onPress={() => preventDoublePress.onPress(() => this.aboutAndUp(0))}>
                            <View style={styles.jump}>
                                <View style={styles.showLeft}>
                                    <Text style={styles.text}>关于我们</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                        <View style={styles.aboutList}>
                            {
                                aboutList.map((item, index) => {
                                    return (
                                        <TouchableOpacity 
                                            activeOpacity={1}
                                            key={index} 
                                            style={styles.aboutSite}
                                            onPress={() => preventDoublePress.onPress(() => this.jumpAboutSite(index))}>
                                            <Image
                                                source={item.img}
                                                style={styles.aboutImg}
                                            />
                                            <Text style={{ marginTop: 10 }}>{item.title}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    </View>

                    <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple('#eee', false)}
                        onPress={() => preventDoublePress.onPress(() => this.backAccount())}>
                        <View style={styles.backAccount}>
                            <Text style={{ color: '#ff0000' }}>退出登录</Text>
                        </View>
                    </TouchableNativeFeedback>
                    
                </ScrollView>
            </View>
        )
    }
}


const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(settingContainer);