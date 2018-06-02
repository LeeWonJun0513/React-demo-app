

import React from 'react';

import MUtil from 'util/mm.jsx';
import Product  from 'service/product-service.jsx';

import PageTitle from 'component/page-title/index.jsx';

const _mm = new MUtil();
const _product = new Product();


class CategoryAdd extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            categoryList:[],
            parentId:0,
            categoryName:''
        }
    }
    componentDidMount(){
        this.loadCategoryList()
    }

    // Load category list, show parent category list
    loadCategoryList(){
        _product.getCategoryList().then(res => {
            this.setState({
                categoryList:res
            });

        },errMsg => {
            this.setState({
                list: []
            });
            _mm.errorTips(errMsg);
        });
    }

    onValueChange(e){
        let name = e.target.name,
            value = e.target.value.trim();
        this.setState({
            [name]:value
        });
    }

    onSubmit(e){
        let categoryName = this.state.categoryName.trim();
        if(categoryName){// Commodity category is not empty submit data
            _product.saveCategory({
                parentId:this.state.parentId,
                categoryName:this.state.categoryName
            }).then((res) => {
                _mm.successTips(res);
                this.props.history.push('/product-category/index')
            },(errMsg) => {
                _mm.errorTips(errMsg);
            });
        }else{// Otherwise, error
            _mm.errorTips("请输入品类名称");
        }
    }

    render(){
        return(
            <div id="page-wrapper">
                <PageTitle title="添加品类"/>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <label className="col-sm-2 control-label">Belonging category</label>
                                <div className="col-sm-5">
                                    <select name="parentId"
                                            onChange={(e) => this.onValueChange(e)}
                                            className="form-control">
                                        <option value="0">Root category</option>
                                        {
                                            this.state.categoryList.map((category,index) => {
                                                return <option key={index} value={category.id}>Root category/{category.name}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-2 control-label">Category name</label>
                                <div className="col-sm-5">
                                    <input type="text"
                                           className="form-control"
                                           name="categoryName"
                                           value={this.state.name}
                                           onChange={(e) => this.onValueChange(e)}
                                           placeholder="Please enter the category name"/>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-sm-offset-2 col-sm-10">
                                    <button className="btn btn-primary" onClick={(e) => {this.onSubmit(e)}}>submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CategoryAdd;