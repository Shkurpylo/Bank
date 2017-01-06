require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,

  db: {
    name: 'bank_db',
    host: 'ds143777.mlab.com',
    port: 43777,
    user: 'forBank',
    password: '1997bankBANK'
  },

  app: {
    title: 'TRUE Bank',
    description: 'ElifTech after building',
    head: {
      titleTemplate: 'Bank: %s',
      meta: [
        {name: 'description', content: 'All the modern best practices in one example.'},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: 'Bank'},
        {property: 'og:locale', content: 'en_US'},
        {property: 'og:title', content: 'Bank'},
        {property: 'og:image:width', content: '200'},
        {property: 'og:image:height', content: '200'}
      ]
    }
  },

}, environment);
