
import React from 'react';
import ReactDOM from 'react-dom';


// 基础组件写法
function Component() {
    return <h1>I am Dylan</h1>
}

class ES6Component extends React.Component{
    render(){
        return <h1>I am Dylan in es6</h1>
    }
}

ReactDOM.render(
    <div>
        <Component/>
        <ES6Component/>
    </div>,
    document.getElementById('app')
);


// state && props
class Component extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        setTimeout(() => {
            this.setState({
                name: 'Dylan Test'
            })
        },2000);
        return <h1>I am {this.state.name}</h1>
    }
}
ReactDOM.render(
    <div>
        <Component name="Dylan"/>
    </div>,
    document.getElementById('app')
);


// 事件处理方式一

class Component extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name : 'Dylan',
            age : 18
        };
        this.handleClick = this.handleClick.bind(this); // 注释这一行 看看报什么错，为什么
    }
    handleClick(){
        this.setState({
            age : this.state.age + 1
        })
    }
    render(){
        return(
            <div>
                <h1>I am {this.state.name}</h1>
                <p>I am {this.state.age} years old!</p>
                <button onClick={this.handleClick}>加一岁</button> /* 当构造函数中没有绑定this时，可以使用箭头函数{(e) => this.handleClick(e)}  参见方式二*/
            </div>
        );
    }
}

// 事件处理方式二

class Component extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name : 'Dylan',
            age : 18
        };
    }
    handleClick(){
        this.setState({
            age : this.state.age + 1
        })
    }
    onValueChange(e) {
        this.setState({
            age : e.target.value
        });
    }
    render(){
        return(
            <div>
                <h1>I am {this.state.name}</h1>
                <p>I am {this.state.age} years old!</p>
                <button onClick={(e) => this.handleClick(e)}>加一岁</button>
                <input type="text" onChange={(e) => {this.onValueChange(e)}}/>
            </div>
        );
    }
}

// 组件的组合方式
class Component extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name : 'Dylan',
            age : 18
        };
    }
    handleClick(){
        this.setState({
            age : this.state.age + 1
        })
    }
    onValueChange(e) {
        this.setState({
            age : e.target.value
        });
    }
    render(){
        return(
            <div>
                <h1>I am {this.state.name}</h1>
                <p>I am {this.state.age} years old!</p>
                <button onClick={(e) => this.handleClick(e)}>加一岁</button>
                <input type="text" onChange={(e) => {this.onValueChange(e)}}/>
            </div>
        );
    }
}

class Title extends React.Component{
    constructor(props){
        super(props);
    }
    render(props){
        return <h1>{this.props.children}</h1>
    }
}

class App extends React.Component{
    render(){
        return(
            <div className="">
                {/* 容器式组件 */}
                <Title>
                    <span>App Span</span>
                    <a href="">Link</a>
                </Title>
                <hr/>
                {/* 单纯组件 */}
                <Component/>
            </div>
        );
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('app')
);


// 子组件向父组件传值，通过回调，（注：父组件向子组件传值可以通过props）
class Child extends React.Component{
    constructor(props){
        super(props);
    }
    handleClick(){
        this.props.changeColor('red');
    }
    render(){
        return(
            <div>
                <h1>父组件的背景颜色 {this.props.bgColor}</h1>
                <button onClick={(e) => this.handleClick(e)}>改变父组件bgColor</button>
            </div>
        );
    }
}

class Father extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            bgColor: '#999'
        };
    }
    onChangeBgColor (color){
        this.setState({
            bgColor : color
        });
    }
    render(props){
        return (
            <div style={{background:this.state.bgColor}}>
                <Child bgColor ={this.state.bgColor} changeColor={(color) => {this.onChangeBgColor(color)}}/>
            </div>
        );
    }
}

ReactDOM.render(
    <Father/>,
    document.getElementById('app')
);


// 兄弟组件之间传值，状态提升，先将A组件状态提升至父组件，再通过父组件将状态传递值A的兄弟组件

class Child1 extends React.Component{
    constructor(props){
        super(props);
    }
    handleClick(){
        this.props.changeChild2Color('red');
    }
    render(){
        return(
            <div>
                <h1>Child1： {this.props.bgColor}</h1>
                <button onClick={(e) => this.handleClick(e)}>改变Child2的bgColor</button>
            </div>
        );
    }
}


class Child2 extends React.Component{
    constructor(props){
        super(props);
    }
    handleClick(){
        this.props.changeColor('red');
    }
    render(){
        return(
            <div style={{background:this.props.bgColor}}>
                <h1>Child2背景颜色: {this.props.bgColor}</h1>
            </div>
        );
    }
}

class Father extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            child2BgColor: '#999'
        };
    }
    onChangeChild2BgColor (color){
        this.setState({
            child2BgColor : color
        });
    }
    render(props){
        return (
            <div>
                <Child1 changeChild2Color = {(color) => {this.onChangeChild2BgColor(color)}}/>
                <Child2 bgColor ={this.state.child2BgColor}/>
            </div>
        );
    }
}
ReactDOM.render(
    <Father/>,
    document.getElementById('app')
);