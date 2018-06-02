

import React from 'react';
import {Link} from 'react-router-dom';

import MUtil from 'util/mm.jsx';
import Product  from 'service/product-service.jsx';

import PageTitle from 'component/page-title/index.jsx';
import TableList from 'util/table-list/index.jsx';

const _mm = new MUtil();
const _product = new Product();


class CategoryList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            list:[],
            parentCategoryId:this.props.match.params.categoryId || 0
        }
    }
    componentDidMount(){
        this.loadCategoryList()
    }
    componentDidUpdate(prevProps,prevState){
        let oldPath = prevProps.location.pathname,
            newPath = this.props.location.pathname,
            newId   = this.props.match.params.categoryId || 0;
        if(oldPath !== newPath){
            this.setState({
                parentCategoryId:newId
            },() => {
                this.loadCategoryList();
            });
        }
    }
    // Loading category list
    loadCategoryList(){
        _product.getCategoryList(this.state.parentCategoryId).then(res => {
            this.setState({
                list:res
            });

        },errMsg => {
            this.setState({
                list: []
            });
            _mm.errorTips(errMsg);
        });
    }

    onUpdateName(id,name){
        let newName = window.prompt("Please enter a new category name",name);
        if(newName){
            _product.updateCategoryName({
                categoryId:id,
                categoryName:newName
            }).then((res) => {
                _mm.successTips(res);
                this.loadCategoryList();
            },(errMsg) => {
                _mm.errorTips(errMsg);
            });
        }
    }

    render(){
        let listBody = this.state.list.map((category,index) => {
            return (
                <tr key={index}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>
                        <a className='operate' onClick={(e) => {this.onUpdateName(category.id,category.name)}}>修改名称</a>
                        {
                            category.parentId === 0
                            ? <Link to = {`/product-category/index/${category.id}`}>See subcategory</Link>
                            : null
                        }
                    </td>
                </tr>
            );
        });
        return(
            <div id="page-wrapper">
                <PageTitle title="Category list">
                    <div className="page-header-right">
                        <Link to="/product-category/add" className="btn btn-primary">
                            <i className="fa fa-plus"></i>
                            <span>Add category</span>
                        </Link>
                    </div>
                </PageTitle>
                <div className="row">
                    <div className="col-md-12">
                        <p>父品类ID：{this.state.parentCategoryId}</p>
                    </div>
                </div>
                <TableList tableHeads={['Category ID', 'Category', 'Operation']}>
                    {listBody}
                </TableList>
            </div>
        );
    }
}

export default CategoryList;