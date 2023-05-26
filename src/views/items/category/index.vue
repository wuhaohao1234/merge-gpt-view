<template>
  <div class="item_list">
    <van-tabs v-model="navActive" @click="handleTabClick">
      <van-tab v-for="(nav, index) in navList" :title="nav.name" :key="index">
        <!--        <van-list v-model="loading"
                  :finished="finished"
                  :immediate-check="false"
                  finished-text="没有更多了"
                  @load="getGoodsList">-->
        <div class="h">
          <div class="name">{{ currentCategory.name }}</div>
          <div class="desc">{{ currentCategory.desc }}</div>
        </div>
        <van-button
          v-show="showExample()"
          @click="inputCase1"
          plain
          type="info"
          style="
            width: 24%;
            border-radius: 5px;
            margin-left: 15%;
            margin-bottom: 10px;
            margin-right: 4px;
          "
          >示例1</van-button
        >
        <van-button
          v-show="showExample()"
          @click="inputCase2"
          plain
          type="info"
          style="width: 24%; border-radius: 5px; margin-right: 4px"
          >示例2</van-button
        >
        <van-button
          v-show="showExample()"
          @click="inputCase3"
          plain
          type="info"
          style="width: 24%; border-radius: 5px"
          >示例3</van-button
        >

        <van-cell-group style="width: 90%; left: 5%; margin-bottom: 20px" v-show="currentCategory.id !== 1040007">
          <van-field
            v-model="content"
            clearable
            autosize
            center
            placeholder="请输入...(你的要求越多、越详细，我回答的越好)"
            type="textarea"
            rows="3"
            size="large"
            style="background-color: #fff; border-radius: 10px"
          />
        </van-cell-group>
        <!-- 小说创作 -->
         <div class="wirteList" v-show="currentCategory.id === 1040007">
           <Fiction />
         </div>
        <!-- 写作 -->
        <div class="wirteList" v-show="currentCategory.id === 1040001">
          <van-button @click="handleClearContent">清空</van-button>
          <h4>可以这样提出您的要求：</h4>
          <ul>
            <li
              v-for="(item, key) in wirteList"
              :key="key"
              @click="handleAddContent(item)"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <!-- 改写 -->
        <div class="wirteList" v-show="currentCategory.id === 1040002">
          <van-button @click="handleClearContent">清空</van-button>

          <p style="border-bottom: 1px solid #ccc;padding-bottom: 10px;">{{ reviseText }}{{ reviseModalText }}</p>
          <h4>选择语气</h4>
          <div class="container">
            <van-button
              @click="handleRevise(key)"
              v-for="(item, key) in reviseModal"
              :key="key"

              style="border-radius: 10px;"
              :type="item.active ? 'primary' : 'default'"
              >{{ item.text }}</van-button
            >
          </div>

          <h4>可以这样提出您的要求：</h4>
          <ul>
            <li
              v-for="(item, key) in reviseList"
              :key="key"
              @click="handleReviseContent(item)"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <!-- 内容补全 -->
        <div class="wirteList" v-show="currentCategory.id === 1040003">
          <van-button @click="handleClearContent">清空</van-button>

          <h4>选择语气</h4>
          <div class="container">
            <van-button
              @click="handleRevise(key)"
              v-for="(item, key) in reviseModal"
              :key="key"
              style="border-radius: 10px;"
              :type="item.active ? 'primary' : 'default'"
              >{{ item.text }}</van-button
            >
          </div>

          <h4>可以这样提出您的要求：</h4>
          <ul>
            <li
              v-for="(item, key) in contentList"
              :key="key"
              @click="handleChangeContent(item)"
            >
              {{ item }}
            </li>
          </ul>
        </div>

        <van-button
          size="large"
          type="primary"
          @click="submit"
          v-show="currentCategory.id !== 1040007"
          style="
            right: -30%;
            width: 40%;
            background: linear-gradient(to right, #ff6034, #ee0a24);
            border: 0px;
            border-radius: 5px;
          "
          >生成</van-button
        >

        <van-cell-group style="width: 90%; left: 5%; margin-bottom: 20px">
          <van-field
            id="messages"
            v-model="contentG"
            v-if="isGenFlagContentShow"
            clearable
            autosize
            center
            placeholder="正在生成..."
            type="textarea"
            rows="3"
            size="large"
            style="
              background-color: #fff;
              border-radius: 10px;
              margin-top: 10px;
            "
          />
          <van-button
            v-if="isGenerateFlag"
            loading
            round
            type="info"
            loading-text="正在生成..."
          />
        </van-cell-group>

        <van-button
          size="large"
          type="primary"
          v-if="isCopyFlagBtnShow"
          v-clipboard:copy="contentG"
          v-clipboard:success="firstCopySuccess"
          v-clipboard:error="firstCopyError"
          style="
            right: -30%;
            width: 40%;
            background: linear-gradient(to right, #ff6034, #ee0a24);
            border: 0px;
            border-radius: 5px;
          "
          >复制</van-button
        >

        <!--          <van-card v-for="(item, i) in goodsList"
                    :key="i"
                    :desc="item.brief"
                    :title="item.name"
                    :thumb="item.picUrl"
                    :price="item.retailPrice"
                    :origin-price="item.counterPrice"
                    @click="itemClick(item.id)" />-->
        <!--        </van-list>-->
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import {
  feedbackAdd,
  goodsCategory,
  goodsList,
  changJingCaseList,
  detailStreamChat,
} from '@/api/api';
import { Card, List, Tab, Tabs, Field, Button, Toast } from 'vant';
import VueClipBoard from 'vue-clipboard2';
import cacheUtil from '@/utils/cacheUtil';
import Fiction from './components/fiction.vue';
const { config, read, save } = cacheUtil;
import Vue from 'vue';
Vue.use(VueClipBoard); //必须这样子引用 否则会报错的
let messageDom = null;
export default {
  name: 'Item-list',
  props: {
    itemClass: {
      type: [String, Number],
      default: '',
    },
  },

  data() {
    return {
      categoryId: this.itemClass,
      goodsList: [],
      // 滚动到底部
      scrollLock: false,
      content: '',
      contentG: '',
      bGenerate: true,
      page: 0,
      limit: 10,
      currentCategory: {},
      navList: [],
      navActive: 0,
      isGenerateFlag: false,
      isGenFlagContentShow: false,
      isCopyFlagBtnShow: false,
      loading: false,
      timer: null, //settimeout
      finished: false,
      wirteList: [
        '父亲为了子女上学而四处打工的艰辛',
        '中国成为世界第二大经济体',
        '每个人应追求感情、知识、人格、成就的完整',
        '紧密围绕“我的深圳故事”为核心主题，描述平凡真实的身边人、身边物、身边事',
        '北京奥运会成功举办、2012年伦敦奥运会取得优异成绩',
        '神舟系列发射成功、嫦娥登月计划、蛟龙号深潜成功',
      ],
      reviseList: [
        '帮我把这段话增加一些古文色彩，体现音韵美。',
        '这工作周报太直白了，帮我表达地更正式一些。',
        '将这份短视频文案，加工的更吸引人一些。',
        '希望这段宣传语能简练一些，易读且易记。',
      ],
      reviseModal: [
        {
          active: true,
          text: '严肃',
        },
        {
          active: false,
          text: '高兴',
        },
        {
          active: false,
          text: '调皮',
        },
        {
          active: false,
          text: '沮丧',
        },
        {
          active: false,
          text: '生气',
        },
      ],
      contentList: [
        '写一首诗歌，《黄昏里》 \b 叫响的鸟雀，衔着沉闷的黄昏， \b 云疏远天空的时候，风也疏远了我。',
        '以下是初创公司以运营增长为主题的博客大纲：\b 1. 简介 \b 6. 结论',
        '如何提高领导能力？有几点要素你一定要知道：\b 1.清点你的领导技能 \b 5.培养你的人际交往能力',
        '如何提高领导能力？有几点要素你一定要知道：\b 1.清点你的领导技能 \b 5.培养你的人际交往能力',
        '以下是在抖音涨粉的步骤与诀窍：\b 1.注册抖音 \b 恭喜你，即将获得第一个1W粉丝。',
      ],
      reviseText: '帮我把这段话增加一些古文色彩，体现音韵美。',
      reviseModalText: '严肃',

      storyBackgroundText: '',
      characterRelationshipsText: '',
      plotOptionsText: '',
      preambleText: '',
      plotDescrptionText: '',
      isGenerateStoryBackground: false,
      isGeneratecharacterRelationships: false,
      wordCount: 300
      // 玄幻奇幻武侠仙侠都市言情历史军事体育科幻悬疑
      // 平静稳重慷慨激昂热情奔放轻松自如慢条斯理愤怒沮丧轻蔑嘲讽富有幽默感神秘的纯真的痴情的钦佩的悲伤的高兴的幸福的愤怒的紧张的友善的严谨的情感化世俗化夸张的惊悚的
    };
  },

  created() {
    this.init();
  },

  methods: {
    changeWord(num) {
      this.wordCount = num
    },
    generatecharacterRelationships() {
      this.isGeneratecharacterRelationships = true
      this.submit()
    },
    generateStoryBackground() {
      this.isGenerateStoryBackground = true
      this.submit()
    },
    handleTabClick(index) {
      this.categoryId = this.navList[index].id;
      this.$router.replace({
        name: 'category',
        query: { itemClass: this.categoryId },
      });
      this.init();
      //
      this.cleanText();
      this.content = '';
    },
    cleanText() {
      //清除生成的文本
      this.contentG = '';
      this.isGenFlagContentShow = false;
      this.isCopyFlagBtnShow = false;
    },
    init() {
      goodsCategory({ id: this.categoryId }).then((res) => {
        this.navList = res.data.data.brotherCategory;
        this.currentCategory = res.data.data.currentCategory;

        // 当id是L1分类id时，这里需要重新设置成L1分类的一个子分类的id
        if (res.data.data.parentCategory.id == this.categoryId) {
          this.categoryId = res.data.data.currentCategory.id;
        }

        for (let i = 0; i < this.navList.length; i++) {
          if (this.navList[i].id == this.categoryId) {
            this.navActive = i;
            break;
          }
        }
        this.page = 0;
        this.goodsList = [];
        this.changJingCaseList();
      });
    },
    changJingCaseList() {
      this.page++;
      changJingCaseList({
        categoryId: this.categoryId,
        pageNum: this.page,
        pageSize: this.limit,
      }).then((res) => {
        this.goodsList.push(...res.data.data.rows);
        this.loading = false;
        this.finished = res.data.data.page >= res.data.data.pages;
      });
    },
    itemClick(id) {
      this.$router.push(`/items/detail/${id}`);
    },
    firstCopySuccess() {
      Toast('复制成功!');
    },
    firstCopyError() {
      Toast('复制失败!');
    },
    inputCase1() {
      this.content = this.goodsList[0].caseContent;
      this.cleanText();
    },
    inputCase2() {
      this.content = this.goodsList[1].caseContent;
      this.cleanText();
    },
    inputCase3() {
      this.content = this.goodsList[2].caseContent;
      this.cleanText();
    },
    handleAddContent(item) {
      this.content = item;
    },
    handleClearContent() {
      this.content = '';
    },
    handleReviseContent(item) {
      this.reviseText = item;
    },
    handleRevise(index) {
      this.reviseModal.forEach((item, key) => {
        item.active = index === key;
        this.reviseModalText = this.reviseModal[index].text;
      });
    },
    handleChangeContent(item) {
      this.content = item;
    },
    submit() {
      if (this.content === '' && !this.isGenerateStoryBackground && !this.isGeneratecharacterRelationships) {
        this.$toast('请输入内容');
        return;
      }
      let promat = '';
      if (this.currentCategory.id === 1040002) {
        promat =
          '使用' +
          this.reviseText +
          '要求' +
          '使用' +
          this.reviseModalText +
          '语气';
      }
      if (this.isGenerateStoryBackground) {
        promat = '帮我生成故事背景0-50字'
      }
      if (this.isGeneratecharacterRelationships) {
        promat = '帮我生成人际关系0-50字'
      }
      if (this.currentCategory.id === 1040003) {
        promat = '使用' + this.reviseModalText + '语气';
      }
      this.contentG = '';
      this.isGenerateFlag = true;
      this.isGenFlagContentShow = true;

      // 使用 fetch API 获取响应流
      fetch('https://api.n0ts.top/chatgpt-stream', {
        method: 'POST',
        body: JSON.stringify({
          key: config.key,
          model: config.data.model,
          messages: [
            {
              role: 'user',
              content:
                this.currentCategory.changjing_desc + this.content + promat,
            },
            {
              role: 'assistant',
              content: '',
            },
          ],
          timeout: 60000,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          // 获取 ReadableStream 对象
          const stream = response.body;

          // 获取流的阅读器
          const reader = stream.getReader();
          const decoder = new TextDecoder('utf-8');
          // 定义接受返回数据的函数
          const processStream = () => {
            reader.read().then((result) => {
              // 处理返回的数据
              const message = result.value;
              const decodeContent = decoder.decode(message);

              // done
              if (decodeContent.includes('data: [DONE]')) {
                Toast('生成完毕！');
                this.isGenerateFlag = false;
                this.isCopyFlagBtnShow = true;
                this.scrollToBottom();
                return;
              }

              if (decodeContent) {
                // 在这里将返回的消息添加到页面中
                decodeContent
                  .replaceAll('data: ', '')
                  .split('\n')
                  .filter(Boolean)
                  .forEach(async (item) => {
                    const itemObj = JSON.parse(item);
                    if (!itemObj.choices[0].delta.content) {
                      return;
                    }
                    const str = itemObj.choices[0].delta.content;
                    if (this.isGenerateStoryBackground) {
                      this.storyBackgroundText += str
                    }
                    if(this.isGeneratecharacterRelationships) {
                      this.characterRelationshipsText += str
                    } else {
                      this.contentG += str;
                    }
                    this.scrollToBottom();
                  });
              } else {
                Toast('生成完毕！');
                this.isGenerateFlag = false;
                this.isCopyFlagBtnShow = true;
              }
              // 持续读取数据
              processStream();
            });
          };
          // 开始持续读取数据
          processStream();
        })
        .catch((err) => {
          console.log('error:', err);
        });
    },

    /* 滚动到底部 */
    scrollToBottom() {
      if (this.scrollLock) {
        return;
      }
      this.scrollLock = true;
      setTimeout(() => {
        this.scrollLock = false;
        messageDom = document.querySelector('#messages');
        if (messageDom) {
          messageDom.scrollTo({
            top: messageDom.scrollHeight,
            behavior: 'smooth',
          });
        } else {
          this.scrollToBottom();
        }
      }, 300);
    },
    appear(content) {
      const _this = this;

      this.contentG = '';
      clearTimeout(this.timer);

      var speed = 50; //设置定时的速度 越来越快
      var count = 1;

      function changeContent() {
        _this.contentG = content.substring(0, count); //截取字符串
        count++;

        if (count != content.length + 1) {
          speed -= 1;
          if (speed < 5) speed = 5;

          _this.timer = setTimeout(changeContent, speed);
        }
      }
      changeContent();
      Toast('生成完毕！');
      this.isGenerateFlag = false;
      this.isCopyFlagBtnShow = true;
    },
    showExample() {
      return ![1040001, 1040002, 1040003, 1040007].includes(
        this.currentCategory.id
      );
    },
  },

  components: {
    [Button.name]: Button,
    [Field.name]: Field,
    [List.name]: List,
    [Card.name]: Card,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    Fiction
  },
};
</script>

<style lang="scss" scoped>
/*.van-cell-group__title{
  margin-left:8rem
}*/
.item_list {
  background-color: #f2f2f2;
}

.h {
  height: 100px;
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.h .name {
  display: block;
  height: 30px;
  margin-bottom: 10px;
  font-size: 20px;
  color: #333;
}

.h .desc {
  display: block;
  height: 24px;
  font-size: 16px;
  color: #999;
}
.wirteList {
  width: 90%;
  margin: 0 auto;
  .container {
    .van-button {
      margin-right: 10px;
      width: 80px;
    }
  }
  .van-button {
    margin-bottom: 10px;
  }
  h4 {
    margin-bottom: 10px;
  }
  ul {
    list-style-type: disc;
    li {
      list-style: square;
      color: #999;
      padding: 10px;
      font-size: 13px;
      cursor: pointer;
    }
  }
}
.novel {
  .writeHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
}
.select-plot {
  .van-button {
    width: 80px;
    margin-right: 20px;
  }
}
</style>
