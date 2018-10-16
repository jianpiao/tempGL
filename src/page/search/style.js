import { StyleSheet, Dimensions } from 'react-native';

let screenWidth = Dimensions.get('window').width; 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1'
    },
    headerRightIcon: {
        fontFamily: 'iconfont',
        marginRight: 20,
        fontSize: 19,
        color: "#000"
    },
    textRight: {

    },
    viewPager: {
        flex: 1,
    },
    pageStyle: {

    },
    searchView: {
        flexDirection: 'row', 
        height: 50, 
        backgroundColor: '#e1e1e1', 
        margin: 12, 
        borderRadius: 5
    },
    goBack: {
        width: 50, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    goBackText: {
        fontFamily: 'iconfont', 
        fontSize: 18, 
        color: '#333'
    },
    searchIconText: {
        fontFamily: 'iconfont', 
        fontSize: 21, 
        color: '#333'
    },

    //  searchHeader
    headerBar: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderBottomColor: '#000'
    },
    searchHeader: {
        flexDirection: 'row', 
        height: 40, 
        backgroundColor: '#fff', 
        elevation: 3
    },

    //  searchHistory
    historyList: {
        padding: 12, 
        borderTopColor: '#e9e9e9', 
        borderTopWidth: 1, 
        flexDirection: 'row'
    },
    historyEmpty: {
        padding: 12, 
        borderTopColor: '#e9e9e9', 
        borderTopWidth: 1        
    },
    historyEmptyText: {
        color: '#000'
    },

    // listview
    FlatListItems: {
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: '#fff'
    },
    FlatListGoodsName: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    FlatListGoodsNameItem: {
        flexDirection: 'row',
        width: screenWidth - 110
    },
    GoodsName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    OrderType: {
        width: 90,
        alignItems: 'flex-end'
    },
    OrderTypeText: {
        fontSize: 13,
        textAlign: 'right'
    },
    orderInfo: {
        lineHeight: 20,
        fontSize: 14,
    },
    loadMore: {
        height: 50, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#fff',
        borderTopColor: '#e8e8e8',
        borderTopWidth: .8,
    }
})

export default styles;