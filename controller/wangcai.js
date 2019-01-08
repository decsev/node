const utils = require('../utils/index');

const { aesEn, aesDe, md5 } = utils;
module.exports = {
  index: async (ctx, next) => {
    await ctx.render("wangcai/index", { title: "数字财经" });
    next();
  },
  first: async (ctx, next) => {
    const { app } = ctx;
    await app.service.wangcai.first('http://caibaojian.com/c/news')
      .then(($) => {
        let links = [];
        $('#content>article').each(function () {
          let title = $(this)
            .find('.entry-title span')
            .text()
          let description = $(this)
            .find('.entry-content p')
            .text()
          let href = $(this)
            .find('.entry-title>a')
            .attr('href')
          let date = $(this)
            .find('.entry-date')
            .text()
          let tmp = {
            title: title,
            description: description,
            date: date,
            url: href
          }
          links.push(tmp)
        })
        ctx.send({
          code: 200,
          data: links,
          msg: ''
        })
      })
      .catch((error) => {
        ctx.send(error);
      })
    next();
  },
  second: async (ctx, next) => {
    const { app } = ctx;
    await app.service.wangcai.second('https://juejin.im/welcome/frontend')
      .then(($) => {
        let links = [];
        $('.entry-list>.item').each(function () {
          let title = $(this)
            .find('.title')
            .text()
          let description = ""
          let href = $(this)
            .find('.title')
            .attr('href')
          let publishTime = $(this)
            .find('.meta-list>li').eq(-2)
            .text()
          let tmp = {
            title: title,
            description: description,
            publishTime: publishTime,
            url: 'https://juejin.im' + href,
            uniqueCode: md5('https://juejin.im' + href),
            dataSource: '掘金前端',
            type: 1,
            cat: 1
          }
          if (tmp.title !== '') {
            links.push(tmp)
          }
        })
        // app.service.wangcai.add(ctx, links);
        ctx.send({
          code: 200,
          data: links,
          msg: ''
        });
      })
      .catch((error) => {
        ctx.send(error);
      })
    next();
  },
  jobbole: async (ctx, next) => {
    const { app } = ctx;
    await app.service.wangcai.second('http://web.jobbole.com/all-posts/')
      .then(($) => {
        let links = [];
        $('#archive>.floated-thumb').each(function () {
          let title = $(this).find('.archive-title').text();
          let description = $(this).find('.excerpt>p').text();
          let href = $(this).find('.archive-title').attr('href')
          let publishTime = $(this).find('.post-meta').text()
          const reg = /\b\d{4}\/\d{2}\/\d{2}\b/;
          const rs_match = publishTime.match(reg);
          publishTime = rs_match[0];
          let tmp = {
            title: title,
            description: description,
            publishTime: publishTime,
            url: href,
            uniqueCode: md5(href),
            dataSource: '伯乐在线',
            type: 2,
            cat: 1
          }
          if (tmp.title !== '') {
            links.push(tmp)
          }
        })
        // app.service.wangcai.add(ctx, links);
        ctx.send({
          code: 200,
          data: links,
          msg: ''
        });
      })
      .catch((error) => {
        ctx.send(error);
      })
    next();
  },
  segmentfault: async (ctx, next) => {
    const { app } = ctx;
    await app.service.wangcai.second('https://segmentfault.com/channel/frontend')
      .then(($) => {
        let links = [];
        $('.news-item').each(function () {
          let title = $(this).find('.news__item-title').text();
          let description = $(this).find('.article-excerpt').text();
          let href = $(this).find('a').attr('href')
          let publishTime = $(this).find('.author').text();
          const reg = /·(.*)$/;
          const rs_match = publishTime.match(reg);
          publishTime = rs_match[1].replace(' ', '');
          let tmp = {
            title: title,
            description: description,
            publishTime: publishTime,
            url: 'https://segmentfault.com' + href,
            uniqueCode: md5('https://segmentfault.com' + href),
            dataSource: 'segmentfault',
            type: 3,
            cat: 1
          }
          if (tmp.title !== '') {
            links.push(tmp)
          }
        })
        // app.service.wangcai.add(ctx, links);
        ctx.send({
          code: 200,
          data: links,
          msg: ''
        });
      })
      .catch((error) => {
        ctx.send(error);
      })
    next();
  },
  fex: async (ctx, next) => {
    const { app } = ctx;
    await app.service.wangcai.second('http://fex.baidu.com/')
      .then(($) => {
        let links = [];
        $('.post-list>li').each(function () {
          let title = $(this).find('p').text();
          let description = '';
          let href = $(this).find('a').attr('href')
          let publishTime = $(this).find('.date').text();
          const reg = /发布于(.*)/;
          const rs_match = publishTime.match(reg);
          publishTime = rs_match[1];
          let tmp = {
            title: title,
            description: description,
            publishTime: publishTime,
            url: 'http://fex.baidu.com' + href,
            uniqueCode: md5('http://fex.baidu.com' + href),
            dataSource: 'FEX',
            type: 4,
            cat: 1
          }
          if (tmp.title !== '') {
            links.push(tmp)
          }
        })
        // app.service.wangcai.add(ctx, links);
        ctx.send({
          code: 200,
          data: links,
          msg: ''
        });
      })
      .catch((error) => {
        ctx.send(error);
      })
    next();
  },
  dingding: async (ctx, next) => {
    const { app } = ctx;
    let params = ctx.request.body;
    let tempData = {
      "msgtype": "markdown",
      "markdown": {
        "title": "今日推文",
        "text": params.content
      },
      "at": {
        "atMobiles": [

        ],
        "isAtAll": params.isAtAll
      }
    };
    await app.service.wangcai.post(`https://oapi.dingtalk.com/robot/send?access_token=${params.token}`, tempData)
      .then((data) => {
        ctx.send({
          code: 200,
          data: data,
          msg: ''
        });
      })
      .catch((error) => {
        ctx.send(error);
      })
  },
  add: async (ctx, next) => {
    const { app } = ctx;
    let params = ctx.request.body;
    const { list } = params;
    const result = await app.service.wangcai.add(ctx, list);
    ctx.send(result);
  }
}