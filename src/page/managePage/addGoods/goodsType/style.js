import { StyleSheet } from 'react-native';

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
    goodsTypeList: {
        backgroundColor: '#fff',
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1,
        padding: 15,
        elevation: 2,
        marginTop: 10
    },
    deleteItem: {
        width: 60,
        height: 40,
        marginTop: 10,
        alignSelf: 'center'
    },
    addButton: {
        width: 100,
        height: 50,
        alignSelf: 'center'
    },
    modal: {
        flex: 1,
        marginTop: -22,
        borderRadius: 5,
        justifyContent: 'center',
        padding: 40,
    },
    modalInput: {
        backgroundColor: '#fff'
    }
})

export default styles;