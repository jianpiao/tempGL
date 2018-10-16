import { StyleSheet } from 'react-native';
import {
    fontsize13,
    fontsize16
} from '../../../global/fontSize';
import {
    backgroundColor1,
    fontColor3,
    fontColor6,
    primaryFontColor,
    borderColor2,
    borderColor14
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
        fontSize: fontsize13,
        color: primaryFontColor
    },
    shopImgListLeft: {
        flex: 1
    },
    shopImgListRight: {
        width: 40, 
        height: 40, 
        marginLeft: 20
    },
    info: {
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 15,
        marginLeft: 15,
        marginRight: 15,
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
    modal: {
        flex: 1,
        borderRadius: 5,
        justifyContent: 'center',
        padding: 40,
    },
    modalItem: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalItemBottom: {
        borderTopWidth: 1,
        borderTopColor: borderColor2,
        marginTop: 10
    },
    modalItemText: {
        fontSize: fontsize16,
    }
})

export default styles;