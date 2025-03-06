const api = require('../../utils/api');

Page({
  data: {
    exams: [],
    currentSemester: '2023-2024-1'
  },

  onLoad() {
    this.loadExams();
  },

  loadExams() {
    wx.showLoading({
      title: '加载中',
    });

    api.getExams(this.data.currentSemester)
      .then(exams => {
        // 处理考试状态
        const now = new Date();
        exams.forEach(exam => {
          const examDate = new Date(exam.exam_date + ' ' + exam.end_time);
          exam.status = examDate < now ? 'completed' : 'upcoming';
          exam.time = `${exam.exam_date} ${exam.start_time}-${exam.end_time}`;
        });

        this.setData({ exams });
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
    this.loadExams();
    wx.stopPullDownRefresh();
  }
})