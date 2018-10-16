import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    RefreshControl,
    ToastAndroid,
    TouchableOpacity,
    TouchableNativeFeedback
} from 'react-native';
import styles from './style';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { workerList, isRefreshing } from '../../../redux/actions';
import Empty from '../../../global/components/empty/index';
import { empty } from '../../../global/global';
import preventDoublePress from '../../../global/preventDoublePress';
import headerRightIcon from '../../../global/components/headerRightIcon/style';

//  排序
sortAu = (x, y) => {
    return (x.authority > y.authority) ? 1 : -1
}


class workderContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        }
    }

    //  进入页面
    componentWillMount() {
        // this.props.dispatch(isRefreshing(true))
    }
    /* 生命周期  节点动态渲染 */
    componentDidMount() {
        this.props.navigation.setParams({ add: this.add })
    }

    //  提交按钮
    static navigationOptions = ({ navigation, screenProps }) => ({
        headerRight: (
            <View style={{ flexDirection: 'row' }}>
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple('#aaa', true)}
                    onPress={() => preventDoublePress.onPress(() => navigation.state.params.add())}>
                    <View style={headerRightIcon.headerRightView}>
                        <Text style={headerRightIcon.headerRightIcon}>
                            &#xe649;
                        </Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        )
    });


    //  添加
    add = () => {
        this.props.navigation.navigate('AddWorker')
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
    //  获取成员信息
    getWorker() {
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
    }
    //  跳转详情页面
    workerDetail (item,index){
        this.props.navigation.navigate('WorkerDetail',{
            detail: item,
            index: index,
            tag: 0
        })
    }
    //  下拉刷新
    onRefresh() {
        this.props.dispatch(isRefreshing(true))
        this.getWorker()
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
                            tintColor="#30b9ef"
                            title="加载中..."
                            titleColor="#30b9ef"
                            colors={refreshColor}
                            progressBackgroundColor="#ffffff"
                        />
                    }
                    scrollEventThrottle={50}>
                {
                    this.props.counter.workerList.length > 0 ? 
                        this.props.counter.workerList.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => preventDoublePress.onPress(() => this.workerDetail(item, index))}
                                    activeOpacity={0.8}>
                                    <View style={{ padding: 12, backgroundColor: '#fff', borderBottomColor: '#e9e9e9', borderBottomWidth: 1 }}>
                                        <View style={{ flexDirection: 'row', paddingTop: 8, paddingBottom: 8 }}>
                                            <Text style={styles.title}>账号名称:</Text>
                                            <Text style={{ marginLeft: 10, color: '#000' }}>{item.account_name}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', paddingTop: 8, paddingBottom: 8 }}>
                                            <Text style={styles.title}>真实名字:</Text>
                                            <Text style={{ marginLeft: 10, color: '#000' }}>{item.real_name}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.title}>拥有权限:</Text>
                                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingTop: 8, paddingBottom: 8 }}>
                                                {
                                                    item.authority.map((m, i) => {
                                                        return <Text key={i} style={styles.authority}>{this.authority(m.authority)}</Text>
                                                    })
                                                }
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        }):
                    <Empty content={empty(this.props.counter.refreshing,this.props.counter.workerList,'暂无职工')} />
                }
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(workderContainer);
