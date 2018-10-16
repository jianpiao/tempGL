import { StyleSheet, Platform, PixelRatio, Dimensions } from 'react-native';
let screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imageBackground: {
        width: screenWidth,
        height: 240
    },
    //  通知
    header: {
        height: 55,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        // backgroundColor: '#fff'
    },
    headerSearch: {
        flex: 1
    },
    headerNotice: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15
    },
    headerNoticeIcon: {
        fontFamily: 'iconfont',
        color: '#fff',
        fontSize: 20
    },
    headerNoticeView: {
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f49c20',
        marginTop: -15
    },
    headerNoticeText: {
        color: '#fff',
        fontSize: 10
    },
    //  用户信息
    userInfo: {
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: -66,
    },
    image: {
        width: 100, 
        height: 100, 
        borderRadius: 50
    },
    shop_name: {
        marginTop: 10,
        fontSize: 19,
        fontWeight: '700',
        lineHeight: 30,
        color: '#000'
    },
    synopsis: {
        fontSize: 14,
        color: '#999',
        lineHeight: 25
    },
    footer: {
        marginTop: 10,
        backgroundColor: '#fff'
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
    showLeft : {
        flex: 1,
    },
    showRight: {
        flex: 1,
        alignItems: 'flex-end'
    },
    jumpText: {
        fontFamily: 'iconfont',
        fontSize: 16,
        color: '#333',
    },
    iconRight: {
        fontFamily: 'iconfont',
        alignSelf: 'flex-end',
        lineHeight: 22
    },
    notice: {
        color: '#e84141', 
        fontWeight: '600', 
        marginRight: 20
    },

    headRightNotice: {
        width: 14,
        height: 14,
        backgroundColor: '#ff0000',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -7
    },
    headRightNoticeText: {
        fontSize: 10,
        color: '#fff'
    },
})

export default styles;