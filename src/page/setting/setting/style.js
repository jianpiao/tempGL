import { StyleSheet, Platform, PixelRatio, Dimensions } from 'react-native';
import {
    fontsize13,
    fontsize16
} from '../../../global/fontSize';
import { primaryFontColor} from '../../../global/color';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1'
    },
    content: {
        backgroundColor: '#fff'
    },
    type: {
        padding: 15,
        color: primaryFontColor,
        fontSize: fontsize13,
    },
    jump: {
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 15,
        paddingRight: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f1f1',
        flexDirection: 'row',
    },
    showLeft: {
        flex: 1,
        justifyContent: 'center'
    },
    text: {
        fontSize: fontsize16,
        color: '#333'
    },
    backAccount: {
        marginTop: 10, 
        marginBottom: 30, 
        height: 50, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#fff'
    },
    aboutList: {
        flexDirection: 'row', 
        paddingTop: 15, 
        paddingBottom: 15, 
        backgroundColor: '#fff'
    },
    aboutSite: {
        flex: 1, 
        alignItems: 'center'
    },
    aboutImg: {
        width: 50, 
        height: 50, 
        borderRadius: 25
    }
})

export default styles;