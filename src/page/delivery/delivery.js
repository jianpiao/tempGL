import React, { Component } from 'react';
import {
    Text,
    View,
    Alert,
    Button,
    FlatList,
    ToastAndroid,
    TouchableHighlight
} from 'react-native';
import styles from './style';
import { connect } from 'react-redux';
import { setTableDelivery, isRefreshing } from '../../redux/actions';
import preventDoublePress from '../../global/preventDoublePress';
import Empty from '../../global/components/empty/index';
import headerRightIcon from '../../global/components/headerRightIcon/style';

class DeliveryContainer extends Component {

    componentDidMount = () => {
        this.delivery()
        this.props.navigation.setParams({ cleanAll: this.cleanAll })
    };

    //  头部右边按钮
    // static navigationOptions = ({ navigation }) => ({
    //     // 这里面的属性和App.js的navigationOptions是一样的。
    //     headerRight: (
    //         <TouchableNativeFeedback
    //             background={TouchableNativeFeedback.Ripple('#aaa', true)}
    //             onPress={() => preventDoublePress.onPress(() => navigation.state.params.cleanAll())}>
    //             <View style={headerRightIcon.headerRightView}>
    //                 <Text style={headerRightIcon.headerRightIcon2}>
    //                     &#xe630;
    //                 </Text>
    //             </View>
    //         </TouchableNativeFeedback>
    //     )
    // });
    cleanAll = () => {
        Alert.alert(
            '提示',
            '全部配送完毕？',
            [
                { text: '取消', onPress: () => null, style: 'cancel' },
                {
                    text: '确认', onPress: () => {
                        this.props.counter.tableDelivery.length > 0
                            ?
                            this.props.dispatch(setTableDelivery([]))
                            :
                            ToastAndroid.show('暂无订单，无需上菜', ToastAndroid.SHORT)
                    }
                },
            ],
            { cancelable: false }
        )
    }

    /* 提交事件 */
    Serving(id,index) {
        fetch(getURL + 'Serving', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                order_id: id
            })
        }).then((res) => res.json()).then((res) => {
            console.log(res.data)
            if (res.error == 0) {
                //  提交成功清除首页订单
                this.props.counter.tableDelivery.splice(index, 1)
                this.props.dispatch(setTableDelivery(this.props.counter.tableDelivery))
                ToastAndroid.show('提醒成功', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        }).catch((error) => {
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        })
    }
    //  获取代收餐具订单
    delivery () {
        //  获取桌面上菜订单
        fetch(getURL + 'GetServingOrderList', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
        .then((res) => res.json())
        .then((res) => {
            console.log(res.data);
            
            if (res.error == 0) {
                this.props.dispatch(setTableDelivery(res.data))
            } else if (res.error == 1000) {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
                this.props.dispatch(setTableDelivery([]))
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
            this.props.dispatch(isRefreshing(false))
        }).catch((e) => {
            this.props.dispatch(isRefreshing(false))
        })
    }
    //  送餐 
    setout =(id,index) => {
        Alert.alert(
            '',
            '提醒用户取餐(发货)',
            [
                { text: '取消', onPress: () => null, style: 'cancel' },
                { text: '确认', onPress: () => this.Serving(id, index) },
            ],
            { cancelable: false }
        )
    }
    //  查看详情
    jumpDetail = (item,index) => {
        this.props.navigation.navigate('OrderDetailes', {
            detail: item,
            index: index,
            tag: 'delivery',
        });
    }
    //  下拉刷新
    onRefresh = () => {
        this.props.dispatch(isRefreshing(true))
        this.delivery()
    }
    //  行与行之间的分隔线组件
    itemSeparatorComponent = () => {
        return <View style={{ height: .8, backgroundColor: '#e8e8e8' }} />
    }
    //  列表为空时渲染该组件
    emptyComponent = () => {
        return <Empty />
    }
    /* 渲染 */
    render() {
        return (
            <View style={styles.contarner}>
                <FlatList
                    refreshing={this.props.counter.refreshing}
                    onRefresh={() => this.onRefresh()}
                    data={this.props.counter.tableDelivery}
                    ItemSeparatorComponent={() => this.itemSeparatorComponent()}
                    ListEmptyComponent={() => this.emptyComponent()}
                    renderItem={({ item, index }) =>
                        <TouchableHighlight
                            underlayColor="#e8e8e8"
                            activeOpacity={1}
                            style={styles.listItem}
                            key={index}
                            onPress={() => preventDoublePress.onPress(() => this.jumpDetail(item, index))}>
                            <View>
                                <Text style={styles.address}>餐桌位置：{item.address}</Text>
                                <Text style={styles.name}>餐名：
                                        {
                                        item.order_information.map((m, i) => {
                                            return m.goods_name
                                        })
                                    }
                                </Text>
                                <Text style={styles.name}>订单号：{item.order_id}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.time}>下单时间：{item.date}</Text>
                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <Button
                                            title="  送餐  "
                                            color='#0aa394'
                                            style={{ marginRight: 15 }}
                                            onPress={() => this.setout(item.order_id, index)} />
                                    </View>
                                </View>
                            </View>
                        </TouchableHighlight>
                    }
                />
            </View>
        )
    }
}


const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(DeliveryContainer);


