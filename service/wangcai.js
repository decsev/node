const cheerio = require('cheerio');
const request = require('request');
const Iconv = require('iconv-lite')
const Crawler = require('crawler');

module.exports = {
  post: (url, data) => {
    return new Promise((resolve, reject) => {
      request.post({
        url,
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      }, function (err, response, body) {
        if (response && response.statusCode === 200) {
          body += body.toString('utf8');
          resolve(body);
        } else {
          reject({
            code: 404,
            msg: '网络好像有点问题'
          })
        }
      })
    })
  },
  first: (url) => {
    return new Promise((resolve, reject) => {
      request(
        {
          url: url,
          encoding: null
        },
        function (error, response, body) {
          if (response && response.statusCode === 200) {
            body = Iconv.decode(body, 'utf-8');
            let $ = cheerio.load(body);
            resolve($);
          } else {
            reject({
              code: 404,
              msg: '网络好像有点问题'
            })
          }
        }
      )
    })
  },
  second: (url) => {
    return new Promise((resolve, reject) => {
      const c = new Crawler({
        rateLimit: 2000,
        maxConnections: 1,
        callback: function (error, res, done) {
          if (error) {
            console.log(error);
            reject({
              code: 404,
              msg: '网络好像有点问题'
            })
          } else {
            const $ = res.$;
            resolve($);
          }
          done();
        }
      });
      c.queue(url);
    })
  },
  add: async (ctx, data) => {
    const uniqueCodeArr = await ctx.mysqlQuery('SELECT uniqueCode from article');
    let exitCode = [];
    for (let i = 0; i < uniqueCodeArr.length; i++) {
      exitCode.push(uniqueCodeArr[i].uniqueCode);
    }
    let sql = 'INSERT INTO article(title, publishTime, addTime, url, description, uniqueCode, cat, dataSource) VALUES';
    let params = '';
    const addTime = new Date().getTime();
    (data || []).forEach((item, index) => {
      if (exitCode.indexOf(item.uniqueCode) === -1) {
        params += (params === '' ? '' : ',') + `('${item.title}', '${item.publishTime}', ${addTime}, '${item.url}', '${item.description}', '${item.uniqueCode}', 1, '${item.dataSource}')`;
      }
      exitCode.push(item.uniqueCode);
    });

    if (params === '') {
      return {
        code: 200,
        msg: '库内已存，没有新的数据需要插入'
      }
    } else {
      let result = await ctx.mysqlQuery(sql + params);
      return result;
    }

  }
}