import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    RefreshControl
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { isRefreshing } from '../../../redux/actions';



//  内容输入组件
class refreshContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    onRefresh = () => {
        // console.log("刷新了")
    }

    render() {
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.props.counter.isRefreshing}
                        onRefresh={() => this.onRefresh()}
                        enabled={true}
                        tintColor="#30b9ef"
                        title="加载中..."
                        titleColor="#30b9ef"
                        colors={['#000', '#00ff00', '#0000ff']}
                        progressBackgroundColor="#ffffff"
                    />
                }
                scrollEventThrottle={50}
            >
            </ScrollView>
        )
    }
}


const mapStateToProps = state => ({
    counter: state.counter
})

export default connect(mapStateToProps)(refreshContainer);
