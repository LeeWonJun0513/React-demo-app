




import React from 'react';
import PageTitle from "component/page-title/index.jsx";
import MUtil from 'util/mm.jsx';
import Order  from 'service/order-service.jsx';
import TableList  from 'util/table-list/index.jsx';

import './detail.scss';

const _mm = new MUtil();
const _order = new Order();

class OrderDetail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id:this.props.match.params.orderNumber,
            orderInfo:{}
        }
    }
    componentDidMount(){
        this.loadOrderDetail();
    }
    // Load order details
    loadOrderDetail(){
        _order.getOrderDetail(this.state.id).then((res) => {
            this.setState({
                orderInfo:res
            });
        },(errMsg) => {
            _mm.errorTips(errMsg);
        });
    }

    onSendGoods(e){
        if(window.confirm("Confirm whether the order has been shipped？")){
            _order.sendGoods(this.state.orderNumber).then((res) => {
                _mm.successTips("Successful delivery");
                this.loadOrderDetail();
            },(errMsg) => {
                _mm.errorTips(errMsg);
            });
        }
    }

    render(){
        let receiverInfo = this.state.orderInfo.shippingVo || {},
            productList  = this.state.orderInfo.orderItemVoList || [];
        let tableHeads = [
            {name:'product picture',width:'10%'},
            {name:'Product Information',width:'45%'},
            {name:'unit price',width:'15%'},
            {name:'Quantity',width:'15%'},
            {name:'total',width:'15%'}
        ];
        return(
            <div id="page-wrapper">
                <PageTitle title="order details"/>
                <div className="form-horizontal">
                    <div className="form-group">
                        <label className="col-sm-2 control-label">order number</label>
                        <div className="col-sm-5">
                            <p className="form-control-static">{this.state.orderInfo.orderNo}</p>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">Creation time</label>
                        <div className="col-sm-5">
                            <p className="form-control-static">{this.state.orderInfo.createTime}</p>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">Recipient</label>
                        <div className="col-sm-5">
                            <p className="form-control-static">
                                {receiverInfo.receiverName}，
                                {receiverInfo.receiverProvince}
                                {receiverInfo.receiverCity}
                                {receiverInfo.receiverAddress}
                                {receiverInfo.receiverMobile || receiverInfo.receiverPhone}
                            </p>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">Order Status</label>
                        <div className="col-sm-5">
                            <p className="form-control-static">
                                {this.state.orderInfo.statusDesc}
                                {
                                    this.state.orderInfo.status ===20
                                    ? <button className="btn btn-default btn-sm btn-send-goods"
                                              onClick={(e) => this.onSendGoods(e)}>Immediate delivery</button> : null
                                }
                            </p>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">payment method</label>
                        <div className="col-sm-5">
                            <p className="form-control-static">{this.state.orderInfo.paymentTypeDesc}</p>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">order amount</label>
                        <div className="col-sm-5">
                            <p className="form-control-static">￥{this.state.orderInfo.payment}</p>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">Product list</label>
                        <div className="col-sm-10">
                            <TableList tableHeads={tableHeads}>
                                {
                                    productList.map((product,index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <img className="p-img"
                                                         src={`${this.state.orderInfo.imageHost}/${product.productImage}`}
                                                         alt={product.productName}/>
                                                </td>
                                                <td>{product.productName}</td>
                                                <td>￥{product.currentUnitPrice}</td>
                                                <td>{product.quantity}</td>
                                                <td>￥{product.totalPrice}</td>
                                            </tr>
                                        );
                                    })
                                }
                            </TableList>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default OrderDetail;