import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Alert,
    NativeModules,
    ToastAndroid
} from 'react-native';
import styles from './style.js';
import { getOrderTypeColor} from '../../global/global';
import { connect } from 'react-redux';
import { setNewOrder, refund, getAllRefund, getTransactions, setTableDelivery, isRefreshing  } from '../../redux/actions';
import preventDoublePress from '../../global/preventDoublePress';



/*  订单详情  */
class DetailContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detail: { order_price: 0, order_state: 0},
            index: null,
            information: [],
            tag: '',
            list: [],
        }
    }

    /* 节点改变 */
    componentDidMount = () => {
        //  获取页面传值
        let { params } = this.props.navigation.state
        let detail = params ? params.detail : null
        let index = params ? params.index : null
        let tag = params ? params.tag : null
        this.setState({
            detail: detail,
            index: index,
            information: detail.order_information,
            tag: tag,
            list: [
                { title: '商品内容', data: detail.order_information},
                { title: '订单类型', data: detail.order_type },
                { title: '配送状态', data: getTransportState(detail.travel_position) },
                { title: '打包费', data: getFloatStr(detail.packing_fee / 100) },
                { title: '外卖费', data: getFloatStr(detail.takeout_fee / 100) },
                { title: '订单编号', data: detail.order_id },
                { title: '下单时间', data: detail.date },
                { title: '付款时间', data: detail.time_end },
                { title: '用户名称', data: detail.user_name },
                { title: '联系方式', data: detail.phone_number },
                { title: '地址(座位)', data: detail.address },
                { title: '订单备注', data: detail.remark },
                { title: '店铺单号', data: detail.shop_every_id },
                { title: '系统单号', data: detail.order_number }
            ]
        })
    };


    /* 提交事件  退单 */
    ConfirmBack() {
        this.props.dispatch(isRefreshing(true))
        fetch(getURL + 'ConfirmBack', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: this.state.detail.order_id })
        }).then((res) => res.json()).then((res) => {
            let index = this.state.index;
            if (res.error == 0) {
                switch (this.state.tag) {
                    case 'home':
                        //  提交成功清除首页订单
                        this.props.counter.newOrder.splice(index, 1)
                        this.props.dispatch(setNewOrder(JSON.parse(JSON.stringify(this.props.counter.newOrder))))
                        break;
                    case 'refund':
                        //  提交成功后 删除对应待处理项 
                        this.props.counter.refund.splice(index, 1)
                        this.props.dispatch(refund(this.props.counter.refund))
                        //  提交成功后 添加对应待已经处理完项 
                        this.props.counter.allRefund.unshift(this.state.detail)
                        this.props.dispatch(getAllRefund(JSON.parse(JSON.stringify(this.props.counter.allRefund))))
                        break;
                    case 'orderState1':
                        this.props.counter.newOrder.forEach((e, i) => {
                            //  如果新订单中包含当前的订单就删除
                            if (e.order_id == this.state.detail.order_id) {
                                this.props.counter.newOrder.splice(i, 1)
                                this.props.dispatch(setNewOrder(JSON.parse(JSON.stringify(this.props.counter.newOrder))))
                            }
                        })
                        //  把历史交易记录的内容也改变了
                        this.props.counter.transactions.splice(index,1)
                        this.props.dispatch(getTransactions(JSON.parse(JSON.stringify(this.props.counter.transactions))))
                        break;
                    case 'orderState4':
                        //  把历史交易记录的内容也改变了
                        this.props.counter.transactions.splice(index, 1)
                        this.props.dispatch(getTransactions(JSON.parse(JSON.stringify(this.props.counter.transactions))))
                        break;
                    case 'delivery':
                        this.props.counter.tableDelivery.splice(index,1)
                        this.props.dispatch(setTableDelivery(JSON.parse(JSON.stringify(this.props.counter.tableDelivery))))
                        break;
                    default:
                        break;
                }
                ToastAndroid.show('退单成功', ToastAndroid.SHORT);
                this.props.navigation.goBack();
            } else if (res.error == 10) {
                //  返回10 说明用户已经退单
                switch (this.state.tag) {
                    case 'home':
                        this.props.counter.newOrder.splice(index, 1)
                        this.props.dispatch(setNewOrder(JSON.parse(JSON.stringify(this.props.counter.newOrder))))
                        break;
                    case 'delivery':
                        this.props.counter.tableDelivery.splice(index, 1)
                        this.props.dispatch(setTableDelivery(JSON.parse(JSON.stringify(this.props.counter.tableDelivery))))
                        break;
                    default:
                        break;
                }
                ToastAndroid.show('退单成功', ToastAndroid.SHORT);
                this.props.navigation.goBack();
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
            this.props.dispatch(isRefreshing(false))
        }).catch((error) => {
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        })
    }


    /* 内容过滤 */
    filterItem = (m,i) => {
        if (i == 0) {
            return (
                m.map((n) =>
                    <Text key={n.goods_id}>{n.goods_name}*{n.number}份{n.goods_type > 0 ? '('+n.goods_type_name+')' : ''}  </Text>
                )
            )
        } else if (i == 1) {
            return getOrderType(m)
        } else {
            return m
        }
    }

    //  底部按钮
    showButton(tag) {
        switch (tag) {
            case 'home':
                return this.componentsButton('售馨','是否确认提醒用户商品已经售馨？')
                break;
            case 'refund':
                return this.componentsButton('警告','确认退单后钱将直接退回给用户，确认退单？')
                break;
            case 'orderState1':
                return this.componentsButton('售馨', '是否确认提醒用户商品已经售馨？')
                break;
            case 'orderState4':
                return this.componentsButton('警告', '确认退单后钱将直接退回给用户，确认退单？')
                break;
            case 'delivery':
                return this.componentsButton('警告', '确认退单后钱将直接退回给用户，确认退单？')
                break;
            default:
                // return <View style={styles.info}></View>
                return (
                    <View style={styles.saleOutShow}>
                        <TouchableOpacity
                            style={styles.TouchableOpacity}
                            onPress={() => preventDoublePress.onPress(() => this.printOrder(0))}
                            activeOpacity={0.8}>
                            <Text style={styles.buttonText}>打印</Text>
                        </TouchableOpacity>
                    </View>
                )
                break;
        }
    }

    //  按钮组件
    componentsButton = (title,content) => {
        return (
            <View style={styles.saleOutShow}>
                <TouchableOpacity
                    style={styles.TouchableOpacity1}
                    onPress={() => preventDoublePress.onPress(() => this.saled(title, content))}
                    activeOpacity={0.8}>
                    <Text style={styles.buttonText}>{title == '警告' ? '退单' : '售馨'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.TouchableOpacity}
                    onPress={() => preventDoublePress.onPress(() => this.printOrder(1))}
                    activeOpacity={0.8}>
                    <Text style={styles.buttonText}>打印</Text>
                </TouchableOpacity>
            </View>
        )
    }

    /* 按钮点击事件 */
    saled(title,content) {
        Alert.alert(
            title,
            content,
            [
                { text: '取消', onPress: () => null, style: 'cancel' },
                { text: '确认', onPress: () => this.ConfirmBack(this.state.detail.order_id) },
            ],
            { cancelable: false }
        )
    }
    //  打印
    printOrder = (tag) => {
        Alert.alert(
            '打印',
            '是否要打印订单',
            [
                { text: '忽略', onPress: () => this.Shipment(this.state.detail, this.state.index, 0, tag) },
                { text: '取消', onPress: () => null, style: 'cancel' },
                {
                    text: '确认', onPress: () => {
                        //  打印机是否已连接
                        NativeModules.BluetoothPrinterModule.IsOk((c) => {
                            if (c.error == 1) {
                                ToastAndroid.show('打印机未连接', ToastAndroid.SHORT);
                                this.props.navigation.navigate('Print');
                            } else {
                                //  打印机连接成功则打印订单
                                if (tag == 0) {
                                    NativeModules.BluetoothPrinterModule.Print(JSON.stringify(this.state.detail), this.props.counter.shop.shop_name, this.props.counter.shop.wx_payment_code)
                                } else {
                                    this.Shipment(this.state.detail, this.state.index, 1, tag)
                                }
                            }
                        })
                    }
                },
            ],
            { cancelable: false }
        )
    }
    //  提交打印数据，出单
    Shipment = (item, index, state) => {
        fetch(getURL + 'Shipment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: item.order_id })
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                //打印
                state == 1 ? NativeModules.BluetoothPrinterModule.Print(JSON.stringify(item), this.props.counter.shop.shop_name, this.props.counter.shop.wx_payment_code) : null
                //  删除订单
                this.props.counter.newOrder.splice(index, 1)
                //  如果是桌面点餐就添加到桌面点餐列表
                this.props.counter.tableDelivery.push(item)
                this.props.dispatch(setTableDelivery(this.props.counter.tableDelivery))
                this.props.dispatch(setNewOrder(this.props.counter.newOrder))
                ToastAndroid.show('打印成功', ToastAndroid.SHORT);
            } else if (res.error == 10){
                //  删除订单
                this.props.counter.newOrder.splice(index, 1)
                this.props.dispatch(setNewOrder(this.props.counter.newOrder))
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            } else {

            }
        })
        .catch((error) => {
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }
    //  套餐类型
    
    /* 组件渲染 */
    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    {/** 头部价格  **/}
                    <View style={styles.header}>
                        <Text style={styles.order_price}>{getFloatStr(this.state.detail.order_price / 100)}</Text>
                        <Text>{getOrderState(this.state.detail.order_state)}</Text>
                    </View>
                    {/** 列表内容  **/}
                    {
                        this.state.list.map((m,i) => 
                            <View style={styles.info} key={i}>
                                <View style={styles.infoLeft}>
                                    <Text>{m.title}</Text>
                                </View>
                                <View style={styles.infoRight}>
                                    <Text style={{ color: i == 1 ? getOrderTypeColor(this.state.detail.order_type) : '#000' }}>
                                        {this.filterItem(m.data,i)}
                                    </Text>
                                </View>
                            </View>
                        )
                    }
                    {/** 底部按钮  **/}
                    {this.showButton(this.state.tag)}
                </View>
            </ScrollView>
        )
    }
}



const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(DetailContainer);


