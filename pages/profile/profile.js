// profile.js
Page({
  data: {
  },
  onLoad() {
    // 页面加载时执行
  },

  onMenuClick(e) {
    const type = e.currentTarget.dataset.type;
    // 根据不同的菜单类型进行处理
    switch(type) {
      case 'pre':
        this.navigateToDetail('pre');
        break;
      case 'razor':
        this.navigateToDetail('razor');
        break;
      case 'blade':
        this.navigateToDetail('blade');
        break;
      case 'brush':
        this.navigateToDetail('brush');
        break;
      case 'soap':
        this.navigateToDetail('soap');
        break;
      case 'bowl':
        this.navigateToDetail('bowl');
        break;
      case 'post':
        this.navigateToDetail('post');
        break;
      case 'generator-settings':
        wx.navigateTo({
          url: '/pages/generator-settings/generator-settings'
        });
        break;
      case 'settings':
        wx.showToast({
          title: '设置功能开发中',
          icon: 'none'
        });
        break;
      case 'about':
        wx.showToast({
          title: '关于功能开发中',
          icon: 'none'
        });
        break;
    }
  },

  navigateToDetail(title) {
    // 根据类型跳转到对应的列表页面
    wx.navigateTo({
      url: `/pages/item-list/item-list?type=${title.toLowerCase()}`
    });
  }
})
