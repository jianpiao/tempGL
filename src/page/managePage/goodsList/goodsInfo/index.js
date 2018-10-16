import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Picker,
    Dimensions,
    ToastAndroid,
    TouchableNativeFeedback,
    Alert
} from 'react-native';
import styles from './style'
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { 
    getGoodsList, 
    rollImg, 
    goodsType, 
    associated,
    shopGoodsCategoryList,
    upGoods, 
    downGoods,
    isRefreshing
} from '../../../../redux/actions';
import preventDoublePress from '../../../../global/preventDoublePress';
import headerRightIcon from '../../../../global/components/headerRightIcon/style';
import options from '../../../../global/options';
var ImagePicker = require('react-native-image-picker');


//  商品信息
class goodsInfoContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            goodsId:'',
            index: null,
            onpressState: true,
            file: { 
                uri: null, 
                type: 'multipart/form-data', 
                name: 'image.png' 
            }
        }
    }


    /* 生命周期  节点动态渲染 */
    componentDidMount() {
        this.props.navigation.setParams({ submit: this.submit })
        this.props.navigation.setParams({ delete: this.delete })
        //  先清空
        this.props.dispatch(rollImg([]))
        this.props.dispatch(goodsType([]))
        this.props.dispatch(associated([]))
        let { params } = this.props.navigation.state
        let item = params ? params.item : null
        let index = params ? params.index : null
        //  再添加
        this.props.dispatch(rollImg(item.roll_image))
        this.props.dispatch(goodsType(item.goods_type))
        this.props.dispatch(associated(item.associated_goods))

        this.setState({
            goodsId: item.goods_id,
            index: index,
            list: [
                { title: '照片',     data: { uri: shopImg + 'goods_image/' + item.goods_image }, placeholder: '请选择商品照片' },
                { title: '商品名称', data: item.goods_name,                     placeholder: '请填写商品名称' },
                { title: '商品价格', data: getFloatStr(item.goods_price / 100), placeholder: '请填写商品价格' },
                { title: '商品介绍', data: item.goods_details,                  placeholder: '请填写商品介绍' },
                { title: '双拼',    data: item.associated_goods.length + '份', placeholder: '请选择双拼商品' },
                { title: '轮播图片', data: item.roll_image.length + '张',       placeholder: '请添加商品介绍图片'},
                { title: '套餐类型', data: item.goods_type.length + '份',       placeholder: '请选择套餐类型' },
                { title: '商品状态', data: item.goods_state, placeholder: '请选择商品状态' },
                { title: '店铺分类', data: item.shop_goods_category_id,         placeholder: '请选择店铺分类' },
                { title: '系统分类', data: item.system_category_id,             placeholder: '请选择系统分类' },
                { title: '主推',     data: item.recommend,                      placeholder: '请选择是否主推' }
            ]
        })
    }

    //  提交按钮
    static navigationOptions = ({ navigation }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
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

    //  提交数据
    submit = (index) =>{
        if (!this.state.onpressState) return ;
        this.props.dispatch(isRefreshing(true))
        this.setState({ onpressState: false})
        console.log(this.props.counter.associated);
        
        fetch(getURL + 'SetGoodsInfo', {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            body: formdata({
                goods_id: this.state.goodsId,
                goods_image: this.state.file.uri == null || undefined ? '' : this.state.file,
                goods_name: this.state.list[1].data,
                goods_price: this.state.list[2].data * 100,
                goods_details: this.state.list[3].data,
                associated_goods: JSON.stringify(this.props.counter.associated),
                roll_image: JSON.stringify(this.props.counter.rollImg),
                goods_type: JSON.stringify(this.props.counter.goodsType),
                goods_state: this.state.list[7].data,
                shop_goods_category_id: this.state.list[8].data,
                system_category_id: this.state.list[9].data,
                recommend: this.state.list[10].data
            })
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                console.log(res.data);
                
                let [cate, index, goodsList, upList, downList] = [
                    this.props.counter.shopGoodsCategoryList,
                    this.state.index,
                    this.props.counter.getGoodsList,
                    JSON.parse(JSON.stringify(this.props.counter.shopGoodsCategoryList)),
                    JSON.parse(JSON.stringify(this.props.counter.shopGoodsCategoryList))
                ]
                //  覆盖商品列表
                goodsList.forEach((e,i) => {
                    e.goods_id == res.data.goods_id ? goodsList[i] = res.data : null
                })
                //  店铺分类请求成功之后遍历分类内容重新排列
                cate.forEach((e,i) => {
                    //  通过比较分类id和每个商品上面的分类id相同就添加到分类的数组中
                    cate[i].data = goodsList.filter(m => m.shop_goods_category_id == e.shop_goods_category_id)
                    upList[i].data = goodsList.filter(m => m.shop_goods_category_id == e.shop_goods_category_id && m.goods_state == 2)
                    downList[i].data = goodsList.filter(m => m.shop_goods_category_id == e.shop_goods_category_id && m.goods_state == 1)
                });
                //  深拷贝 从而改变渲染
                this.props.counter.rollImg = res.data.roll_image
                this.props.counter.goodsType = res.data.goods_type
                this.props.counter.associated = res.data.associated_goods
                this.props.dispatch(shopGoodsCategoryList(JSON.parse(JSON.stringify(cate))))
                this.props.dispatch(upGoods(JSON.parse(JSON.stringify(upList))))
                this.props.dispatch(downGoods(JSON.parse(JSON.stringify(downList))))
                this.props.dispatch(getGoodsList(goodsList))
                ToastAndroid.show('修改成功', ToastAndroid.SHORT);
                this.props.navigation.goBack()
            } else {
                this.setState({ onpressState: true })
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
            this.props.dispatch(isRefreshing(false))
        })
        .catch((error) => {
            this.props.dispatch(isRefreshing(false))
            this.setState({ onpressState: true })
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        })
    }
    //  删除
    delete = () =>{
        Alert.alert(
            '警告',
            '是否要删除该商品',
            [
                { text: '取消', onPress: () => null, style: 'cancel' },
                { text: '确认', onPress: () => {
                    this.props.dispatch(isRefreshing(true))
                    this.deleteGoods()
                }},
            ],
            { cancelable: false }
        )
    }
    //  删除商品
    deleteGoods = () => {
        fetch(getURL + 'DeleteGoods', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ goods_id: this.state.goodsId })
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                let [cate, index, goods, upList, downList] = [
                    this.props.counter.shopGoodsCategoryList,
                    this.state.index,
                    this.props.counter.getGoodsList,
                    JSON.parse(JSON.stringify(this.props.counter.shopGoodsCategoryList)),
                    JSON.parse(JSON.stringify(this.props.counter.shopGoodsCategoryList))
                ]
                //  删除
                goods.forEach((m, i) => {
                    if (m.goods_id == this.state.goodsId) {
                        goods.splice(i, 1)
                    }
                })
                cate.forEach((m, i) => {
                    m.data.forEach((e, n) => {
                        if (e.goods_id == this.state.goodsId) {
                            cate[i].data.splice(n, 1)
                        }
                    });
                })
                cate.forEach((e, i) => {
                    upList[i].data = goods.filter(m => m.shop_goods_category_id == e.shop_goods_category_id && m.goods_state == 2)
                    downList[i].data = goods.filter(m => m.shop_goods_category_id == e.shop_goods_category_id && m.goods_state == 1)
                });
                this.props.dispatch(shopGoodsCategoryList(JSON.parse(JSON.stringify(cate))))
                this.props.dispatch(upGoods(JSON.parse(JSON.stringify(upList))))
                this.props.dispatch(downGoods(JSON.parse(JSON.stringify(downList))))
                this.props.dispatch(getGoodsList(goods))
                //  深拷贝 从而改变渲染
                ToastAndroid.show('删除成功', ToastAndroid.SHORT);
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
    //  填写数据改变状态
    changeText = (text, index) => {
        if (index == 2) {
            if (text <= 99999) {
                this.state.list[index].data = text
                this.setState({
                    list: this.state.list
                })
            } else {
                ToastAndroid.show('价格不能超过100000(十万)', ToastAndroid.SHORT);
            }
        } else {
            this.state.list[index].data = text
            this.setState({
                list: this.state.list
            })
        }
    }


    //  选择图片
    choosePic = (index) => {
        ImagePicker.showImagePicker(options, (response) => {
            if (response.error === 'Camera permissions not granted') {
                Alert.alert(
                    '没有权限',
                    '相机权限未开启，请到设置中开启！'
                );
            }
            if (response.didCancel) {

            } else {
                this.state.list[index].data = { uri: response.uri }
                this.setState({
                    file: {
                        uri: response.uri,
                        type: 'multipart/form-data',
                        name: 'image.png'
                    }
                })
            }
        });
    }

    //  跳转页面
    openPage = (index,item) => {
        switch (index) {
            case 4:
                this.props.navigation.navigate('Associated',{
                    goodsName: this.state.list[1].data
                });
                break;
            case 5:
                this.props.navigation.navigate('Roll');
                break;
            case 6:
                this.props.navigation.navigate('GoodsType', { 
                    goodsId: this.state.goodsId
                });
                break;
            default:
                break;
        }
    }

    //   填写栏
    setControlType = (item, index) => {
        if (item.title == '照片') {
            return (
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => this.choosePic(index)}>
                        {
                            this.state.list[index].data == '' ?
                                <Image
                                    resizeMode='cover'
                                    style={{ width: 80, height: 80, alignSelf: 'flex-end' }}
                                    source={require('../../../../static/img/31.png')}
                                /> :
                                <Image
                                    resizeMode='cover'
                                    style={{ width: 80, height: 80, alignSelf: 'flex-end' }}
                                    source={item.data}
                                />
                        }
                    </TouchableOpacity>
                </View>
            )
        } else if (item.title == '商品名称' || item.title == '商品介绍') {
            return (
                <TextInput
                    style={styles.textRight}
                    underlineColorAndroid='transparent'
                    placeholder={item.placeholder}
                    multiline={true}
                    numberOfLines={1}
                    onChangeText={(text) => this.changeText(text, index)}
                    value={item.data}
                />
            )
        } else if (item.title == '商品价格') {
            return (
                <TextInput
                    style={styles.textRight}
                    underlineColorAndroid='transparent'
                    placeholder={item.placeholder}
                    multiline={true}
                    numberOfLines={1}
                    keyboardType="numeric"
                    onChangeText={(text) => this.changeText(text, index)}
                    value={item.data}
                />
            )
        } else if (item.title == '轮播图片' || item.title == '套餐类型' || item.title == '双拼') {
            let content = ''
            if (item.title == '轮播图片') {
                content = this.props.counter.rollImg.length + '张'
            } else if (item.title == '套餐类型') {
                content = this.props.counter.goodsType.length + '份'
            } else if (item.title == '双拼') {
                content = this.props.counter.associated.length + '份'
            }
            return (
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => preventDoublePress.onPress(() => this.openPage(index, item))}
                    style={{ flex: 1, flexDirection: 'row'}}>
                    <View style={styles.textLeftView}>
                        <Text style={styles.textRight1}>{content}</Text>
                    </View>
                    <View style={styles.textRightView1}>
                        <Text style={[styles.textRight1, { alignSelf: 'flex-end', fontFamily: 'iconfont' }]}>
                            &#xe6b9;
                        </Text>
                    </View>
                </TouchableOpacity>
            )
        } else if (item.title == '店铺分类' || item.title == '系统分类') {
            //  店铺分类,系统分类
            let temp = this.props.counter.shopGoodsCategoryList
            return (
                <View style={{ flex: 1, }}>
                    <Picker
                        selectedValue={item.data}
                        mode="dropdown"
                        style={{color: '#666'}}
                        onValueChange={(text) => this.changeText(text, index)}>
                        {
                            item.title == '店铺分类' ?
                                temp.map((m, i) =>
                                    <Picker.Item
                                        key={i}
                                        label={m.shop_goods_category_name}
                                        value={m.shop_goods_category_id} />) :
                                this.props.counter.systemGoodsCategoryList.map((m, i) =>
                                    <Picker.Item
                                        key={i}
                                        label={m.category_name}
                                        value={m.system_category_id} />)
                        }
                    </Picker>
                </View>
            )
        } else if (item.title == '主推' || item.title == '商品状态') {
            //  主推,商品状态
            return (
                <View style={{ flex: 1, }}>
                    <Picker
                        selectedValue={item.data}
                        mode="dropdown"
                        style={{ color: '#666' }}
                        onValueChange={(text) => this.changeText(text, index)}>
                        <Picker.Item
                            style={{ marginLeft: 12 }}
                            label={item.title == '主推' ? '是' : '上架'}
                            value={item.title == '主推' ? 1 : 2} />
                        <Picker.Item
                            style={{ marginLeft: 12 }}
                            label={item.title == '主推' ? '否' : '下架'}
                            value={item.title == '主推' ? 0 : 1} />
                    </Picker>
                </View>
            )
        } else {
            return (
                <TextInput
                    style={styles.textRight}
                    underlineColorAndroid='transparent'
                    placeholder={item.placeholder}
                    multiline={true}
                    numberOfLines={1}
                    onChangeText={(text) => this.changeText(text, index)}
                    value={item.data}
                />
            )
        }
    }

    //  页面渲染
    render() {
        return (
            <View style={styles.container}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    {
                        this.state.list.map((item, index) => {
                            return (
                                <View style={styles.inputText} key={index}>
                                    <View style={styles.textLeftView}>
                                        <Text style={styles.textLeft}>{item.title}</Text>
                                    </View>
                                    {this.setControlType(item, index)}
                                </View>
                            )
                        })
                    }
                </ScrollView>
            </View>
        )
    }
}


const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(goodsInfoContainer);