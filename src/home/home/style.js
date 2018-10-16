import { StyleSheet, PixelRatio, Dimensions } from 'react-native';
import { setSpText} from '../../global/deviceAdaption';
import {
    primaryFontColor
} from '../../global/color';

const screenWidth = Dimensions.get('window').width;



const styles = StyleSheet.create({
    //  组件 Home ↓
    container: {
        flex: 1
    },
    
    //  组件 DataList ↓
    FlatList: {
        flex: 1,
    },
    FlatListItems: {
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f1f1',
    },
    FlatListGoodsName: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    FlatListGoodsNameItem: {
        width: screenWidth - 110
    },
    GoodsName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    OrderType: {
        width: 90
    },
    OrderTypeText: {
        fontSize: 13,
        textAlign: 'right'
    },
    orderInfo: {
        lineHeight: 20,
        fontSize: 14,
    },
    print: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    printText: {
        fontFamily: 'iconfont',
        paddingRight: 15,
        textAlign: 'right',
    },

    
    //  组件 HeaderFun ↓
    header: {
        height: 55, 
        flexDirection: 'row', 
        paddingLeft: 15, 
        paddingRight: 15, 
        backgroundColor: primaryFontColor
    },
    headerSearch: {
        flex: 1, 
        flexDirection: 'row', 
        height: 40, 
        backgroundColor: '#3ed4b2', 
        marginTop: 7.5, 
        borderRadius: 20, 
        paddingTop: 12
    },  
    headerSearchIcon: {
        fontFamily: 'iconfont', 
        color: '#fff', 
        fontSize: 18, 
        marginLeft: 12, 
        marginRight: 15
    },
    headerSearchText: {
        color: '#fff'
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
    headerFun: {
        flex: -1,
        paddingBottom: 10,
        flexDirection: 'row',
        backgroundColor: primaryFontColor
    },
    headerFunList: {
        flex: 1,
        alignItems: 'center', 
        paddingTop: 15,
    },
    headerFunIcon: {
        fontSize: 35,
        fontFamily: 'iconfont',
        justifyContent: 'space-around',
        color: '#fff',
        // color: '#e86d13'
    },
    headerFunText1: {
        fontSize: 13,
        color: '#fff',
    },


});

export default styles;