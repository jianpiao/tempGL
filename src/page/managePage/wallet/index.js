import React, { Component } from 'react';
import {
    Text,
    View,
    Alert,
    FlatList,
    SectionList,
    ToastAndroid,
    TouchableOpacity,
    TouchableNativeFeedback,
    ViewPagerAndroid,
} from 'react-native';
import styles from './style'
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import {  
    isRefreshing, 
    shopGoodsCategoryList, 
    downGoods,
    upGoods,
    getGoodsList
} from '../../../redux/actions';
import preventDoublePress from '../../../global/preventDoublePress';
import Empty from '../../../global/components/empty/index';
import headerRightIcon from '../../../global/components/headerRightIcon/style';
import GoodsItem from './components/goodsitem';
import { Classify, Updown,ModalAdd,SelectAll} from './components/classify';


class walletContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listState: false,
            initialPage: 0,
            temp: 0,
            modalVisible: false,
            checkBox: false,
            selectAllState: false,
            selectValue: 0
        }
    }

    /* 生命周期  节点动态渲染 */
    componentDidMount() {
        this.props.navigation.setParams({ add: this.add })
        this.props.navigation.setParams({ checkbox: this.checkbox })
        this.props.counter.upGoods.forEach(e => {
            e.data.forEach(m => {
                m.checkBox = false
            })
        })
        this.props.counter.downGoods.forEach(e => {
            e.data.forEach(m => {
                m.checkBox = false
            })
        })
    }
    //  离开页面时候执行
    componentWillUnmount() {
        preventDoublePress.reponTime = 1000
    }
    //  提交按钮
    static navigationOptions = ({ navigation }) => ({
        headerRight: (
            <View style={{flexDirection: 'row'}}>
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple('#aaa', true)}
                    onPress={() => navigation.state.params.checkbox()}>
                    <View style={headerRightIcon.headerRightView}>
                        <Text style={{ fontFamily: 'iconfont', fontSize: 19,color: '#333'}}>
                          &#xe62e;
                        </Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple('#aaa', true)}
                    onPress={() => navigation.state.params.add()}>
                    <View style={headerRightIcon.headerRightView}>
                        <Text style={headerRightIcon.headerRightIcon}>
                            &#xe66a;
                        </Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        )
    });
    //  获取商品列表
    getData = () => {
        fetch(getURL + 'GetGoodsList', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                const tempGoodsList = res.data.sort(sortDown)
                this.props.counter.getGoodsList = res.data
                this.props.dispatch(getGoodsList(tempGoodsList))
                //  商品请求成功之后执行
                //  店铺分类
                fetch(getURL + 'ShopGoodsCategoryList',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                    })
                    .then((res) => res.json())
                    .then((res) => {
                        if (res.error == 0) {
                            let [upList, downList] = [
                                JSON.parse(JSON.stringify(res.data)),
                                JSON.parse(JSON.stringify(res.data))
                            ]
                            res.data.forEach((e, i) => {
                                //  通过比较分类id和每个商品上面的分类id相同就添加到分类的数组中
                                e.data = tempGoodsList.filter(m => m.shop_goods_category_id == e.shop_goods_category_id)
                                upList[i].data = tempGoodsList.filter(m => m.shop_goods_category_id == e.shop_goods_category_id && m.goods_state == 2)  //  上架
                                downList[i].data = tempGoodsList.filter(m => m.shop_goods_category_id == e.shop_goods_category_id && m.goods_state == 1)  //  下架
                            });
                            this.props.dispatch(upGoods(upList))
                            this.props.dispatch(downGoods(downList))
                            this.props.dispatch(shopGoodsCategoryList(res.data))
                        } else {
                            ToastAndroid.show(res.data, ToastAndroid.SHORT);
                        }
                        this.props.dispatch(isRefreshing(false))
                    })
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        }).catch((error) => {
            this.props.dispatch(isRefreshing(false))
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        })
    }
    //  商品上下架设置
    setGoodsState(goods_list,state) {
        //  获取商品列表
        fetch(getURL + 'BatchSetGoodsState', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                goods_list: JSON.stringify(goods_list),
                state
            })
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error == 0) {
                let gtemp = this.updonwList()
                gtemp.forEach(e => {
                    e.data.forEach(m => {
                        m.checkBox = false
                    })
                })
                let [cate, upList, downList,goods] = [
                    JSON.parse(JSON.stringify(this.props.counter.shopGoodsCategoryList)),
                    JSON.parse(JSON.stringify(this.props.counter.shopGoodsCategoryList)),
                    JSON.parse(JSON.stringify(this.props.counter.shopGoodsCategoryList)),
                    this.props.counter.getGoodsList,
                ]
                //  把对应商品状态设置好
                goods.forEach((m, u) => {
                    goods_list.forEach(e => {
                        if (m.goods_id == e) {
                            goods[u].goods_state = state
                        }
                    });
                })
                //  重新排序
                cate.forEach((e, i) => {
                    cate[i].data = goods.filter(m => m.shop_goods_category_id == e.shop_goods_category_id)
                    upList[i].data = goods.filter(m => m.shop_goods_category_id == e.shop_goods_category_id && m.goods_state == 2)
                    downList[i].data = goods.filter(m => m.shop_goods_category_id == e.shop_goods_category_id && m.goods_state == 1)
                });
                //  改变渲染
                this.setState({ listState: false })
                this.props.dispatch(upGoods(JSON.parse(JSON.stringify(upList))))
                this.props.dispatch(downGoods(JSON.parse(JSON.stringify(downList))))
                this.props.dispatch(shopGoodsCategoryList(JSON.parse(JSON.stringify(cate))))
                this.props.dispatch(getGoodsList(goods))
                ToastAndroid.show(state == 1 ? '下架成功' : '上架成功', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
            this.props.dispatch(isRefreshing(false))
        }).catch((error) => {
            this.props.dispatch(isRefreshing(false))
            ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        })
    }
    //  侧栏分类
    updonwList = () => {
        return this.state.initialPage == 0 ? this.props.counter.upGoods : this.props.counter.downGoods
    }
    //  改变数据渲染状态
    updownDip = () => {
        let [up, down] = [this.props.counter.upGoods, this.props.counter.downGoods]
        this.state.initialPage == 0 ?
            this.props.dispatch(upGoods(JSON.parse(JSON.stringify(up)))) :
            this.props.dispatch(downGoods(JSON.parse(JSON.stringify(down))))
    }
    //  开启多选按钮
    checkbox = () => {
        if (this.state.listState) {
            //  取消批量则把全部选中项设回默认false
            this.setState({ listState: false,selectAllState: false })
            let tt = this.updonwList()
            tt.forEach(e => {
                e.data.forEach(m => {
                    m.checkBox = false
                })
            })
            this.updownDip()
        } else {
            this.setState({ listState: true })
        }
    }
    //  添加商品
    add = () => {
        if (this.state.listState) {
            //  取消批量则把全部选中项设回默认false
            let tt = this.updonwList()
            tt.forEach(e => {
                e.data.forEach(m => {
                    m.checkBox = false
                })
            })
            preventDoublePress.reponTime = 1000
            this.updownDip()
            this.setState({ listState: false })
        } else {
            this.setModalVisible(true)
        }
    }
    //  查看单个商品详情
    jumpDetail = (item, index,value) => {
        if (this.state.listState) {
            preventDoublePress.reponTime = 100
            this.onCheckBox(value, item)
        } else {
            preventDoublePress.reponTime = 1000
            this.props.navigation.navigate('GoodsItem', {
                item: item,
                index: index
            });
        }
        
    }
    //  下拉刷新
    onRefresh = () => {
        this.props.dispatch(isRefreshing(true))
        this.getData()
    }
    //  显示弹出框
    setModalVisible = (v) => {
        this.setState({ modalVisible: v })
    }
    //  选择添加类型
    modalSelect = (i) => {
        this.setState({ modalVisible: false })
        i == 0 ? this.props.navigation.navigate('AddGoods') : this.props.navigation.navigate('Classify')
    }
    //  查看图片
    checkImg = (index, section, value, item) => {
        if (this.state.listState) {
            preventDoublePress.reponTime = 100
            this.onCheckBox(value, item)
        } else {
            preventDoublePress.reponTime = 1000
            let photos = []
            section.data.forEach(e => {
                let p = e.goods_image.substring(0, e.goods_image.length - 6)
                photos.push({ photo: shopImg + 'goods_image/' + p })
            });
            this.props.navigation.navigate('Photo', {
                media: photos,
                index: index
            })
        }
        
    }
    //  行与行之间的分隔线组件
    itemSeparatorComponent = () => {
        return <View style={{ height: .8, backgroundColor: '#e8e8e8' }} />
    }
    //  列表为空时渲染该组件
    emptyComponent = () => {
        return <Empty content="暂无商品" />
    }
    //  选择分类
    selectClass = (item,index) => {
        let gtemp = this.updonwList()
        //  初始化为0
        this.state.temp = 0
        for (let i = 1; i <= index; i++) {
            this.state.temp += gtemp[i - 1].data.length
            this.state.temp += 1
        }
        if (this.state.initialPage == 0) {
            this.refs.sectionList0.scrollToLocation({ animated: true, itemIndex: this.state.temp == 0 ? -1 : this.state.temp })
        } else {
            this.refs.sectionList1.scrollToLocation({ animated: true, itemIndex: this.state.temp == 0 ? -1 : this.state.temp })
        }
    }
    //  页面左右滑动
    onPageSelected = (i) => {
        let tt = this.updonwList()
        tt.forEach(e => {
            e.data.forEach(m => {
                m.checkBox = false
            })
        })
        this.updownDip()
        this.setState({ initialPage: i, selectAllState: false, selectValue: 0})
        this.refs.viewPage.setPage(i)
    }
    //  复选框
    onCheckBox = (value, item,index, section) => {
        let gtemp = this.updonwList()
        //  设置对应的对象选中状态
        for (let i in gtemp) {
            gtemp[i].data.forEach((e,n) => {
                if (item.goods_id == e.goods_id) {
                    gtemp[i].data[n].checkBox = value
                }
            });
        }
        let [dlength, ddlen] = [0,0]
        gtemp.forEach(m => {
            dlength+=m.data.filter(m => m.checkBox).length
        })
        gtemp.forEach(m => {
            ddlen+=m.data.length
        })
        if (dlength == ddlen) {
            //  选中项和原数组相同则变为全选
            this.setState({ selectAllState: true })
        } else if (dlength != ddlen) {
            //  选中项和原数组不同则变为不全选
            this.setState({ selectAllState: false })
        }
        //  添加选中项
        this.setState({ selectValue: dlength})
        this.updownDip()
    }
    //  全选
    selectAll = () => {
        preventDoublePress.reponTime = 100
        let gtemp = this.updonwList()
        if (this.state.selectAllState) {
            gtemp.forEach(e => {
                e.data.forEach(m => {
                    m.checkBox = false
                })
            })
        } else {
            gtemp.forEach(e => {
                e.data.forEach(m => {
                    m.checkBox = true
                })
            })
        }
        this.updownDip()
        this.setState({ 
            selectAllState: !this.state.selectAllState, 
            selectValue: gtemp.forEach(e => e.data.filter(m => m.checkBox).length)
        })
    }
    //  设置商品上下架
    setGoodsUpDown = (i) => {
        let gtemp = this.updonwList()
        let len = 0
        gtemp.forEach(m =>{
            len+=m.data.filter(m => m.checkBox).length
        })
        if (len > 0) {
            //  弹框提示
            this.warning(gtemp, i == 1 ? '是否下架选中的' : '是否上架选中的',len,i)
        } else {
            ToastAndroid.show('您还没有选中商品哦!', ToastAndroid.SHORT);
        }
    }
    //  弹出框提示组件
    warning = (gtemp, title, len, tag) => {
        let dd = []
        Alert.alert(
            '提示',
            title + len + ' 个商品',
            [
                { text: '取消', onPress: () => null, style: 'cancel' },
                {
                    text: '确认', onPress: () => {
                        this.props.dispatch(isRefreshing(true))
                        gtemp.forEach(e => {
                            e.data.forEach(m => {
                                if (m.checkBox) {
                                    dd.push(m.goods_id)
                                }
                            })
                        })
                        this.setGoodsState(dd, tag)
                    }
                },
            ],
            { cancelable: false }
        )
    }
    //  页面
    render() {
        let list = [
            { data: this.props.counter.upGoods,  ref:'sectionList0' },
            { data: this.props.counter.downGoods, ref: 'sectionList1'}
        ]
        return (
            <View style={styles.container}>
                <View style={{ height: 50, flexDirection: 'row', backgroundColor: '#fff',borderBottomWidth: .8,borderBottomColor:'#e9e9e9' }}>
                    {/* 上下架 */}
                    {
                        ['上架','下架'].map((item,index) =>
                            <Updown
                                key={index}
                                item={item}
                                index={index}
                                onPageSelected={this.onPageSelected}
                                initialPage={this.state.initialPage}
                            />
                        )
                    }
                </View>
                <View style={{flexDirection: 'row',marginBottom: 50,}}>
                    {/* 左侧分类列表 */}
                    <View style={styles.classify}>
                        <FlatList
                            data={this.updonwList()}
                            ListEmptyComponent={() => this.emptyComponent()}
                            renderItem={({ item, index }) =>
                                <Classify
                                item={item}
                                index={index}
                                selectClass={this.selectClass}
                                />
                            }
                        />
                    </View>
                    {/* 商品列表 */}
                    <ViewPagerAndroid
                        style={styles.viewPager}
                        initialPage={this.state.initialPage}
                        onPageSelected={(e) => this.onPageSelected(e.nativeEvent.position)}
                        ref="viewPage">
                        {
                            list.map((mm,ii) => 
                                <View key={ii} style={{ marginBottom: this.state.listState ? 60 : 0}}>
                                    <SectionList
                                        ref={mm.ref}
                                        sections={mm.data}
                                        refreshing={this.props.counter.refreshing}
                                        onRefresh={() => this.onRefresh()}
                                        keyExtractor={(item, index) => item + index}
                                        ItemSeparatorComponent={() => this.itemSeparatorComponent()}
                                        ListEmptyComponent={() => this.emptyComponent()}
                                        renderSectionHeader={({ section: { shop_goods_category_name,data } }) => (
                                            <Text style={{ fontWeight: "bold", color: '#000', padding: 10 }}>{data.length > 0 ? shop_goods_category_name +' (' +data.length+'份)':''}</Text>
                                        )}
                                        renderItem={({ item, index, section }) => {
                                            return (
                                                <GoodsItem
                                                    item={item}
                                                    index={index}
                                                    section={section}
                                                    jumpDetail={this.jumpDetail}
                                                    checkImg={this.checkImg}
                                                    onCheckBox={this.onCheckBox}
                                                    checkBoxWidth={this.state.listState}
                                                />
                                            )
                                        }}
                                    />
                                </View>
                            )
                        }
                    </ViewPagerAndroid>
                </View>
                {/* 全选 */}
                <SelectAll 
                    listState={this.state.listState}
                    selectAll={this.selectAll}
                    selectAllState={this.state.selectAllState}
                    initialPage={this.state.initialPage}
                    selectValue={this.state.selectValue}
                    setGoodsUpDown={this.setGoodsUpDown} />
                {/* 添加商品 */}
                <ModalAdd
                    modalVisible={this.state.modalVisible}
                    setModalVisible={this.setModalVisible}
                    modalSelect={this.modalSelect}
                />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(walletContainer);