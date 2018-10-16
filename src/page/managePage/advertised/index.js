import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    WebView,
    ScrollView,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import styles from './style'
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { getWallet } from '../../../redux/actions';
import Empty from '../../../global/components/empty/index';
import preventDoublePress from '../../../global/preventDoublePress';
var screenHeight = Dimensions.get('window').height;

//  跳转外网页面
class walletContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: ''
        }
    }

    /* 生命周期  节点动态渲染 */
    componentDidMount() {
        let { params } = this.props.navigation.state
        this.setState({
            item: params.item
        })
    }
    //  提交按钮
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.title
    });
    //  查看图片
    checkImg = (i) => {
        this.props.navigation.navigate('Photo', {
            media: [{ photo: i}],
            index: 0
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <WebView
                    source={{ uri: this.state.item.url }}
                    style={{ height: screenHeight}}
                />
                {/* <ScrollView>
                    <Text style={{ fontSize: 30, color: '#333', padding: 50, textAlign: 'center' }}>{this.state.item.title}</Text>
                    <Text style={{ textAlign: 'center', color: '#777',paddingBottom: 30 }}>广理商业街 . 推广{new Date().getFullYear() + '-' + new Date().getMonth() + 1 + '-' + new Date().getDate()}</Text>
                    <Text style={{ padding: 20, color: '#333', letterSpacing: 1 }}>
                        突如其来的9月1日让我措手不及，以前这个时候我已经收拾好行礼大包小包的回学校了。现在才发现，
                        这一年，我们再也没有开学了。毕业后的日子给我们带来的是无尽的燥热，
                        以及随温度升高而带来的各种工作压力。开始新的生活，又开始怀念从前。
                        曾经无比厌恶的上学日子，现在却是最想回到的过去。
                      记忆中的9月1日总是令人既兴奋又恐惧、躁动不安却心驰神往，
                        无论是小学、中学还是大学，这种感觉一直陪伴着我们，唯独这一年，
                        当我们真正明白自己不再是一名学生的时候，才发现那种感觉竟是如此的弥足珍贵！
                    </Text>
                    <TouchableOpacity activeOpacity={1} onPress={() => preventDoublePress.onPress(() => this.checkImg(this.state.item.img))}>
                        {
                            this.state.item.img != '' ? 
                                <Image
                                    style={{ width: screenWidth, height: 250, marginTop: 20, marginBottom: 20 }}
                                    resizeMode='cover'
                                    source={{ uri: this.state.item.img}}
                                />:
                            null
                        }
                    </TouchableOpacity>
                    <View style={{ alignSelf: 'center',width: 90, height: 70, marginTop: 20, marginBottom: 20, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: '600', color: '#777',marginBottom: 5 }}>完</Text>
                        <Text style={{ fontWeight: '600', color: '#777', }}>E N D</Text>
                    </View>
                </ScrollView> */}
            </View>
        )
    }
}

const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(walletContainer);