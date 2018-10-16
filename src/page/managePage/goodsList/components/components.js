import React, { Component } from 'react';
import {
    Text,
    View,
    Modal,
    TouchableOpacity,
    TouchableHighlight,
    TouchableNativeFeedback
} from 'react-native';
import styles from '../style';
import preventDoublePress from '../../../../global/preventDoublePress';


export const Classify = ({ item, index, selectClass }) => {
    return (
        <TouchableNativeFeedback
            key={index}
            background={TouchableNativeFeedback.Ripple('#aaa', false)}
            onPress={() => selectClass(item, index)}>
            <View style={styles.classifyItem}>
                <Text key={index}>
                    {item.shop_goods_category_name + ' (' + item.data.length + '份)'}
                </Text>
            </View>
        </TouchableNativeFeedback>
    )
}

export const Updown = ({ item, index, onPageSelected, initialPage }) => {
    return (
        <TouchableNativeFeedback
            key={index}
            background={TouchableNativeFeedback.Ripple('#aaa', true)}
            onPress={() => onPageSelected(initialPage = index)}>
            <View style={[styles.nabar]}>
                <View style={[styles.nabarView, { borderBottomWidth: initialPage == index ? 2 : 0 }]}>
                    <Text style={{ color: initialPage == index ? '#000' : '#999' }}>
                        {item}
                    </Text>
                </View>
            </View>
        </TouchableNativeFeedback>
    )
}

export const ModalAdd = ({ modalVisible, setModalVisible, modalSelect }) => {
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
                <View style={styles.modal}>
                    <TouchableHighlight
                        underlayColor="#e9e9e9"
                        activeOpacity={1}
                        style={styles.modalView}
                        onPress={() => preventDoublePress.onPress(() => modalSelect(0))}>
                        <Text style={styles.modalText}>添加商品</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        underlayColor="#e9e9e9"
                        activeOpacity={1}
                        style={styles.modalView}
                        onPress={() => preventDoublePress.onPress(() => modalSelect(1))}>
                        <Text style={styles.modalText}>管理分类</Text>
                    </TouchableHighlight>
                </View>
            </TouchableOpacity>
        </Modal>
    )
}


export const SelectAll = ({ listState, selectAll, selectAllState, initialPage, selectValue, setGoodsUpDown }) => {
    return (
        <View style={[styles.bottomControl, { height: listState ? 60 : 0 }]}>
            <View style={{ flexDirection: 'row' }}>
                <View style={styles.bcViewt}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => preventDoublePress.onPress(() => selectAll())}
                        style={{ flexDirection: 'row' }}>
                        <View style={[styles.bcRadio, { borderWidth: selectAllState ? 0 : .8, backgroundColor: selectAllState ? '#30bd9e' : '#fff' }]}>
                            {
                                selectAllState ? <Text style={{ color: '#fff' }}>√</Text> : null
                            }
                        </View>
                        <Text style={styles.selectAllText}>全选</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.bccView}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.bcViewLen}>
                            <Text style={{ color: '#444' }}>已选 {selectValue} 份</Text>
                        </View>
                        {
                            initialPage == 0 ?
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => preventDoublePress.onPress(() => setGoodsUpDown(1))}
                                    style={styles.bcViewT}>
                                    <Text style={{ color: '#fff' }}>下架</Text>
                                </TouchableOpacity> :
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => preventDoublePress.onPress(() => setGoodsUpDown(2))}
                                    style={styles.bcViewT}>
                                    <Text style={{ color: '#fff' }}>上架</Text>
                                </TouchableOpacity>
                        }
                    </View>
                </View>
            </View>
        </View>
    )
}
