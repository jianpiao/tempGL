import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ToastAndroid,
    TouchableNativeFeedback,
    ViewPagerAndroid,
} from 'react-native';
import styles from "./style";
import { StackNavigator } from 'react-navigation';
import preventDoublePress from '../../global/preventDoublePress';
import { connect } from 'react-redux';
import {
    getGoodsList,
    shopGoodsCategoryList,
    systemGoodsCategoryList,
    workerList,
    isRefreshing,
    initialRefundPage,
    refund,
    getAllRefund,
    promotions,
    upGoods,
    downGoods
} from '../../redux/actions';
import Workers from './components/workers';
import Refund from './components/refund';
import GoodsManage from './components/goodsManage';
import { Promption1, Promption2 } from './components/promotion';
import Doubt from './components/doubt';
import headerRightIcon from '../../global/components/headerRightIcon/style';

//  管理
class ManageScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iconList: [
                { title: '钱包' },
                { title: '退款/售后' },
                { title: '职工' },
                { title: '类别管理' },
                { title: '管理商品' }
            ],
            initialPage: 0,
            initialSlider: 0,
            modalVisible: false
        }
    }
    componentDidMount() {
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
                this.classifyList()
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        }).catch((error) => {
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        })
    }
    //  搜索
    search = () => {
        this.props.counter.isLogin ? this.props.navigation.navigate('Search') : this.props.navigation.navigate('Login')
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
    //  数据请求
    classifyList() {
        //  推广
        fetch(getURL + 'GetExtension',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            .then((res) => res.json())
            .then((res) => {
                if (res.error == 0) {
                    this.props.dispatch(promotions(res.data))
                }
            })

        //  获取商品列表
        fetch(getURL + 'GetGoodsList', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.error == 0) {
                    const tempGoodsList = res.data.sort(sortDown)
                    this.props.counter.getGoodsList = res.data
                    this.props.dispatch(getGoodsList(tempGoodsList))
                    //  商品请求成功之后执行
                    //  店铺分类
                    fetch(getURL + 'ShopGoodsCategoryList',
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' }
                        })
                        .then((res) => res.json())
                        .then((res) => {
                            if (res.error == 0) {
                                let [upList, downList] = [
                                    JSON.parse(JSON.stringify(res.data)),
                                    JSON.parse(JSON.stringify(res.data))
                                ]
                                res.data.forEach((e, i) => {
                                    //  通过比较分类id和每个商品上面的分类id相同就添加到分类的数组中
                                    e.data = tempGoodsList.filter(m => m.shop_goods_category_id == e.shop_goods_category_id)
                                    upList[i].data = tempGoodsList.filter(m => m.shop_goods_category_id == e.shop_goods_category_id && m.goods_state == 2)  //  上架
                                    downList[i].data = tempGoodsList.filter(m => m.shop_goods_category_id == e.shop_goods_category_id && m.goods_state == 1)  //  下架
                                });
                                this.props.dispatch(upGoods(upList))
                                this.props.dispatch(downGoods(downList))
                                this.props.dispatch(shopGoodsCategoryList(res.data))
                                // this.props.navigation.navigate('ManageGoods') 
                            } else {
                                ToastAndroid.show(res.data, ToastAndroid.SHORT);
                            }
                        })
                } else {
                    ToastAndroid.show(res.data, ToastAndroid.SHORT);
                }
            }).catch((error) => {
                ToastAndroid.show('网络异常', ToastAndroid.SHORT);
            })


        //  系统分类
        fetch(getURL + 'GoodsSystemCategoryList',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            .then((res) => res.json())
            .then((res) => {
                if (res.error == 0) {
                    this.props.dispatch(systemGoodsCategoryList(res.data))
                } else {
                    ToastAndroid.show(res.data, ToastAndroid.SHORT);
                }
            })

        //  获取成员信息
        fetch(getURL + 'GetShopAuthorityList', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.error == 0) {
                    //  遍历权限 进行排序
                    for (let i in res.data) {
                        res.data[i].authority = res.data[i].authority.sort(sortAu)
                    }
                    this.props.dispatch(workerList(res.data))
                } else {
                    ToastAndroid.show(res.data, ToastAndroid.SHORT);
                }
                this.props.dispatch(isRefreshing(false))
            })

        //  待处理
        fetch(getURL + 'GetOrderList2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.error == 0) {
                    res.data = res.data.sort(sortDown)
                    this.props.dispatch(refund(res.data))
                } else {
                    ToastAndroid.show(res.data, ToastAndroid.SHORT);
                }
            })

        // 已经处理完成
        fetch(getURL + 'GetRecededOrderList', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                res.data = res.data.sort(sortDown)
                this.props.dispatch(getAllRefund(res.data))
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        })
    }
    //  下拉刷新
    onRefresh = () => {
        this.props.dispatch(isRefreshing(true))
        this.classifyList()
    }
    //  滑动页面
    onPageSelected(e) {
        this.setState({ initialPage: e })
        this.refs.viewPage.setPage(e)
    }
    //  跳转详情页面
    workerDetail = (item, index) => {
        this.props.navigation.navigate('WorkerDetail', {
            detail: item,
            index: index,
            tag: 0
        })
    }
    //  设置商品管理侧栏状态
    sliderSelected = (e) => {
        this.setState({ initialSlider: e })
        this.refs.viewPage.setPage(e)
    }
    //  设置弹出框状态
    setModalVisible = (v) => {
        this.setState({ modalVisible: v });
    }
    //  查看单个商品详情
    showGoodsDetail = (item, index) => {
        this.props.navigation.navigate('GoodsItem', {
            item: item,
            index: index
        });
    }
    //  跳转到退单页面
    jumpRefund = (i) => {
        this.props.dispatch(initialRefundPage(i))
        this.props.counter.isLogin ? this.props.navigation.navigate('Refund') : this.props.navigation.navigate('Login')
    }
    //  跳转到商品管理列表页面
    jumpGoodsList = () => {
        // this.props.counter.isLogin ? this.props.navigation.navigate('Wallet') : this.props.navigation.navigate('Login')
        this.props.counter.isLogin ? this.props.navigation.navigate('ManageGoods') : this.props.navigation.navigate('Login')
    }
    //  添加商品
    jumpAddGoods = () => {
        this.props.counter.isLogin ? this.props.navigation.navigate('AddGoods') : this.props.navigation.navigate('Login')
    }
    //  跳转到推广页面
    jumpAdvertised = (item, index) => {
        this.props.navigation.navigate('Advertised', {
            item: item,
            title: item.title
        })
    }
    //  跳转到职工页面
    jumpWorker = () => {
        this.props.counter.isLogin ? this.props.navigation.navigate('Worker') : this.props.navigation.navigate('Login')
    }
    //  跳转到添加员工界面
    jumpAddWorker = () => {
        this.props.counter.isLogin ? this.props.navigation.navigate('AddWorker') : this.props.navigation.navigate('Login')
    }
    //  页面渲染
    render() {
        var modalBackgroundStyle = {
            backgroundColor: this.state.modalVisible ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)'
        };
        var transparentStyle = this.state.modalVisible ? { backgroundColor: '#fff' } : null

        return (
            <View style={styles.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.counter.refreshing}
                            onRefresh={() => this.onRefresh()}
                            enabled={true}
                            colors={refreshColor}
                            progressBackgroundColor="#ffffff"
                        />
                    }
                    scrollEventThrottle={50}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => preventDoublePress.onPress(() => this.search())}
                            style={styles.headerSearch}>
                            <Text style={styles.headerSearchIcon}>&#xe627;</Text>
                            <Text style={styles.headerSearchText}>搜索订单号/日期/手机号/用户名</Text>
                        </TouchableOpacity>
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
                    {/** 页面头部推广 **/}
                    <ViewPagerAndroid
                        style={{ height: this.props.counter.promotions.length > 0 ? 224 : 0,backgroundColor: '#fff'}}
                        initialPage={this.state.initialPage}
                        onPageSelected={(e) => this.onPageSelected(e.nativeEvent.position)}
                        ref="viewPage">
                        {
                            this.props.counter.promotions.map((item, index) => {
                                return (
                                    <View key={index}>
                                        {
                                            item.img != '' ?
                                                <Promption1
                                                    item={item}
                                                    index={index}
                                                    pager={this.props.counter.promotions}
                                                    jumpAdvertised={this.jumpAdvertised} />
                                                :
                                                <Promption2
                                                    item={item}
                                                    index={index}
                                                    pager={this.props.counter.promotions}
                                                    jumpAdvertised={this.jumpAdvertised} />
                                        }
                                    </View>
                                )
                            })
                        }
                    </ViewPagerAndroid>
                    {/** 退单/售后 **/}
                    <Refund
                        refund={this.props.counter.refund}
                        allRefund={this.props.counter.allRefund}
                        jumpRefund={this.jumpRefund} />
                    {/** 商品管理 **/}
                    <GoodsManage
                        jumpGoodsList={this.jumpGoodsList}
                        jumpAddGoods={this.jumpAddGoods}
                    />
                    {/** 值班员工 **/}
                    <Workers
                        setModalVisible={this.setModalVisible}
                        jumpWorker={this.jumpWorker}
                        workerList={this.props.counter.workerList}
                        workerDetail={this.workerDetail}
                        jumpAddWorker={this.jumpAddWorker}
                    />
                </ScrollView>

                <Doubt
                    modalVisible={this.state.modalVisible}
                    setModalVisible={this.setModalVisible}
                    modalBackgroundStyle={modalBackgroundStyle}
                    transparentStyle={transparentStyle} />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(ManageScreen);
