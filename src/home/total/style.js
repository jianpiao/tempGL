import { StyleSheet, Platform, Dimensions } from 'react-native';
import {
    fontsize17,
    fontsize19,
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
    primaryFontColor
} from '../../global/color';
const screenWidth = Dimensions.get('window').width;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    //  通知
    header: {
        height: 55,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: primaryFontColor
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
    //  今日统计
    headerTodayIncome: {
        // margin: 20,
        height: 260,
        backgroundColor: primaryFontColor,
        paddingBottom: 40,
        // elevation: 5,
        // borderRadius: 10,
    },
    todayIncomeView: {
        height: 130, 
        alignItems: 'center'
    },
    todayIncome: {
        flexDirection: 'row', 
        marginTop: 30, 
        alignItems: 'center'
    },
    todayIncomeTag: {
        color: '#fff', 
        fontSize: 18, 
        fontWeight: '600'
    },
    todayIncomePrice: {
        fontSize: 50,
        fontWeight: '600',
        color: '#fff'
    },
    todayIncomeFoot: {
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-around'
    },
    todayIncomeNum: {
        alignItems: 'center'
    },
    commodity: {
        marginTop: 15, 
        paddingBottom: 11, 
        marginBottom: 10, 
        backgroundColor: '#fff'
    },
    commodityBar: {
        padding: 12, 
        flexDirection: 'row'
    },

    footerView: {
        marginTop: 10, 
        marginBottom: 10, 
        backgroundColor: '#fff'
    },
    otherIncomeView: {
        flexDirection: 'row', 
        height: 120, 
        borderBottomColor: '#e9e9e9', 
        borderBottomWidth: 1
    },
    otherIncomeItem: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRightColor: '#e9e9e9', 
        borderRightWidth: 1
    },
    otherIncomeItem1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
    },
    otherIncome: {
        flexDirection: 'row', 
        alignItems: 'center'
    },
    incomeText: {
        fontSize: 20, 
        color: '#000'
    },
    viewPager: {
        marginLeft: 15, 
        marginRight: 15, 
        paddingTop: 18, 
        paddingBottom: 12, 
        flexDirection: 'row', 
        borderBottomColor: '#f1f1f1', 
        borderBottomWidth: 1
    },
    middleView: {
        marginTop: -50, 
        marginLeft: 12,
        marginRight: 12,
        padding: 12, 
        borderRadius: 4,
        backgroundColor: '#fff', 
        flexDirection: 'row',
        elevation: 3
    },
    transaction: {
        flex: 1, 
        alignItems: 'center', 
        borderRightColor: '#e9e9e9', 
        borderRightWidth: 1
    },
    allIncome: {
        flex: 1, 
        alignItems: 'center'
    }
})

export default styles;