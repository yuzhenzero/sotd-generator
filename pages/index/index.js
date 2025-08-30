// index.js
Page({
  data: {
    displayItems: []
  },

  onLoad() {
    this.loadSettings();
  },

  onShow() {
    // 每次页面显示时重新加载设置
    this.loadSettings();
  },

  loadSettings() {
    const settings = wx.getStorageSync('generatorSettings') || [];
    // 获取上次保存的生成结果
    const lastGeneratedResult = wx.getStorageSync('lastGeneratedResult') || {};
    
    const displayItems = settings
      .filter(item => item.checked)
      .map(item => ({
        id: item.id,
        name: item.name,
        value: lastGeneratedResult[item.id] || '--'
      }));
    
    this.setData({ displayItems });
  },

  getRandomItemFromList(type) {
    const items = wx.getStorageSync(`items_${type}`) || [];
    // 只从选中的物品中随机选择
    const selectedItems = items.filter(item => item.done);
    
    if (selectedItems.length === 0) {
      return '未设置';
    }

    const randomIndex = Math.floor(Math.random() * selectedItems.length);
    return selectedItems[randomIndex].name;
  },

  onGenerate() {
    if (this.data.displayItems.length === 0) {
      wx.showToast({
        title: '请先在设置中选择项目',
        icon: 'none'
      });
      return;
    }

    // 检查是否有可用的物品
    const settings = wx.getStorageSync('generatorSettings') || [];
    const hasNoItems = settings
      .filter(item => item.checked)
      .some(item => {
        const items = wx.getStorageSync(`items_${item.id}`) || [];
        return items.filter(i => i.done).length === 0;
      });

    if (hasNoItems) {
      wx.showToast({
        title: '请先添加并选择物品',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '生成中...'
    });

    // 从每个类型的列表中随机选择一个选中的物品
    setTimeout(() => {
      // 生成新的结果并保存
      const lastGeneratedResult = {};
      const displayItems = this.data.displayItems.map(item => {
        const value = this.getRandomItemFromList(item.id);
        lastGeneratedResult[item.id] = value;
        return {
          ...item,
          value
        };
      });

      // 保存生成结果到本地存储
      wx.setStorageSync('lastGeneratedResult', lastGeneratedResult);
      this.setData({ displayItems });
      
      wx.hideLoading();
      wx.showToast({
        title: '生成成功',
        icon: 'success'
      });
    }, 1500);
  }
});
