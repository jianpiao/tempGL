import { StyleSheet, Dimensions } from 'react-native';

var screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1'
    },
    img: {
        height: screenHeight
    },
    headerBackTag: {
        color: '#fff',
        fontFamily: 'iconfont',
        fontSize: 18,
        marginLeft: 10,
        marginTop: 5
    },
    info: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#666'
    },
    infoText: {
        textAlign: 'center',
        lineHeight: 50,
        fontSize: 25,
        color: '#666'
    },
})

export default styles;