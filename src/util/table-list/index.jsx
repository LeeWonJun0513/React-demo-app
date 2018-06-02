



import React from 'react';

// Universal list
class TableList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isFirstLoading:true
        }
    }
    componentWillReceiveProps(){
        // The list is only loaded for the first time, isFirstLoading is true, other conditions are false
        this.setState({
            isFirstLoading:false
        });
    }
    render(){
        // Header information
        let tableHeader = this.props.tableHeads.map(
            (tableHead,index) => {
                if(typeof tableHead === 'object'){
                    return <th key={index} width={tableHead.width}>{tableHead.name}</th>
                }else if(typeof tableHead === 'string'){
                    return <th key={index}>{tableHead}</th>
                }
            }
        );
        // List content
        let listBody = this.props.children;

        // List information
        let listInfo = (
            <tr>
                <td colSpan={this.props.tableHeads.length} className="text-center">
                    {this.state.isFirstLoading ? 'Loading...' : 'No results found'}
                </td>
            </tr>
        );
        let tableBody = listBody.length >0 ? listBody : listInfo;
        return(
            <div className="row">
                <div className="col-md-12">
                    <table className="table table-striped table-bordered">
                        <thead>
                        <tr>
                            {tableHeader}
                        </tr>
                        </thead>
                        <tbody>
                        {tableBody}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default TableList;