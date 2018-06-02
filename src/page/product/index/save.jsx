




import React from 'react';
import PageTitle from "component/page-title/index.jsx";
import MUtil from 'util/mm.jsx';
import Product  from 'service/product-service.jsx';
import CategorySelector from "page/product/index/category-selector.jsx";

import FileUploader from 'util/file-upload/index.jsx';
import RichEditor from "util/rich-editor/index.jsx";

import './save.scss';


const _mm = new MUtil();
const _product = new Product();

class ProductSave extends React.Component{
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
                res.defaultDetail = res.detail;
                this.setState(res);
            },(errMsg) => {
                _mm.errorTips(errMsg);
            });
        }
    }
    // Simple field changes, such as product name, description, price, inventory
    onValueChange(e){
        let name = e.target.name,
            value = e.target.value.trim();
        this.setState({
            [name]:value
        });
    }
    // Category selector changes
    onCategoryChange(categoryId,parentCategoryId){
        this.setState({
            categoryId:categoryId,
            parentCategoryId:parentCategoryId
        });
    }

    // Successful uploading of pictures
    onUploadSuccess(res) {
        let subImages = this.state.subImages;
        subImages.push(res);
        this.setState({
            subImages: subImages
        });
    }
    // Failed to upload picture
    onUploadError(errMsg){
        _mm.errorTips(errMsg);
    }

    // Delete picture
    onImageDelete(e){
        let index = parseInt(e.target.getAttribute('index')),
            subImages = this.state.subImages;
        subImages.splice(index,1);
        this.setState({
            subImages:subImages
        });
    }

    // Rich text editor changes
    onDetailValueChange(value){
        // console.log(value);
        this.setState({
            detail:value
        });
    }

    getSubImagesString(){
        return this.state.subImages.map((image) => image.uri).join(',');
    }
    // submit Form
    onSubmit(e){
        let product = {
            name       :this.state.name,
            subtitle   :this.state.subtitle,
            categoryId :parseInt(this.state.categoryId),
            subImages  :this.getSubImagesString(),
            detail     :this.state.detail,
            price      :parseFloat(this.state.price),
            stock      :parseInt(this.state.stock),
            status     :this.state.status
        };
        let productCheckResult = _product.checkProduct(product);
        if(this.state.id){
            product.id = this.state.id;
        }
        // Form validation succeeded
        if(productCheckResult.status){
            _product.saveProduct(product).then((res) =>{
                _mm.successTips(res);
                this.props.history.push('/product/index');
            },(errMsg) => {
                _mm.errorTips(errMsg);
            });
        }
        // Form verification failed
        else{
            _mm.errorTips(productCheckResult.msg);
        }
    }

    render(){
        return(
            <div id="page-wrapper">
                <PageTitle title={this.state.id ? 'Edit merchandise': 'add goods'}/>
                <div className="form-horizontal">
                    <div className="form-group">
                        <label className="col-sm-2 control-label">product name</label>
                        <div className="col-sm-5">
                            <input type="text"
                                   className="form-control"
                                   name="name"
                                   value={this.state.name}
                                   onChange={(e) => this.onValueChange(e)}
                                   placeholder="请输入商品名称"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">product description</label>
                        <div className="col-sm-5">
                            <input type="text"
                                   className="form-control"
                                   name="subtitle"
                                   value={this.state.subtitle}
                                   onChange={(e) => this.onValueChange(e)}
                                   placeholder="Please enter product description"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">category</label>
                        <CategorySelector categoryId={this.state.categoryId}
                                          parentCategoryId={this.state.parentCategoryId}
                                          onCategoryChange={(categoryId,parentCategoryId) => {this.onCategoryChange(categoryId,parentCategoryId)}}/>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">product price</label>
                        <div className="col-sm-3">
                            <div className="input-group">
                                <input type="number"
                                       className="form-control"
                                       name="price"
                                       value={this.state.price}
                                       onChange={(e) => this.onValueChange(e)}
                                       placeholder="价格" aria-describedby="basic-addon2"/>
                                    <span className="input-group-addon">won</span>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">Commodity stocks</label>
                        <div className="col-sm-3">
                            <div className="input-group">
                                <input type="number"
                                       className="form-control"
                                       name="stock"
                                       value={this.state.stock}
                                       onChange={(e) => this.onValueChange(e)}
                                       placeholder="库存" aria-describedby="basic-addon2"/>
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
                                        <i className="fa fa-close" index={index} onClick={(e) => this.onImageDelete(e)}></i>
                                    </div>
                                )
                            ) : (<div>请上传图片</div>)}
                        </div>
                        <div className="col-md-offset-2 col-sm-10 file-upload-con">
                            <FileUploader onSuccess={(res) => {this.onUploadSuccess(res)}}
                                          onError={(err) => {this.onUploadError(errMsg)}}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">product details</label>
                        <div className="col-sm-10">
                            <RichEditor detail={this.state.detail}
                                        defaultDetail={this.state.defaultDetail}
                                        onValueChange={(value) => this.onDetailValueChange(value)}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button className="btn btn-primary" onClick={(e) => {this.onSubmit(e)}}>submit</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProductSave;