import React, { Component } from 'react';
import {
    Text,
    View,
    FlatList,
    TouchableHighlight,
    TouchableNativeFeedback
} from 'react-native';
import styles from './style'
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { associated } from '../../../../redux/actions';
import Empty from '../../../../global/components/empty/index';
import preventDoublePress from '../../../../global/preventDoublePress';
import headerRightIcon from '../../../../global/components/headerRightIcon/style';

class associatedContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            listLen: 0,
            goodsName: ''
        }
    }    

    //  生命周期
    componentWillMount = () =>{
        let temp = JSON.parse(JSON.stringify(this.props.counter.getGoodsList))
        let len = 0
        let { params } = this.props.navigation.state
        temp.forEach((m,i) => {
            temp[i].tag = false
        })
        this.props.counter.associated.forEach((e, i) => {
            temp.forEach((m, n) => {
                if (e.goods_id == m.goods_id) {
                    temp[n].tag = true
                    len++
                }
            })
        });
        this.setState({ list: temp, listLen: len, goodsName: params.goodsName})
    }
    

    /* 生命周期  节点动态渲染 */
    componentDidMount() {
        this.props.navigation.setParams({ navigatePress: this.submit })
    }

    //  提交按钮
    static navigationOptions = ({ navigation, screenProps }) => ({
        headerRight: (
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple('#aaa', true)}
                onPress={() => preventDoublePress.onPress(() => navigation.state.params.navigatePress())}>
                <View style={headerRightIcon.headerRightView}>
                    <Text style={headerRightIcon.headerRightIcon}>
                        &#xe609;
                    </Text>
                </View>
            </TouchableNativeFeedback>
        )
    });


    //  提交数据
    submit = () => {
        this.props.counter.associated = []
        this.state.list.forEach(e => {
            if (e.tag) {
                this.props.counter.associated.push({goods_id:e.goods_id})
            }
        });
        this.props.dispatch(associated(this.props.counter.associated))
        this.props.navigation.goBack()
    }


    //  选择
    chooseItem = (index) => {
        this.state.list[index].tag = !this.state.list[index].tag
        this.setState({
            list: this.state.list,
            listLen: this.state.list.filter(m => m.tag).length
        })
    }
    //  行与行之间的分隔线组件
    itemSeparatorComponent = () => {
        return <View style={{ height: .8, backgroundColor: '#e8e8e8' }} />
    }
    //  列表为空时渲染该组件
    emptyComponent = () => {
        return <Empty content="暂无可拼商品" />
    }
    //  页面
    render() {
        return (
            <View style={styles.container}>
                <View style={{marginBottom: 50}}>
                    <FlatList
                        ItemSeparatorComponent={() => this.itemSeparatorComponent()}
                        ListEmptyComponent={() => this.emptyComponent()}
                        data={this.state.list}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableHighlight
                                    key={index}
                                    underlayColor="#eee"
                                    activeOpacity={1}
                                    onPress={() => this.chooseItem(index)}>
                                    <View style={styles.item}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={styles.goodsName}>{item.goods_name}</Text>
                                            <Text style={styles.goodsPrice}>￥{getFloatStr(item.goods_price / 100)}</Text>
                                        </View>
                                        <View style={styles.tag}>
                                            {
                                                item.tag ? <Text style={styles.chooseState}>&#xe609;</Text> : <Text></Text>
                                            }
                                        </View>
                                    </View>
                                </TouchableHighlight>
                            )
                        }}
                    />
                </View>
                <View style={styles.bottomControl}>
                    <View style={{ flexDirection: 'row',alignItems: 'center'}}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#000'}}>[ {this.state.goodsName} ] </Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#000' }}>已拼 {this.state.listLen} 份</Text>
                    </View>
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(associatedContainer);