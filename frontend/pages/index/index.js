// pages/index/index.js
const api = require('../../utils/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoggedIn: false,
    isBinding: false,
    studentId: '',
    password: '',
    wechatId: '',
    announcements: [],
    todaySchedule: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.checkLoginStatus();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 检查登录状态
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    if (token) {
      this.setData({ isLoggedIn: true });
      this.loadData();
    } else {
      this.setData({ isLoggedIn: false });
      this.handleWechatLogin();
    }
  },
  // 处理微信登录
  handleWechatLogin() {
    wx.login({
      success: (res) => {
        if (res.code) {
          // 使用code获取微信ID（实际项目中需要通过后端接口获取）
          const mockWechatId = 'wx_2021001'
          this.setData({ wechatId: mockWechatId });
          
          api.wechatLogin(mockWechatId)
            .then(res => {
              wx.setStorageSync('token', res.token);
              this.setData({ isLoggedIn: true });
              this.loadData();
            })
            .catch(() => {
              // 未绑定教务系统账号时，显示提示框而不是强制绑定
              wx.showModal({
                title: '提示',
                content: '您还未绑定教务系统账号，绑定后可以查看课表、成绩等信息',
                confirmText: '立即绑定',
                cancelText: '暂不绑定',
                success: (res) => {
                  if (res.confirm) {
                    this.setData({ isBinding: true });
                  } else {
                    // 用户选择不绑定，仍然可以使用基本功能，但不加载需要token的数据
                    this.setData({
                      isLoggedIn: true,
                      announcements: [],
                      todaySchedule: []
                    });
                  }
                }
              });
            });
        }
      }
    });
  },

  // 绑定教务系统账号
  bindAccount() {
    const { studentId, password, wechatId } = this.data;
    if (!studentId || !password) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    api.bindAccount(studentId, password, wechatId)
      .then(res => {
        wx.setStorageSync('token', res.token);
        this.setData({
          isLoggedIn: true,
          isBinding: false
        });
        this.loadData();
      })
      .catch(err => {
        wx.showToast({
          title: err.message || '绑定失败',
          icon: 'none'
        });
      });
  },
  // 加载首页数据
  loadData() {
    // 创建请求数组
    const requests = [api.getAnnouncements()];
    
    // 检查是否有token，只有在有token的情况下才请求课表数据
    const token = wx.getStorageSync('token');
    if (token) {
      requests.push(api.getSchedule());
    }
    
    Promise.all(requests)
      .then((results) => {
        const announcements = results[0];
        let todaySchedule = [];
        
        // 如果获取了课表数据
        if (results.length > 1) {
          const schedule = results[1];
          // 获取今天是周几（0-6，0是周日）
          const today = new Date().getDay() || 7;
          // 过滤出今天的课程
          todaySchedule = schedule.filter(course => course.day_of_week === today);
        }
        
        this.setData({
          announcements,
          todaySchedule
        });
      })
      .catch(err => {
        wx.showToast({
          title: err.message || '数据加载失败',
          icon: 'none'
        });
      });
  },
  // 输入框事件处理
  onStudentIdInput(e) {
    this.setData({ studentId: e.detail.value });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  }
})