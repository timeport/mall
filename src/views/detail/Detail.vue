<template>
  <div id="detail">
    <detail-nav-bar class="nav-bar" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" @scorll="contentScroll" :probeType="3">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";
  // import BackTop from "components/common/backTop/BackTop";

  import {getDetail,getRecommend,GoodsInfo,Shop,GoodsParam} from "network/detail";

  import Scroll from "components/common/scroll/scroll";
  import GoodsList from "components/common/goods/GoodsList";
  import {itemListenerMixin,topBackMixin} from "common/mixin";
  import {debounce} from "common/Utils";

  import {mapActions} from 'vuex'



  export default {
    name: "Detail",
    mixins: [itemListenerMixin,topBackMixin],
    components: {
      // BackTop,
      DetailBottomBar,
      GoodsList,
      DetailCommentInfo,
      DetailParamInfo,
      DetailGoodsInfo,
      Scroll,
      DetailShopInfo,
      DetailBaseInfo,
      DetailSwiper,
      DetailNavBar
    },
    data() {
      return {
        iid:null,
        topImages:[],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        // isShowBackTop: false,
        currentIndex: 0
      }
    },
    created() {
      this.iid = this.$route.params.iid
      // console.log(this.iid);
      getDetail(this.iid).then(res=>{
        console.log(res);
        const data = res.result;
        // 获取顶部的图片轮播数据
        this.topImages = data.itemInfo.topImages
        // 获取商品信息
        this.goods = new GoodsInfo(data.itemInfo, data.columns, data.shopInfo.services)
        // 创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)
        //保存商品的详情数据
        this.detailInfo = data.detailInfo
        // 获取参数的信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
        // 获取评论的信息
        if(data.rate.cRate !== 0){
          this.commentInfo = data.rate.list[0]
        }
      })

      //请求推荐数据
      getRecommend().then(res=>{
        console.log(res);
        this.recommends = res.data.list;
      })


      //防抖得到各个组件的高度
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
        console.log(this.themeTopYs);
      },200)
    },
    mounted() {

    },
    updated() {

    },
    destroyed() {
      //离开时监听itemImageLoad关闭
      this.$bus.$off('itemImageLoad',this.itemListener)
    },
    methods: {
      ...mapActions(['addCart']),
      imageLoad() {
        this.newRefresh()
        // console.log('imageLoad');
        this.getThemeTopY()
      },
      // backClick() {
      //   this.$refs.scroll.scrollTo(0,0,800)
      // },
      titleClick(index) {
        // console.log(index);
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],1000)
      },
      addToCart() {
        const product = {}
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;

        // this.$store.commit('addCart',product)
        // this.$store.dispatch('addCart',product)
        this.addCart(product).then(res=>{
          this.$toast.show(res,3000)
          // console.log(res);
        })
        // console.log('addToCart');
      },
      contentScroll(position) {
        // this.isShowBackTop = (-position.y) > 1000
        this.listenerShowBackTop(position)
        const positionY = -position.y;
        let length = this.themeTopYs.length;
        for (let i = 0; i < length; i++) {
          // if((this.currentIndex !== i) &&
          //   ((i < length -1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) || (i === length -1 && positionY >= this.themeTopYs[i]))){
          //   this.currentIndex = i;
          //   this.$refs.nav.currentIndex = this.currentIndex
          // }
          if(positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]){
              this.currentIndex = i;
              this.$refs.nav.currentIndex = this.currentIndex
          }
        }
      }
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .nav-bar {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content {
    /*height: calc(100% - 44px);*/
    position: absolute;
    top: 44px;
    left: 0px;
    right: 0px;
    bottom: 49px;
  }
</style>
