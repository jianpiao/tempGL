import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
    Dimensions,
    ToastAndroid,
    TouchableNativeFeedback
} from 'react-native';
import styles from './style'
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { rollImg } from '../../../../redux/actions';
import Empty from '../../../../global/components/empty/index';
import preventDoublePress from '../../../../global/preventDoublePress';
import headerRightIcon from '../../../../global/components/headerRightIcon/style';
// import options from '../../../../global/options';
var screenWidth = Dimensions.get('window').width;
// var ImagePicker = require('react-native-image-picker');
import SyanImagePicker from 'react-native-syan-image-picker';

const options = {
    imageCount: 9,
    isRecordSelected: false
}


//  轮播图
class rollContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            tempPhotos: []
        }
    }

    componentWillMount = () => {
        this.setState({
            list: JSON.parse(JSON.stringify(this.props.counter.rollImg))
        })
    };
    

    /* 生命周期  节点动态渲染 */
    componentDidMount() {
        this.props.navigation.setParams({ add: this.add })
        this.props.navigation.setParams({ submit: this.submit })
    }
    componentWillUnmount() {
        SyanImagePicker.removeAllPhoto()
        SyanImagePicker.deleteCache()
    }
    //  提交按钮
    static navigationOptions = ({ navigation, screenProps }) => ({
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

    //  选择图片  添加轮播图
    add = () => {
        SyanImagePicker.removeAllPhoto()
        SyanImagePicker.showImagePicker(options, (err, photos) => {
            if (err) {
                // 取消选择
                return;
            }
            let ph = []
            let phs = []
            for (let i of photos) {
                ph.push(i.uri)
            }
            ph = new Set([...ph])
            phs = [...ph]
            if (ph.length != this.state.tempPhotos.length) {
                for (let i of ph) {
                    this.uploadImg({ uri: i, type: 'multipart/form-data', name: 'image.png' })
                }
                this.setState({ tempPhotos: phs})
            }
        })
    }
    //  提交数据
    submit = () => {
        this.props.dispatch(rollImg(this.state.list))
        this.props.navigation.goBack()
    }
    //  上传图片
    uploadImg (file) {
        fetch(getURL + 'UpRollImage', {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            body: formdata({ 
                image: file, 
                synopsis: ''
            })
        })
        .then((res) => res.json())
        .then((res) => 
        {
            if (res.error == 0) {
                this.state.list.push({ 
                    goods_roll_id: res.data.goods_roll_id,
                    goods_roll_image: res.data.image, 
                    goods_roll_synopsis: '' 
                })
                this.setState({
                    list: this.state.list
                })
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        })
        .catch((error) => {
            console.log(error)
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        })
    }
    //  输入框
    changeText = (text,index) => {
        this.state.list[index].goods_roll_synopsis = text
        this.setState({
            list: this.state.list
        })
    }
    //  删除
    deleteItem = (index) => {
        this.state.list.splice(index,1)
        this.setState({
            list: this.state.list
        })
    }
    //  查看图片
    checkImg = (index) => {
        let temp = []
        this.state.list.forEach(e => {
            if (e.goods_roll_image.substring(e.goods_roll_image.length - 6, e.goods_roll_image.length) == '.im100') {
                let p = e.goods_roll_image.substring(0, e.goods_roll_image.length - 6)
                temp.push({ photo: shopImg + 'goods_image/' +  p})
            } else {
                temp.push({ photo: shopImg + 'goods_image/' + e.goods_roll_image })
            }
        });
        this.props.navigation.navigate('Photo', {
            media: temp,
            index: index
        })
    }
    //  页面
    render() {
        return (
            <View style={styles.container}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <View style={{padding: 15,marginBottom: 30}}>
                        {
                            this.state.list.length > 0 ? 
                                this.state.list.map((item, index) => {
                                    return (
                                        <View key={index} style={styles.imgList}>
                                            <View style={{flex: 1}}>
                                                <TouchableOpacity 
                                                    onPress={() => this.deleteItem(index)}
                                                    activeOpacity={0.9} 
                                                    style={{width: 40,borderColor: '#FF0000',borderWidth: 1,borderRadius: 5,padding: 3,alignItems: 'center',justifyContent: 'center'}}>
                                                    <Text style={{ color: '#FF0000' }}>删除</Text>
                                                </TouchableOpacity>
                                                <TextInput
                                                    style={{ height: 60, borderWidth: 0}}
                                                    multiline={true}
                                                    placeholder="来介绍一下你的图片"
                                                    numberOfLines={1}
                                                    onChangeText={(text) => this.changeText(text, index)}
                                                    value={item.goods_roll_synopsis}
                                                />
                                            </View>
                                            <TouchableOpacity 
                                                activeOpacity={1}
                                                onPress={() => preventDoublePress.onPress(() => this.checkImg(index))}>
                                                <Image
                                                    resizeMode='cover'
                                                    style={{ width: 80, height: 80, alignSelf: 'flex-end' }}
                                                    source={{ uri: shopImg+'goods_image/'+item.goods_roll_image}}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }):
                            <Empty content="暂无轮播图" />
                        }
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(rollContainer);