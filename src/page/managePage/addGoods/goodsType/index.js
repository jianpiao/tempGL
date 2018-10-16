import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    ScrollView, 
    ToastAndroid,
    TouchableNativeFeedback,
    Modal,
    TouchableOpacity,
    TextInput
} from 'react-native';
import styles from './style'
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { goodsType } from '../../../../redux/actions';
import Empty from '../../../../global/components/empty/index';
import preventDoublePress from '../../../../global/preventDoublePress';
import headerRightIcon from '../../../../global/components/headerRightIcon/style';
import ModalInput from './components/modalInput';
import ModalDialog from './components/modalDialog';


//  商品套餐
class GoodsTypeContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            goodsId: '',
            types: '',
            price: 0,
            modalVisible: false
        }
    }


    componentWillMount = () => {
        //  深拷贝
        this.setState({
            list: JSON.parse(JSON.stringify(this.props.counter.goodsType))
        })
    };
    

    /* 生命周期  节点动态渲染 */
    componentDidMount() {
        //  把价格转化为字符串
        this.state.list.forEach(e => {
            e.goods_type_price = "" + getFloatStr(e.goods_type_price / 100)
        });
        let { params } = this.props.navigation.state
        let goodsId = params ? params.goodsId : null
        this.setState({goodsId})
        this.props.navigation.setParams({ add: this.add })
        this.props.navigation.setParams({ submit: this.submit })
    }

    //  提交按钮
    static navigationOptions = ({ navigation }) => ({
        headerRight: (
            <View style={{ flexDirection: 'row', }}>
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple('#aaa', true)}
                    onPress={() => preventDoublePress.onPress(() => navigation.state.params.add())}>
                    <View style={headerRightIcon.headerRightView}>
                        <Text style={headerRightIcon.headerRightIcon}>
                            &#xe649;
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


    //  添加套餐类型
    add = () => {
        this.setState({
            types: '',
            price: ''
        })
        this.setModalVisible(true)
    }
    //  提交数据
    submit = () => {
        let obj = this.state.list
        let valiState = 0;
        for (let i in obj) {
            if (Trim(obj[i].goods_type_name).length > 0 && validate(obj[i].goods_type_price) && obj[i].goods_type_price >= 0.01) {
                valiState++
            }
        }
        if (valiState == obj.length) {
            this.state.list.forEach(e => {
                e.goods_type_price = parseInt(e.goods_type_price)*100
            });
            this.props.dispatch(goodsType(this.state.list))
            this.props.navigation.goBack();
        } else {
            ToastAndroid.show("输入内容有误", ToastAndroid.SHORT);
        }
    }


    //  输入框
    changeText = (text, index,tag) => {
        tag == 0 ? this.state.list[index].goods_type_name = text : this.state.list[index].goods_type_price = text
        this.setState({
            list: this.state.list
        })
    }

    //  删除
    deleteItem = (item,index) => {
        this.state.list.splice(index,1)
        this.setState({
            list: this.state.list
        })
        ToastAndroid.show("已删除" + item.goods_type_name, ToastAndroid.SHORT);
    }
    //  对话框
    setModalVisible = (v) => {
        this.setState({ modalVisible: v })
    }
    //  新增套餐对话框 文本改变
    onChangeText = (i,v) => {
        if (i == 0) {
            this.setState({ types: v })
        } else if (i == 1 && v <= 99999) {
            this.setState({ price: v })
        } else if (i == 1 && v > 100000) {
            ToastAndroid.show("价格不能大于100000(十万)", ToastAndroid.SHORT);
        }
    }
    //  确认添加套餐
    confirm = () => {
        //  判断 名字去空格之后长度是否为空 价格类型和长度是否正确
        if (Trim(this.state.types).length > 0 && validate(this.state.price) && parseInt(this.state.price) > 0) {
            this.state.list.push({
                goods_id: this.state.goodsId,
                goods_type_id: 0,
                goods_type_name: this.state.types,
                goods_type_price: getFloatStr(this.state.price)
            })
            this.setState({
                modalVisible: false,
                list: this.state.list
            })
        } else if (Trim(this.state.types).length == 0 && validate(this.state.price)) {
            ToastAndroid.show("套餐名称不能为空", ToastAndroid.SHORT);
        } else if (Trim(this.state.types).length > 0 && !validate(this.state.price)) {
            ToastAndroid.show("套餐价格只能必须为数字", ToastAndroid.SHORT);
        } else if (Trim(this.state.types).length > 0 && parseInt(this.state.price) <= 0) {
            ToastAndroid.show("套餐价格不能小于0", ToastAndroid.SHORT);
        } else {
            ToastAndroid.show("输入内容不能为空", ToastAndroid.SHORT);
        }
    }
    //  页面
    render() {
        var modalBackgroundStyle = {
            backgroundColor: this.state.modalVisible ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)',
        };
        var transparentStyle = this.state.modalVisible ? { backgroundColor: '#fff' } : null
        return (
            <View style={styles.container}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <View style={{ padding: 12, marginBottom: 30 }}>
                        {
                            this.state.list.length > 0 ?
                                this.state.list.map((item, index) => {
                                    return (
                                        <View key={index} style={styles.goodsTypeList}>
                                            <ModalInput
                                                goodsType='套餐类型' 
                                                placeholder='填写套餐名称' 
                                                keyboardType='default'
                                                changeText={this.changeText} 
                                                value={item.goods_type_name}
                                                index={index}
                                                tag={0}
                                            />
                                            <ModalInput
                                                goodsType='套餐价格'
                                                placeholder='填写套餐价格(元)'
                                                keyboardType='numeric'
                                                changeText={this.changeText}
                                                value={item.goods_type_price}
                                                index={index}
                                                tag={1}
                                            />
                                            <View style={styles.deleteItem}>
                                                <Button title="删除" color="#ff0000" onPress={() => this.deleteItem(item,index)} />
                                            </View>
                                        </View>
                                    )
                                }) :
                            <Empty content="暂无套餐类型" />
                        }
                    </View>
                </ScrollView>
                <ModalDialog
                    modalVisible={this.state.modalVisible} 
                    setModalVisible={this.setModalVisible}
                    modalBackgroundStyle={modalBackgroundStyle}
                    transparentStyle={transparentStyle}
                    types={this.state.types} 
                    price={this.state.price} 
                    onChangeText={this.onChangeText}
                    confirm={this.confirm} /> 
            </View>
        )
    }
}

const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(GoodsTypeContainer);