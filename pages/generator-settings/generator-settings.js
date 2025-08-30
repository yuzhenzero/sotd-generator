// generator-settings.js
Page({
  data: {
    items: [
      { id: 'pre', name: '须前', checked: false, required: false },
      { id: 'razor', name: '剃须刀', checked: true, required: true },
      { id: 'blade', name: '刀片', checked: false, required: false },
      { id: 'brush', name: '剃须刷', checked: true, required: true },
      { id: 'soap', name: '剃须皂', checked: true, required: true },
      { id: 'bowl', name: '剃须碗', checked: false, required: false },
      { id: 'post', name: '须后', checked: false, required: false }
    ]
  },

  onLoad() {
    // 从本地存储加载设置
    const settings = wx.getStorageSync('generatorSettings');
    if (settings) {
      const items = this.data.items.map(item => {
        const savedItem = settings.find(s => s.id === item.id);
        return {
          ...item,
          checked: savedItem ? savedItem.checked : item.checked
        };
      });
      this.setData({ items });
    }
  },

  onToggleItem(e) {
    const { id } = e.currentTarget.dataset;
    const { items } = this.data;
    const index = items.findIndex(item => item.id === id);
    
    if (index !== -1 && !items[index].required) {
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        checked: !newItems[index].checked
      };
      this.setData({ items: newItems });
    }
  },

  onCancel() {
    wx.navigateBack();
  },

  onConfirm() {
    // 保存设置到本地存储
    wx.setStorageSync('generatorSettings', this.data.items);
    wx.showToast({
      title: '设置已保存',
      icon: 'success',
      duration: 1500
    });
    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  }
});
