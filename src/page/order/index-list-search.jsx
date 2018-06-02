

import React from 'react';

class ListSearch extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            orderNumber : ''
        }
    }
    onValueChange(e){
        let name  = e.target.name,
            value = e.target.value.trim();
        this.setState({
            [name] : value
        });
    }
    // When you click the search button
    onSearch(){
        this.props.onSearch(this.state.orderNumber);
    }
    // Enter the keywords and press Enter to submit them automatically
    onSearchKeyWordKeyUp(e){
        if(e.keyCode === 13){
            this.onSearch();
        }
    }
    render(){
        return(
            <div className="row search-wrap">
                <div className="col-md-12">
                    <div className="form-inline">
                        <div className="form-group">
                            <select className="form-control">
                                <option value="productId">Query by order number</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <input className="form-control"
                                   name="orderNumber"
                                   onChange={(e) => this.onValueChange(e)}
                                   onKeyUp ={(e) => this.onSearchKeyWordKeyUp(e)}
                                   placeholder="Please enter the order number"/>
                        </div>

                        <button className="btn btn-primary"
                                onClick={(e) => this.onSearch()}>搜索
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ListSearch;