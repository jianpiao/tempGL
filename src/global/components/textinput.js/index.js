import React, { Component } from 'react';
import {
    Text,
    View,
    TextInput,
    ToastAndroid,
    TouchableNativeFeedback
} from 'react-native';
import styles from './style'
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { setShopInfo, setAccount, isRefreshing } from '../../../redux/actions';
import { primaryFontColor } from '../../color';
import headerRightIcon from '../headerRightIcon/style';
import preventDoublePress from '../../preventDoublePress';

//  验证Email
checkEmail = (n) =>{
    let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    return reg.test(n);
}

//  内容输入组件
class textinputContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '输入内容',
            index: null,
            data: null,
            oldValue: '',
            value: '',
            tag: null,
            keyboardType: null
        }
    }

    /* 生命周期  节点动态渲染 */
    componentDidMount() {
        this.props.navigation.setParams({ navigatePress: this.comfirm })

        let { params } = this.props.navigation.state;
        this.setState({
            title: params ? params.title : '',
            index: params ? params.index : '',
            data: params ? params.data : '',
            oldValue: params ? params.value : '',
            value: params ? params.value : '',
            tag: params ? params.tag : '',
            keyboardType: params ? params.keyboardType : ''
        })    
    }

    //  提交按钮
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.title,//设置标题内容
        headerRight: (
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple('#eee', true)}
                onPress={() => preventDoublePress.onPress(() => navigation.state.params.navigatePress())}>
                <View style={headerRightIcon.headerRightView}>
                    <Text style={headerRightIcon.headerRightIcon}>
                        &#xe609;
                    </Text>
                </View>
            </TouchableNativeFeedback>
        )
    });

    //  提交信息
    submitInfo(data,api) {
        api = api == 1 ? 'SetPhoneNumber' : 'SetShopInfo'
        fetch(getURL + api, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then((res) => res.json()).then((res) => {
            if (res.error == 0) {
                let [i, t, g] = [this.state.index, this.state.value.trim(), this.state.tag]
                switch (g) {
                    case 'fee':
                        //  如果tag是fee则改变打包和外面费用
                        if (i == 0) {
                            this.props.counter.shop.packing_fee = t * 100
                        } else if (i == 1) {
                            this.props.counter.shop.takeout_fee = t * 100
                        } else  {
                            this.props.counter.shop.free_amount = t * 100
                        }
                        //  改变渲染
                        this.props.dispatch(setShopInfo(this.props.counter.shop))
                        break;
                    case 'shopName':
                        //  如果tag 是shopName 则改变店铺名称
                        this.props.counter.shop.shop_name = t
                        this.props.dispatch(setShopInfo(this.props.counter.shop))
                        break;
                    case 'shopSynopsis':
                        //  如果tag 是shopName 则改变店铺简介
                        this.props.counter.shop.synopsis = t
                        this.props.dispatch(setShopInfo(this.props.counter.shop))
                        break;
                    case 'shopPhone':
                        //  如果tag 是shopName 则改变店铺号码
                        this.props.counter.shop.phone_number = t
                        this.props.dispatch(setShopInfo(this.props.counter.shop))
                        break;
                    case 'shopAddress':
                        this.props.counter.shop.address = t
                        this.props.dispatch(setShopInfo(this.props.counter.shop))
                        break;
                    case 'accountPhone':
                        this.props.counter.account.phone_number = t
                        this.props.dispatch(setAccount(this.props.counter.account))
                        break;
                    default:
                        break;
                }
                ToastAndroid.show('设置成功', ToastAndroid.SHORT);
                this.props.navigation.goBack();
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
            this.props.dispatch(isRefreshing(false))
        })
        .catch((error) => {
            console.log(error);
            
            this.props.dispatch(isRefreshing(false))
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        })
    }
    

    //  确认
    comfirm = () => {
        this.props.dispatch(isRefreshing(true))
        let [i, t, g, o] = [this.state.index, this.state.value.trim(), this.state.tag, this.state.oldValue.trim()]
        //  先检测输入的内容是否为空
        if (t.length > 0 && t != o) {
            switch (g) {
                case 'fee':
                    //  如果tag是fee则改变打包和外面费用
                    if (i == 0) {
                        this.submitInfo({ packing_fee: t * 100 })
                    } else if (i == 1) {
                        this.submitInfo({ takeout_fee: t * 100 })
                    } else {
                        this.submitInfo({ free_amount: t * 100 })
                    }
                    break;
                case 'shopName':
                    //  如果tag 是shopName 则改变店铺名称
                    this.submitInfo({ shop_name: t })
                    break;
                case 'shopSynopsis':
                    //  如果tag 是shopName 则改变店铺简介
                    this.submitInfo({ synopsis: t })
                    break;
                case 'shopPhone':
                    //  如果tag 是shopName 则改变店铺号码
                    if (checkPhone(t)) {
                        this.submitInfo({ phone_number: t })
                    } else {
                        ToastAndroid.show('号码有误', ToastAndroid.SHORT);
                    }
                    break;
                case 'shopAddress':
                    this.submitInfo({ address: t })
                    break;
                case 'accountPhone':
                    if (checkPhone(t)) {
                        this.submitInfo({ phone_number: t }, 1)
                    } else {
                        ToastAndroid.show('号码有误', ToastAndroid.SHORT);
                    }
                    break;
                default:
                    this.props.dispatch(isRefreshing(false))
                    break;
            }
        } else if (t == o) {
            this.props.dispatch(isRefreshing(false))
            ToastAndroid.show('内容未修改', ToastAndroid.SHORT);
            this.props.navigation.goBack();
        }
         else {
            this.props.dispatch(isRefreshing(false))
            ToastAndroid.show('内容不能为空', ToastAndroid.SHORT);
        }
    }

    //  页面
    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.text}
                    autoFocus={true}
                    selectionColor={primaryFontColor}
                    keyboardType={this.state.keyboardType}
                    onChangeText={(text) => this.setState({ value: text })}
                    value={this.state.value != null ? this.state.value : ''}
                    multiline={true}
                    underlineColorAndroid="transparent"
                    placeholder={this.state.title}
                />
            </View>
        )
    }
}


const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(textinputContainer);
