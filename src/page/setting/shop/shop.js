import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    Image,
    TouchableOpacity,
    TimePickerAndroid,
    ToastAndroid,
    ScrollView,
    Modal,
    RefreshControl
} from 'react-native';
import styles from './style'
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { setShopInfo, isRefreshing } from '../../../redux/actions';
import preventDoublePress from '../../../global/preventDoublePress';
var ImagePicker = require('react-native-image-picker');


//图片选择器参数设置
import options from '../../../global/options';



//  店铺
class shopContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false
        }
    }

    //  设置店铺信息
    SetShopInfo(data) {
        fetch(getURL + 'SetShopInfo', {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            body: formdata(data)
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                //  更新成功就把数据刷新一遍
                this.props.dispatch(setShopInfo(res.shop_info))
                ToastAndroid.show('设置成功', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        })
        .catch((error) => {
            alert("网络连接失败" + error)
        })
    }
    //  获取店铺信息
    getShop() {
        fetch(getURL + 'GetShop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                this.props.dispatch(setShopInfo(res.data))
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
            this.props.dispatch(isRefreshing(false))
        })
    }
    //  过滤时间 自动补0
    filterTime = i => {
        if (i < 10) {
            return '0' + i
        } else {
            return i
        }
    }
    //  打开弹出框
    openModal = (i) => {
        switch (i) {
            case 0:
                //  打开时间选择器  开店时间
                TimePickerAndroid.open().then(({ action, hour, minute }) => {
                    if (action !== TimePickerAndroid.dismissedAction) {
                        //  获取并格式时间
                        let formtime = this.filterTime(hour) + ':' + this.filterTime(minute) + ':' +'00'
                        //  提交到数据库
                        this.SetShopInfo({ business_hours_start: formtime })
                    }
                })
                break;

            case 1:
                //  打开时间选择器  关店时间
                TimePickerAndroid.open().then(({ action, hour, minute }) => {
                    if (action !== TimePickerAndroid.dismissedAction) {
                        //  获取并格式时间
                        let formtime = this.filterTime(hour) + ':' + this.filterTime(minute) + ':' + '00'
                        //  提交到数据库
                        this.SetShopInfo({ business_hours_end: formtime })
                    }
                })
                break;

            case 2:
                //  显示弹出框
                this.setState({
                    modalVisible: true
                });
                break;     

            default:
                break;
        }
    }
    //  关闭弹出框
    setModalVisible(s,i) {
        if (s) {
            this.SetShopInfo({ shop_state: '' + i })
        }

        this.setState({
            modalVisible: false
        });
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
            }
            else if (response.error) {
                ToastAndroid.show('上传失败，请重新上传' + response.error, ToastAndroid.SHORT);
            }
            else {
                let file = { uri: response.uri, type: 'multipart/form-data', name: 'image.png' }
                this.SetShopInfo(index == 0 ? { shop_image: file } : { back_image: file })
            }
        });
    }
    //  查看图片
    checkImg = (i) => {
        this.props.navigation.navigate('Photo', {
            media: [
                { photo: shopImg + 'shop_image/' + this.props.counter.shop.shop_image },
                { photo: shopImg + 'shop_back_image/' + this.props.counter.shop.back_image }
            ],
            index: i
        })
    }
    //  选择修改内容 
    selectShopList = (i,f,t) => {
        switch (i) {
            case 0:
                this.props.navigation.navigate('Textinput', {
                    transition: 'forHorizontal',
                    title: '修改'+t,
                    index: i,
                    data: '',
                    value: "" + f,
                    tag: 'shopName',
                    keyboardType: 'default'
                });
                break;
            case 1:
                this.props.navigation.navigate('Textinput', {
                    transition: 'forHorizontal',
                    title: '修改'+t,
                    index: i,
                    data: '',
                    value: "" + f,
                    tag: 'shopSynopsis',
                    keyboardType: 'default'
                });
                break;
            case 2:
                this.props.navigation.navigate('Textinput', {
                    transition: 'forHorizontal',
                    title: '修改'+t,
                    index: i,
                    data: '',
                    value: "" + f,
                    tag: 'shopPhone',
                    keyboardType: 'numeric'
                });
                break;
            case 5:
                this.props.navigation.navigate('Textinput', {
                    transition: 'forHorizontal',
                    title: '修改'+t,
                    index: i,
                    data: '',
                    value: "" + f,
                    tag: 'shopAddress',
                    keyboardType: 'default'
                });
                break;
            default:
                break;
        }
    }
    //  下拉刷新
    onRefresh = () => {
        this.getShop()
        this.props.dispatch(isRefreshing(true))
    }
    //  页面
    render() {
        var modalBackgroundStyle = {
            backgroundColor: this.state.modalVisible ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)',
        };
        var transparentStyle = this.state.modalVisible
            ? { backgroundColor: '#fff', padding: 20 }
            : null;

        //  定义
        let data = this.props.counter.shop
        let shopImgList = [
            { title: '店铺照片', url: shopImg + 'shop_image/' + data.shop_image },
            { title: '店铺背景', url: shopImg + 'shop_back_image/' + data.back_image}    
        ]
        let shopList = [
            { title: '店铺名称', data: data.shop_name },
            { title: '店铺简介', data: data.synopsis },
            { title: '联系方式', data: data.phone_number },
            { title: '店铺编号', data: data.shop_id },
            { title: '店铺类型', data: data.shop_category_name },
            { title: '店铺地址', data: data.address }
        ]
        let shopTimeList = [
            { title: '开店时间', data: data.business_hours_start },
            { title: '关店时间', data: data.business_hours_end },
            { title: '营业状态', data: data.shop_state == 1 ? '营业' : '打烊' },
            { title: '到期时间', data: data.expiration_date }
        ]
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.props.counter.refreshing}
                        onRefresh={() => this.onRefresh()}
                        enabled={true}
                        colors={refreshColor}
                        progressBackgroundColor="#ffffff"
                    />
                }
                scrollEventThrottle={50}>
                <View style={styles.container}>
                    <View style={styles.title}>
                        <Text style={styles.titleText}>基本信息</Text>
                    </View>
                    {/** 店铺照片 **/}
                    {
                        shopImgList.map((m,i) => 
                            <TouchableOpacity 
                                style={styles.info} 
                                key={i}
                                activeOpacity={0.8}
                                onPress={() => preventDoublePress.onPress(() => this.choosePic(i))}>
                                <View style={styles.shopImgListLeft}>
                                    <Text style={styles.infoLeftText}>{m.title}</Text>
                                </View>
                                <TouchableOpacity 
                                    style={styles.shopImgListRight} 
                                    onPress={() => preventDoublePress.onPress(() => this.checkImg(i))} 
                                    activeOpacity={0.8} >
                                    <Image style={{ width: 40, height: 40 }} resizeMode='cover' source={{ uri: m.url }} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        )
                    }
                    {/** 店铺介绍 **/}
                    {
                        shopList.map((m,i) => 
                            <TouchableOpacity 
                                style={styles.info} 
                                key={i}
                                activeOpacity={1}
                                onPress={() => preventDoublePress.onPress(() => this.selectShopList(i, m.data,m.title))}>
                                <View style={styles.infoLeft}>
                                    <Text style={styles.infoLeftText}>{m.title}</Text>
                                </View>
                                <View style={styles.infoRight}>
                                    <Text style={styles.infoRightText}>{m.data}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                    <View style={styles.title}>
                        <Text style={styles.titleText}>时间期限</Text>
                    </View>
                    {/** 时间期限 **/}
                    {
                        shopTimeList.map((m,i) => 
                            <TouchableOpacity 
                                key={i}
                                style={styles.info} 
                                activeOpacity={i != 3 ? 0.6 : 1}
                                onPress={() => this.openModal(i)}>
                                <View style={styles.infoLeft}>
                                    <Text style={styles.infoLeftText}>{m.title}</Text>
                                </View>
                                <View style={styles.infoRight}>
                                    <Text style={styles.infoRightText}>{m.data}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }


                    <Modal
                        animationType={"none"}
                        transparent={this.state.modalVisible}
                        visible={this.state.modalVisible}
                        onRequestClose={() => { this.setModalVisible(false) }}>
                        <TouchableOpacity 
                            activeOpacity={1}
                            style={{ flex: 1 }} 
                            onPress={() => this.setModalVisible(false)}>
                            <View style={[styles.modal,modalBackgroundStyle]}>
                                <View style={transparentStyle}>
                                    <TouchableOpacity 
                                        style={[styles.modalItem,{marginBottom: 10}]} 
                                        activeOpacity={0.6} 
                                        onPress={() => this.setModalVisible(true,0)}>
                                        <Text style={styles.modalItemText}>打烊</Text>
                                    </TouchableOpacity >
                                    <TouchableOpacity 
                                        style={[styles.modalItem,styles.modalItemBottom]} 
                                        activeOpacity={0.6} 
                                        onPress={() => this.setModalVisible(true,1)}>
                                        <Text style={styles.modalItemText}>营业</Text>
                                    </TouchableOpacity >
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Modal>    
                </View>
            </ScrollView>
        )
    }
}

const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(shopContainer);

