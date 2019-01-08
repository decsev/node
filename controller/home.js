
const Crawler = require("crawler");
module.exports = {
  index: async (ctx, next) => {
    await ctx.render("home/index", { title: "iKcamp欢迎您" });
    next();
  },
  home: async (ctx, next) => {
    console.log(ctx.request.query)
    console.log(ctx.request.querystring)
    ctx.response.body = '<h1>HOME page</h1>'
  },
  homeParams: async (ctx, next) => {
    console.log(ctx.params)
    ctx.response.body = '<h1>HOME page /:id/:name</h1>'
  },
  login: async (ctx, next) => {
    await ctx.render('home/login', {
      btnName: 'GoGoGo'
    })
  },
  register: async (ctx, next) => {
    const { app } = ctx
    let params = ctx.request.body
    let name = params.name
    let password = params.password
    let res = await app.service.home.register(name, password)
    if (res.status == "-1") {
      await ctx.render("home/login", res.data)
    } else {
      ctx.state.title = "个人中心"
      await ctx.render("home/success", res.data)
    }
  },
  crawler: async (ctx, next) => {
    ctx.response.body = '<h1>测试页面</h1>'
    const userList = await ctx.mysqlQuery('select * from user_info where id=1');
    console.log('userList:', userList);
    // const c = new Crawler({
    //   maxConnections: 10,
    //   // 这个回调每个爬取到的页面都会触发
    //   callback: function (error, res, done) {
    //     if (error) {
    //       console.log('error:', error);
    //     } else {
    //       const $ = res.$;
    //       // $默认使用Cheerio
    //       // 这是为服务端设计的轻量级jQuery核心实现
    //       console.log($("title").text());
    //     }
    //     done();
    //   }
    // });

    // 爬取一个URL，使用默认的callback
    // c.queue('http://www.baidu.com');
    // ctx.response.body = '<h1>测试页面</h1>'
  }
}