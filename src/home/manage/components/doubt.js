import React, { Component } from 'react';
import {
    Text,
    View,
    Modal,
    TouchableOpacity
} from 'react-native';
import styles from '../style';

const doubt = ({ modalVisible, setModalVisible, modalBackgroundStyle, transparentStyle }) => {
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
                        <View style={{ height: 150, backgroundColor: '#fff', padding: 20 }}>
                            <Text style={{ fontSize: 18, fontWeight: '600', textAlign: 'center', color: '#000', marginBottom: 10 }}>本店职工</Text>
                            <Text style={{ textAlign: 'center' }}>本店职工是在本店就职或者兼职，使用商家管理软件的职工。</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal> 
    )
}

export default doubt;