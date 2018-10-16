import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableHighlight,
    ScrollView
} from 'react-native';
import styles from './style'
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import {  isLogin } from '../../../redux/actions';
import preventDoublePress from '../../../global/preventDoublePress';

class selectShopContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    
    componentDidMount() {
        preventDoublePress.reponTime = 100
    }
    componentWillMount () {
        preventDoublePress.reponTime = 1000
    };
    
    //  店铺选择
    selectShop = (id) =>{
        fetch(getURL + 'Index', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shop_id: id })
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                if (!!window.webSockConnect){
                    webSockConnect.close();
                    webSockConnect.reconnect()
                }
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'tabNav' })
                    ]
                });
                this.props.dispatch(isLogin(true))
                this.props.navigation.dispatch(resetAction);
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        })
        .catch((error) => {
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        })
    }

    //  权限
    authority(v) {
        if (v == 1) {
            return '订单管理'
        } else if (v == 2) {
            return '店铺信息管理'
        } else if (v == 3) {
            return '商品管理'
        } else if (v == 4) {
            return '统计管理'
        } else if (v == 5) {
            return '子管理员管理'
        } else if (v == 6) {
            return '资金管理'
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View>
                        {
                            this.props.counter.authority.authority_info.authority.map((item, index) => {
                                return (
                                    <TouchableHighlight 
                                        key={index}
                                        onPress={() => preventDoublePress.onPress(() => this.selectShop(item.shop_id))}
                                        activeOpacity={0.8}
                                        underlayColor="#bbb">
                                        <View style={{ padding: 12, backgroundColor: '#fff', borderBottomColor: '#e9e9e9', borderBottomWidth: 1 }}>
                                            <View style={{ flexDirection: 'row', paddingTop: 8, paddingBottom: 8 }}>
                                                <Text style={styles.title}>店铺名称:</Text>
                                                <Text style={{ marginLeft: 10, color: '#000' }}>{item.shop_name}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.title}>拥有权限:</Text>
                                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingTop: 8, paddingBottom: 8 }}>
                                                    {
                                                        item.authority.map((m, i) => {
                                                            return <Text key={i} style={styles.authority}>{this.authority(m)}</Text>
                                                        })
                                                    }
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableHighlight >
                                )
                            })
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

export default connect(mapStateToProps)(selectShopContainer);
