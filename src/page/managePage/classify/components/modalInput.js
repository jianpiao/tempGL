import React, { Component } from 'react';
import {
    Text,
    View,
    TextInput,
    Modal,
    TouchableOpacity,
    TouchableNativeFeedback
} from 'react-native';
import styles from '../style';
import preventDoublePress from '../../../../global/preventDoublePress';

const modalDialog = ({ modalVisible, setModalVisible, modalBackgroundStyle, transparentStyle, name, onChangeText, add }) => {
    return (
        <Modal
            animationType={"none"}
            transparent={modalVisible}
            visible={modalVisible}
            onRequestClose={() => { setModalVisible(false) }}>
            <TouchableOpacity
                activeOpacity={1}
                style={{ flex: 1 }}
                onPress={() => setModalVisible(false)}>
                <View style={[styles.modal, modalBackgroundStyle]}>
                    <View style={transparentStyle}>
                        <View style={styles.modalInput}>
                            <View style={{ paddingTop: 20, paddingLeft: 15, paddingRight: 15, justifyContent: 'center', }}>
                                <Text style={{ fontSize: 20, fontWeight: '600', color: '#000' }}>新增分类</Text>
                            </View>
                            <View style={{ padding: 15 }}>
                                <TextInput
                                    goodsType='分类名称'
                                    placeholder='分类名称'
                                    keyboardType='default'
                                    autoFocus={true}
                                    underlineColorAndroid="#097d72"
                                    onChangeText={(t) => onChangeText(t)}
                                    value={name}
                                />
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <TouchableNativeFeedback
                                        background={TouchableNativeFeedback.Ripple('#aaa', false)}
                                        onPress={() => preventDoublePress.onPress(() => setModalVisible(false))}>
                                        <View style={{ flex: 1, height: 50, justifyContent: 'center', alignItems: 'flex-end' }}>
                                            <Text style={{ color: '#097d72' }}>取消</Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                    <TouchableNativeFeedback
                                        background={TouchableNativeFeedback.Ripple('#aaa', false)}
                                        onPress={() => preventDoublePress.onPress(() => add())}>
                                        <View style={{ width: 80, height: 50, marginLeft: 20, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end' }}>
                                            <Text style={{ color: '#097d72' }}>确认</Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    )
}

export default modalDialog;