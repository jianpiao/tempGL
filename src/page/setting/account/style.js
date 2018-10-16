import { StyleSheet } from 'react-native';
import {
    fontSize13,
    fontsize16,
} from '../../../global/fontSize';
import {
    backgroundColor1,
    backgroundColor3,
    borderColor1,
    borderColor14,
    primaryFontColor,
    fontColor3,
    fontColor6,
    fontColor12,
} from '../../../global/color';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: backgroundColor1
    },
    title: {
        marginTop: 25,
        paddingLeft: 12,
        marginBottom: 10,
    },
    titleText: {
        fontSize: fontSize13,
        color: primaryFontColor
    },
    info: {
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 15,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: backgroundColor1,
        borderBottomWidth: 0.7,
        borderBottomColor: borderColor14,
    },
    infoLeft: {
        width: 100,
        justifyContent: 'center'
    },
    infoLeftText: {
        fontSize: fontsize16,
        color: fontColor3
    }, 
    infoRight: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    infoRightText: {
        fontSize: fontsize16,
        color: fontColor6
    },
})

export default styles;