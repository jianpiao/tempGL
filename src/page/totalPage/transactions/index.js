import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Modal,
    FlatList,
    ScrollView,
    ToastAndroid,
    TouchableNativeFeedback,
    RefreshControl,
    TouchableHighlight
} from 'react-native';
import styles from './style';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { getTransactions,isRefreshing } from '../../../redux/actions';
import Empty from '../../../global/components/empty/index';
import { empty, getOrderTypeColor } from '../../../global/global';
import preventDoublePress from '../../../global/preventDoublePress';



//  交易记录
class transactionContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: [],
            headerList:[
                { title: '订单类型', data: <Text style={styles.headerListTag}>&#xe624;</Text> },
                { title: '交易状态', data: <Text style={styles.headerListTag}>&#xe624;</Text> },
                { title: '下单时间', data: <Text style={styles.headerListTag}>&#xe624;</Text> }
            ],
            modalList: [],
            orderTypeList: [
                { title: '全部类型', tag: 0 },
                { title: '桌上点餐', tag: 1 },
                { title: '预定点餐', tag: 2 },
                { title: '线上点餐', tag: 3 },
                { title: '前台点餐', tag: 4 }
            ],
            orderStateList: [
                { title: '全部状态', tag: 0 },
                { title: '已下单',  tag: 1 },
                { title: '已接单',  tag: 2 },
                { title: '已结单',  tag: 3 },
                { title: '退单中',  tag: 4 },
                { title: '已退单',  tag: 5 }
            ],
            timeList: [
                { title: '全部时间', tag: 0 },
                { title: '三天内', tag: 3 },
                { title: '一个星期内', tag: 7 },
                { title: '一个月内', tag: 30 },
                { title: '半年内', tag: 182 }
            ],
            headerSelectIndex: null,
            seleteStartTime: '',
            seleteType: '',
            selectState: '',
            page: 1,
            loadMoreText: true,
            modalVisible: false
        }
    }
    //  初始化加载
    componentWillMount = () => {
        this.props.dispatch(isRefreshing(true))
    };
    /* 生命周期  节点动态渲染 */
    componentDidMount() {
        this.getTransactions(0)
        this.props.navigation.setParams({ search: this.search })
    }
    //  头部导航
    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        headerRight: (
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple('#aaa', true)}
                onPress={() => preventDoublePress.onPress(() => navigation.state.params.search())}>
                <View>
                    <Text style={styles.headerRightIcon}>&#xe627;</Text>
                </View>
            </TouchableNativeFeedback>
        )
    })
    //  搜索
    search = () => {
        this.props.navigation.navigate('Search')
    }
    //  获取历史交易记录
    getTransactions(tag) {
        fetch(getURL + 'GetOrderList4', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                page: tag == 0 ? 0 : this.state.page,
                start_date: this.state.seleteStartTime,
                end_date: this.state.seleteStartTime != '' ? `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}` : '',
                type: this.state.seleteType,
                state: this.state.selectState
            })
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                res.data.data = res.data.data.sort(sortTime)
                this.state.transactions = res.data.data
                //  判断tag是0那就是刷新数据  是1就是添加数据
                if (tag == 0) {
                    this.props.dispatch(getTransactions(res.data.data))
                } else {
                    this.props.counter.transactions = this.props.counter.transactions.concat(res.data.data)
                    this.props.dispatch(getTransactions(JSON.parse(JSON.stringify(this.props.counter.transactions))))
                }
            } else {
                ToastAndroid.show(data.data, ToastAndroid.SHORT);
            }
            this.props.dispatch(isRefreshing(false))
        })
        .catch((error) => {
            this.props.dispatch(isRefreshing(false))
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        })
    }

    //  查看售后详情
    checkDetail = (item, index) => {
        let orderState = ''
        if (item.order_state == 1) {
            orderState = 'orderState1'
        } else if (item.order_state == 4) {
            orderState = 'orderState4'
        } else {
            orderState = ''
        }
        this.props.navigation.navigate('OrderDetailes', {
            detail: item,
            index: index,
            sellOutShow: true,
            tag: orderState
        });
    }

    //  下拉刷新事件
    onRefresh = () => {
        this.props.dispatch(isRefreshing(true))
        this.getTransactions(0)
    }
    //  加载更多
    loadMore = () => {
        //  定义向上取整和向下取整还有页面值
        let data = this.props.counter.transactions.length
        let [c, i] = [
            Math.ceil(data / 30),
            Math.floor(data / 30)
        ]
        //  如果向上取整大于向下取整 说明数据已经请求完毕 
        //  例如 数据库有100条数据 每页最多30条数据 请求页面一个4次 分别是 30/30/30/10 
        //  100/30 向下取整是3 向上取整是4 如果4>3 那么说明已经没有数据了
        //  如果 向上取整和向下取整都是一样的整数说明还有数据 或者没有数据
        if (c > 0 && c == i) {
            this.props.dispatch(isRefreshing(true))
            this.setState({
                page: i + 1
            })
            this.getTransactions(1)
        } else {
            // console.log("不够"+this.state.page)
        }
    }
    //  modal对话框
    setModalVisible(visible) {
        this.state.headerList.forEach(e => {
            e.data = <Text style={styles.headerListTag}>&#xe624;</Text>
        })
        this.setState({ modalVisible: visible });
    }
    //  头部类型选择
    headerSelect = (index) => {
        this.state.headerSelectIndex = index
        this.state.headerList[index].data = <Text style={styles.headerListTag1}>&#xe624;</Text>
        if (index == 0) {
            this.state.modalList = this.state.orderTypeList
        } else if (index == 1) {
            this.state.modalList = this.state.orderStateList
        } else {
            this.state.modalList = this.state.timeList
        }
        this.setState({ 
            modalVisible: true,
            modalList: this.state.modalList
        });
    }
    //  选择内容
    selectContent =(item) => {
        this.props.dispatch(isRefreshing(true))
        //  获取头部三项的其中一项
        let[index, now] = [this.state.headerSelectIndex,new Date()]
        //  获取选择的一项提交
        if (index == 0) {
            //  如果为0就是选择全部 否则是对应项目
            this.state.seleteType = item.tag == 0 ? '' : item.tag
        } else if (index == 1) {
             //  如果为0就是选择全部 否则是对应项目
            this.state.selectState = item.tag == 0 ? '' : item.tag
        } else {
            if (item.tag == 0) {
                this.state.seleteStartTime = ''
            } else {
                //  获取对应的时间段
                let date = new Date(now.getTime() - item.tag * 24 * 3600 * 1000)
                this.state.seleteStartTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
            }
        }
        //  上面选择完毕开始请求数据
        this.getTransactions(0)
        this.state.headerList[index].title = item.title
        this.state.page = 1
        this.setState({
            modalList: this.state.modalList
        });
        this.setModalVisible(false)
    }
    //  底部加载提示
    footer = () => {
        if (this.props.counter.transactions.length > 0) {
            return (
                <View style={styles.loadMore}>
                    <Text
                        style={{ color: this.state.transactions.length == 30 ? '#0aa394' : '#666' }}
                        onPress={() => preventDoublePress.onPress(() => this.loadMore())}>
                        {this.state.transactions.length == 30 ? '加载更多' : '已经到底了'}
                    </Text>
                </View>
            )
        } else {
            return null
        }
    }
    //  行与行之间的分隔线组件
    itemSeparatorComponent = () => {
        return <View style={{ height:0.8,backgroundColor: '#e8e8e8'}} />
    }
    //  列表为空时渲染该组件
    emptyComponent = () => {
        return <Empty content={empty(this.props.counter.refreshing, this.props.counter.transactions, '暂无交易记录')} />
    }
    //  页面
    render() {
        const modalBackgroundStyle = {
            backgroundColor: this.state.modalVisible ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)',
        };
        const innerStyle = this.state.modalVisible ? { backgroundColor: '#fff' } : null;

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    {
                        this.state.headerList.map((item,index) => {
                            return (
                                <TouchableHighlight
                                    key={index}
                                    activeOpacity={1}
                                    underlayColor="#eee"
                                    onPress={() => { this.headerSelect(index); }}
                                    style={[styles.headerBorderLine, {
                                        borderLeftWidth: index == 1 ? 0.8 : 0,
                                        borderRightWidth: index == 1 ? 0.8 : 0
                                    }]}>
                                    <View style={styles.headerListView}>
                                        <Text style={styles.headerListTitle}>{item.title}</Text>
                                        <View style={styles.headerListTagView}>
                                            {item.data}
                                        </View>
                                    </View>
                                </TouchableHighlight>
                            )
                        })
                    }
                </View>

                <Modal
                    animationType={"none"}
                    transparent={this.state.modalVisible}
                    visible={this.state.modalVisible}
                    hardwareAccelerated={true}
                    onRequestClose={() => { this.setModalVisible(false) }}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ flex: 1 }}
                        onPress={() => this.setModalVisible(false)}>
                        <View style={[{ flex: 1,marginTop: 98 }, modalBackgroundStyle]}>
                            <View style={innerStyle}>
                                <FlatList
                                    data={this.state.modalList}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableHighlight
                                                activeOpacity={1}
                                                underlayColor="#eee"
                                                onPress={() => { this.selectContent(item); }}
                                                key={index}
                                                style={{ padding: 12, borderTopColor: '#eee', borderTopWidth: 0.8 }}>
                                                <Text>{item.title}</Text>
                                            </TouchableHighlight>
                                        )
                                    }}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>  

                <View style={{ marginBottom: 50 }}>
                    <FlatList
                        data={this.props.counter.transactions}
                        initialNumToRender={8}
                        refreshing={this.props.counter.refreshing}
                        onRefresh={() => this.onRefresh()}
                        onEndReachedThreshold={0.5}
                        ItemSeparatorComponent={() => this.itemSeparatorComponent()}
                        ListEmptyComponent={() => this.emptyComponent()}
                        ListFooterComponent={() => this.footer()}
                        onEndReached={(info) => this.loadMore()}
                        renderItem={({ item, index }) => 
                            <TouchableHighlight
                                activeOpacity={1}
                                underlayColor="#eee"
                                key={index}
                                style={styles.transactionsItem}
                                onPress={() => preventDoublePress.onPress(() => this.checkDetail(item, index))}>
                                <View>
                                    <View style={styles.goodsNameView}>
                                        <View style={styles.goodsName}>
                                            {
                                                item.order_information.map((m, i) =>
                                                    <Text key={i} style={styles.goodsNameText} >
                                                        {m.goods_name}*{m.number}
                                                    </Text>
                                                )
                                            }
                                        </View>
                                        <View style={styles.orderType}>
                                            <Text style={{ color: getOrderTypeColor(item.order_type), fontSize: 13, paddingRight: 8 }}>{getOrderType(item.order_type)}</Text>
                                        </View>
                                    </View>
                                    <Text>总价 &nbsp;￥{getFloatStr(item.order_price / 100)}</Text>
                                    <Text>下单时间 &nbsp;{item.date}</Text>
                                </View>
                            </TouchableHighlight>}
                    />
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(transactionContainer);