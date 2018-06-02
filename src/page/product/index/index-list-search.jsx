

import React from 'react';

class ListSearch extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            searchType    : 'productId', // productId,productName
            searchKeyWord : ''
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
        this.props.onSearch(this.state.searchType,this.state.searchKeyWord);
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
                            <select className="form-control"
                                    name="searchType"
                                    onChange={(e) => this.onValueChange(e)}>
                                <option value="productId">Query by product ID</option>
                                <option value="productName">Query by product name</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <input className="form-control"
                                   name="searchKeyWord"
                                   onChange={(e) => this.onValueChange(e)}
                                   onKeyUp ={(e) => this.onSearchKeyWordKeyUp(e)}
                                   placeholder="Key words"/>
                        </div>

                        <button className="btn btn-primary"
                                onClick={(e) => this.onSearch()}>search for
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ListSearch;