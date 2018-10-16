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

class forgetPasswordContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [
                { title: '手机号码', data: '' },
                { title: '新的密码', data: '' },
                { title: '确认密码', data: ''}
            ]
        }
    }

    onChangeText = (t,i)=> {
        this.state.list[i].data = t
        this.setState({
            list: this.state.list
        })
    }

    comfirm=() => {
        ToastAndroid.show('需要更改密码请联系我们：Wo客平台', ToastAndroid.SHORT);
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.list.map((item,index) =>{
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
                                        underlineColorAndroid="transparent"
                                        onChangeText={(t) => this.onChangeText(t,index)}
                                        value={item.data}
                                    />
                                </View>
                            </View>
                        )
                    })
                } 
                <View style={{marginTop: 40}}>
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

export default connect(mapStateToProps)(forgetPasswordContainer);
