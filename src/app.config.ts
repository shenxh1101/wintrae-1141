export default defineAppConfig({
  pages: [
    'pages/publish/index',
    'pages/square/index',
    'pages/appointment/index',
    'pages/message/index',
    'pages/profile/index',
    'pages/detail/index',
    'pages/handover/index',
    'pages/org/index',
    'pages/pickpoint/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#07c160',
    navigationBarTitleText: '公益物资捐赠',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#07c160',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/publish/index',
        text: '发布'
      },
      {
        pagePath: 'pages/square/index',
        text: '需求广场'
      },
      {
        pagePath: 'pages/appointment/index',
        text: '预约'
      },
      {
        pagePath: 'pages/message/index',
        text: '消息'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})
