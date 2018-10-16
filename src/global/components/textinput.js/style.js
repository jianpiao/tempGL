import { StyleSheet } from 'react-native';
import {
    fontsize17,
    fontsize19
} from '../../fontSize';
import {
    backgroundColor1,
    backgroundColor3,
    borderColor1,
    borderColor12,
    fontColor1,
    fontColor12,
} from '../../color';


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        backgroundColor: backgroundColor1,
        borderWidth: 1,
        borderColor: borderColor12,
        fontSize: fontsize17,
        margin: 15,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 6,
        paddingBottom: 6,
        // textAlignVertical: 'top'
    }
})

export default styles;