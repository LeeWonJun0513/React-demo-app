

import React from 'react';

import MUtil from 'util/mm.jsx';
import Product  from 'service/product-service.jsx';

const _mm = new MUtil();
const _product = new Product();

import './category-selector.scss';

// Category selector
class CategorySelector extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            firstCategoryList : [],
            firstCategoryId : 0,
            secondCategoryList : [],
            secondCategoryId : 0
        }
    }
    componentDidMount(){
        this.loadFirstCategory();
    }

    componentWillReceiveProps(nextProps){
        let categoryIdChange = this.props.categoryId !== nextProps.categoryId,
            parentCategoryIdChange = this.props.parentCategoryId !== nextProps.parentCategoryId;
        // When there is no change in data, no processing is done
        if(!categoryIdChange && !parentCategoryIdChange){
            return;
        }
        // If there is only one category
        if(nextProps.parentCategoryId === 0){
            this.setState({
               firstCategoryId:nextProps.categoryId,
               secondCategoryId:0
            });
        }
        // There are two categories
        else{
            this.setState({
                firstCategoryId:nextProps.parentCategoryId,
                secondCategoryId:nextProps.categoryId
            },() => {
                parentCategoryIdChange && this.loadSecondCategory();
            });
        }
    }
    //Loading a classification
    loadFirstCategory(){
        _product.getCategoryList().then(res => {
            this.setState({
                firstCategoryList: res
            });
        },errMsg => {
            _mm.errorTips(errMsg);
        });
    }

    // Loading secondary classification
    loadSecondCategory(){
        _product.getCategoryList(this.state.firstCategoryId).then(res => {
            this.setState({
                secondCategoryList: res
            });
        },errMsg => {
            _mm.errorTips(errMsg);
        });
    }

    // Select first class
    onFirstCategoryChange(e){
        if(this.props.readOnly){
            return;
        }
        let newValue = e.target.value || 0;
        this.setState({
            firstCategoryId: newValue,
            secondCategoryId:0,
            secondCategoryList:[]
        },() => {
            // Update secondary category
            this.loadSecondCategory();
            this.onPropsCategoryChange();
        });
    }
    // Select secondary category
    onSecondCategoryChange(e){
        if(this.props.readOnly){
            return;
        }
        let newValue = e.target.value || 0;
        this.setState({
            secondCategoryId: newValue
        },() => {
            this.onPropsCategoryChange();
        });
    }

    // The result passed to the parent component
    onPropsCategoryChange(){
        // Judging the existence of a callback function in props
        let categoryChageable = typeof this.props.onCategoryChange === 'function';
        //If there are two categories
        if(this.state.secondCategoryId){
            categoryChageable && this.props.onCategoryChange(this.state.secondCategoryId,this.state.firstCategoryId);
        }
        // If only the first category
        else{
            categoryChageable && this.props.onCategoryChange(this.state.firstCategoryId,0);
        }
    }

    render(){
        return(
            <div className="col-sm-10">
                <select value={this.state.firstCategoryId}
                        onChange={(e) => this.onFirstCategoryChange(e)}
                        readOnly={this.props.readOnly}
                        className="form-control cate-select">
                    <option>Please choose a classification</option>
                    {
                        this.state.firstCategoryList.map((category,index) => <option value={category.id} key={index}>{category.name}</option>)
                    }
                </select>
                {
                    this.state.secondCategoryList.length > 0
                        ?
                        (<select value={this.state.secondCategoryId}
                                 onChange={(e) => this.onSecondCategoryChange(e)}
                                 readOnly={this.props.readOnly}
                                 className="form-control cate-select">
                            <option>Please select secondary classification</option>
                            {
                                this.state.secondCategoryList.map((category,index) => <option value={category.id} key={index}>{category.name}</option>)
                            }
                        </select>)
                        : null
                }

            </div>
        );
    }
}

export default CategorySelector;