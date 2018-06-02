



import React from 'react';
import {Link} from 'react-router-dom';

import MUtil from 'util/mm.jsx';
import Product  from 'service/product-service.jsx';

import PageTitle from 'component/page-title/index.jsx';
import Pagination from'util/pagination/index.jsx';
import TableList from "util/table-list/index.jsx";
import ListSearch from "./index-list-search.jsx";

const _mm = new MUtil();
const _product = new Product();

import './index.scss'


class ProductList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            list:[],
            pageNum:1,
            listType : 'list'
        }
    }
    componentDidMount(){
        this.loadProductList()
    }

    // Loading product list
    loadProductList(){
        let listParam = {};
        listParam.listType = this.state.listType;
        listParam.pageNum = this.state.pageNum;
        // If it is a search, it needs incoming search type and search key
        if(this.state.listType === 'search'){
            listParam.searchType = this.state.searchType;
            listParam.keyword = this.state.searchKeyWord;
        }
        // Request interface
        _product.getProductList(listParam).then(res => {
            this.setState(res);
        },errMsg => {
            this.setState({
                list: []
            });
            _mm.errorTips(errMsg);
        });
    }

    // search for
    onSearch(searchType,searchKeyWord){
        let listType = searchKeyWord === '' ? 'list' : 'search';
        this.setState({
            listType : listType,
            pageNum  : 1,
            searchType: searchType,
            searchKeyWord:searchKeyWord
        },() => {
            this.loadProductList();
        });
    }

    // When the number of pages changes
    onPageNumChange(pageNum){
        this.setState({
            pageNum:pageNum
        },() => {
            this.loadUserList();
        });
    }
    // Change product status, shelves, shelves
    onSetProductStatus(e,productId,currentStatus){
        let newStatus   = currentStatus == 1 ? 2 : 1,
            confirmTips = currentStatus == 1 ? '确定要下架该商品' : '确定要上架该商品';

        if(window.confirm(confirmTips)){
            _product.setProductStatus({
                productId:productId,
                status   :newStatus
            }).then(res => {
                _mm.successTips(res);
                this.loadProductList();
            },errMsg => {
                _mm.errorTips(errMsg);
            });
        }
    }

    render(){
        let tableHeads = [
            {name:'Product ID',width:'10%'},
            {name:'Product Information',width:'50%'},
            {name:'price',width:'10%'},
            {name:'status',width:'15%'},
            {name:'operating',width:'15%'}
        ];
        return(
            <div id="page-wrapper">
                <PageTitle title="Product list">
                    <div className="page-header-right">
                        <Link to="/product/save" className="btn btn-primary">
                            <i className="fa fa-plus"></i>
                            <span>Adding goods</span>
                        </Link>
                    </div>
                </PageTitle>
                <ListSearch onSearch={(searchType,searchKeyWord) => {this.onSearch(searchType,searchKeyWord)}}/>
                <TableList tableHeads={tableHeads}>
                    {
                        this.state.list.map((product,index) => {
                            return (
                                <tr key={index}>
                                    <td>{product.id}</td>
                                    <td>
                                        <p>{product.name}</p>
                                        <p>{product.subtitle}</p>
                                    </td>
                                    <td>￥{product.price}</td>
                                    <td>
                                        <p>{product.status == 1 ? 'in stock' : 'Has been removed'}</p>
                                        <button className="btn btn-xs btn-warning"
                                                onClick={(e) => {this.onSetProductStatus(e,product.id,product.status)}}>{product.status == 1 ? 'Drop off' : 'on selves'}
                                        </button>
                                    </td>
                                    <td>
                                        <Link className='operate' to={`/product/detail/${product.id}`}>Detailss</Link>
                                        <Link className='operate' to={`/product/save/${product.id}`}>edit</Link>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </TableList>
                <Pagination
                    current={this.state.pageNum}
                    total={this.state.total}
                    onChange={(pageNum) => this.onPageNumChange(pageNum)}/>
            </div>
        );
    }
}

export default ProductList;