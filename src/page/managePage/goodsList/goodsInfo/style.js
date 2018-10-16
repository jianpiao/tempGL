import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    inputText: {
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 8,
        paddingBottom: 8,
        borderBottomColor: '#e9e9e9',
        borderBottomWidth: 1,
        flexDirection: 'row'
    },
    textLeftView: {
        width: 100,
        justifyContent: 'center',
    },
    textLeft: {
        fontSize: 16,
        color: '#000'
    },
    textRight: {
        flex: 1,
        fontSize: 16,
        paddingLeft: 10,
        color: '#666'
    },
    textRightView: {
        flex: 1,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10
    },
    textRightView1: {
        flex: 1,
        padding: 15,
        alignItems: 'flex-end'
    },
    textRight1: {
        fontSize: 16,
        color: '#666',
        paddingLeft: 10,
    }
})

export default styles;