import {ADD_COUNT,ADD_TO_CART} from "./mutation-type";

export default {
  addCart(context,payload) {
    return new Promise((resolve,reject) => {
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
      if(oldProduct){
        context.commit(ADD_COUNT,oldProduct)
        resolve('数量+1')
      }
      else{
        context.commit(ADD_TO_CART,payload)
        resolve('商品+1')
      }
    })

  }
}
