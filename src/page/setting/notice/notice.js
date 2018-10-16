import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    RefreshControl,
    TouchableHighlight,
    ToastAndroid,
    ScrollView
} from 'react-native';
import styles from './style'
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { getNotice, isRefreshing } from '../../../redux/actions';
import Empty from '../../../global/components/empty/index';
import preventDoublePress from '../../../global/preventDoublePress';
import {empty} from '../../../global/global';

class NoticeContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                
            }
        }
    }

    //  获取消息
    getNotice() {
        fetch(getURL + 'GetMassage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }).then((res) => res.json()).then((res) => {
            if (res.error == 0) {
                this.props.dispatch(getNotice(res.data))
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
            this.props.dispatch(isRefreshing(false))
        }).catch((error) => {
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        })
    }

    //  设置通知为已读
    setMassageRead(id) {
        fetch(getURL + 'SetMassageRead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message_id: id
            })
        }).then((res) => res.json()).then((res) => {
            if (res.error == 0) {
                
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        }).catch((error) => {
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        })
    }

    //  查看消息
    readMessage = (item,index) => {
        //  将消息设为已读
        this.setMassageRead(item.message_id)
        this.props.counter.notice[index].read = 1
        this.props.dispatch(getNotice(this.props.counter.notice))
        this.props.navigation.navigate('NoticeDetail',{
            item: item
        });
    }
    //  下拉刷新
    onRefresh = () => {
        this.props.dispatch(isRefreshing(true))
        this.getNotice()
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
                            progressBackgroundColor="#ffffff"
                        />
                    }
                    scrollEventThrottle={50}>
                    {
                        this.props.counter.notice.length != 0
                            ?
                            this.props.counter.notice.map((item, index) =>
                                <TouchableHighlight 
                                    underlayColor="#eee"
                                    key={index} 
                                    activeOpacity={1} 
                                    onPress={() => preventDoublePress.onPress(() => this.readMessage(item, index))}>
                                    <View style={[styles.item, { backgroundColor: item.read == 0 ? '#f4f7f6' : '#fff'}]} >
                                        <View style={styles.noticeHeader}>
                                            <View style={styles.flex}>
                                                <Text style={styles.accountName}>{item.title}</Text>
                                            </View>
                                            <View style={styles.flex}>
                                                <Text style={styles.date}>{item.date}</Text>
                                            </View>
                                        </View>
                                        <View key={index} style={{ paddingTop: 12, paddingBottom: 12 }}>
                                            <Text numberOfLines={4} ellipsizeMode='tail'>{item.content}</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                            )
                            :
                            <Empty content={empty(this.props.counter.refreshing, this.props.counter.notice, '暂无通知')}/>
                    }
                </ScrollView>
            </View>
        )
    }
}


const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(NoticeContainer);


