import { StyleSheet, Platform, PixelRatio, Dimensions } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listItem: {
        backgroundColor: '#fff',
        borderBottomColor: '#e9e9e9',
        borderBottomWidth: 1,
        padding: 15,
    },
    address: {
        fontSize: 20,
        color: '#333'
    },
    time: {
        color: '#777'
    }
});

export default styles;