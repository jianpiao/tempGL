import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    TextInput,
    ScrollView,
    ToastAndroid,
    Alert,
    TouchableNativeFeedback
} from 'react-native';
import styles from './style'
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { shopGoodsCategoryList, isRefreshing, upGoods, downGoods } from '../../../redux/actions';
import Empty from '../../../global/components/empty/index';
import headerRightIcon from '../../../global/components/headerRightIcon/style';
import preventDoublePress from '../../../global/preventDoublePress';
import ModalInput from './components/modalInput';



class classifyContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            pushList: [],
            modalVisible: false,
            name: ''
        }
    }

    //  节点渲染完毕
    componentDidMount() {
        this.setState({
            list: JSON.parse(JSON.stringify(this.props.counter.shopGoodsCategoryList))
        })
        this.props.navigation.setParams({ add: this.setModalVisible })
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
    //  添加
    add = () => {
        if (this.state.name.length > 0) {
            this.state.list.push({
                data: [],
                shop_id: this.props.counter.shop.shop_id,
                shop_goods_category_id: 0,
                shop_goods_category_name: this.state.name
            })
            this.setState({
                modalVisible: false,
                list: this.state.list
            })
        } else {
            ToastAndroid.show("输入内容不能为空", ToastAndroid.SHORT);
        }
    }
    //  提交数据
    submit = () => {
        this.props.dispatch(isRefreshing(true))
        this.upShopGoodsCategoryList()
    }
    //  上传数据
    upShopGoodsCategoryList() {
        fetch(getURL + 'UpShopGoodsCategoryList',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category_list: JSON.stringify(this.state.list) })
            })
            .then((res) => res.json())
            .then((res) => 
            {
                if (res.error == 0) {
                    let [upList, downList] = [
                        JSON.parse(JSON.stringify(res.new_data)),
                        JSON.parse(JSON.stringify(res.new_data))
                    ]
                    res.new_data.forEach((e,i) => {
                        //  通过比较分类id和每个商品上面的分类id相同就添加到分类的数组中
                        e.data = this.props.counter.getGoodsList.filter(m => m.shop_goods_category_id == e.shop_goods_category_id)
                        upList[i].data = this.props.counter.getGoodsList.filter(m => m.shop_goods_category_id == e.shop_goods_category_id && m.goods_state == 2)  //  上架
                        downList[i].data = this.props.counter.getGoodsList.filter(m => m.shop_goods_category_id == e.shop_goods_category_id && m.goods_state == 1)  //  下架
                    });
                    this.props.dispatch(upGoods(JSON.parse(JSON.stringify(upList))))
                    this.props.dispatch(downGoods(JSON.parse(JSON.stringify(downList))))
                    this.props.dispatch(shopGoodsCategoryList(JSON.parse(JSON.stringify(res.new_data))))
                    ToastAndroid.show(res.data, ToastAndroid.SHORT);
                    this.props.navigation.goBack()
                } else {
                    ToastAndroid.show(res.data, ToastAndroid.SHORT);
                }
                this.props.dispatch(isRefreshing(false))
            })
            .catch((error) => {
                this.props.dispatch(isRefreshing(false))
                ToastAndroid.show('网络异常', ToastAndroid.SHORT);
            })
    }
    //  输入框
    changeText = (text, index) => {
        this.state.list[index].shop_goods_category_name = text
        this.setState({
            list: this.state.list
        })
    }
    //  删除
    deleteItem = (item,index) => {
        this.state.list.splice(index, 1)
        this.setState({ list: this.state.list })
        ToastAndroid.show('已删除' + item.shop_goods_category_name, ToastAndroid.SHORT);
    }
    //  对话框
    setModalVisible = (v) => {
        this.setState({ name: ''})
        v == null ? this.setState({ modalVisible: true }) : this.setState({ modalVisible: v })
    }
    //  输入内容
    onChangeText = (v) => {
        this.setState({name: v})
    }
    //  页面渲染
    render() {
        var modalBackgroundStyle = {
            backgroundColor: this.state.modalVisible ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)',
        };
        var transparentStyle = this.state.modalVisible ? { backgroundColor: '#fff' } : null
        return (
            <View style={styles.container}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <View>
                       {
                           this.state.list.length > 0 ?
                                this.state.list.map((item, index) => {
                                    return (
                                        <View key={index} style={styles.classifyModal}>
                                            <View style={styles.modalHeader}>
                                                <View style={styles.textTitleView}>
                                                    <Text style={styles.textTitle}>分类名</Text>
                                                </View>
                                                <View style={styles.textInputView}>
                                                    <TextInput
                                                        style={styles.textInput}
                                                        underlineColorAndroid='transparent'
                                                        placeholder="请输入分类名"
                                                        multiline={true}
                                                        numberOfLines={1}
                                                        onChangeText={(text) => this.changeText(text, index)}
                                                        value={item.shop_goods_category_name}
                                                    />
                                                </View>
                                            </View>
                                            <View style={styles.deleteItem}>
                                                <Button
                                                    title="删除"
                                                    color="#FF0000"
                                                    onPress={() => this.deleteItem(item,index)} />
                                            </View>
                                        </View>
                                    )
                                }):
                            <Empty content="暂无分类" />
                       }
                    </View>
                </ScrollView>
                <ModalInput 
                modalVisible={this.state.modalVisible} 
                setModalVisible={this.setModalVisible} 
                modalBackgroundStyle={modalBackgroundStyle} 
                transparentStyle={transparentStyle}
                name={this.state.name} 
                onChangeText={this.onChangeText} 
                add={this.add}/>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(classifyContainer);