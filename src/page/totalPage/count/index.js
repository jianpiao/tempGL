import React, { Component } from 'react';
import {
    Text,
    View,
    Modal,
    TouchableOpacity,
    ScrollView,
    ToastAndroid,
    TouchableNativeFeedback,
    RefreshControl,
    DatePickerAndroid
} from 'react-native';
import styles from './style';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { getTransactions, isRefreshing } from '../../../redux/actions';
import Empty from '../../../global/components/empty/index';
import { empty, getOrderTypeColor } from '../../../global/global';
import preventDoublePress from '../../../global/preventDoublePress';

//  总计
class countContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yyear: new Date().getFullYear(),
            mmonth: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate(),
            yearList: [],
            monthList: [1,2,3,4,5,6,7,8,9,10,11,12],
            count: 0,
            freeze: 0,
            modalVisible: false,
            list: [
                { title: '线上点餐', price: 0, number: 0 },
                { title: '桌面点餐', price: 0, number: 0 },
                { title: '前台点餐', price: 0, number: 0 },
                { title: '预定点餐', price: 0, number: 0 },
                { title: '退款', price: 0, number: 0 }
            ],
            page: 1
        }
    }
    //  初始化加载
    componentWillMount = () => {
        this.props.dispatch(isRefreshing(true))
    };
    /* 生命周期  节点动态渲染 */
    componentDidMount = () => {
        this.getMonthData()
        this.getDayData()
        //  把从2018年到现在的年份遍历显示
        let [y, m] = [2018,9]
        while (y <= new Date().getFullYear()) {
            this.state.yearList.push(y)
            y++
        }
        this.setState({ yearList: this.state.yearList})
    }
    //  获取总计每月数据
    getMonthData() {
        fetch(getURL + 'GetMonthTypeOrderMoney', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                year: this.state.yyear,
                month: this.state.mmonth
            })
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                this.setState({
                    count: res.data
                })
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
            this.props.dispatch(isRefreshing(false))
        })
        .catch((error) => {
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        })
    }
    //  获取总计每天数据
    getDayData() {
        fetch(getURL + 'GetEveryDayTypeOrderMoney', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                year: this.state.year,
                month: this.state.month,
                day: this.state.day
            })
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                this.setState({list: [
                        { title: '线上点餐', price: res.data[3].price / 100, number: res.data[3].number },
                        { title: '桌面点餐', price: res.data[1].price / 100, number: res.data[1].number },
                        { title: '前台点餐', price: res.data[4].price / 100, number: res.data[4].number },
                        { title: '预定点餐', price: res.data[2].price / 100, number: res.data[2].number },
                        { title: '退款', price: res.data[0].price / 100, number: res.data[0].number }
                    ]
                })
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
            this.props.dispatch(isRefreshing(false))
        })
        .catch((error) => {
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        })
    }
    //  物理返回键
    goBack = () => {
        this.props.navigation.goBack();
    }
    //  下拉刷新事件
    onRefresh = () => {
        this.props.dispatch(isRefreshing(true))
        this.getMonthData()
        this.getDayData()
    }
    //  时间选择框
    datePick = () => {
        try {
            const { action } = DatePickerAndroid.open({
                // 要设置默认值为今天的话，使用`new Date()`即可
                date: new Date(this.state.year,this.state.month-1,this.state.day),
                maxDate: new Date(),
                minDate: new Date(2018,3,1)
            }).then(({ year, month, day }) => {
                if (action !== DatePickerAndroid.dismissedAction) {
                    // 这里开始可以处理用户选好的年月日三个参数：year, month (0-11), day
                    //  取消则不执行
                    if (year == undefined || year == NaN || month == undefined || month == NaN) {

                    } else {
                        this.props.dispatch(isRefreshing(true))
                        this.state.year = year
                        this.state.month = month + 1
                        this.state.day = day
                        this.setState({
                            year: year,
                            month: month + 1,
                            day: day
                        })
                        this.getDayData()
                    }
                }
            })
        } catch ({ code, message }) {
            // console.warn('Cannot open date picker', message);
        }
    }
    //  显示弹出框
    setModalVisible = (v) => {
        this.setState({ modalVisible: v })
    }
    //  选择日期
    modalSelect = (t,item,index) => {
        this.props.dispatch(isRefreshing(true))
        this.setModalVisible(false)
        if (t == 0) {
            this.state.yyear = item
            this.setState({
                yyear: item,
                yearSelect: index
            })
        } else {
            this.state.mmonth = item
            this.setState({
                mmonth: item,
                monthSelect: index
            })
        }
        this.getMonthData()
    }
    //  背景颜色
    tagbgc = (index) => {
        switch (index) {
            case 0:
                return '#41c6c7'
                break;
            case 1:
                return '#55A532'
                break;
            case 2:
                return '#ad32c5'
                break;
            case 3:
                return '#6641E2'
                break;
            case 4:
                return '#ea1230'
                break;
            default:
                break;
        }
    }
    //  日期加0
    format = (f) => {
        return f < 10 ? '0'+f : f
    }
    //  页面
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
                            progressBackgroundColor="#fff"
                        />
                    }
                    scrollEventThrottle={50}>
                    <View style={styles.headerCount}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableNativeFeedback
                                background={TouchableNativeFeedback.Ripple('#aaa', true)}>
                                <View style={{ margin: 15 }}>
                                    <Text
                                        style={styles.headerBackTag}
                                        onPress={() => preventDoublePress.onPress(() => this.goBack())}>
                                        &#xe645;
                                    </Text>
                                </View>
                            </TouchableNativeFeedback>
                            <View style={{ flex: 1, margin: 15, alignItems: 'flex-end' }}>
                                <TouchableOpacity 
                                    style={{ flexDirection: 'row' }}
                                    activeOpacity={1}
                                    onPress={() => preventDoublePress.onPress(() => this.setModalVisible(true))}>
                                    <Text
                                        style={{ color: '#fff', fontSize: 16 }}>
                                        {this.state.yyear + '-' + this.format(this.state.mmonth)}
                                    </Text>
                                    <Text
                                        style={{ color: '#fff', fontFamily: 'iconfont', marginTop: 6 }}
                                        onPress={() => preventDoublePress.onPress(() => this.setModalVisible(true))}>&#xe624;</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.headerCountText}>
                            <Text style={styles.headerCountPriceTag}>
                                月销售额(元)
                            </Text>
                            <View style={styles.flexDirection}>
                                <Text style={styles.headerCountPrice}>{getFloatStr(this.state.count.price/100)}</Text>
                            </View>
                            <Text style={styles.headerCountType}>
                                交易共 {this.state.count.number} 单
                            </Text>
                        </View>
                    </View>
                    <View style={styles.saleSituation}>
                        <View style={styles.flexDirection}>
                            <View style={styles.tagStyle}></View>
                            <Text style={{ marginLeft: 5 }}>日交易总览</Text>
                            <View style={styles.transactionsCheck}>
                                <TouchableOpacity 
                                    style={styles.flexDirection}
                                    activeOpacity={1}
                                    onPress={() => preventDoublePress.onPress(() => this.datePick())}>
                                    <Text
                                        style={{ fontSize: 16, color: '#333', textAlign: 'right' }}>
                                        {this.state.year + '-' + this.format(this.state.month) + '-' + this.format(this.state.day)}
                                    </Text>
                                    <Text style={{ color: '#333', fontFamily: 'iconfont', marginTop: 8 }}>&#xe624;</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            {
                                this.state.list.map((item, index) => {
                                    return (
                                        <View style={styles.TypeView} key={index}>
                                            <View style={styles.flexDirection}>
                                                <View style={styles.flexDirection}>
                                                    <View style={[styles.tagRadio,{backgroundColor: this.tagbgc(index)}]}></View>
                                                    <View style={styles.flexDirection}>
                                                        <Text style={styles.priceType}>{item.title == '退款' ? '-' : '+'}</Text>
                                                        <Text style={styles.priceType}>{getFloatStr(item.price)}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.transactionsCheck}>
                                                    <Text>{item.number}份</Text>
                                                </View>
                                            </View>
                                            <Text style={styles.listTitle}>{item.title}</Text>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                </ScrollView>
                <Modal
                    animationType={"fade"}
                    transparent={this.state.modalVisible}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { this.setModalVisible(false) }}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ flex: 1 }}
                        onPress={() => this.setModalVisible(false)}>
                        <View style={styles.modal}>
                            <View style={styles.modalView}>
                                {
                                    this.state.yearList.map((item, index) => {
                                        return (
                                            <Text 
                                                key={index} 
                                                onPress={() => preventDoublePress.onPress(() => this.modalSelect(0,item,index))}
                                                style={{ paddingTop: 8, paddingBottom: 8,color: this.state.yearSelect == index ? '#1fcea7' : '#333' }}>
                                                {item} 年
                                            </Text>
                                        )
                                    })
                                }
                            </View>
                            <View style={styles.modalView}>
                                {
                                    this.state.monthList.map((item, index) => {
                                        return (
                                            <Text 
                                                key={index} 
                                                onPress={() => preventDoublePress.onPress(() => this.modalSelect(1,item,index))}
                                                style={{ paddingTop: 8,paddingBottom: 8,color: this.state.monthSelect == index ? '#1fcea7' : '#333' }}>
                                                {item} 月
                                            </Text>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>     
            </View>
        )
    }
}

const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(countContainer);