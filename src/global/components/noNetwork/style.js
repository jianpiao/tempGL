import { StyleSheet, Dimensions } from 'react-native';
import {
    fontsize16,
    fontsize20
} from '../../fontSize';
import {
    fontColor9,
    primaryFontColor
} from '../../color';

let screenHeight = Dimensions.get('window').height - 240;

const styles = StyleSheet.create({
    //  订单为空
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: screenHeight
    },
    emptyText: {
        fontSize: fontsize20,
        color: fontColor9
    },
    emptyTextColor: {
        fontSize: fontsize16,
        color: primaryFontColor
    }
})

export default styles;