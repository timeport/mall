import Toast from './Toast'

const obj = {}
obj.install = function (Vue) {
  //创建组件构造器
  const toastContrustor = Vue.extend(Toast)
  //通过组件构造器new的方式 创建对象
  const toast = new toastContrustor()
  //将组件对象挂载到某一个元素上
  toast.$mount(document.createElement('div'))
  //toast.$el就是对应的div
  document.body.appendChild(toast.$el)

  Vue.prototype.$toast = toast;

}

export default obj