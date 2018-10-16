import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    CheckBox,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';
import styles from '../style';
import preventDoublePress from '../../../../global/preventDoublePress';



const goodsItem = ({ item, index, section, jumpDetail, checkImg, checkBoxWidth, onCheckBox}) => {
    return (
        <TouchableHighlight
            key={index}
            activeOpacity={0.8}
            onPress={() => preventDoublePress.onPress(() => jumpDetail(item, index, !item.checkBox))}>
            <View style={styles.goodsItemView}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => preventDoublePress.onPress(() => checkImg(index, section, !item.checkBox, item))}
                    style={{ flexDirection: 'row' }}>
                    <CheckBox
                        style={{ width: checkBoxWidth? 40 : 0 }}
                        onValueChange={(value) => onCheckBox(value, item, index, section)}
                        value={item.checkBox} />
                    <Image
                        style={{ width: 54, height: 54, borderRadius: 3 }}
                        resizeMode='cover'
                        source={{ uri: shopImg + 'goods_image/' + item.goods_image }}
                    />
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 10, paddingRight: checkBoxWidth ? 30 : 0 }}>
                    <View style={{ flexDirection: 'row' }}>
                        {item.recommend == 1 ?
                            <View style={{ borderColor: '#30bd9e', borderWidth: 1, width: 35, height: 20, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: '#30bd9e' }}>主推</Text>
                            </View>
                            : null
                        }
                        <Text style={styles.goodsName} numberOfLines={1}>{item.goods_name}</Text>
                    </View>
                    <Text numberOfLines={1}>{item.goods_details}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: '#e45b3a', fontWeight: '600' }}>￥{getFloatStr(item.goods_price / 100)}</Text>
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    )
}


export default goodsItem;