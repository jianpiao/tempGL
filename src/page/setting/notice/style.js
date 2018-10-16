import { StyleSheet, Dimensions } from 'react-native';
import {
    fontsize16,
    fontsize13,
} from '../../../global/fontSize';
import {
    backgroundColor1,
    borderColor13,
    fontColor1
} from '../../../global/color';


var screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#f1f1f1'
    },
    item: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: backgroundColor1,
        borderBottomColor: borderColor13,
        borderBottomWidth: 0.7,
    },
    noticeHeader: {
        flexDirection: 'row',
    },
    flex: {
        flex: 1,
    },
    accountName: {
        textAlign: 'left',
        fontSize: fontsize16,
        color: fontColor1
    },
    date: {
        fontSize: fontsize13,
        textAlign: 'right'
    }
})

export default styles;