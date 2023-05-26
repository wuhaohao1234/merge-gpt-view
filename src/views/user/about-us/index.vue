<template>
  <div>
<!--    <van-popup v-model="aboutUs">-->
      <van-cell-group>
        <van-cell title="品牌名称" value="机器星球计划" />
        <van-cell title="当前版本" value="XPlanX 4.0"/>
        <van-cell title="企业名称" value="元空间科技有限公司" />
        <van-cell title="企业官网" style="color: blue" value=">>" url="https://www.vspacen.com"/>
<!--        <van-cell title="企业邮箱" value="738696120" />-->
      </van-cell-group>
<!--    </van-popup>-->
  </div>
</template>

<script>
import { Popup, Cell, CellGroup } from 'vant';

export default {
  data() {
    return {
      aboutUs: true
    };
  },

  components: {
    [Popup.name]: Popup,
    [Cell.name]: Cell, 
    [CellGroup.name]: CellGroup    
  }
};
</script>
<style scoped lang="scss">
  .van-popup {
    width: 80%;
    padding: 20px;
    box-sizing: border-box;

  }
</style>