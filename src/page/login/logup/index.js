import React, { Component } from 'react';
import {
    Text,
    View,
    TextInput,
    Image,
    TouchableNativeFeedback,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    ToastAndroid
} from 'react-native';
import styles from './style'
import { StackNavigator } from 'react-navigation';
import preventDoublePress from '../../../global/preventDoublePress';
//图片选择器参数设置
import options from '../../../global/options';
var screenWidth = Dimensions.get('window').width;
var ImagePicker = require('react-native-image-picker');


//用户名
function checkUser(num) {
    var reg = /^[a-zA-Z\u4e00-\u9fa5]{3,15}$/
    return reg.test(num);
}

//密码
function checkPassWord(num) {
    var reg = /^[a-zA-Z]\w{6,17}$/
    return reg.test(num);
}

// 真实名字
function checkName(num) {
    var reg = /^[\u4e00-\u9fa5]{2,5}$/
    return reg.test(num);
}

// 身份证号
function checkCard(num) {
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    return reg.test(num);
}


export default class aboutContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [
                { placeholder: '用户名', bcolor: '#ccc', keyboardType: 'default', value: '', icon: '\ue623', secureTextEntry:false},
                { placeholder: '密码(字母开头且至少八位数)', bcolor: '#ccc', keyboardType: 'default', value: '', icon: '\ue603', secureTextEntry:true },
                { placeholder: '手机号码', bcolor: '#ccc', keyboardType: 'numeric', value: '', icon: '\ue682', secureTextEntry:false },
                { placeholder: '真实名字', bcolor: '#ccc', keyboardType: 'default', value: '', icon: '\ue608', secureTextEntry:false },
                { placeholder: '身份证号', bcolor: '#ccc', keyboardType: 'numeric', value: '', icon: '\ue674', secureTextEntry:false}
            ],
            imgList: [
                { title: '  个  人  照  ', data:'',uri: '', height: 40, bcolor: '#777' },
                { title: '身份证正面', data: '',uri: '', height: 40, bcolor: '#777' },
                { title: '身份证反面', data: '',uri: '', height: 40, bcolor: '#777' },
            ],
            username: '',
            password: '',
            phone: '',
            realName: '',
            idCard: '',
            privatePhoto: '',
            idCardFront: '',
            idCardBehind: '',
            height1: '',
            onpressState: true
        }
    }

    
    // 物理返回键
    goBack = () => {
        this.props.navigation.goBack()
    }
    //  输入内容
    onChangeText = (index,text) =>{
        this.state.list[index].value = text
        this.state.list[index].bcolor = '#777'
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
            }
            else if (response.error) {
                ToastAndroid.show('上传失败，请重新上传' + response.error, ToastAndroid.SHORT);
            }
            else {
                //  设置图片的宽高为原尺寸比例
                this.state.imgList[index].height = (screenWidth - 180) * response.height / response.width
                this.state.imgList[index].uri = response.uri
                this.setState({
                    imgList: this.state.imgList 
                })
                let file = { uri: response.uri, type: 'multipart/form-data', name: 'image.png' }
                this.updataPicture(file,index)
            }
        });
    }
    //  上传图片
    updataPicture = (data, index) =>{
        fetch(regPath + 'UpUserImage', {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            body: formdata({
                image: data
            })
        })
        .then((res) => res.json())
        .then((res) => {
            console.log(res.data)
            if (res.error == 0) {
                this.state.imgList[index].data = res.data
                this.state.imgList[index].bcolor= '#777'
                this.setState({
                    imgList: this.state.imgList
                })
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        })
        .catch((error) => {
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        })
    }
    //  注册
    registration = () =>{
        if (!this.state.onpressState) return;
        this.setState({ onpressState: false })
        fetch(regPath + 'Registration', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                account_name: this.state.list[0].value,
                account_pass: this.state.list[1].value,
                phone_number: this.state.list[2].value,
                real_name: this.state.list[3].value,
                id_number: this.state.list[4].value,
                life_photos: this.state.imgList[0].data,
                photo_positive: this.state.imgList[1].data,
                photo_other: this.state.imgList[2].data
            })
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                this.props.navigation.goBack()
                ToastAndroid.show('注册成功，等待后台审核', ToastAndroid.SHORT);
            } else {
                this.setState({ onpressState: true })
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        })
        .catch((error) => {
            this.setState({ onpressState: false })
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        })
    }
    //  注册按钮点击事件
    logup = () => {
        if (!checkUser(this.state.list[0].value)) {
            this.state.list[0].bcolor = '#ff0000'
        }
        if (!checkPassWord(this.state.list[1].value)) {
            this.state.list[1].bcolor = '#ff0000'
        }
        if (!checkPhone(this.state.list[2].value)) {
            this.state.list[2].bcolor = '#ff0000'
        }
        if (!checkName(this.state.list[3].value)) {
            this.state.list[3].bcolor = '#ff0000'
        }
        if (!checkCard(this.state.list[4].value)) {
            this.state.list[4].bcolor = '#ff0000'
        }
        if (this.state.imgList[0].uri == '') {
            this.state.imgList[0].bcolor = '#ff0000'
        }
        if (this.state.imgList[1].uri == '') {
            this.state.imgList[1].bcolor = '#ff0000'
        }
        if (this.state.imgList[2].uri == '') {
            this.state.imgList[2].bcolor = '#ff0000'
        }
        this.setState({
            list: this.state.list,
            imgList: this.state.imgList
        })

        if (checkUser(this.state.list[0].value) &&
            checkPassWord(this.state.list[1].value) &&
            checkPhone(this.state.list[2].value) &&
            checkName(this.state.list[3].value) &&
            checkCard(this.state.list[4].value) &&
            this.state.imgList[0].uri != '' &&
            this.state.imgList[1].uri != '' &&
            this.state.imgList[2].uri!= '') {
            this.registration()
        } else {
            ToastAndroid.show('内容填写有误', ToastAndroid.SHORT);
        }
    }
    //  页面
    render() {
        return (
            <View style={styles.container}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <View style={{ flex: 1, margin: 20 }}>
                        {/** 内容填写  **/}
                        {
                            this.state.list.map((item, index) => {
                                return (
                                    <View key={index} style={{ flexDirection: 'row', paddingLeft: 7, paddingRight: 7, marginBottom: 15, borderBottomColor: item.bcolor, borderBottomWidth: 0.7 }}>
                                        <View style={{ justifyContent: 'center' }}>
                                            <Text style={{ fontFamily: 'iconfont', fontSize: 18 }}>{item.icon}</Text>
                                        </View>
                                        <View style={{ flex: 1, paddingLeft: 10 }}>
                                            <TextInput
                                                style={{ fontSize: 16 }}
                                                placeholder={item.placeholder}
                                                keyboardType={item.keyboardType}
                                                secureTextEntry={item.secureTextEntry}
                                                underlineColorAndroid="transparent"
                                                onChangeText={(t) => this.onChangeText(index, t)}
                                                value={item.value}
                                            />
                                        </View>
                                    </View>
                                )
                            })
                        }
                        {/** 照片上传  **/}
                        {
                            this.state.imgList.map((item,index) => {
                                return (    
                                    <View key={index} style={{ flexDirection: 'row', marginTop: 15 }}>
                                        <View style={{ width: 100 }}>
                                            <Text style={{ color: item.bcolor }}>{item.title}:</Text>
                                        </View>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => preventDoublePress.onPress(() => this.choosePic(index))}
                                            style={{ flex: 1 }}>
                                            {
                                                item.uri == '' ?
                                                    <Text style={{color: '#222'}}>点击添加</Text> :
                                                    <Image
                                                        style={{ width: screenWidth - 180, height: item.height }}
                                                        resizeMode="cover"
                                                        resizeMethod="scale"
                                                        source={{ uri: item.uri }}
                                                    />
                                            }
                                        </TouchableOpacity>
                                    </View>
                                )
                            })
                        }
                        <View style={{ marginTop: 50 }}>
                            <TouchableNativeFeedback
                                background={TouchableNativeFeedback.Ripple('#aaa', false)}
                                onPress={() => preventDoublePress.onPress(() => this.logup())}>
                                <View style={{ height: 40, backgroundColor: '#1fcea7', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                                    <Text style={{ fontSize: 16, color: '#fff' }}>注册</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

