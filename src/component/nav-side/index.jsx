

import React  from 'react';
import {Link,NavLink} from 'react-router-dom';


class NavSide extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className="navbar-default navbar-side">
                <div className="sidebar-collapse">
                    <ul className="nav">
                        <li>
                            <NavLink exact activeClassName="active-menu" to="/">
                                <i className="fa fa-dashboard"></i>
                                <span>Home</span>
                            </NavLink>
                        </li>

                        <li className="active">
                            <Link to="/product">
                                <i className="fa fa-list"></i>
                                <span>Product</span>
                                <span className="fa arrow"></span>
                            </Link>
                            <ul className="nav nav-second-level collapse in">
                                <li>
                                    <NavLink to="/product" activeClassName="active-menu">Product management</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/product-category" activeClassName="active-menu">Category management</NavLink>
                                </li>
                            </ul>
                        </li>

                        <li className="active">
                            <Link to="/order">
                                <i className="fa fa-check-square-o"></i>
                                <span>Orders</span>
                                <span className="fa arrow"></span>
                            </Link>
                            <ul className="nav nav-second-level collapse in">
                                <li>
                                    <NavLink to="/order" activeClassName="active-menu">Order management</NavLink>
                                </li>
                            </ul>
                        </li>

                        <li className="active">
                            <Link to="/user">
                                <i className="fa fa-user-o"></i>
                                <span>user</span>
                                <span className="fa arrow"></span>
                            </Link>
                            <ul className="nav nav-second-level collapse in">
                                <li>
                                    <NavLink to="/user" activeClassName="active-menu">User Management</NavLink>
                                </li>
                            </ul>
                        </li>

                    </ul>

                </div>

            </div>
        );
    }
}

export default NavSide;