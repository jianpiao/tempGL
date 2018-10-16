import { StyleSheet, Dimensions } from 'react-native';

var screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    img: {
        height: screenHeight
    },
    timeView: {
        alignSelf: 'flex-end',
        width: 90, 
        height: 40, 
        marginTop: 12,
        marginRight: 12,
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: 'rgba(0,0,0,.2)', 
        borderRadius: 5
    },
    time: {
        color: '#fff'
    }
})

export default styles;