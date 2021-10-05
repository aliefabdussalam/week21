const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const registermodel = require('../model/register.model');
const { success, failed } = require('../helper/respon');

const register = {
  getAllData: (req, res) => {
    try {
      registermodel.getAllData().then((result) => {
        success(res, result, 'success');
      }).catch((err) => {
        failed(res, 404, err);
      });
    } catch (error) {
      console.log(error)
      failed(res, 404, error);
    }
  },
  insert: (req, res) => {
    try {
      const { body } = req;
      bcrypt.hash(body.password, 10, (err, hash) => {
        if (err) {
          console.log(err);
        } else {
          const data = {
            username: body.username,
            numberPhone: body.numberPhone,
            password: hash,
          };

          registermodel.insert(data).then((result) => {
            success(res, result, 'success');
          }).catch((error) => {
            failed(res, 404, error);
          });
        }
      });
    } catch (error) {
      failed(res, 401, error);
    }
  },
  login: (req, res) => {
    try {
      const { body } = req;
      console.log(body);
      registermodel.login(body).then((result) => {
        if (result.length <= 0) {
          res.status(404).json('email not found');
        } else {
          const hash = result[0].password;
          bcrypt.compare(body.password, hash, (error, checkpass) => {
            if (error) {
              res.json(error);
            } else if (checkpass === true) {
              const user = result[0];
              const payload = {
                id: user.id,
              };
              const token = jwt.sign(payload, 'secret');
              success(res, result, token);
            } else {
              res.json('password incorrect');
            }
          });
        }
      });
    } catch (error) {
      failed(res, 401, error);
    }
  },
};
module.exports = register;
