import React, { Component } from 'react';
import {
    Text,
    View,
    ToastAndroid,
    ScrollView
} from 'react-native';
import styles from './style'
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';

class NoticeDetailContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: {
                title: '',
                content: '',
                date: ''
            }
        }
    }
    
    componentDidMount = () =>{
        let { params } = this.props.navigation.state
        this.setState({
            item: params.item
        })
    }
    

    //  获取通知数据
    getFecth() {
        fetch(getURL + 'GetMassage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }).then((res) => res.json()).then((res) => {
            if (res.error == 0) {
                
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        }).catch((error) => {
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        })
    }
    //  页面
    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <Text style={{ fontSize: 30, color: '#000', paddingTop: 50, textAlign: 'center' }}>{this.state.item.title}</Text>
                    <Text style={{ textAlign: 'center', color: '#777', paddingBottom: 30 }}>{this.state.item.date}</Text>
                    <Text style={{ padding: 20, color: '#333', letterSpacing: 1,textAlign: 'center' }}>{this.state.item.content}</Text>
                    <View style={{ alignSelf: 'center', width: 90, height: 70, marginTop: 20, marginBottom: 20, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: '600', color: '#999', marginBottom: 5 }}>完</Text>
                        <Text style={{ fontWeight: '600', color: '#999', }}>E N D</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(NoticeDetailContainer);


