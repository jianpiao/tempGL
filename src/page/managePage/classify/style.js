import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width/2;

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
    imgList: {
        flexDirection: 'row',
        borderBottomColor: '#f4f4f4',
        borderBottomWidth: 1,
        padding: 5,
    },
    addButton: {
        width: 100,
        height: 50,
        alignSelf: 'center',
        marginTop: 30,
    },
    classifyModal: {
        backgroundColor: '#fff', 
        paddingLeft: 15, 
        paddingRight: 15, 
        paddingTop: 15, 
        paddingBottom: 10, 
        marginTop: 10,
        marginBottom: 10,
    },
    modalHeader:{
        flexDirection: 'row',
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    textTitleView: {
        flex: 1,
        justifyContent: 'center'
    },
    textTitle: {
        fontSize: 16,
    },
    textInputView: {
        flex: 1, 
        alignItems: 'flex-end'
    },
    textInput: {
        fontSize: 16,
        width: screenWidth,
        fontWeight: '500',
        textAlign: 'right'
    },
    deleteItem: {
        width: 70, 
        height: 35, 
        marginTop: 10,
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