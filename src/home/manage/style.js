import { StyleSheet, Platform, Dimensions } from 'react-native';
import {
    fontsize17,
    fontsize19,
    fontsize23,
    fontsize40
} from '../../global/fontSize';
import {
    backgroundColor1,
    backgroundColor2,
    backgroundColor3,
    fontColor1,
    fontColor2,
    fontColor3,
    fontColor9,
    primaryColor
} from '../../global/color';

var screenWidth = Dimensions.get('window').width;
var iconViewWidht = screenWidth/3;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    //  搜索
    header: {
        height: 55,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#fff'
    },
    headerSearch: {
        flex: 1,
        flexDirection: 'row',
        height: 40,
        backgroundColor: '#f1f1f1',
        marginTop: 7.5,
        borderRadius: 20,
        paddingTop: 12
    },
    headerSearchIcon: {
        fontFamily: 'iconfont',
        color: '#666',
        fontSize: 18,
        marginLeft: 12,
        marginRight: 15
    },
    headerSearchText: {
        color: '#666'
    },
    headerNotice: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15
    },
    headerNoticeIcon: {
        fontFamily: 'iconfont',
        color: '#000',
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
        color: '#FFF',
        fontSize: 10
    },
    //  推广内容
    iconList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 20,
        backgroundColor: backgroundColor1,
    },
    iconItem: {
        width: iconViewWidht,
        alignItems: 'center',
        paddingBottom: 20,
    },
    icon: {
        fontFamily: 'iconfont',
        fontSize: fontsize40,
    },
    promotion: {
        height: 200, 
        margin: 12, 
        padding: 15, 
        backgroundColor: '#0aa394', 
        elevation: 4,
        borderRadius: 5
    },
    promotionTitle: {
        color: '#fff'
    },
    promotionContent: {
        alignItems: 'center', 
        marginTop: 25
    },
    promotionContentTitle: {
        color: '#fff', 
        fontSize: 25, 
        fontWeight: '600'
    },
    promotionContentIntro: {
        color: '#fff', 
        marginTop: 15
    },
    promotionBottom: {
        width: screenWidth,
        position: 'absolute',
        // bottom: 20,
        top: 220,
        alignItems: 'center'
    },
    promotionBottomTag: {
        height: 5, 
        borderRadius: 2, 
        marginLeft: 3, 
        marginRight: 3
    },
    modal: {
        flex: 1,
        marginTop: -22,
        borderRadius: 5,
        justifyContent: 'center',
        padding: 40,
    },

    //  refund
    refundBody : {
        backgroundColor: '#fff', 
        padding: 12
    },
    refundContent: {
        flexDirection: 'row', 
        marginTop: 10, 
        borderRadius: 5, 
        backgroundColor: '#f3f3f3'
    },
    refundTouch: {
        flex: 1, 
        padding: 12, 
        justifyContent: 'center',
        alignItems: 'center'
    },
    refundLength: {
        fontSize: 20, 
        fontWeight: '600', 
        color: '#333', 
        marginBottom: 5
    },
    refundWait: {
        fontSize: 16, 
        fontWeight: '600', 
        color: '#333', 
        marginBottom: 5
    },

    //  workers
    workers: {
        backgroundColor: '#fff', 
        marginBottom: 10, 
        paddingTop: 15, 
        paddingBottom: 15, 
        paddingLeft: 10, 
        paddingRight: 10,
        marginTop: 10,
    },
    workersHeader: {
        flexDirection: 'row', 
        marginBottom: 10
    },
    workersHeaderTitle: {
        flex: 1, 
        flexDirection: 'row'
    },
    workersHeadTag: {
        marginLeft: 3, 
        fontSize: 16, 
        marginTop: 2, 
        fontFamily: 'iconfont'
    },
    workersHeadRight: {
        flex: 1, 
        alignItems: 'flex-end'
    },
    workersBody: {
        flexDirection: 'row', 
        backgroundColor: '#f3f3f3', 
        alignItems: 'center', 
        padding: 15, 
        marginTop: 5, 
        marginBottom: 5, 
        marginRight: 10, 
        borderRadius: 5
    },
    workerBodyHeader: {
        flex: 1, 
        marginTop: 4, 
        marginRight: 20
    },
    workersBodyName: {
        fontSize: 18, 
        fontWeight: '600', 
        color: '#333'
    },
    workersBodyIcon: {
        fontFamily: 'iconfont', 
        fontSize: 35
    },
    workersAdd: {
        width: 135, 
        height: 81, 
        flexDirection: 'row', 
        margin: 5, 
        backgroundColor: '#f3f3f3', 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 5
    },
    workersAddTitle: {
        fontSize: 18, 
        fontWeight: '600', 
        color: '#666'
    }
})

export default styles;