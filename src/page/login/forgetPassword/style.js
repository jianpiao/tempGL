import { StyleSheet, Dimensions } from 'react-native';

var screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 30,
        paddingLeft: 20,
        paddingRight: 20
    },
    img: {
        height: 200
    },
    headerBackTag: {
        color: '#fff',
        fontFamily: 'iconfont',
        fontSize: 18,
        marginLeft: 10,
        marginTop: 5
    }
})

export default styles;