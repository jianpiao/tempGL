import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1'
    },
    headerRightIcon: {
        fontFamily: 'iconfont',
        marginRight: 20,
        fontSize: 25,
        color: '#000'
    },
    transactionsItem: {
        backgroundColor: '#fff',
        padding: 15
    },
    goodsNameView: {
        flexDirection: 'row'
    },
    goodsName: {
        width: screenWidth - 110
    },
    goodsNameText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    orderType: {
        width: 90,
        alignItems: 'flex-end'
    },
    loadMore: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopColor: '#eee',
        borderTopWidth: 0.8,
        backgroundColor: '#fff'
    },
    header: {
        backgroundColor: '#f5f5f5', 
        flexDirection: 'row', 
        borderBottomColor: '#eee', 
        borderBottomWidth: 1
    },
    headerListView: {
        flexDirection: 'row'
    },
    headerListTitle: {
        color: '#666'
    },
    headerBorderLine: {
        flex: 1, 
        padding: 12, 
        borderLeftColor: '#eee', 
        borderRightColor: '#eee'
    },
    headerListTagView: {
        flex: 1,
        alignItems: 'flex-end'
    },
    headerListTag1: {
        fontFamily: 'iconfont', 
        color: '#ccc', 
        transform: [{ rotateZ: '-180deg' }], 
        position: 'absolute', 
        zIndex: 2
    },
    headerListTag: {
        fontFamily: 'iconfont', 
        color: '#ccc'
    }
})

export default styles;