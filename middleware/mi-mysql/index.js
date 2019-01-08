const config = require('../../config.js');
const mysql = require('mysql');

const { database } = config;
module.exports = () => {
  return async (ctx, next) => {
    const pool = mysql.createPool({
      host: database.host,
      user: database.user,
      password: database.password,
      database: database.database
    })
    ctx.mysqlQuery = function (sql, values) {
      return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
          if (err) {
            reject(err)
          } else {
            connection.query(sql, values, (err, rows) => {
              if (err) {
                reject(err)
              } else {
                resolve(rows)
              }
              connection.release()
            })
          }
        })
      })
    }
    await next();
  }
}
