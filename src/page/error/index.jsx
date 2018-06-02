



import React from 'react';
import {Link} from 'react-router-dom';

import PageTitle from 'component/page-title/index.jsx';

class Error extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div id="page-wrapper">
                <PageTitle title="error!"/>
                <div className="row">
                    <div className="col-md-12">
                        <span>No path found,</span>
                        <Link to="/">Click me to return home</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Error;