import { StyleSheet, Dimensions } from 'react-native';
import {
    fontsize16,
    fontsize17,
    fontsize45,
    fontsize19,
} from '../../../global/fontSize';
import {
    backgroundColor1,
    borderColor12,
    fontColor12,
    fontColor1,
} from '../../../global/color';


var screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: backgroundColor1
    },
    title: {
        color: fontColor1,
        fontSize: fontsize17, 
    },
    headerRightIcon: {
        fontFamily: 'iconfont',
        marginRight: 20,
        fontSize: fontsize19,
        color: fontColor1
    },
    remove: {
        position: 'absolute',
        right: 15,
        top: 15, 
        width: 20, 
        height: 20, 
        backgroundColor: 'rgba(0,0,0,.4)', 
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 10
    },
    removeText: {
        color: '#fff' 
    },
    addImg: {
        marginTop: 10,
        marginRight: 10,
        width: 90,
        height: 90,
        borderColor: borderColor12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addImgIcon: {
        fontFamily: 'iconfont',
        fontSize: fontsize45,
        color: fontColor12
    },
    text: {
        borderWidth: 1,
        borderColor: borderColor12,
        fontSize: 16,
        height: 40,
        marginTop: 10,
        padding: 10,
    }, 
    textareaView: {
        marginTop: 10,
        height: 100,
        borderWidth: 1,
        borderColor: borderColor12,
    },
    textarea: {
        borderWidth: 0,
        fontSize: fontsize16,
        height: 100,
        textAlign: 'left',
        textAlignVertical: 'top',
        justifyContent: 'flex-start',
        padding: 10,
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
    },
    ModalPic: {
        width: screenWidth,
        height: 498 * screenWidth / 750
    }
})

export default styles;