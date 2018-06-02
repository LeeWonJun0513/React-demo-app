


import React from 'react';

import RcPagination from'rc-pagination';
import 'rc-pagination/dist/rc-pagination.min.css';

// General paging component
class Pagination extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="row">
                <div className="col-md-12">
                    <RcPagination {...this.props}
                                  hideOnSinglePage
                                  showQuickJumper/>
                </div>
            </div>
        );
    }
}

export default Pagination;