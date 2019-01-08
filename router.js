const router = require('koa-router')()

module.exports = (app) => {
  // router.get('/test', app.controller.home.crawler);
  // router.get('/', app.controller.home.index);
  // router.get('/home', app.controller.home.home);
  // router.get('/home/:id/:name', app.controller.home.homeParams);
  // router.get('/user', app.controller.home.login);
  // router.post('/user/register', app.controller.home.register);
  router.get('/wangcai/first', app.controller.wangcai.first);
  router.get('/wangcai/second', app.controller.wangcai.second); // 掘金前端
  router.get('/wangcai/jobbole', app.controller.wangcai.jobbole); // 伯乐在线 
  router.get('/wangcai/segmentfault', app.controller.wangcai.segmentfault); // segmentfault 前端
  router.get('/wangcai/fex', app.controller.wangcai.fex); // FEX 百度前端
  router.get('/', app.controller.wangcai.index); // 文章采集页
  router.post('/wangcai/dingding', app.controller.wangcai.dingding); // 发送钉钉信息
  router.post('/wangcai/add', app.controller.wangcai.add); // 把发送过的文章存库

  app.use(router.routes())
    .use(router.allowedMethods())
}