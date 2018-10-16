import React, { Component } from 'react';
import {
    Text,
    View,
    Modal
} from 'react-native';
import styles from './style'
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { setModalVisible } from '../../../redux/actions';


//  加载框组件
class loading extends Component {

    render() {
        var modalBackgroundStyle = {
            backgroundColor: this.props.counter.modalVisible ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0)',
        };
        var transparentStyle = this.props.counter.modalVisible ? { backgroundColor: '#fff' } : null
        return (
            <Modal
                animationType={"none"}
                transparent={this.props.counter.modalVisible}
                visible={this.props.counter.modalVisible}
                onRequestClose={() => { this.props.dispatch(setModalVisible(false)) }}>
                <View style={{ flex: 1 }}>
                    <View style={[styles.modal, modalBackgroundStyle]}>
                        <View style={transparentStyle}>
                            <View style={{ height: 150, backgroundColor: '#fff', padding: 20 }}>
                                <Text style={{ fontSize: 18, fontWeight: '600', textAlign: 'center', color: '#000', marginBottom: 10 }}>值班员工</Text>
                                <Text style={{ textAlign: 'center' }}>值班员工是今日在职的员工</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal> 
        )
    }
}


const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(loading);
