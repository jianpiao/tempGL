import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    ToastAndroid,
    RefreshControl,
    ViewPagerAndroid,
    TouchableOpacity,
    TouchableNativeFeedback
} from 'react-native';
import styles from './style';
import { StackNavigator } from 'react-navigation';
import preventDoublePress from '../../global/preventDoublePress';
import { connect } from 'react-redux';
import { isRefreshing, todayIncome, todayTop, todayDown } from '../../redux/actions';
import PageView from './components/pageView';


//  数组排序
function down(x, y) {
    return (x.number < y.number) ? 1 : -1
}

//  反向数组排序
function reseverdown(x, y) {
    return (x.number > y.number) ? 1 : -1
}



class TotalContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            pageSelected: 0,
            list: [],
            sortState: true
        }
    }
    
    //  生命周期  刷新
    componentWillMount () {
        this.props.dispatch(isRefreshing(true))
        this.getLoginState()
    };
    //  获取登录状态
    getLoginState() {
        fetch(getURL + 'IsLogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                this.goodsOneDayStatistics()
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        }).catch((error) => {
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
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
    //  获取今日订单
    goodsOneDayStatistics(){
        //  今日订单销售情况
        fetch(getURL + 'TodayStatistics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                this.props.dispatch(todayIncome(res.data))
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        }).catch((error) => {
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })

        //  今日所有订单
        fetch(getURL + 'GoodsOneDayStatistics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                //  先清空
                this.setState({ list: res.data})
                this.props.counter.todayTop = []
                this.props.counter.todayDown = []
                res.data = res.data.sort(down)
                //  再添加
                res.data.forEach((e, i) => {
                    if (i <=9) {
                        this.props.counter.todayTop.push(e)
                    }
                });
                this.props.dispatch(todayTop(this.props.counter.todayTop))
                res.data = res.data.sort(reseverdown)
                res.data.forEach((e, i) => {
                    if (i >= res.data.length-10) {
                        this.props.counter.todayDown.push(e)
                    }
                });
                this.props.dispatch(todayDown(this.props.counter.todayDown))
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
            this.props.dispatch(isRefreshing(false))
        }).catch((error) => {
            this.props.dispatch(isRefreshing(false))
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }

    //  下拉刷新事件
    onRefresh() {
        this.props.dispatch(isRefreshing(true))
        this.goodsOneDayStatistics()
    }
    //  滑动界面
    onPageSelected = (e) => {
        this.setState({ pageSelected: e })
        this.refs.viewPage.setPage(e)
    }
    //  交易记录
    checkTransactions = () => {
        this.props.counter.isLogin ? this.props.navigation.navigate('Transactions') : this.props.navigation.navigate('Login')
    }
    //  总收入
    checkAllIncome = () => {
        this.props.counter.isLogin ? this.props.navigation.navigate('Count') : this.props.navigation.navigate('Login')
    }
    //  商品排序
    setSort = () => {
        if (this.state.sortState) {
            this.setState({
                list: this.state.list.sort(down),
                sortState: false
            })
        } else {
            this.setState({
                list: this.state.list.sort(reseverdown),
                sortState: true
            })
        }
    }
    //  页面
    render() {
        let todayIncomeNum = [
            { title: '订单数量', data: this.props.counter.todayIncome.shop_flow },
            { title: '销售数量', data: this.props.counter.todayIncome.number_of_goods },
            { title: '外卖收入', data: getFloatStr(this.props.counter.todayIncome.takeout_fee/100) }
        ]
        let commodityRink = ['十佳热销','销售低榜']
        return (
            <View style={styles.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.counter.refreshing}
                            onRefresh={() => this.onRefresh()}
                            enabled={true}
                            tintColor="#30b9ef"
                            title="加载中..."
                            titleColor="#30b9ef"
                            colors={refreshColor}
                            progressBackgroundColor="#ffffff"
                        />
                    }
                    scrollEventThrottle={50}>
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
                    <View style={styles.headerTodayIncome}>
                        <View style={styles.todayIncomeView}>
                            <View style={styles.todayIncome}>
                                {/* <Text style={styles.todayIncomeTag}>￥</Text> */}
                                <Text style={styles.todayIncomePrice}>{getFloatStr(this.props.counter.todayIncome.turnover / 100)}</Text>
                            </View>
                            <Text style={{color: '#fff'}}>今日收入</Text>
                        </View>
                        <View style={styles.todayIncomeFoot}>
                            {
                                todayIncomeNum.map((item,index) => {
                                    return (
                                        <View key={index} style={styles.todayIncomeNum}>
                                            <Text style={{ color: '#fff' }}>{item.title}</Text>
                                            <Text style={{ color: '#fff' }}>{item.data}</Text>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                    <View style={styles.middleView}>
                        <TouchableOpacity 
                            style={styles.transaction}
                            activeOpacity={0.6}
                            onPress={() => preventDoublePress.onPress(() => this.checkTransactions())}
                            >
                            {/* <Text style={{ fontFamily: 'iconfont', fontSize: 40, color: '#7678cf' }}>&#xe61a;</Text>                             */}
                            <Text style={{ fontFamily: 'iconfont', fontSize: 40, color: '#f49c20'}}>&#xe61a;</Text>                            
                            <Text style={{ color: '#f49c20' }}>数据</Text>
                            <Text style={{ color: '#f49c20' }}>交易记录</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.allIncome}
                            activeOpacity={0.6}
                            onPress={() => preventDoublePress.onPress(() => this.checkAllIncome())}
                            >
                            <Text style={{ fontFamily: 'iconfont', fontSize: 40, color: '#f49c20'}}>&#xe604;</Text>                            
                            <Text style={{ color: '#f49c20' }}>总计</Text>
                            <Text style={{ color: '#f49c20' }}>所有收入</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.commodity}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{ paddingLeft: 15, paddingRight: 5, color: '#333', fontSize: 25, fontWeight: '600' }}>
                                单品销量
                            </Text>
                            <View style={{flex:1,alignItems: 'flex-end',paddingRight: 15}}>
                                <View style={{width: 50,height:30,borderRadius: 5,backgroundColor: '#f1f1f1',justifyContent: 'center',alignItems: 'center',elevation: 4}}>
                                    <Text
                                        style={{ color: '#777' }}
                                        onPress={() => this.setSort()}>
                                        {this.state.sortState ? '升序' : '降序'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <PageView todayData={this.state.list} />
                        {/* <View style={styles.commodityBar}>
                            {
                                commodityRink.map((item, index) => {
                                    return (
                                        <Text
                                            key={index}
                                            style={{
                                                paddingLeft: 5,paddingRight: 5,
                                                color: this.state.pageSelected == index ? '#333' : '#777',
                                                fontSize: this.state.pageSelected == index ? 25 : 14,
                                                fontWeight: this.state.pageSelected == index ? '600' : '300'
                                            }}
                                            onPress={() => preventDoublePress.onPress(() => this.onPageSelected(this.state.pageSelected == 0 ? 1 : 0))}>
                                            {item}
                                        </Text>
                                    )
                                })
                            }
                        </View> */}
                        
                        {/* <ViewPagerAndroid
                            style={{ height: this.props.counter.todayTop.length * 50,marginBottom: 40}}
                            initialPage={this.state.pageSelected}
                            peekEnabled={true}
                            onPageSelected={(e) => this.onPageSelected(e.nativeEvent.position)}
                            ref="viewPage">
                            <View>
                                <PageView todayData={this.props.counter.todayTop}/>
                            </View>
                            <View>
                                <PageView todayData={this.props.counter.todayDown} />
                            </View>
                        </ViewPagerAndroid> */}
                    </View>
                </ScrollView>
            </View>
        )
    }
}


const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(TotalContainer);
