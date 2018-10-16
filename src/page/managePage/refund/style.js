import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width / 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1'
    },
    viewPager: {
        flex: 1,
    },
    nabar: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderBottomColor: '#000'
    },
    refundItem: {
        backgroundColor: '#fff',
        padding: 15
    }
})

export default styles;