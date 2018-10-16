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
    ToastAndroid,
    Dimensions
} from 'react-native';
import styles from './style'
import { StackNavigator } from 'react-navigation';
import ActionSheet from 'react-native-actionsheet';
import headerRightIcon from '../../../global/components/headerRightIcon/style';
import preventDoublePress from '../../../global/preventDoublePress';
import SyanImagePicker from 'react-native-syan-image-picker';
const ImagePicker = require('react-native-image-picker');
const screenWidth = Dimensions.get('window').width;

const options = {
    imageCount: 9,
    isRecordSelected: false
}

export default class feedbackContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            detail: '',
            uploadImg: [],
            ModalPic: { uri: '' }
        }
    }

    /* 生命周期  节点动态渲染 */
    componentDidMount() {
        this.props.navigation.setParams({ navigatePress: this.setFecth })
    }
    componentWillUnmount() {
        SyanImagePicker.removeAllPhoto()
        SyanImagePicker.deleteCache();
    }
    //  提交按钮
    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
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

    //  请求数据
    setFecth = () => {
        if (this.state.text.length > 5 && this.state.detail.length > 10) {
            //  使用表格形式上传
            let file = { uri: this.state.ModalPic.uri, type: 'multipart/form-data', name: 'image.png' }
            //  提交反馈
            fetch(getURL + 'Feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'multipart/form-data' },
                body: formdata({
                    outline: this.state.text,
                    feedback_info: this.state.detail,
                    error_img: file.uri == '' || null || undefined ? '' : file
                })
            })
            .then((res) => res.json())
            .then((res) => {
                if (res.error == 0) {
                    ToastAndroid.show('感谢您的反馈', ToastAndroid.SHORT);
                    this.props.navigation.goBack();
                } else {
                    ToastAndroid.show(res.data, ToastAndroid.SHORT);
                }
            })
            .catch((error) => {
                ToastAndroid.show('网络异常', ToastAndroid.SHORT);
            })
        } else {
            ToastAndroid.show('概括不得少于5个字，内容不得少于10个字', ToastAndroid.SHORT);
        }
    }

    //  选择图片
    choosePic = () => {
        SyanImagePicker.removeAllPhoto()
        SyanImagePicker.showImagePicker(options, (err, photos) => {
            if (err) {
                // 取消选择
                return;
            }

            if (this.state.uploadImg.length < 9) {
                let addimg = this.state.uploadImg
                let ph = []
                let phs = []
                for (let i in addimg) {
                    ph.push(addimg[i].uri)
                }
                for (let i in photos) {
                    ph.push(photos[i].uri)
                }
                //  去除重复
                ph = new Set([...ph])
                for (let i of ph) {
                    phs.push({ uri: i })
                }
                this.setState({
                    ModalPic: { uri: photos[0].uri },
                    uploadImg: phs
                });
            } else {
                ToastAndroid.show('图片已超过上限', ToastAndroid.SHORT);
            }
        })
    }


    //  查看图片
    previewImg = (e,i) => {
        let media = []
        for (let n of this.state.uploadImg) {
            media.push({ photo: n.uri} )
        }
        this.props.navigation.navigate('Photo', { media: media, index: i })
    }
    //  删除图片
    removePhoto = (i) => {
        const photos = this.state.uploadImg.filter((m,n) => n !== i)
        // 更新原生图片数组
        SyanImagePicker.removePhotoAtIndex(i);
        // 更新 RN 页面
        this.setState({ uploadImg: photos });
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={{ padding: 15, marginTop: 20 }}>
                        <Text style={styles.title}>概括</Text>
                        <TextInput
                            style={styles.text}
                            onChangeText={(text) => this.setState({ text })}
                            value={this.state.text}
                            underlineColorAndroid="transparent"
                            placeholder="清晰的标题会更快被审核"
                        />
                    </View>
                    <View style={{ padding: 15 }}>
                        <Text style={styles.title}>内容</Text>
                        <View style={styles.textareaView}>
                            <TextInput
                                style={styles.textarea}
                                onChangeText={(detail) => this.setState({ detail })}
                                value={this.state.detail}
                                multiline={true}
                                numberOfLines={5}
                                underlineColorAndroid="transparent"
                                placeholder="请具体描述问题或者分享有用的想法，我们会尽快处理并与您联系。"
                            />
                        </View>
                    </View>

                    <Text style={[styles.title, { marginTop: 15, marginLeft: 15 }]}>上传照片</Text>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: 15, marginRight: 15, }}>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.addImg}
                            onPress={() => preventDoublePress.onPress(() => this.choosePic())}>
                            <Text style={styles.addImgIcon}>&#xe6d1;</Text>
                        </TouchableOpacity>
                        {
                            this.state.uploadImg.map((m, i) =>
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => preventDoublePress.onPress(() => this.previewImg(m,i))}
                                    activeOpacity={1}>
                                    <TouchableOpacity
                                        style={styles.remove}
                                        activeOpacity={1}
                                        onPress={() => this.removePhoto(i)}>
                                        <Text style={styles.removeText}>×</Text>
                                    </TouchableOpacity>
                                    <Image
                                        key={i}
                                        resizeMode='cover'
                                        style={{ width: 90, height: 90, marginRight: 10, marginTop: 10, }}
                                        source={m}
                                    />
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </ScrollView>
            </View>
        )
    }
}

