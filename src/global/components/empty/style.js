import { StyleSheet, Dimensions} from 'react-native';
import {
    fontsize20
} from '../../fontSize';
import {
    fontColor9
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
    }
})

export default styles;