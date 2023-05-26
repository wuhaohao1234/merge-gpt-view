<template>
  <div>
    <van-row class="order_status">
      <van-col span="6">
        <div class="order_status_icon"
             :style="'background-image:url('+require('../../assets/images/icon/tequan.png')+');background-size:cover'"
             >

        </div>
        <div>剩余免费对话n天</div>
      </van-col>
      <van-col span="6">
        <div class="order_status_icon"
             :style="'background-image:url('+require('../../assets/images/icon/tehui.png')+');background-size:cover'"
             >
        </div>
        <div>每天免费对话n次</div>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import { Row, Col } from 'vant';
import { userIndex } from '@/api/api';

export default {
  name: 'order-group',

  data() {
    return {
      order: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      userIndex().then(res => {
      this.order = res.data.data.order;
      });
    }
  },
  components: {
    [Row.name]: Row,
    [Col.name]: Col
  }
};
</script>


<style scoped lang="scss">
@import '../../assets/scss/mixin';
.order_status {
  background-color: #fff;
  text-align: center;
  padding: 10px 0;
  font-size: 12px;

  > div {
    @include one-border;
    &::after {
      top: 50%;
      left: 50%;
      border-bottom: 0;
      border-right: 1px solid $border-color;
      height: 150%;
      transform: scale(0.5) translate3d(-50%, -50%, 0);
      transform-origin: 0 0;
    }
    &:last-child::after {
      border: 0;
    }
  }

  .order_status_icon {
    position: relative;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: inline-block;
    i {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      font-size: 24px;
      color: #000;
    }
  }
}
</style>
