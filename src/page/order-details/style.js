import { StyleSheet, Dimensions} from 'react-native';

/**
 * 单个页面的样式  包含了本页面其他组件的样式
 */
const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 20,
        backgroundColor: '#fff'
    },
    header: {
        paddingTop: 20,
        alignItems: 'center',
    },
    order_price: {
        fontSize: 40,
        color: '#000'
    },
    info: {
        flexDirection: 'row',
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 12,
        paddingRight: 12,
    },
    infoLeft: {
        width: 100,
    },
    infoRight: {
        flex: 1,
        alignItems: 'flex-end'
    },
    saleOutShow: {
        flex: 1,
        flexDirection: 'row',
        bottom: 0,
        height: 60,
        marginTop: 20,
        paddingTop: 7,
        paddingLeft: 12,
        paddingRight: 12
    },
    TouchableOpacity: {
        flex: 1,
        height: 45,
        marginLeft: 18,
        marginRight: 18,
        justifyContent: 'center',
        borderRadius: 3,
        backgroundColor: '#0aa394',
        elevation: 4
    },
    TouchableOpacity1: {
        flex: 1,
        height: 45,
        marginLeft: 18,
        marginRight: 18,
        justifyContent: 'center',
        borderRadius: 3,
        backgroundColor: '#f3571f',
        elevation: 4
    },  
    buttonText: {
        alignSelf: 'center',
        color: '#fff',
        fontSize: 16
    }
});

export default styles;