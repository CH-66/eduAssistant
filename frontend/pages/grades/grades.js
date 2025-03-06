// pages/grades/grades.js
const api = require('../../utils/api');

Page({
  data: {
    scores: [],
    currentSemester: '2023-2024-1'
  },
  onLoad() {
    this.loadScores();
  },
  loadScores() {
    wx.showLoading({
      title: '加载中',
    });

    api.getScores()
      .then(scores => {
        this.setData({ scores });
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
    this.loadScores();
    wx.stopPullDownRefresh();
  }
})