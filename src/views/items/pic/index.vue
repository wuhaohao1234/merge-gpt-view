<template>
  <div>
<!--    <van-cell-group title="AI绘图">
    </van-cell-group>-->
    <van-cell-group title="AI绘画描述：(请输入你的要求)">

      <van-field v-model="content"
                 clearable autosize center
                 placeholder="请输入你的要求，我是AI画家，我可以生成任何图片（推荐以多个具体的关键词和短语来描述，无须使用完整句子）"
                 type="textarea"
                 rows="2"
                 size="large"
      />
    </van-cell-group>
    <van-cell-group title="推荐描述示例：" >
<!--
      <van-button size="normal" plain hairline type="info" @click="submit"  style="border:0px;width: 6rem;margin-left:1rem;margin-top: 1rem;">刷新示例</van-button>
-->
      <van-cell-group >
        <van-button @click="toDesc1" class="ellipsis" text="女孩，动物...." plain type="info" style="width: 24%;border-radius:5px;margin-top:5px;margin-bottom:5px;margin-left: 30px"></van-button>
        <van-button @click="toDesc2" class="ellipsis" plain type="info" text="概念艺术...." style="width: 24%;border-radius:5px;margin-top:5px;margin-bottom:5px;margin-left: 30px"></van-button>
        <van-button @click="toDesc3" class="ellipsis" plain type="info" text="长发，黑发...." style="width: 24%;border-radius:5px;margin-top:5px;margin-bottom:5px;margin-left: 30px"></van-button>
      </van-cell-group>
    </van-cell-group>
    <van-cell-group title="图片形状" >
      <div class="image-shape"  >
        <div :class="['image-shape-item' , shape.shape, { active: shape.active }]" v-for="(shape, index) in shapes" :key="index" @click="handleShape(index)" >
          <div class="shape"></div>
          <span>{{shape.text}}</span>
        </div>
      </div>
    </van-cell-group>
    <van-button size="large" hairline type="primary" @click="submit" style="background: linear-gradient(to right,#ff6034,#ee0a24);border-radius:5px;
    border: 0px;margin-top: 10px;margin-left:10px;right: -28%;width: 40%">生成</van-button>
    <van-cell-group  v-if="isGenerateFlag" title="你要的图：" style="margin-top: 10px" >
      <van-button  v-if="isGenBtnFlag"  loading round type="info" loading-text="正在生成..." />
      <van-image v-if="isGenerateFlag"  lazy-load :src="images"  style="left:3rem;width:20rem;height:100%;background-color: #f2f2f2;padding: 10px 10px" >
        <template v-slot:loading >
          <van-loading size="24px" vertical>图片高清哦，预计最多40s，全力加载中...</van-loading>
        </template>
      </van-image>
    </van-cell-group>

  </div>
</template>

<script>
import { Field , Picker, Popup, Button,Image } from 'vant';
import { chatStreamImg } from '@/api/api';
import Vue from 'vue';
import { Lazyload } from 'vant';

Vue.use(Lazyload, {
  lazyComponent: true,
});

export default {
  data() {
    return {
      mobile: '',
      content: '',
      isGenerateFlag: false,
      isGenBtnFlag: false,
      types:['头像、水精灵、飞溅的深蓝色海洋、高度细致的现实主义数字艺术、艺术潮流、一只雄性人猿肌肉白化狮子的脸冲破了水墙、精细的墨墨西方漫画艺术，2021获奖绘画', '壮丽的树，从远处看，科幻小说，神圣的恐怖,科技感，虚幻的引擎，金属质感，体积光，抬头看，五颜六色，超广角，壮丽，壮观', '优化建议', '其他'],
      type: '',
      show: true,
      index: 0,
      images: '',
      shapes: [
        {
          active: true,
          shape: 'square',
          text: '正方形 1: 1'
        },
        {
          active: false,
          shape: 'rectangle',
          text: '3: 4'
        },
        {
          active: false,
          shape: 'rectangle-replace',
          text: '4: 3'
        },
      ]
    };
  },
  created() {
  },
  methods: {
    toDesc1(){
      this.content="女孩，动物耳朵，刘海，黑色项链，黑发，蓝眼睛，模糊，猫耳朵，项链，闭嘴，睫毛，嘴唇，长发，看观众，肖像，独唱，(闪亮的皮肤)，写实，成熟女性";
    },
    toDesc2(){
      this.content="概念艺术，猫布徽章，电流，圆形，青色配色方案，矢量图形，超现实主义，辛烷渲染，插图";
    },
    toDesc3(){
      this.content="长发，黑发，黑色的眼睛，红色山茶花背景，红色宝石项链，闪闪发光，山茶花背景，山茶花";
    },
    onType(picker, value, index) {
      this.type = value
      this.showList = false
    },
    handleShape(index) {
      this.shapes.forEach((shape,key) => {
        shape.active = key === index;
      });
    },
    submit() {
      if(this.content === ''){
        this.$toast("请输入描述");
        return;
      }
      this.isGenerateFlag=true;
      this.isGenBtnFlag=true;
      this.images='';
      chatStreamImg({content: this.content, type: this.shapes.findIndex(item => item.active === true)}).then(res => {
        this.$toast("生成成功！");
        this.images=res.data.data;
        this.isGenBtnFlag=false;
      }).catch(err => {
        this.$toast({
          message: err.data.errmsg,
          duration: 3000
        });
      });
    }
  },
  components: {
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Button.name]: Button,
    [Image.name]: Image,
    [Picker.name]: Picker
  }
};
</script>


<style lang="scss" scoped>
/* 限制按钮宽度，超出部分省略显示 */
.ellipsis {
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.addressGroup {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
.tuijian{
  width: 20px;
  height: 10px;
}
.bottom_btn {
  position: fixed;
  bottom: 0;
}
.anli{
  color: #3a65ff;
}
.image-shape {
  display: flex;
  padding: 20px;
  padding-bottom: 30px;
  cursor: pointer;
  .image-shape-item {
    border: 1px solid #ccc;
    width: 80px;
    height: 80px;
    border-radius: 5px;
    margin-right: 15px;
    padding: 5px;
    font-size: 12px;
    text-align: center;
    .shape {
      height: 100%;
      background: #ccc;
    }
    span {
      display: inline-block;
      margin-top: 10px;
    }
  }
  .rectangle {
    width: 60px;
  }
  .rectangle-replace {
    width: 110px;
  }
  .active {
    border: 1px solid #1989fa;
    .shape {
      background: #1989fa;
    }
    span {
      color: #1989fa;
    }
  }
}
</style>
