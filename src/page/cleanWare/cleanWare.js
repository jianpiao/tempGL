import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableHighlight,
    Alert,
    ToastAndroid,
    TouchableNativeFeedback,
    FlatList
} from 'react-native';
import styles from './style';
import { connect } from 'react-redux';
import { setCleanWare, isRefreshing } from '../../redux/actions';
import preventDoublePress from '../../global/preventDoublePress';
import Empty from '../../global/components/empty/index';
import headerRightIcon from '../../global/components/headerRightIcon/style';


/** 清理餐具 */
class cleanWareContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }

    componentDidMount = () => {
        this.cleanWare()
        this.props.navigation.setParams({ cleanOne: this.cleanOne })
    };
    
    //  头部右边按钮
    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        headerRight: (
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple('#aaa', true)}
                onPress={() => preventDoublePress.onPress(() => navigation.state.params.cleanOne())}>
                <View style={headerRightIcon.headerRightView}>
                    <Text style={headerRightIcon.headerRightIcon2}>
                       &#xe630;
                    </Text>
                </View>
            </TouchableNativeFeedback>
        )
    });

    //  提示对话框
    cleanOne = () =>{
        Alert.alert(
            '提示',
            '已经收拾完所有餐具？',
            [
                { text: '取消', onPress: () => null, style: 'cancel' },
                { text: '确认', onPress: () => {
                    this.props.counter.cleanWare.length > 0  
                    ?  
                    this.collectTablewareZero(this.props.counter.cleanWare)
                    :
                    ToastAndroid.show('暂无餐具，无需清理', ToastAndroid.SHORT)
                }},
            ],
            { cancelable: false }
        )
    }

    //  收拾餐具
    collectTablewareZero(data,index) {
        fetch(getURL + 'CollectTablewareZero', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({list: JSON.stringify(data)})
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                //  如果是清除所有
                if(index == null || undefined) {
                    this.props.dispatch(setCleanWare([]))
                } else {
                    //  清理对应项
                    this.props.counter.cleanWare.splice(index, 1)
                    this.props.dispatch(setCleanWare(this.props.counter.cleanWare))
                }
                ToastAndroid.show('餐具收拾完成', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        }).catch((error) => {
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }
    //  获取代收餐具订单
    cleanWare() {
        fetch(getURL + 'CollectTableware', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                this.props.dispatch(setCleanWare(res.data))
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
            this.props.dispatch(isRefreshing(false))
        })
    }
    //  下拉刷新
    onRefresh = () => {
        this.props.dispatch(isRefreshing(true))
        this.cleanWare()
    }
    //  清理单项
    cleanItem = (id,index) => {
        Alert.alert(
            '提示',
            '编号'+id+'已经收拾完毕？',
            [
                { text: '取消', onPress: () => null, style: 'cancel' },
                {
                    text: '确认', onPress: () => {
                        this.collectTablewareZero([{ order_id: id }], index)
                    }
                },
            ],
            { cancelable: false }
        )
    }
    //  行与行之间的分隔线组件
    itemSeparatorComponent = () => {
        return <View style={{ height: .8, backgroundColor: '#e8e8e8' }} />
    }
    //  列表为空时渲染该组件
    emptyComponent = () => {
        return <Empty/>
    }
    //  页面
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    refreshing={this.props.counter.refreshing}
                    onRefresh={() => this.onRefresh()}
                    data={this.props.counter.cleanWare}
                    ItemSeparatorComponent={() => this.itemSeparatorComponent()}
                    ListEmptyComponent={() => this.emptyComponent()}
                    renderItem={({ item, index }) => 
                        <TouchableHighlight
                            underlayColor="#e8e8e8"
                            activeOpacity={1}
                            style={styles.listItem}
                            onPress={() => preventDoublePress.onPress(() => this.cleanItem(item.order_id, index))}
                            key={index}>
                            <Text style={styles.address}>位置：{item.address}</Text>
                            <Text style={styles.time}>编号：{item.order_id}</Text>
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

export default connect(mapStateToProps)(cleanWareContainer);

