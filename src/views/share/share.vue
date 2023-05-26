<template>
  <div class="share">
    <h1>解放人类大脑!(ChatGPT)</h1>
    <!-- 这里从后端获取url -->
    <img :src="link" alt="" />
    <van-button type="primary" @click="download" >保存图片</van-button>
  </div>
</template>
<script>
import { share } from '../../api/api';

export default {
  name: 'share',
  created() {
    share().then(res => {
      this.link = res.data
    })
  },
  data() {
    return {
      link: ''
    }
  },
  methods: {
    download() {
      const link = document.createElement('a');
      link.href =
        'https://cdn.wujiebantu.com/ai/022FA463FB28DCB4F2DB98ECEE4A1854-01.jpg?imageView2/2/w/800/q/75/format/webp';
      link.download = '分享';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>

<style lang="scss" scoped>
.share {
  width: 366px;
  background: 100% 100%
    url(https://cdn.wujiebantu.com/ai/022FA463FB28DCB4F2DB98ECEE4A1854-01.jpg?imageView2/2/w/800/q/75/format/webp);
  margin: 0 auto;
  background-size: cover;
  text-align: center;
  padding: 100px 0;
  color: #fff;
  display: flex;
  align-items: center;
  flex-direction: column;
  h1 {
    margin-bottom: 20px;
  }
  img {
    display: block;
    margin-bottom: 20px;
  }
}
</style>
