<template>
  <div class="user_module">
    <van-cell-group>
<!--      <van-cell icon="shoucang" title="我的收藏" to="/user/collect" isLink/>-->
      <van-cell icon="kefu" title="联系客服"  @click="showKefu = true" />
      <van-cell icon="kefu" title="意见反馈" to="/user/feedback" isLink/>
      <van-cell icon="team" title="关于我们" to="/user/aboutUs" isLink/>
      <van-cell icon="team" title="邀请好友" to="/share" isLink/>
    </van-cell-group>
    <van-popup v-model="showKefu">
      <van-cell-group>
        <div class="text-desc text-center" style="margin-bottom: 3px;color:black;font-size: large">微信扫一扫</div>
        <van-image style="width: 12rem" src="https://www.xplanx.com/pic/kefu/qrcode.png"></van-image>
      </van-cell-group>
    </van-popup>
  </div>
</template>

<script>
import { Popup, Cell, CellGroup,Image } from 'vant';
export default {
  data() {
    return {
      showKefu: false
    };
  },
  name: 'user-module',
  components: {
    [Popup.name]: Popup,
    [Cell.name]: Cell,
    [Image.name]: Image,
    [CellGroup.name]: CellGroup
  }
};
</script>

<style scoped lang="scss">
.user_module {
  background-color: #fff;
}
.van-popup {
  width: 14.5rem;
  padding: 20px;
  box-sizing: border-box;
}
</style>
