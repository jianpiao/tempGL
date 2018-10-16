import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    TouchableNativeFeedback,
    Picker,
    Dimensions,
    ToastAndroid,
    Alert
} from 'react-native';
import styles from './style'
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { setShopInfo, rollImg, goodsType, shopGoodsCategoryList, upGoods, downGoods, isRefreshing } from '../../../redux/actions';
import preventDoublePress from '../../../global/preventDoublePress';
import headerRightIcon from '../../../global/components/headerRightIcon/style';
import options from '../../../global/options';
var ImagePicker = require('react-native-image-picker');
var screenWidth = Dimensions.get('window').width;


class addGoodsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onpressState: true,
            list: [
                { title: '照片',      data: "", placeholder: '请选择商品照片' },
                { title: '商品名称',  data: "", placeholder:'请填写商品名称'},
                { title: '商品价格',  data: "", placeholder: '请填写商品价格' },
                { title: '商品介绍',  data: "", placeholder: '请填写商品介绍'},
                { title: '轮播图片',  data: "", placeholder: '请添加商品介绍图片'},
                { title: '套餐类型',  data: "", placeholder: '请选择套餐类型'},
                { title: '店铺分类',  data: "", placeholder: '请选择店铺分类'},
                { title: '系统分类',  data: "", placeholder: '请选择系统分类'},
                { title: '主推',     data: 0,   placeholder: '请选择是否主推'},
                { title: '商品状态', data: 2,   placeholder: '请选择商品状态'}
            ]
        }
    }

    /* 生命周期开始 */
    componentWillMount() {
        //  初始化清空轮播图和商品套餐
        this.props.dispatch(rollImg([]))
        this.props.dispatch(goodsType([]))
    }

    /* 生命周期  节点动态渲染 */
    componentDidMount() {
        this.props.navigation.setParams({ submit: this.submit })
        //  初始化商品列表选项和系统分类
        if (this.props.counter.shopGoodsCategoryList.length > 1) {
            this.state.list[6].data = this.props.counter.shopGoodsCategoryList[1].shop_goods_category_id
        }
        if (this.props.counter.systemGoodsCategoryList.length > 0) {
            this.state.list[7].data = this.props.counter.systemGoodsCategoryList[0].system_category_id
        }
        this.setState({
            list: this.state.list
        })
    }

    //  提交按钮
    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        headerRight: (
            <View style={{ flexDirection: 'row', }}>
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
    submit = () => {
        if (this.props.counter.shopGoodsCategoryList.length == 0) {
            this.props.navigation.navigate('Classify')
        } else {
            if (!this.state.onpressState) return; 
            this.props.dispatch(isRefreshing(true))
            this.setState({ onpressState: false})
            //  把套餐价格改成整数类型
            let gt = JSON.parse(JSON.stringify(this.props.counter.goodsType));
            gt.forEach(e => {
                e.goods_type_price = parseInt(e.goods_type_price) * 100
            });
            //  使用表格形式上传
            let file = { uri: this.state.list[0].data.uri, type: 'multipart/form-data', name: 'image.png' }
            fetch(getURL + 'SetGoodsInfo', {
                method: 'POST',
                headers: { 'Content-Type': 'multipart/form-data' },
                body: formdata({
                    goods_id: 0,
                    goods_image: file.uri == null || undefined ? '' : file,
                    goods_name: this.state.list[1].data,
                    goods_price: this.state.list[2].data * 100,
                    goods_details: this.state.list[3].data,
                    roll_image: JSON.stringify(this.props.counter.rollImg),
                    goods_type: JSON.stringify(gt),
                    shop_goods_category_id: this.state.list[6].data,
                    system_category_id: this.state.list[7].data,
                    recommend: this.state.list[8].data,
                    goods_state: this.state.list[9].data,
                    associated_goods: JSON.stringify([])
                })
            })
            .then((res) => res.json())
            .then((res) => {
                if (res.error == 0) {
                    let [cate, goodsList, upList, downList] = [
                        this.props.counter.shopGoodsCategoryList,
                        this.props.counter.getGoodsList,
                        JSON.parse(JSON.stringify(this.props.counter.shopGoodsCategoryList)),
                        JSON.parse(JSON.stringify(this.props.counter.shopGoodsCategoryList))
                    ]
                    goodsList.push(res.data)
                    //  遍历分类列表 找到和添加的对象对应的分类id  相同的就将最新对象添加进去对应分类的数组里面
                    cate.forEach(e => {
                        e.shop_goods_category_id == res.data.shop_goods_category_id ? e.data.push(res.data) : null
                    });
                    cate.forEach((e, i) => {
                        //  通过比较分类id和每个商品上面的分类id相同就添加到分类的数组中
                        cate[i].data = goodsList.filter(m => m.shop_goods_category_id == e.shop_goods_category_id)
                        upList[i].data = goodsList.filter(m => m.shop_goods_category_id == e.shop_goods_category_id && m.goods_state == 2)
                        downList[i].data = goodsList.filter(m => m.shop_goods_category_id == e.shop_goods_category_id && m.goods_state == 1)
                    });
                    //  深拷贝 从而改变渲染
                    this.props.dispatch(shopGoodsCategoryList(JSON.parse(JSON.stringify(cate))))
                    this.props.dispatch(upGoods(JSON.parse(JSON.stringify(upList))))
                    this.props.dispatch(downGoods(JSON.parse(JSON.stringify(downList))))
                    ToastAndroid.show('添加成功', ToastAndroid.SHORT);
                    this.props.navigation.goBack()
                } else {
                    this.setState({ onpressState: true })
                    ToastAndroid.show(res.data, ToastAndroid.SHORT);
                }
                this.props.dispatch(isRefreshing(false))
            })
            .catch((error) => {
                this.props.dispatch(isRefreshing(false))
                ToastAndroid.show('网络异常', ToastAndroid.SHORT);
            })
        }
    }


    
    //  填写数据改变状态
    changeText = (text,index) => {
        this.state.list[index].data = text
        this.setState({
            list: this.state.list
        })
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
                // console.log('用户取消了选择！');
            } else if (response.error) {
                ToastAndroid.show('出现了一些问题，请重新上传' + response.error, ToastAndroid.SHORT);
            } else {
                let sourse = { uri: response.uri }
                let height = (response.height * response.width) / screenWidth
                this.changeText(sourse,index)
            }
        });
    }

    //  跳转页面
    openPage = (index) => {
        switch (index) {
            case 4:
                this.props.navigation.navigate('Roll', { transition: 'forHorizontal' });
                break;
            case 5:
                this.props.navigation.navigate('GoodsType', { 
                    transition: 'forHorizontal',
                    goodsId: 0    
                });
                break;
            default:
                break;
        }
    }

    //   填写栏
    setControlType = (item,index) => {
        if (item.title == '照片') {
            return (
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => preventDoublePress.onPress(() => this.choosePic(index))}>
                        {
                            this.state.list[index].data == '' ?
                            <Image
                                resizeMode='cover'
                                style={{ width: 80, height: 80, alignSelf: 'flex-end' }}
                                source={require('../../../static/img/glsyj.png')}
                            /> :
                            <Image
                                resizeMode='cover'
                                style={{ width: 80, height: 80, alignSelf: 'flex-end' }}
                                source={this.state.list[index].data}
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
        } else if (item.title == '套餐类型' || item.title == '轮播图片') {
            let content = ''
            if (item.title == '轮播图片') {
                content = this.props.counter.rollImg.length + '张'
            } else if (item.title == '套餐类型') {
                content = this.props.counter.goodsType.length + '份'
            }
            return (
                <TouchableOpacity 
                    activeOpacity={0.9} 
                    onPress={() => preventDoublePress.onPress(() => this.openPage(index))} 
                    style={{ flex: 1, flexDirection: 'row'}}>
                    <View style={styles.textLeftView}>
                        <Text style={styles.textRight1}>{content}</Text>
                    </View>
                    <View style={styles.textRightView1}>
                        <Text style={[styles.textRight1,{ alignSelf: 'flex-end', fontFamily: 'iconfont' }]}>
                            &#xe6b9;
                        </Text>
                    </View>
                </TouchableOpacity>
            )
        } else if (item.title == '店铺分类' || item.title == '系统分类') {
            //  店铺分类,系统分类
            let temp = this.props.counter.shopGoodsCategoryList
            return (
                <View style={{ flex: 1 }}>
                    <Picker
                        selectedValue={item.data}
                        mode="dropdown"
                        onValueChange={(text) => this.changeText(text, index)}>
                        {
                            index == 6 ? 
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
                        onValueChange={(text) => this.changeText(text, index)}>
                        <Picker.Item 
                            style={{ marginLeft: 12 }} 
                            label={index == 8 ? '是' : '上架'} 
                            value={index == 8 ? 1 : 2} />
                        <Picker.Item
                            style={{ marginLeft: 12 }}
                            label={index == 8 ? '否' : '下架'}
                            value={index == 8 ? 0 : 1} />
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


    render() {
        return (
            <View style={styles.container}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    {
                        this.state.list.map((m,i) => {
                            return (
                                <View style={styles.inputText} key={i}>
                                    <View style={styles.textLeftView}>
                                        <Text style={styles.textLeft}>{m.title}</Text>
                                    </View>
                                    {this.setControlType(m,i)}
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

export default connect(mapStateToProps)(addGoodsContainer);