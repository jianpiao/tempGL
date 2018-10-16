import { StyleSheet } from 'react-native';

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
    imgList: {
        flexDirection: 'row', 
        borderBottomColor: '#f4f4f4', 
        borderBottomWidth: 1, 
        padding: 5,
    },
    addButton: {
        width: 100, 
        height: 50, 
        alignSelf: 'center'
    }
})

export default styles;