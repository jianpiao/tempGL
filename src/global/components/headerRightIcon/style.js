import { StyleSheet } from 'react-native';
import {
    fontsize19,
    fontsize23
} from '../../fontSize';
import {
    fontColor9,
    primaryFontColor
} from '../../color';


const styles = StyleSheet.create({
    headerRightIcon: {
        fontFamily: 'iconfont',
        fontSize: fontsize19,
        color: "#000"
    },
    headerRightView: {
        width: 60,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },

    //  另外尺寸大小的图标
    headerRightIcon2: {
        fontFamily: 'iconfont',
        fontSize: fontsize23,
        color: "#000"
    },

    headRightView: {
        marginRight: 20
    },
    headRightIcon: {
        fontFamily: 'iconfont',
        fontSize: 25,
        color: '#000'
    }
})

export default styles;