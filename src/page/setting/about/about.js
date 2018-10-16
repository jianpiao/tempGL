import React, { Component } from 'react';
import {
    Text,
    View,
    Dimensions,
    Image,
    TouchableNativeFeedback,
} from 'react-native';
import styles from './style'
import { StackNavigator } from 'react-navigation';
import preventDoublePress from '../../../global/preventDoublePress';
var screenHeight = Dimensions.get('window').height;


export default class aboutContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    // goBack = () => {
    //     this.props.navigation.goBack()
    // }

    render() {
        return (
            <View style={styles.container}>
                {/* <ImageBackground style={styles.img} source={require('../../../static/img/31.png')} resizeMode='cover'>
                    
                </ImageBackground> */}
                <View style={{ height: screenHeight }}>
                    {/* <View>
                        <TouchableNativeFeedback
                            background={TouchableNativeFeedback.Ripple('#aaa', true)}>
                            <View style={{ margin: 15 }}>
                                <Text
                                    style={styles.headerBackTag}
                                    onPress={() => preventDoublePress.onPress(() => this.goBack())}>
                                    &#xe645;
                                </Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View> */}
                    <View style={{ marginTop: 50, alignItems: 'center'}}>
                        <Image
                            style={{ width: 80, height: 80 }}
                            source={require('../../../static/img/glsyj.png')}
                        />
                        <Text style={styles.infoText}>广理商业街</Text>
                        <Text style={styles.info}>肇庆市睿客信息科技有限公司</Text>
                        <Text>V {APPVersion}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

