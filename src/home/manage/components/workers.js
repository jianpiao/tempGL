import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TouchableNativeFeedback
} from 'react-native';
import styles from '../style';
import preventDoublePress from '../../../global/preventDoublePress';

const workers = ({ setModalVisible, jumpWorker,workerList, workerDetail, jumpAddWorker}) => {    
    return (
        <View style={styles.workers}>
            <View style={styles.workersHeader}>
                <View style={styles.workersHeaderTitle}>
                    <Text>本店职工</Text>
                    <Text
                        style={styles.workersHeadTag}
                        onPress={() => preventDoublePress.onPress(() => setModalVisible(true))}
                    >
                        &#xe666;
                    </Text>
                </View>
                <View style={styles.workersHeadRight}>
                    <Text 
                        style={{ color: '#0aa394'}} 
                        onPress={() => preventDoublePress.onPress(() => jumpWorker())}>
                        管理
                    </Text>
                </View>
            </View>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row' }}>
                    {
                        workerList.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    activeOpacity={1}
                                    onPress={() => preventDoublePress.onPress(() => workerDetail(item, index))}
                                    >
                                    <View style={styles.workersBody}>
                                        <View style={styles.workerBodyHeader}>
                                            <Text style={styles.workersBodyName}>{item.real_name}</Text>
                                            <Text style={{ marginTop: 4 }}>{item.authority.length}项权限</Text>
                                        </View>
                                        <Text style={styles.workersBodyIcon}>&#xe60d;</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                    <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple('#aaa', false)}
                        onPress={() => preventDoublePress.onPress(() => jumpAddWorker())}>
                        <View style={styles.workersAdd}>
                            <Text style={styles.workersAddTitle}>添加员工</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </ScrollView>
        </View>
    )
}

export default workers;