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
import { isRefreshing } from '../../../../redux/actions';
import preventDoublePress from '../../../../global/preventDoublePress';
import ListView from './components/listView';
import SearchHistory from './components/searchHistory';
import SearchHeader from './components/searchHeader';


class addWorkerContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            searchState: false,
            searchHistory: [],
            accountList: [],
            phoneList: [],
            emailList: [],
            accountListState: true,
            phoneListState:true,
            emailListState: true,
            pageSelected: 0
        }
    }

    //  头部导航
    static navigationOptions = () => ({
        header: null
    });
    //  页面渲染完毕
    componentDidMount() {
        this.readData()
    }

    //  确认提交
    search = () => {
        if (!this.props.counter.refreshing && this.state.searchValue.length > 0) {
            //  显示加载圈
            this.props.dispatch(isRefreshing(true))
            //  设置回默认值
            this.setState({
                accountListState: true,
                phoneListState: true,
                emailListState: true
            })
            //  查看历史记录中有没有存在 和搜索的值一样的内容 存在就删除
            for (let i in this.state.searchHistory) {
                if (this.state.searchHistory[i].data == this.state.searchValue) {
                    this.state.searchHistory.splice(i, 1)
                }
            }
            //  把搜索值添加到历史记录列表中
            this.state.searchHistory.unshift({ data: this.state.searchValue })
            this.saveData()
            this.onPageSelected(this.state.pageSelected, this.state.searchValue)
            this.setState({ searchState: true })
        } else {
            ToastAndroid.show('输入内容不能为空',ToastAndroid.SHORT)
        }
    }
    //  返回
    back = () => {
        this.props.navigation.goBack()
    }
    //  获取数据
    getUserData(i,v) {
        fetch(getURL + 'SearchUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: i == null || undefined ? 0 : i,
                value: v == null || undefined ? '' : v
            })
        })
        .then((res) => res.json())
        .then((res) => {
            this.props.dispatch(isRefreshing(false))
            if (res.error == 0) {
                if (i == 1) {
                    this.setState({ 
                        accountList: res.data,
                        accountListState: false
                    })
                } else if(i == 2) {
                    this.setState({ 
                        phoneList: res.data,
                        phoneListState: false,
                    })
                } else if (i == 3) {
                    this.setState({ 
                        emailList: res.data,
                        emailListState: false,
                    })
                }
            } else {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
            }
        }).catch((error) => {
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }
    //  输入值
    changeText = (searchValue) =>{
        this.setState({ searchValue})
    }
    //  删除历史记录
    deleteItem = (index) => {
        this.state.searchHistory.splice(index,1)
        this.saveData()
    }
    //  左右滑动
    onPageSelected = (e) => {
        this.setState({ pageSelected: e })
        if (e == 0 && this.state.accountListState) {
            this.props.dispatch(isRefreshing(true))
        } else if (e == 1 && this.state.phoneListState) {
            this.props.dispatch(isRefreshing(true))
        } else if (e == 2 && this.state.emailListState) {
            this.props.dispatch(isRefreshing(true))
        } else {
            this.props.dispatch(isRefreshing(false))
        }
        this.state.searchValue.length > 0 ? this.getUserData(e += 1, this.state.searchValue) : null
    }
    //  页面选择
    onPageSelect =(e) => {
        this.refs.viewPage.setPage(e)
        this.onPageSelected(e)
    }
    //  下拉刷新事件
    onRefresh = () => {
        this.props.dispatch(isRefreshing(true))
        this.getUserData(this.state.pageSelected, this.state.searchValue)
    }
    //  跳转详情
    onPressItem = (item,index) => {
        this.props.navigation.navigate('WorkerDetail', {
            detail: item,
            index: index,
            tag: 1
        })
    }
    //  保存历史记录
    saveData = () => {
        this.setState({
            searchHistory: this.state.searchHistory
        })
        AsyncStorage.setItem('workersHistory', JSON.stringify(this.state.searchHistory), (error) => {
            if (error) {
                //  保存失败
            } else {
                //  保存成功
            }
        })
    }
    //  读取历史记录
    readData = () => {
        AsyncStorage.getItem('workersHistory', (error, value) => {
            if (error) {
                //  读取失败
            } else {
                //  读取成功
                value !== null ? this.setState({ searchHistory: JSON.parse(value) }) : null
            }
        })
    }
    //  选择历史记录搜索
    selectHistory = (data) => {
        this.state.searchValue = data
        this.search()
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{ height: 70, backgroundColor: '#fff', elevation: this.state.searchState ? 0 : 3}}>
                    <View style={{ flexDirection: 'row', height: 50, backgroundColor: '#dedbdb', margin: 12, borderRadius: 5 }}>
                        <TouchableNativeFeedback 
                            background={TouchableNativeFeedback.Ripple('#aaa', true)}
                            onPress={() => preventDoublePress.onPress(() => this.back())}>
                            <View style={{ width: 50,justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontFamily: 'iconfont', fontSize: 18, color: '#333' }}>&#xe645;</Text>
                            </View>
                        </TouchableNativeFeedback>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <TextInput
                                style={styles.textRight}
                                onSubmitEditing={() => preventDoublePress.onPress(() => this.search())}
                                underlineColorAndroid='transparent'
                                placeholder="搜索账户名/手机号/邮箱"
                                onChangeText={(text) => this.changeText(text)}
                                value={this.state.searchValue}
                            />
                        </View>
                        <TouchableNativeFeedback 
                            background={TouchableNativeFeedback.Ripple('#aaa', true)}
                            onPress={() => preventDoublePress.onPress(() => this.search())}>
                            <View style={{ width: 50,justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontFamily: 'iconfont', fontSize: 21, color: '#333' }}>&#xe627;</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
                {
                    this.state.searchState ?
                        <View style={{ flex: 1, backgroundColor: "#f1f1f1" }}>
                            <SearchHeader 
                                onPageSelected={this.onPageSelect}
                                pageSelected={this.state.pageSelected} />
                            <ViewPagerAndroid
                                style={styles.viewPager}
                                peekEnabled={true}
                                initialPage={this.state.pageSelected}
                                onPageSelected={(e) => this.onPageSelected(e.nativeEvent.position)}
                                ref="viewPage">
                                <View>
                                    <ListView 
                                        data={this.state.accountList}
                                        onRefresh={this.onRefresh}
                                        refreshing={this.props.counter.refreshing}
                                        onPressItem={this.onPressItem} />
                                </View>
                                <View>
                                    <ListView 
                                        data={this.state.phoneList}
                                        onRefresh={this.onRefresh}
                                        refreshing={this.props.counter.refreshing}
                                        onPressItem={this.onPressItem} />
                                </View>
                                <View>
                                    <ListView 
                                        data={this.state.emailList}
                                        onRefresh={this.onRefresh}
                                        refreshing={this.props.counter.refreshing}
                                        onPressItem={this.onPressItem} />
                                </View>
                            </ViewPagerAndroid>
                        </View>
                        :
                        <SearchHistory
                            searchHistory={this.state.searchHistory}
                            deleteItem={this.deleteItem}
                            selectHistory={this.selectHistory} />
                }
            </View>
        )
    }
}

const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(addWorkerContainer);
