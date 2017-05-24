module.exports = {
  name: 'AntD Admin',
  prefix: 'antdAdmin',
  footerText: 'Ant Design Admin  © 2017 zuiidea',
  logo: '/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  baseURL: 'http://localhost:8000/api/dev',
  YQL: ['http://www.zuimeitianqi.com'],
  CORS: ['http://localhost:7000'],
  openPages: ['/login'],
  apiPrefix: '/api/dev',
  api: {
    userLogin: '/login',
    userLogout: '/logout',
    currentUser: '/current_user',
    userInfo: '/userInfo',
    users: '/user',
    user: '/user/:id',
    role: '/role/:id',
    permission: '/permission/:id',
    dashboard: '/dashboard',
  },
}
