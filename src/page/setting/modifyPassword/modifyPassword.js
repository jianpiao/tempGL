import React, { Component } from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableNativeFeedback,
    ToastAndroid
} from 'react-native';
import styles from './style'
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import preventDoublePress from '../../../global/preventDoublePress';

//  修改密码
class modifyPasswordContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [
                { title: '旧的密码',   data: '' },
                { title: '新的密码', data: '' },
                { title: '确认密码', data: '' }
            ]
        }
    }
    //  输入框内容
    onChangeText = (t, i) => {
        this.state.list[i].data = t
        this.setState({
            list: this.state.list
        })
    }

    //  提交数据
    getFecth() {
        fetch(getURL + 'UpPass', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pass: this.state.list[0].data,
                new_pass: this.state.list[1].data
            })
        }).then((res) => res.json()).then((res) => {
            if (res.error == 0) {
                this.props.dispatch(getNotice(res.data))
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        }).catch((error) => {
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        })
    }
    //  确认
    comfirm = () => {
        let l = this.state.list
        if (l[0].data.length > 0 &&
            l[1].data.length > 0 &&
            l[2].data.length > 0 &&  
            l[1].data == l[2].data) {
            this.getFecth()
        } else if (l[0].data.length == 0 || 
            l[1].data.length == 0 || 
            l[2].data.length == 0 ) {
            ToastAndroid.show('输入内容不能为空', ToastAndroid.SHORT);
        } else {
            ToastAndroid.show('两次密码不一样，请重新输入', ToastAndroid.SHORT);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.list.map((item, index) => {
                        return (
                            <View key={index} style={{ flexDirection: 'row', paddingLeft: 7, paddingRight: 7, marginBottom: 20 }}>
                                <View style={{ justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 16, color: '#000' }}>{item.title}</Text>
                                </View>
                                <View style={{ flex: 1, paddingLeft: 10, borderBottomColor: '#ccc', borderBottomWidth: 0.7 }}>
                                    <TextInput
                                        style={{ fontSize: 16 }}
                                        placeholder={item.title}
                                        keyboardType='default'
                                        secureTextEntry={true}
                                        underlineColorAndroid="transparent"
                                        onChangeText={(t) => this.onChangeText(t, index)}
                                        value={item.data}
                                    />
                                </View>
                            </View>
                        )
                    })
                }
                <View style={{ marginTop: 40 }}>
                    <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple('#aaa', false)}
                        onPress={() => preventDoublePress.onPress(() => this.comfirm())}>
                        <View style={{ height: 40, backgroundColor: '#1fcea7', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                            <Text style={{ fontSize: 16, color: '#fff' }}>确认</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        )
    }
}


const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(modifyPasswordContainer);
