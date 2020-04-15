'use strict';
const fs = require('fs')
const Hapi = require('@hapi/hapi');


const init = async () => {

  const server = Hapi.server({
    port: 4321,
    host: 'localhost'
  });

  server.route({
    path: '/',
    method: 'GET',
    handler: (req, h) => ({message: 'Hello Hapi.js'})
  })

  server.route({
    path: '/upload',
    method: 'POST',
    handler: (req, h) => {
      const {payload} = req
      return  handleFileUpload(payload.file)
    },
    options: {
      payload: {
        maxBytes: 1024 * 1024 * 100,
        parse: true,
        output: 'data',
        allow: 'multipart/form-data',
        multipart: true
      }
    }
  })

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

const handleFileUpload = file => {
  return new Promise((resolve, reject) => {
    fs.writeFile('./upload/test.png', file, err => {
      if (err) {
        reject(err)
      }
      resolve({message: 'Upload successfully!'})
    })
  })
}

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();