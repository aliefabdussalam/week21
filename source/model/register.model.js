const db = require('../config/db');

const registermodel = {
  getAllData: () => new Promise((resolve, reject) => {
    db.query('select * from users', (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),
  insert: (data) => new Promise((resolve, reject) => {
    const {
      id, username, numberPhone, password,
    } = data;
    db.query(`insert into users (id,username, number_phone, password) 
    value ("${id}","${username}", "${numberPhone}", "${password}")`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        // eslint-disable-next-line no-shadow
        resolve(result, db.query('select * from users'));
      }
    });
  }),
  login: (body) => new Promise((resolve, reject) => {
    const { numberPhone } = body;
    db.query(`select * from users where number_phone = '${numberPhone}'`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),
};
module.exports = registermodel;
