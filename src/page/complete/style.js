import { StyleSheet, Platform, PixelRatio, Dimensions } from 'react-native';
let screenWidth = Dimensions.get('window').width; 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    FlatList: {
        flex: 1
    },
    FlatListItems: {
        paddingLeft: 12,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f1f1',
    },
    FlatListGoodsName: {
        flexDirection: 'row',
        width: screenWidth - 110
    },
    orderType: {
        width: 90, 
        alignItems: 'flex-end'
    },
    GoodsName: {
        fontSize: 16,
        fontWeight: '600',
        fontWeight: '600',
        color: '#000',
    },
    orderInfo: {
        fontSize: 13,
    },
});

export default styles;