const vm = new Vue({
  el: '#app',
  data: {
    type: '1',
    articles: [],
    selectedArticles: [],
    currentTypeSelected: [],
    otherTypeSelected: [],
    allTypeSelected: [],
    loading: false,
    map: {
      1: '/wangcai/second',
      2: '/wangcai/jobbole',
      3: '/wangcai/segmentfault',
      4: '/wangcai/fex'
    },
    sources: {
      1: 'https://juejin.im/welcome/frontend',
      2: 'http://web.jobbole.com/all-posts/',
      3: 'https://segmentfault.com/channel/frontend',
      4: 'http://fex.baidu.com/'
    },
    isInit: false,
    dialogFormVisible: false,
    form: {
      token: '', // https://oapi.dingtalk.com/robot/send?access_token=e34fce0278aaff26762fea09d05f910c0a2f08b16f3d629a46bf0d3294e9b77e
      content: ''
    },
    formLabelWidth: '120px'
  },
  mounted() {
    this.getArticleList();
  },
  watch: {
    type: function () {
      this.getArticleList();
    }
  },
  computed: {

  },
  methods: {
    getArticleList() {
      this.loading = true;
      const url = this.map[this.type];
      request({ url, method: 'get' })
        .then((data) => {
          this.articles = data.data;
          this.loading = false;
          this.isInit = true;
          // 设置选中项
          this.initSelected(); // 设置选中的相关数据
          setTimeout(() => {
            this.toggleSelection();
          }, 500)
        })
        .catch((data) => {
          this.$message.error('出错了哦，', data.message);
          this.loading = false;
        })
    },
    handleSelectionChange(val) {
      if (this.isInit) {
        this.currentTypeSelected = this.currentTypeSelected;
      } else {
        this.currentTypeSelected = val;
      }
      // 设置全部选中
      this.allTypeSelected = this.otherTypeSelected.concat(this.currentTypeSelected);
    },
    toSource() {
      const url = this.sources[this.type];
      window.open(url, '_blank');
    },
    initSelected() {
      this.currentTypeSelected = this.allTypeSelected.filter((item) => {
        return Number(item.type) === Number(this.type);
      })
      this.otherTypeSelected = this.allTypeSelected.filter((item) => {
        return Number(item.type) !== Number(this.type);
      })

    },
    toggleSelection() {
      let rows = [];
      for (let i = 0; i < this.articles.length; i++) {
        for (let j = 0; j < this.currentTypeSelected.length; j++) {
          if (this.currentTypeSelected[j].uniqueCode === this.articles[i].uniqueCode) {
            rows.push(i);
          }
        }
      }
      this.rows = rows;
      if (rows && rows.length > 0) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(this.articles[row], true);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
      this.isInit = false;
    },
    showDialog() {
      const newDate = new Date().format('yyyy-MM-dd')
      this.form.content = `#### ${newDate} 文章推荐\r\n`;
      this.allTypeSelected.forEach((item) => {
        this.form.content += `> \n`
        this.form.content += `> [${item.title}](${item.url}) \n`;
      });
      this.dialogFormVisible = true;
    },
    dingding() {
      request({
        url: '/wangcai/dingding',
        method: 'post',
        data: {
          isAtAll: false,
          content: this.form.content,
          token: this.form.token
        }
      })
        .then((data) => {
          if (data.success) {
            this.$message({
              message: '钉钉群消息发送成功',
              type: 'success'
            });
            this.dialogFormVisible = false;
            this.addArticle();
          }
        })
        .catch((data) => {
          this.$message.error('钉钉群消息发送失败，', data.message);
        })
    },
    addArticle() {
      request({
        url: '/wangcai/add',
        method: 'post',
        data: {
          list: this.allTypeSelected
        }
      })
        .then((data) => {
          if (data.success) {
            this.$message({
              message: '文章入库成功',
              type: 'success'
            });
          }
        })
        .catch((data) => {
          this.$message.error('插入文章失败', data.message);
        })
    }
  }
})
