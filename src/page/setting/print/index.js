import React, { Component } from 'react';
import {
    Text,
    View,
    Modal,
    Alert,
    ScrollView,
    AsyncStorage,
    NativeModules,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';
import styles from './style'
import { StackNavigator } from 'react-navigation';
import { printList } from '../../../redux/actions';
import { connect } from 'react-redux';
import preventDoublePress from '../../../global/preventDoublePress';

//  打印
class printContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            buttonList: ['打印机连接', '打开蓝牙'],
            modalVisible: false
        }
    }

    //  选择打印机蓝牙
    select = (v) => {
        //设置蓝牙设备 保存到本地
        AsyncStorage.setItem('blueAddress', v.address);
        NativeModules.BluetoothPrinterModule.SetBluetooth(v.address)
        this.setModalVisible(false)
    }
    //  按钮点击
    printButton = (index) => {
        switch (index) {
            case 0:
                //获取已配对的蓝牙列表
                NativeModules.BluetoothPrinterModule.ReturnBluetoothDevice((bluetoothList) => {
                    if (bluetoothList.length > 0) {
                        this.setState({
                            list: bluetoothList
                        })
                    } else {
                        Alert.alert(
                            '',
                            '是否要打开蓝牙配对蓝牙打印机?',
                            [
                                { text: '取消', onPress: () => null, style: 'cancel' },
                                {
                                    text: '确认', onPress: () => {
                                        //调出蓝牙配对界面
                                        NativeModules.BluetoothPrinterModule.PairingBluetooth()
                                    }
                                },
                            ],
                            { cancelable: false }
                        )
                    }
                })
                //  打开选择对话框
                this.setModalVisible(true)
                break;
            case 1:
                //调出蓝牙配对界面
                NativeModules.BluetoothPrinterModule.PairingBluetooth()
                break;
            case 2:
                //测试蓝牙打印机
                NativeModules.BluetoothPrinterModule.Test()
                break;
            default:
                break;
        }
    }
    //  弹出框
    setModalVisible = (v) => {
        this.setState({
            modalVisible: v
        })
    }
    //  页面
    render() {
        var modalBackgroundStyle = {
            backgroundColor: this.state.modalVisible ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)'
        };
        var transparentStyle = this.state.modalVisible ? { backgroundColor: '#fff' } : null
        return (
            <View style={styles.container}>
                {
                    this.state.buttonList.map((item,index) => {
                        return (
                            <TouchableHighlight
                                underlayColor='#eee'
                                key={index}
                                activeOpacity={1}
                                onPress={() => preventDoublePress.onPress(() => this.printButton(index))}
                                style={{ margin: 20, backgroundColor: '#fff', height: 45, justifyContent: 'center', alignItems: 'center', elevation: 4 }}>
                                <Text>{item}</Text>
                            </TouchableHighlight>
                        )
                    })
                }
                {/** 蓝牙选择框 **/}
                <Modal
                    animationType={"none"}
                    transparent={this.state.modalVisible}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { this.setModalVisible(false) }}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ flex: 1 }}
                        onPress={() => this.setModalVisible(false)}>
                        <View style={[styles.modal, modalBackgroundStyle]}>
                            <View style={transparentStyle}>
                                <TouchableOpacity 
                                    activeOpacity={1} 
                                    onPress={() => preventDoublePress.onPress(() => this.setModalVisible(true))} 
                                    style={{ backgroundColor: '#fff', padding: 20,borderRadius: 5}}>
                                    <Text style={{fontSize: 20,fontWeight: '600',marginBottom: 20,color: '#000'}}>选择打印机蓝牙</Text>
                                    <ScrollView>
                                        {
                                            this.state.list.map((item, index) => {
                                                return (
                                                    <TouchableOpacity
                                                        key={index}
                                                        activeOpacity={1}
                                                        onPress={() => preventDoublePress.onPress(() => this.select(item))}
                                                        style={{ margin: 20, elevation: 4 }}>
                                                        <Text>蓝牙名称： {item.name}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </ScrollView>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal> 
            </View>
        )
    }
}


const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(printContainer);