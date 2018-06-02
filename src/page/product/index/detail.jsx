




import React from 'react';
import PageTitle from "component/page-title/index.jsx";
import MUtil from 'util/mm.jsx';
import Product  from 'service/product-service.jsx';
import CategorySelector from "page/product/index/category-selector.jsx";


import './save.scss';


const _mm = new MUtil();
const _product = new Product();

class ProductDetail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id:this.props.match.params.pid,
            name:'',
            subtitle:'',
            categoryId:0,
            parentCategoryId:0,
            subImages:[],
            price:'',
            stock:'',
            detail:'',
            status:1 // Product status 1, for sale
        }
    }
    componentDidMount(){
        this.loadProduct();
    }
    // Load product details
    loadProduct(){
        // When there is an ID, it means that it is an editing function. It needs a form backfill.
        if(this.state.id){
            _product.getProduct(this.state.id).then((res) => {
                let images = res.subImages.split(',');
                res.subImages = images.map((imgUri) => {
                    return {
                        uri:imgUri,
                        url:res.imageHost+imgUri
                    }
                });
                this.setState(res);
            },(errMsg) => {
                _mm.errorTips(errMsg);
            });
        }
    }

    render(){
        return(
            <div id="page-wrapper">
                <PageTitle title="Adding goods"/>
                <div className="form-horizontal">
                    <div className="form-group">
                        <label className="col-sm-2 control-label">product name</label>
                        <div className="col-sm-5">
                            <p className="form-control-static">{this.state.name}</p>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">product description</label>
                        <div className="col-sm-5">
                            <p className="form-control-static">{this.state.subtitle}</p>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">category</label>
                        <CategorySelector readOnly
                                          categoryId={this.state.categoryId}
                                          parentCategoryId={this.state.parentCategoryId}
                        />
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">product price</label>
                        <div className="col-sm-3">
                            <div className="input-group">
                                <input type="number"
                                       className="form-control"
                                       value={this.state.price}
                                       readOnly
                                />
                                <span className="input-group-addon">won</span>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">product stocks</label>
                        <div className="col-sm-3">
                            <div className="input-group">
                                <input type="number"
                                       className="form-control"
                                       value={this.state.stock}
                                       readOnly
                                />
                                <span className="input-group-addon">Matter</span>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">product picture</label>
                        <div className="col-sm-10">
                            {this.state.subImages.length ? this.state.subImages.map(
                                (image,index) => (
                                    <div key={index} className="img-con">
                                        <img className="img" src={image.url}/>
                                    </div>
                                )
                            ) : (<div>No pictures</div>)}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">product details</label>
                        <div className="col-sm-10" dangerouslySetInnerHTML={{__html:this.state.detail}}>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProductDetail;