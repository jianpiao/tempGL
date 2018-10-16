import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import styles from './style'
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { setAccount } from '../../../redux/actions';
import preventDoublePress from '../../../global/preventDoublePress';

class acountContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    /* 生命周期  节点动态渲染 */
    componentDidMount() {
        this.getFecth()
    }
    

    //  请求数据
    getFecth() {
        fetch(getURL + 'GetUserInfo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }).then((res) => res.json())
        .then((res) => {
            this.props.dispatch(setAccount(res.data))
        })
        .catch((error) => {
            alert("网络异常" + error)
        })
    }

    //  选择修改内容 
    jumpModifyAccount = (i, f, t) => {
        switch (i) {
            case 2:
                this.props.navigation.navigate('Textinput', {
                    transition: 'forHorizontal',
                    title: '修改' + t,
                    index: i,
                    data: '',
                    value: "" + f,
                    tag: 'accountPhone',
                    keyboardType: 'numeric'
                });
                break;
            default:
                break;
        }
    }

    //  修改密码
    jumpModifyPassword = () => {
        this.props.navigation.navigate('ModifyPassword')
    }


    render() {
        let accountInfo = [
            { title: '账户名称', data: this.props.counter.account.account_name },
            { title: '真实姓名', data: this.props.counter.account.real_name },
            { title: '联系方式', data: this.props.counter.account.phone_number },
            { title: '邮箱',     data: this.props.counter.account.email }
        ]
        return (
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>个人信息</Text>
                </View>
                {
                    accountInfo.map((m,i) => 
                        <TouchableOpacity 
                            style={styles.info} 
                            key={i}
                            activeOpacity={1}
                            onPress={() => preventDoublePress.onPress(() => this.jumpModifyAccount(i,m.data,m.title))}>
                            <View style={styles.infoLeft}>
                                <Text style={styles.infoLeftText}>{m.title}</Text>
                            </View>
                            <View style={styles.infoRight}>
                                <Text style={styles.infoRightText}>{m.data}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }
                
                <TouchableOpacity 
                    style={styles.info} 
                    activeOpacity={1}
                    onPress={() => this.jumpModifyPassword()}>
                    <View style={styles.infoLeft}>
                        <Text style={styles.infoLeftText}>修改密码</Text>
                    </View>
                    <View style={styles.infoRight}>
                        <Text style={[styles.infoRightText, { fontFamily: 'iconfont' }]}>&#xe6b9;</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(acountContainer);

