<template>
  <div class="cart-list">
    <scroll class="content">
      <cart-list-item v-for="(item,index) in cartList" :product="item" :key="index"></cart-list-item>
    </scroll>
  </div>
</template>

<script>
  import Scroll from "components/common/scroll/scroll";
  import {mapGetters} from 'vuex'
  import CartListItem from "./CartListItem";
  export default {
    name: "CartList",
    components: {CartListItem, Scroll},
    computed: {
      ...mapGetters(['cartList'])
    }
  }
</script>

<style scoped>
  .cart-list {
    height: calc(100% - 44px - 49px - 40px);
  }
  .content {
    height: 100%;
    overflow: hidden;
  }
</style>
