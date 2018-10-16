import React, { Component } from 'react';
import {
    Text,
    View,
    AsyncStorage,
    ToastAndroid,
    TouchableNativeFeedback,
    ViewPagerAndroid,
    TextInput
} from 'react-native';
import styles from './style';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { getClassify, isRefreshing } from '../../redux/actions';
import preventDoublePress from '../../global/preventDoublePress';
import ListView from './components/listView';
import SearchHistory from './components/searchHistory';
import SearchHeader from './components/searchHeader';
import Empty from '../../global/components/empty';
import { empty } from '../../global/global';

//  搜索
class searchContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            searchState: false,
            searchLoading: false,
            searchHistory: [],
            orderList: [],
            phoneList: [],
            timeList: [],
            userList: [],
            orderListState: false,
            phoneListState: false,
            timeListState: false,
            userListState: false,
            pageSelected: 0,
            page1: 1
        }
    }

    componentDidMount() {
        this.readData()
    };
    
    //  头部导航
    static navigationOptions = () => ({
        header: null
    });
    //  页面返回
    goBack = () => {
        this.props.navigation.goBack()
    }
    //  确认提交
    search = () => {
        //  先清空数组 初始化
        this.state.orderList = []
        this.state.timeList = []
        this.state.phoneList = []
        this.state.user = []
        this.state.orderListState= false
        this.state.phoneListState= false
        this.state.timeListState= false
        this.state.userListState= false
        //  判断搜索加载框为false的时候 并且 搜索框内容不为空 则执行
        if (!this.state.searchLoading && this.state.searchValue.length > 0) {
            //  先把搜索状态设置为true
            this.props.dispatch(isRefreshing(true))
            //  查看历史记录中有没有存在 和搜索的值一样的内容 存在就删除
            for (let i in this.state.searchHistory) {
                if (this.state.searchHistory[i].data == this.state.searchValue){
                    this.state.searchHistory.splice(i, 1)
                }
            }
            //  把搜索值添加到历史记录列表中
            this.state.searchHistory.unshift({ data: this.state.searchValue })
            this.saveData()
            //  判断点击搜索按钮的时候导航栏是哪一个，并且将它的搜索状态设为true
            if (this.state.pageSelected == 0) {
                this.setState({orderListState: true})
            } else if (this.state.pageSelected == 1) {
                this.setState({ timeListState: true })
            } else if (this.state.pageSelected == 2) {
                this.setState({ phoneListState: true })
            } else {
                this.setState({ userListState: true })
            }
            //  执行搜索请求
            this.getSearchData(this.state.pageSelected, this.state.searchValue, 1)
            this.setState({
                searchState: true,
                searchLoading: true
            })
        } else if (this.state.pageSelected.length == 0) {
            ToastAndroid.show('搜索内容不能为空', ToastAndroid.SHORT);
        }
    }
    //  获取数据
    getSearchData(t,v,p,f) {
        fetch(getURL + 'SearchOrder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: t+1,
                value: v == null || undefined ? '' : v,
                page: p
            })
        })
        .then((res) => res.json())
        .then((res) => 
        {
            this.setState({ searchLoading: false })
            if (res.error == 0) {
                //  找到对应的导航栏覆盖数据
                switch (t) {
                    case 0:
                        let t0 = f == 0 ? res.data : this.state.orderList.concat(res.data)
                        this.setState({ orderList: t0 })
                        break;
                    case 1:
                        let t1 = f == 0 ? res.data : this.state.timeList.concat(res.data)
                        this.setState({ timeList: t1 });
                        break;
                        
                    case 2:
                        let t2 = f == 0 ? res.data : this.state.phoneList.concat(res.data)
                        this.setState({ phoneList: t2 })
                        break;
                    case 3:
                        let t3 = f == 0 ? res.data : this.state.userList.concat(res.data)
                        this.setState({ userList: t3})
                        break;
                    default:
                        break;
                }
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
            this.props.dispatch(isRefreshing(false))
        }).catch((error) => {
            this.props.dispatch(isRefreshing(false))
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }
    //   选择历史记录
    selectHisItem = (data) => {
        this.state.searchValue = data
        this.search()
    }
    //  删除历史记录
    deleteItem = (index) => {
        this.state.searchHistory.splice(index, 1)
        this.saveData()
    }
    //  左右却换页面
    onPageSelected = (e) => {
        this.refs.viewPage.setPage(e)
        this.setState({ pageSelected: e })
        //  判断 如果路由为e  并且对应路由的状态为false的情况下就执行搜索
        if (e == 0 && !this.state.orderListState) {
            this.props.dispatch(isRefreshing(true))
            this.setState({
                searchLoading: true,
                orderListState: true
            })
            this.state.searchValue.length > 0 ? this.getSearchData(0, this.state.searchValue, 1) : null
        } else if (e == 1 && !this.state.timeListState) {
            this.props.dispatch(isRefreshing(true))
            this.setState({
                searchLoading: true,
                timeListState: true
            })
            this.state.searchValue.length > 0 ? this.getSearchData(1, this.state.searchValue, 1) : null
        } else if (e == 2 && !this.state.phoneListState) {
            this.props.dispatch(isRefreshing(true))
            this.setState({
                searchLoading: true,
                phoneListState: true
            })
            this.state.searchValue.length > 0 ? this.getSearchData(2, this.state.searchValue, 1) : null
        } else if (e == 3 && !this.state.userListState) {
            this.props.dispatch(isRefreshing(true))
            this.setState({
                searchLoading: true,
                userListState: true
            })
            this.state.searchValue.length > 0 ? this.getSearchData(3, this.state.searchValue, 1) : null
        }
    }
    //  下拉刷新事件
    onRefresh = () => {
        if (!this.state.searchLoading) {
            this.props.dispatch(isRefreshing(true))
            this.getSearchData(this.state.pageSelected,this.state.searchValue,1,0)
        }
    }
    //  跳转详情
    onPressItem = (item, index) => {
        this.props.navigation.navigate('OrderDetailes', {
            detail: item,
            index: index,
            tag: 'search',
        })
    }
    //  导航栏对应显示的内容
    showType =(order,phone,user) => {
        let p = this.state.pageSelected
        if (p == 0) {
            return <Text>单号 &nbsp;{order}</Text>
        }else if (p ==2) {
            return <Text>手机号码 &nbsp;{phone}</Text>
        } else if ( p==3 ) {
            return <Text>用户名 &nbsp;{user}</Text>
        } else {
            return null
        }
    }
    //  加载更多
    loadMore = () => {
        let p = this.state.pageSelected
        let v = this.state.searchValue
        if (p == 0) {
            //  定义向上取整和向下取整还有页面值
            let [c, i] = [
                Math.ceil(this.state.orderList.length / 30),
                Math.floor(this.state.orderList.length / 30)
            ]
            //  如果向上取整大于向下取整 说明数据已经请求完毕 
            //  例如 数据库有100条数据 每页最多30条数据 请求页面一个4次 分别是 30/30/30/10 
            //  100/30 向下取整是3 向上取整是4 如果4>3 那么说明已经没有数据了
            //  如果 向上取整和向下取整都是一样的整数说明还有数据 或者没有数据
            if (c > 0 && c == i) {
                this.props.dispatch(isRefreshing(true))
                this.setState({
                    searchLoading: true,
                    orderListState: true
                })
                this.getSearchData(0, v, i + 1)
            }
        } else if (p == 1) {
            //  定义向上取整和向下取整还有页面值
            let [c, i] = [
                Math.ceil(this.state.timeList.length / 30), 
                Math.floor(this.state.timeList.length / 30)
            ]
            if (c > 0 && c == i) {
                this.props.dispatch(isRefreshing(true))
                this.setState({
                    searchLoading: true,
                    timeListState: true
                })
                this.getSearchData(1, v, i + 1)
            }
        } else if (p == 2) {
            //  定义向上取整和向下取整还有页面值
            let [c, i] = [
                Math.ceil(this.state.phoneList.length / 30), 
                Math.floor(this.state.phoneList.length / 30)
            ]
            if (c > 0 && c == i) {
                this.props.dispatch(isRefreshing(true))
                this.setState({
                    searchLoading: true,
                    phoneListState: true
                })
                this.getSearchData(2, v, i + 1)
            }
        } else {
            //  定义向上取整和向下取整还有页面值
            let [c, i] = [
                Math.ceil(this.state.userList.length / 30), 
                Math.floor(this.state.userList.length / 30)
            ]
            if (c > 0 && c == i) {
                this.props.dispatch(isRefreshing(true))
                this.setState({
                    searchLoading: true,
                    userListState: true
                })
                this.getSearchData(3, v, i + 1)
            }
        }
    }
    //  保存历史记录
    saveData = () => {
        this.setState({
            searchHistory: this.state.searchHistory
        })
        AsyncStorage.setItem('searchHistory', JSON.stringify(this.state.searchHistory),(error) => {
            if(error){
                //  保存失败
            } else {
                //  保存成功
            }
        })
    }
    //  读取历史记录
    readData = () => {
        AsyncStorage.getItem('searchHistory',(error,value) => {
            if (error) {
                //  读取失败
            } else {
                //  读取成功
                value !== null ? this.setState({ searchHistory: JSON.parse(value) }) : null
            }
        })
    }
    //  行与行之间的分隔线组件
    itemSeparatorComponent = () => {
        return <View style={{height:0.8,backgroundColor:'#e8e8e8'}} />
    }
    // 列表为空时渲染该组件
    emptyComponent = () => {
        switch (this.state.pageSelected) {
            case 0:
                return <Empty content={empty(this.props.counter.refreshing, this.state.orderList, '暂无商品')} />
                break;
            case 1:
                return <Empty content={empty(this.props.counter.refreshing, this.state.timeList, '暂无商品')} />
                break;
            case 2:
                return <Empty content={empty(this.props.counter.refreshing, this.state.phoneList, '暂无商品')} />
                break;
            case 3:
                return <Empty content={empty(this.props.counter.refreshing, this.state.userList, '暂无商品')} />
                break;
            default:
                break;
        }
    }
    //  底部加载提示
    footer = () => {
        switch (this.state.pageSelected) {
            case 0:
                return this.footerText(this.state.orderList.length)
                break;
            case 1:
                return this.footerText(this.state.timeList.length)
                break;
            case 2:
                return this.footerText(this.state.phoneList.length)
                break;
            case 3:
                return this.footerText(this.state.userList.length)
                break;
            default:
                break;
        }
    }
    //  底部加载提示文字
    footerText = (d) =>{
        if (d > 0) {
            return (
                <View style={styles.loadMore}>
                    <Text
                        style={{ color: d%30 == 0 ? '#0aa394' : '#666'}}
                        onPress={() => preventDoublePress.onPress(() => this.loadMore())}>
                        {d%30 == 0 ? '加载更多' : '没有内容啦'}
                    </Text>
                </View>
            )
        } else {
            return null
        }
    }
    //  页面渲染
    render() {
        let pagerList = [
            { data: this.state.orderList},
            { data: this.state.timeList},
            { data: this.state.phoneList},
            { data: this.state.userList}
        ]
        return (
            <View style={styles.container}>
                <View style={{ height: 70, backgroundColor: '#fff', elevation: this.state.searchState ? 0 : 3 }}>
                    <View style={styles.searchView}>
                        <TouchableNativeFeedback
                            background={TouchableNativeFeedback.Ripple('#aaa', true)}
                            onPress={() => preventDoublePress.onPress(() => this.goBack())}>
                            <View style={styles.goBack}>
                                <Text style={styles.goBackText}>&#xe645;</Text>
                            </View>
                        </TouchableNativeFeedback>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <TextInput
                                style={styles.textRight}
                                onSubmitEditing={() => this.search()}
                                underlineColorAndroid='transparent'
                                placeholder="搜索订单号/日期/手机号/用户名"
                                onChangeText={(searchValue) => this.setState({searchValue})}
                                value={this.state.searchValue}
                            />
                        </View>
                        <TouchableNativeFeedback
                            background={TouchableNativeFeedback.Ripple('#aaa', true)}
                            onPress={() => preventDoublePress.onPress(() => this.search())}>
                            <View style={styles.goBack}>
                                <Text style={styles.searchIconText}>&#xe627;</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
                {
                    this.state.searchState ?
                        <View style={{ flex: 1, backgroundColor: "#f1f1f1" }}>
                            <SearchHeader
                                onPageSelected={this.onPageSelected}
                                pageSelected={this.state.pageSelected} />
                            <ViewPagerAndroid
                                style={styles.viewPager}
                                peekEnabled={true}
                                initialPage={this.state.pageSelected}
                                onPageSelected={(e) => this.onPageSelected(e.nativeEvent.position)}
                                ref="viewPage">
                                {
                                    pagerList.map((item,index) => {
                                        return (
                                            <ListView
                                                key={index}
                                                data={item.data}
                                                onRefresh={this.onRefresh}
                                                refreshing={this.props.counter.refreshing}
                                                onPressItem={this.onPressItem}
                                                showType={this.showType}
                                                loadMore={this.loadMore}
                                                itemSeparatorComponent={this.itemSeparatorComponent}
                                                emptyComponent={this.emptyComponent}
                                                footer={this.footer}
                                            />
                                        )
                                    })
                                }
                            </ViewPagerAndroid>
                        </View>
                        :
                        <SearchHistory
                            searchHistory={this.state.searchHistory}
                            selectHisItem={this.selectHisItem}
                            deleteItem={this.deleteItem} />
                }
            </View>
        )
    }
}

const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(searchContainer);
