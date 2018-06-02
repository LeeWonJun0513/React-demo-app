



import React from 'react';
import MUtil from 'util/mm.jsx';
import User  from 'service/user-service.jsx';

const _mm = new MUtil();
const _user = new User();

import './index.scss';

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username : '',
            password : '',
            redirect : _mm.getUrlParam('redirect') || '/'
        }
    }
    componentWillMount(){
        document.title = 'log in - mall admin';
    }
    // When the input changes
    onInputChange(e){
        let inputValue = e.target.value,
            inputName  = e.target.name;
        this.setState({
            [inputName]:inputValue
        });
    }

    onInputKeyUp(e){
        if(e.keyCode === 13){
            this.onSubmit();
        }
    }

    // When the user submits the form
    onSubmit(){
        let loginInfo = {
            username:this.state.username,
            password:this.state.password
        },
            checkResult = _user.checkLoginInfo(loginInfo);
        //Verification passed
        if(checkResult.status){
            _user.login(loginInfo).then(
                (res) => {
                    _mm.setStorage('userInfo',res);
                    this.props.history.push(this.state.redirect);
                },
                (errMsg) => {
                    _mm.errorTips(errMsg);
                }
            );
        }
        // Verification does not pass
        else{
            _mm.errorTips(checkResult.msg);
        }

    }

    render(){
        return(
            <div className="col-md-4 col-md-offset-4">
                <div className="panel panel-default login-panel">
                    <div className="panel-heading">Login please - MALL Management system</div>
                    <div className="panel-body">
                        <div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="username"
                                    className="form-control"
                                    onChange={e => this.onInputChange(e)}
                                    onKeyUp={e => this.onInputKeyUp(e)}
                                    placeholder="please enter user name"/>
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    onChange={e => this.onInputChange(e)}
                                    onKeyUp={e => this.onInputKeyUp(e)}
                                    placeholder="Please enter your password"/>
                            </div>
                            <button className="btn bg-lg btn-primary btn-block"
                                    onClick={e => this.onSubmit(e)}>log in</button>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default Login;