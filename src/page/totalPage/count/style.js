import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1'
    },
    headerCount: {
        backgroundColor: '#1fcea7'
    },
    headerBackTag: {
        color: '#fff', 
        fontFamily: 'iconfont', 
        fontSize: 16, 
        marginTop: 5
    },
    headerCountText: {
        paddingTop: 30,
        paddingBottom: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerCountPriceTag: {
        textAlign: 'center',
        color: '#82f7dd',
        fontSize: 13,
    },
    headerCountPrice: {
        fontSize: 50, 
        color: '#fff'
    },
    headerCountType: {
        color: '#fff', 
        marginTop: 10
    },
    flexDirection: {
        flexDirection: 'row'
    },
    saleHot: {
        alignItems: 'center', 
        justifyContent: 'center'
    },
    saleSituation: {
        backgroundColor: '#fff',
        padding: 15
    },
    transactionsCheck: {
        flex: 1,
        alignItems: 'flex-end'
    },
    tagStyle: {
        width: 3, 
        height: 14, 
        backgroundColor: '#000',
        marginTop: 3,
    },

    //  新版本
    TypeView: {
        paddingBottom: 25, 
        paddingTop: 25, 
        borderBottomColor: '#eee', 
        borderBottomWidth: 1
    },
    tagRadio: {
        width: 8, 
        height: 8, 
        borderRadius: 4,
        marginTop: 13
    },
    priceType: {
        fontSize: 22, 
        color: '#000', 
        marginLeft: 5 
    },
    listTitle: {
        marginLeft: 18, 
        marginTop: 8
    },

    modal: {
        alignSelf: 'flex-end',
        backgroundColor: '#fff',
        width: 200,
        marginTop: 45,
        borderRadius: 5,
        elevation: 7,
        flexDirection: 'row'
    },
    modalView: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center'
    }
})

export default styles;