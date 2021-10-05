const response = {

    success: (res, data, message) => {
      const Response = {
        success: true,
        data,
        code: 200,
        message,
      };
      res.status(200).json(Response);
    },
    failed: (res, code) => {
      if (code === 404) {
        const failed = {
          success: false,
          data: null,
          code: 404,
          message: 'data not found',
        };
        res.json(failed);
      } if (code === 401) {
        const failed = {
          success: false,
          data: null,
          code: 401,
          message: 'unauthorized',
        };
        res.status(401).json(failed);
      }
    },
  };
  
  module.exports = response;
  