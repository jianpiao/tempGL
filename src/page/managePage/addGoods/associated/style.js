import { StyleSheet, Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    headerRightIcon: {
        fontFamily: 'iconfont',
        marginRight: 20,
        fontSize: 19,
        color: "#000"
    },
    chooseState: {
        fontFamily: 'iconfont',
        fontSize: 18, 
        color: '#30bd9e'
    },
    item: {
        flexDirection: 'row', 
        padding: 15,
    },
    goodsName: {
        color: '#000'
    },
    goodsPrice: {
        color: '#e45b3a'
    },
    tag: {
        flex: 1, 
        justifyContent: 'center', 
        height: 22, 
        alignItems: 'flex-end'
    },

    //  bottomControl
    bottomControl: {
        width: screenWidth,
        height: 50,
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: '#fff',
        borderTopColor: '#ccc',
        borderTopWidth: .7,
        justifyContent: 'center',
        paddingLeft: 15,
    }
})

export default styles;