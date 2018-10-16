import React, { Component } from 'react';
import {
    Text,
    View,
    FlatList,
    Dimensions,
    TouchableHighlight
} from 'react-native';
import styles from './style';
import { getOrderTypeColor  } from '../../global/global';
import Empty from '../../global/components/empty/index';
import { connect } from 'react-redux';
import { setDoneOrder, isRefreshing } from '../../redux/actions';
import preventDoublePress from '../../global/preventDoublePress';
import {empty} from '../../global/global';


//  已完成
class CompleteContainer extends Component {
    //  点击事件 获取数据 跳到订单详情页面
    jumpDetail(item,index) {
        this.props.navigation.navigate('OrderDetailes', {
            detail: item,
            index: index,
            tag: 'complete',
        });
    }

    /* 生命周期  节点动态渲染 */
    componentDidMount = () => {
        this.props.dispatch(isRefreshing(true))
        this.getData()
    }
    getData() {
        //  获取已完成订单
        fetch(getURL + 'GetOrderList3', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify({
                page: 1
            })
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                this.props.dispatch(setDoneOrder(JSON.parse(JSON.stringify(res.data.data))))
            } else if (res.error == 1000) {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
                this.props.dispatch(setDoneOrder([]))
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
            this.props.dispatch(isRefreshing(false))
        }).catch((error) => {
            this.props.dispatch(isRefreshing(false))
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        })
    }
    //  刷新
    onRefresh = () => {
        this.props.dispatch(isRefreshing(true))
        this.getData()
    }
    //  行与行之间的分隔线组件
    itemSeparatorComponent = () => {
        return <View style={{ height: 0.8, backgroundColor: '#e8e8e8' }} />
    }
    //  列表为空时渲染该组件
    emptyComponent = () => {
        return <Empty/>
    }
    //  页面
    render() {
        let screenWidth = Dimensions.get('window').width; 
        return (
            <View style={styles.container}>
                <View style={[styles.FlatList, { width: screenWidth }]}>
                    <FlatList
                        refreshing={this.props.counter.refreshing}
                        onRefresh={() => this.onRefresh()}
                        data={this.props.counter.doneOrder}
                        ItemSeparatorComponent={() => this.itemSeparatorComponent()}
                        ListEmptyComponent={() => this.emptyComponent()}
                        renderItem={({ item, index }) =>
                            <TouchableHighlight
                                activeOpacity={1}
                                underlayColor="#eee"
                                key={index}
                                onPress={() => preventDoublePress.onPress(() => this.jumpDetail(item, index))}>
                                <View
                                    key={item.order_id}
                                    style={styles.FlatListItems}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={styles.FlatListGoodsName}>
                                            {
                                                item.order_information.map((m, i) =>
                                                    <Text key={i} style={styles.GoodsName} >
                                                        {m.goods_name}*{m.number}
                                                    </Text>
                                                )
                                            }
                                        </View>
                                        <View style={styles.orderType}>
                                            <Text style={{ color: getOrderTypeColor(item.order_type) }}>
                                                {getOrderType(item.order_type)}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={styles.orderInfo}>总价 &nbsp;￥{item.order_price / 100}</Text>
                                    <Text style={styles.orderInfo}>下单时间 &nbsp;{item.date}</Text>
                                </View>
                            </TouchableHighlight>
                        }
                    />
                </View>
            </View>
        )
    }
}


const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(CompleteContainer);