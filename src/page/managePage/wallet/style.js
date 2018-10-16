import { StyleSheet, Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1'
    },
    viewPager: {
        flex: 1,
        height: screenHeight-130,
        backgroundColor: '#fff'
    },
    nabar: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    nabarView: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#000',
    },
    goodsItemView: {
        backgroundColor: '#fff',
        padding: 12,
        flexDirection: 'row',
        borderLeftColor: '#e9e9e9',
        borderLeftWidth: .8
    },
    goodsName: {
        fontSize: 16,
        color: '#000',
        fontWeight: '600',
        paddingLeft: 4,
    },
    goodsPrice: {
        fontSize: 16,
        color: '#ff0000',
        fontWeight: '500'
    },

    //  bottomControl
    bottomControl: {
        width: screenWidth,
        position: 'absolute', 
        bottom: 0, 
        left: 0,
        backgroundColor: '#fff',
        borderTopColor: '#eee',
        borderTopWidth: .6,
    },
    bcViewt: {
        height: 60, 
        justifyContent: 'center', 
        paddingLeft: 12
    },
    bcRadio: {
        width: 20, 
        height: 20, 
        borderRadius: 20, 
        borderColor: '#aaa', 
        borderWidth: .8, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#30bd9e'
    },
    selectAllText: {
        marginLeft: 5, 
        color: '#444'
    },
    bccView: {
        flex: 1, 
        height: 60, 
        justifyContent: 'center', 
        alignItems: 'flex-end'
    },
    bcViewT: {
        height: 40, 
        width: 60, 
        backgroundColor: '#30bd9e', 
        marginRight: 10, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 5
    },
    bcViewLen: {
        height: 40,
        width: 100,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    //  添加商品
    modal: {
        alignSelf: 'flex-end',
        backgroundColor: '#fff',
        width: 160,
        borderRadius: 5,
        marginTop: 57,
        elevation: 7
    },
    modalView: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10
    },
    modalText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginTop: 10,
        marginBottom: 10
    },

    //  侧栏分类
    classify: {
        width: 90,
        height: screenHeight
    },
    classifyItem: {
        backgroundColor: '#fff', 
        padding: 10
    }
})

export default styles;