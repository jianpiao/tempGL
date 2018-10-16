import { StyleSheet, Dimensions } from 'react-native';

var screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1'
    },
    title: {
        color: '#7c8886'
    },
    authority: {
        color: '#009385',
        borderColor: '#009385',
        borderWidth: 1,
        marginRight: 10,
        marginTop: 10,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 15
    }
})

export default styles;