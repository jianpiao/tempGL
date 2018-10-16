import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    TouchableOpacity,
    TouchableNativeFeedback,
    ToastAndroid,
    ViewPagerAndroid,
    RefreshControl
} from 'react-native';
import styles from './style';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { refund, getAllRefund, isRefreshing } from '../../../redux/actions';
import DataList from './components/dataList';
import Empty from '../../../global/components/empty/index';
import { empty } from '../../../global/global';

class refundContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialPage: this.props.counter.initialRefundPage
        }
    }


    //  获取待处理售后
    getRefund() {
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
        .catch((error) => {
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
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
            this.props.dispatch(isRefreshing(false))
        })
        .catch((error) => {
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        })
    }

    //  查看售后详情
    checkDetail = (item,index) => {
        this.props.navigation.navigate('OrderDetailes', {
            detail: item,
            index: index,
            sellOutShow: true,
            tag: this.state.initialPage == 0 ? 'refund' : ''
        });
    }

    //  滑动页面
    onPageSelected(e) {
        this.setState({ initialPage:e})
        this.refs.viewPage.setPage(e)
    }

    //  下拉刷新事件
    onRefresh = () =>{
        this.props.dispatch(isRefreshing(true))
        this.getRefund()
    }
    //  行与行之间的分隔线组件
    itemSeparatorComponent = () => {
        return <View style={{ height: 0.8, backgroundColor: '#e8e8e8' }} />
    }
    //  列表为空时渲染该组件
    emptyComponent = () => {
        return <Empty content={empty(this.props.counter.refreshing, this.state.initialPage == 0 ? this.props.counter.refund : this.props.counter.allRefund , '暂无售后')} />
    }
    //  页面
    render() {
        return (
            <View style={styles.container}>
                <View style={{ height: 50, flexDirection: 'row', backgroundColor: '#fff',elevation: 4}}>
                    <TouchableNativeFeedback 
                        background={TouchableNativeFeedback.Ripple('#aaa', true)}
                        onPress={() => this.onPageSelected(this.state.initialPage == 0 ? 1 : 0 )}>
                        <View style={[styles.nabar, { borderBottomWidth: this.state.initialPage == 0 ? 2 : 0 }]}>
                            <Text style={{ color: this.state.initialPage == 0 ? '#000' : '#999' }}>
                                待处理
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback 
                        background={TouchableNativeFeedback.Ripple('#aaa', true)}
                        onPress={() => this.onPageSelected(this.state.initialPage == 0 ? 1 : 0)}>
                        <View style={[styles.nabar, { borderBottomWidth: this.state.initialPage == 1 ? 2 : 0 }]}>
                            <Text style={{ color: this.state.initialPage == 1 ? '#000' : '#999' }}>
                                已完成
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
                <ViewPagerAndroid
                    style={styles.viewPager}
                    initialPage={this.state.initialPage}
                    onPageSelected={(e) => this.onPageSelected(e.nativeEvent.position)}
                    ref="viewPage">
                    {/**  待处理售后  **/}
                    <DataList 
                        dataList={this.props.counter.refund}
                        refreshing={this.props.counter.refreshing}
                        checkDetail={this.checkDetail}
                        onRefresh={this.onRefresh}
                        itemSeparatorComponent={this.itemSeparatorComponent}
                        emptyComponent={this.emptyComponent} />
                    {/**  已完成售后  **/}
                    <DataList
                        dataList={this.props.counter.allRefund}
                        refreshing={this.props.counter.refreshing}
                        checkDetail={this.checkDetail}
                        onRefresh={this.onRefresh} 
                        itemSeparatorComponent={this.itemSeparatorComponent}
                        emptyComponent={this.emptyComponent} />
                </ViewPagerAndroid>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(refundContainer);