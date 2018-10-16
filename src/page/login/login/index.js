import React, { Component} from 'react';
import {
    Text,
    View,
    Alert,
    TextInput,
    AsyncStorage,
    ToastAndroid,
    TouchableNativeFeedback
} from 'react-native';
import styles from './style'
import { StackActions,NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { 
    authority, 
    isLogin,
    isRefreshing
} from '../../../redux/actions';
import preventDoublePress from '../../../global/preventDoublePress';

class loginContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    componentDidMount = () =>{
        this.readData()
    }
    //  登录按钮点击事件
    login = () => {
        if (Trim(this.state.username).length > 0 && Trim(this.state.password).length > 0) {
            this.props.dispatch(isRefreshing(true))
            this.submit()
        } else if (Trim(this.state.username).length == 0 || Trim(this.state.password).length == 0) {
            ToastAndroid.show('帐号或密码不能为空', ToastAndroid.SHORT);
        } else {
            ToastAndroid.show('帐号或密码输入有误', ToastAndroid.SHORT);
        }
    }
    //  登录请求
    submit () {
        fetch(getURL + 'Login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                account_name: this.state.username,
                account_pass: this.state.password
            })
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                if (res.data.authority_info.account_state == 0) {
                    ToastAndroid.show('该账号已被停用', ToastAndroid.SHORT);
                } else if (res.data.authority_info.account_state == 1) {
                    //  正在审核中
                    ToastAndroid.show('帐号正在审核中', ToastAndroid.SHORT);
                } else if (res.data.authority_info.account_state == 2) {
                    //  登录成功
                    this.saveData()
                    this.props.dispatch(authority(res.data))
                    this.shopList(res.data)
                } else if (res.data.authority_info.account_state == 3) {
                    //  审核不通过 让用户修改数据重新上传
                    ToastAndroid.show('审核不通过,请重新上传', ToastAndroid.SHORT);
                }
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        }).catch((error) => {
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        })
    }
    //  店铺选择
    shopList(data) {
        if (data.authority_info.authority.length == 0) {
            this.jumpHome()
            ToastAndroid.show('您暂无店铺', ToastAndroid.SHORT);
        } else if (data.authority_info.authority.length == 1) {
            this.selectShop(data.authority_info.authority[0].shop_id)
        } else {
            this.props.navigation.navigate('SelectShop')
        }
    }
    //  获取店铺数量
    selectShop(id) {
        fetch(getURL + 'Index', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({shop_id: id})
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                this.jumpHome()
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        }).catch((error) => {
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        })
    }
    //  跳到首页
    jumpHome = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'tabNav' })
            ]
        });
        this.props.navigation.dispatch(resetAction);
        this.props.dispatch(isLogin(true))
    }
    // 注册
    logup = () => {
        this.props.navigation.navigate('Logup')
    }
    //  忘记密码
    forgetPassword = () => {
        this.props.navigation.navigate('ForgetPassword')
    }
    //  保存历史记录
    saveData = () => {
        this.setState({
            username: this.state.username
        })
        AsyncStorage.setItem('username', JSON.stringify(this.state.username), (error) => {
            if (error) {
                //  保存失败
            } else {
                //  保存成功
            }
        })
    }
    //  读取历史记录
    readData = () => {
        AsyncStorage.getItem('username', (error, value) => {
            if (error) {
                //  读取失败
            } else {
                //  读取成功
                value !== null ? this.setState({ username: JSON.parse(value) }) : null
            }
        })
    }


    //  页面
    render() {
        return (
            <View style={styles.container}>
                <View style={{ height: 200, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1fcea7' }}>
                    <Text style={{ color: '#fff', fontSize: 27, fontWeight: '600', marginTop: 5, letterSpacing: 3 }}>广理商业街</Text>
                </View>
                <View style={{ flex: 1,marginTop: 20,marginLeft: 20,marginRight: 20,marginBottom: 50}}>
                    <View style={{ flexDirection: 'row', paddingLeft: 7, paddingRight: 7, marginBottom: 15, borderBottomColor: '#ccc', borderBottomWidth: 0.7}}>
                        <View style={{justifyContent: 'center'}}>
                            <Text style={{ fontFamily: 'iconfont',fontSize: 18 }}>&#xe623;</Text>
                        </View>
                        <View style={{ flex: 1, paddingLeft: 10}}>
                            <TextInput
                                style={{fontSize: 16,borderBottomColor: '#000',}}
                                placeholder='用户名/手机号码'
                                keyboardType='default'
                                underlineColorAndroid="transparent"
                                onChangeText={(t) => this.setState({username: t})}
                                value={this.state.username}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', paddingLeft: 7, paddingRight: 7, borderBottomColor: '#ccc', borderBottomWidth: 0.7 }}>
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={{ fontFamily: 'iconfont', fontSize: 18 }}>&#xe603;</Text>
                        </View>
                        <View style={{flex: 1,paddingLeft: 10}}>
                            <TextInput
                                style={{ fontSize: 16 }}
                                placeholder='密码'
                                keyboardType='default'
                                textContentType='password'
                                secureTextEntry={true}
                                underlineColorAndroid="transparent"
                                onChangeText={(t) => this.setState({ password: t })}
                                value={this.state.password}
                            />
                        </View>
                    </View>
                    <View style={{marginTop: 50}}>
                        <TouchableNativeFeedback
                            background={TouchableNativeFeedback.Ripple('#aaa', false)}
                            onPress={() => preventDoublePress.onPress(() => this.login())}>
                            <View style={{ height: 40, backgroundColor: '#1fcea7', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                                <Text style={{ fontSize: 16, color: '#fff' }}>登录</Text>
                            </View>
                        </TouchableNativeFeedback>
                        <View style={{marginTop: 30,flexDirection: 'row'}}>
                            <View style={{flex: 1}}>
                                <Text 
                                    onPress={() => preventDoublePress.onPress(() => this.forgetPassword())}
                                style={{color: '#777',textAlign: 'right'}}>忘记密码?</Text>
                            </View>
                            <View style={{ height:14,width:1,marginTop: 3,backgroundColor: '#999',marginLeft: 20,marginRight: 20 }}></View>
                            <View style={{ flex: 1}}>
                                <Text 
                                    onPress={() => preventDoublePress.onPress(() => this.logup())}
                                    style={{ color: '#0aa394',textAlign: 'left'}}>注册
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(loginContainer);
