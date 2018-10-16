import React, { Component } from 'react';
import {
    Text,
    View,
    Alert,
    ScrollView,
    CheckBox,
    ToastAndroid,
    ViewPagerAndroid,
    TouchableHighlight,
    TouchableNativeFeedback
} from 'react-native';
import styles from './style';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { workerList } from '../../../../redux/actions';
import preventDoublePress from '../../../../global/preventDoublePress';
import headerRightIcon from '../../../../global/components/headerRightIcon/style';


sortAu = (x, y) => {
    return (x.authority > y.authority) ? 1 : -1
}

class workderDetailContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detail: '',
            index: '',
            list: [],
            authority: [
                { title: '订单管理',     state: false },
                { title: '店铺信息管理', state: false },
                { title: '商品管理',     state: false },
                { title: '统计管理',     state: false },
                { title: '子管理员管理', state: false }
            ]
        }
    }


    /* 生命周期  节点动态渲染 */
    componentDidMount() {
        this.props.navigation.setParams({ submit: this.submit })
        this.props.navigation.setParams({ delete: this.delete })
        let { params } = this.props.navigation.state
        let [detail, index, tag] = [
            params ? params.detail : null,
            params ? params.index : null,
            params ? params.tag : null
        ]
        let auth = tag == 0 ? detail.authority : detail.authority_info
        //  判断数据库中是否包含了当前的这个账户
        //  如果包含了当前的这个账户就显示它的权限
        let arr = this.props.counter.workerList.filter(e => {
            return e.account_id == detail.account_id
        })
        if (tag == 0 || arr.length > 0) {
            let [g, au, te] = [auth.sort(sortAu), this.state.authority, 0]
            //  遍历对象  如果对象拥有权限则把状态改为true 以显示出来
            for (let i in au) {
                te++
                for (let n in g) {
                    if (g[n].authority == te) {
                        au[i].state = true
                    }
                }
            }
        }
        //  改变视图状态
        this.setState({
            detail: detail,
            index: index,
            tag: tag,
            list: [
                { title: '账户名称', data: detail.account_name },
                { title: '真实名字', data: detail.real_name },
                { title: '联系方式', data: detail.phone_number }
            ],
            authority: this.state.authority
        })
    }

    //  提交按钮
    static navigationOptions = ({ navigation, screenProps }) => ({
        headerRight: (
            <View style={{ flexDirection: 'row' }}>
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple('#aaa', true)}
                    onPress={() => preventDoublePress.onPress(() => navigation.state.params.delete())}>
                    <View style={headerRightIcon.headerRightView}>
                        <Text style={headerRightIcon.headerRightIcon}>
                            &#xe60c;
                        </Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple('#aaa', true)}
                    onPress={() => preventDoublePress.onPress(() => navigation.state.params.submit())}>
                    <View style={headerRightIcon.headerRightView}>
                        <Text style={headerRightIcon.headerRightIcon}>
                            &#xe609;
                    </Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        )
    });


    //  确认提交
    submit = () => {
        //  把状态为true的添加到数组当中 并且提交
        let [authorityValue,tempNum] = [[],0]
        for (let i in this.state.authority) {
            tempNum++
            if (this.state.authority[i].state) {
                authorityValue.push(tempNum)
            }
        }
        fetch(getURL + 'SetUserAuthority', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                account_id: this.state.detail.account_id,
                authority_value: JSON.stringify(authorityValue)
            })
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                let newAuthority = []
                //  遍历最新选择的权限
                for (let i in authorityValue) {
                    newAuthority.push({
                        authority: authorityValue[i]
                    })
                }
                //  改变状态
                if (this.state.tag == 0) {
                    //  判断如果用于关闭你所有的权限 则删除该职工
                    newAuthority.length > 0
                    ?
                    this.props.counter.workerList[this.state.index].authority = newAuthority
                    :
                    this.props.counter.workerList.splice(this.state.index, 1)
                } else {
                    //  重整对象，把authority_info 改成 authority
                    if (newAuthority.length > 0) {
                        let detail = {
                            account_id: this.state.detail.account_id,
                            account_name: this.state.detail.account_name,
                            authority: newAuthority,
                            email: this.state.detail.email,
                            phone_number: this.state.detail.phone_number,
                            real_name: this.state.detail.real_name
                        }
                        //  在权限列表中添加 新增的用户
                        this.props.counter.workerList.push(detail)
                    } else {
                        //  如果是在搜索页面打开的页面 提交时候 权限为空
                        //  找到不包含当前账户id的对象数组
                        let arr = this.props.counter.workerList.filter(e => {
                            return e.account_id != this.state.detail.account_id
                        })
                        //  覆盖原数组
                        this.props.counter.workerList = arr
                    }
                }
                this.props.dispatch(workerList(this.props.counter.workerList))
                ToastAndroid.show("设置成功", ToastAndroid.SHORT);
                this.props.navigation.goBack();
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        }).catch((error) => {
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }
    delete = () => {
        Alert.alert(
            '警告',
            '是否要删除该员工',
            [
                { text: '取消', onPress: () => null, style: 'cancel' },
                {
                    text: '确认', onPress: () => {
                        //  全部设为false
                        let au = this.state.authority
                        for (let i in au) {
                            if (au[i]) {
                                this.state.authority[i] = !au[i]
                            }
                        }
                        this.setState({
                            authority: this.state.authority
                        })
                        //  提交
                        this.submit()
                    }
                },
            ],
            { cancelable: false }
        )
    }
    //  单选框状态改变
    onValueChange(s,i) {
        this.state.authority[i].state = s
        this.setState({
            authority: this.state.authority
        })
    }

    //  页面渲染
    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    {
                        this.state.list.map((item,index) => {
                            return (
                                <View key={index} style={styles.detailView}>
                                    <Text style={styles.title}>{item.title}</Text>
                                    <View style={styles.detailRight}>
                                        <Text style={styles.detail}>{item.data}</Text>
                                    </View>
                                </View>
                            )
                        })
                    }
                    <View style={styles.detailView1}>
                        <Text style={[styles.title,{marginBottom: 12}]}>请选择权限</Text>
                        {
                            this.state.authority.map((m, i) => {
                                return (
                                    <View key={i} style={{ flexDirection: 'row' }}>
                                        <Text style={styles.authority}>{m.title}</Text>
                                        <View style={styles.detailRight}>
                                            <CheckBox
                                                value={m.state}
                                                onValueChange={(s) => this.onValueChange(s,i)}/>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(workderDetailContainer);
