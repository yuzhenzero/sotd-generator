// item-list.js
Page({
  data: {
    pageTitle: '',
    type: '',
    newItemName: '',
    items: [],
    inputPlaceholder: '',
    emptyTip: ''
  },

  onLoad(options) {
    // 根据传入的类型设置页面标题和提示文字
    const type = options.type || '';
    const typeConfig = {
      'pre': {
        title: '须前用品列表',
        placeholder: '输入须前用品名称',
        emptyTip: '暂无须前用品，点击下方添加'
      },
      'razor': {
        title: '剃须刀列表',
        placeholder: '输入剃须刀名称',
        emptyTip: '暂无剃须刀，点击下方添加'
      },
      'blade': {
        title: '刀片列表',
        placeholder: '输入刀片名称',
        emptyTip: '暂无刀片，点击下方添加'
      },
      'brush': {
        title: '剃须刷列表',
        placeholder: '输入剃须刷名称',
        emptyTip: '暂无剃须刷，点击下方添加'
      },
      'soap': {
        title: '剃须皂列表',
        placeholder: '输入剃须皂名称',
        emptyTip: '暂无剃须皂，点击下方添加'
      },
      'bowl': {
        title: '剃须碗列表',
        placeholder: '输入剃须碗名称',
        emptyTip: '暂无剃须碗，点击下方添加'
      },
      'post': {
        title: '须后用品列表',
        placeholder: '输入须后用品名称',
        emptyTip: '暂无须后用品，点击下方添加'
      }
    };

    const config = typeConfig[type] || {
      title: '物品列表',
      placeholder: '输入物品名称',
      emptyTip: '暂无物品，点击下方添加'
    };
    
    this.setData({
      pageTitle: config.title,
      type,
      inputPlaceholder: config.placeholder,
      emptyTip: config.emptyTip
    });

    // 加载已保存的物品列表
    this.loadItems();
  },

  loadItems() {
    const items = wx.getStorageSync(`items_${this.data.type}`) || [];
    this.setData({ items });
  },

  saveItems() {
    wx.setStorageSync(`items_${this.data.type}`, this.data.items);
  },

  onInputChange(e) {
    this.setData({
      newItemName: e.detail.value
    });
  },

  getItemTypeName() {
    const typeNames = {
      'pre': '须前用品',
      'razor': '剃须刀',
      'blade': '刀片',
      'brush': '剃须刷',
      'soap': '剃须皂',
      'bowl': '剃须碗',
      'post': '须后用品'
    };
    return typeNames[this.data.type] || '物品';
  },

  onAddItem() {
    const { newItemName, items } = this.data;
    const itemTypeName = this.getItemTypeName();
    const trimmedName = newItemName.trim();
    
    if (!trimmedName) {
      wx.showToast({
        title: `请输入${itemTypeName}名称`,
        icon: 'none'
      });
      return;
    }

    // 检查是否存在重复项（不区分大小写）
    const isDuplicate = items.some(item => 
      item.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      wx.showToast({
        title: `${itemTypeName}已存在`,
        icon: 'error'
      });
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: trimmedName,
      done: true
    };

    this.setData({
      items: [...items, newItem],
      newItemName: ''
    }, () => {
      this.saveItems();
      wx.showToast({
        title: `${itemTypeName}添加成功`,
        icon: 'success'
      });
    });
  },

  onToggleItem(e) {
    const { id } = e.currentTarget.dataset;
    const { items } = this.data;
    const newItems = items.map(item => 
      item.id === id ? { ...item, done: !item.done } : item
    );

    this.setData({ items: newItems }, () => {
      this.saveItems();
    });
  },

  onDeleteItem(e) {
    const { id } = e.currentTarget.dataset;
    const itemTypeName = this.getItemTypeName();
    const item = this.data.items.find(item => item.id === id);
    
    wx.showModal({
      title: '确认删除',
      content: `确定要删除${itemTypeName}"${item.name}"吗？`,
      success: (res) => {
        if (res.confirm) {
          const newItems = this.data.items.filter(item => item.id !== id);
          this.setData({ items: newItems }, () => {
            this.saveItems();
            wx.showToast({
              title: `${itemTypeName}已删除`,
              icon: 'success'
            });
          });
        }
      }
    });
  }
});
