


import MUtil from 'util/mm.jsx';

const _mm = new MUtil();

class Product{
    // Get product list
    getProductList(listParam){
        let url  = '',
            data = {};
        if(listParam.listType === 'list'){
            url = '/manage/product/list.do';
            data.pageNum = listParam.pageNum;
        }else if(listParam.listType === 'search'){
            url = '/manage/product/search.do';
            data.pageNum = listParam.pageNum;
            data[listParam.searchType] = listParam.keyword;
        }
        return _mm.request({
            type: 'post',
            url:url,
            data:data
        });
    }
    // Get product details
    getProduct(id){
        return _mm.request({
            type: 'post',
            url:'/manage/product/detail.do',
            data:{
                productId :id || 0
            }
        });
    }
    // Change product sales status
    setProductStatus(productInfo){
        return _mm.request({
            type: 'post',
            url:'/manage/product/set_sale_status.do',
            data:productInfo
        });
    }

    // Check form
    checkProduct(product){
        let result = {
            status:true,
            msg:'Verification passed'
        };
        if(typeof product.name !== 'string' || product.name.length === 0){
            return{
                status:false,
                msg:'Product name cannot be empty'
            }
        }
        if(typeof product.subtitle !== 'string' || product.subtitle.length === 0){
            return{
                status:false,
                msg:'Product description cannot be empty'
            }
        }
        if(typeof product.categoryId !== 'number' || !(product.categoryId > 0)){
            return{
                status:false,
                msg:'Please select product category'
            }
        }
        if(typeof product.price !== 'number' || !(product.price >= 0)){
            return{
                status:false,
                msg:'Invalid commodity price'
            }
        }
        if(typeof product.stock !== 'number' || !(product.stock >= 0)){
            return{
                status:false,
                msg:'Invalid commodity inventory quantity'
            }
        }

        return result;
    }
    // Save goods
    saveProduct(product){
        return _mm.request({
            type: 'post',
            url:'/manage/product/save.do',
            data:product
        });
    }

    /**
     * Category related
     */
    getCategoryList(parentCategoryId){
        return _mm.request({
            type: 'post',
            url:'/manage/category/get_category.do',
            data:{
                categoryId:parentCategoryId || 0
            }
        });
    }

    updateCategoryName(category){
        return _mm.request({
            type: 'post',
            url:'/manage/category/set_category_name.do',
            data:category
        });
    }

    saveCategory(category){
        return _mm.request({
            type: 'post',
            url:'/manage/category/add_category.do',
            data:category
        });
    }
}

export default Product;