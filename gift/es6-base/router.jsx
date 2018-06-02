

// 页面路由
window.location.href = 'http://www.iwmake.com';
history.back();

// hash路由
window.location = '#hash';
window.onHashChange = function () {
    console.log('current hash:',window.location.hash);
};

// H5 路由
// 推进一个状态
history.pushState('name','title','/path');
// 替换一个状态
history.replaceState('name','title','/path');
// popsate
window.onPopState = function () {
    console.log(window.location.href);
    console.log(window.location.pathname);
    console.log(window.location.hash);
    console.log(window.location.search);
};

// React-Router
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router,Route,Link,Switch} from 'react-router-dom';

class A extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div>
                Component A
                <Switch>
                    <Route exact path={`${this.props.match.path}`}
                           render={(route) => {
                               return <div>当前组件是不带参数的A</div>}
                           }/>
                    <Route path={`${this.props.match.path}/sub`}
                           render={(route) => {
                               return <div>当前组件是Sub</div>}
                           }/>
                    <Route path={`${this.props.match.path}/:id`}
                           render={(route) => {
                               return <div>当前组件是带参数的A,参数是：{route.match.params.id}</div>}
                           }/>
                </Switch>
            </div>
        );
    }
}

class B extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return <div>Component B</div>
    }
}

class Wrapper extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div>
                <Link to="/a">组件A</Link>
                <br/>
                <Link to="/a/123">带参数的组件A</Link>
                <br/>
                <Link to="/b">组件B</Link>
                <br/>
                <Link to="/a/sub">/a/sub</Link>
                {this.props.children}
            </div>
        );
    }
}

ReactDOM.render(
    <Router>
        <Wrapper>
            <Route path="/a" component={A}/>
            <Route path="/b" component={B}/>
        </Wrapper>
    </Router>,
    document.getElementById('app')
);