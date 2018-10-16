import { StyleSheet, Platform, PixelRatio, Dimensions } from 'react-native';

const styles = StyleSheet.create({
    contarner: {
        flex: 1
    },
    headerRightIcon: {
        fontFamily: 'iconfont',
        marginRight: 20,
        fontSize: 25,
        color: '#000'
    },
    listItem: {
        backgroundColor: '#fff',
        borderBottomColor: '#e9e9e9',
        borderBottomWidth: 1,
        padding: 15,
    },
    address: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333'
    },
    name: {
        color: '#777'
    },
    time: {
        color: '#777'
    }
});

export default styles;