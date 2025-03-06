// pages/profile/profile.js
const api = require('../../utils/api');

Page({
  data: {
    userInfo: null
  },

  onLoad() {
    this.loadUserProfile();
  },

  loadUserProfile() {
    wx.showLoading({
      title: '加载中',
    });

    api.getProfile()
      .then(userInfo => {
        this.setData({ userInfo });
        wx.hideLoading();
      })
      .catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: err.message || '加载失败',
          icon: 'none'
        });
      });
  },

  onPullDownRefresh() {
    this.loadUserProfile();
    wx.stopPullDownRefresh();
  }
})