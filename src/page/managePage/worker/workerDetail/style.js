import { StyleSheet, Dimensions } from 'react-native';


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
    detailView: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 12,
    },
    detailView1: {
        backgroundColor: '#fff',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
    },
    title: {
        color: '#7c8886'
    },
    detailRight: {
        flex: 1, 
        alignItems: 'flex-end'
    },
    detail: {
        textAlign: 'right', 
        color: '#000'
    },
    authority: {
        color: '#000'
    }
})

export default styles;