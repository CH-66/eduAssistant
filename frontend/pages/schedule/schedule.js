// pages/schedule/schedule.js
const api = require('../../utils/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courses: {},
    currentWeek: 1,
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    showAddCourseModal: false,
    newCourse: {
      name: '',
      teacher: '',
      location: '',
      day_of_week: 1,
      start_section: 1,
      end_section: 2,
      semester: '2023-2024-1'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadSchedule();
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

  // 加载课表数据
  loadSchedule() {
    wx.showLoading({
      title: '加载中',
    });
    
    api.getSchedule()
      .then(courses => {
        // 将课程数据转换为适合展示的格式
        const formattedCourses = {};
        courses.forEach(course => {
          const key = `${course.start_section}-${course.end_section}-${course.day_of_week}`;
          formattedCourses[key] = course;
        });
        
        this.setData({ courses: formattedCourses });
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

  // 显示添加课程弹窗
  showAddCourseModal() {
    this.setData({ showAddCourseModal: true });
  },

  // 隐藏添加课程弹窗
  hideAddCourseModal() {
    this.setData({ showAddCourseModal: false });
  },

  // 添加自定义课程
  addCustomCourse() {
    const { newCourse } = this.data;
    
    if (!newCourse.name || !newCourse.location) {
      wx.showToast({
        title: '请填写完整课程信息',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: '添加中',
    });
    
    api.addCustomCourse(newCourse)
      .then(() => {
        wx.hideLoading();
        wx.showToast({
          title: '添加成功',
        });
        this.hideAddCourseModal();
        this.loadSchedule(); // 重新加载课表
        
        // 重置表单
        this.setData({
          newCourse: {
            name: '',
            teacher: '',
            location: '',
            day_of_week: 1,
            start_section: 1,
            end_section: 2,
            semester: '2023-2024-1'
          }
        });
      })
      .catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: err.message || '添加失败',
          icon: 'none'
        });
      });
  },

  // 切换周次
  changeWeek(e) {
    const week = parseInt(e.currentTarget.dataset.week);
    this.setData({ currentWeek: week });
    // 实际项目中可能需要根据周次筛选课程
  },

  // 表单输入处理函数
  onCourseNameInput(e) {
    this.setData({ 'newCourse.name': e.detail.value });
  },
  
  onTeacherInput(e) {
    this.setData({ 'newCourse.teacher': e.detail.value });
  },
  
  onLocationInput(e) {
    this.setData({ 'newCourse.location': e.detail.value });
  },
  
  onDayChange(e) {
    this.setData({ 'newCourse.day_of_week': parseInt(e.detail.value) + 1 });
  },
  
  onStartSectionChange(e) {
    this.setData({ 'newCourse.start_section': parseInt(e.detail.value) + 1 });
  },
  
  onEndSectionChange(e) {
    this.setData({ 'newCourse.end_section': parseInt(e.detail.value) + 1 });
  },

  // 编辑课程
  editCourse(e) {
    const { time, day } = e.currentTarget.dataset;
    const [start, end] = time.split('-');
    const key = `${time}-${day}`;
    const course = this.data.courses[key];
    
    if (course) {
      // 如果已有课程，可以实现编辑功能
      wx.showActionSheet({
        itemList: ['查看详情', '删除课程'],
        success: (res) => {
          if (res.tapIndex === 0) {
            // 查看详情
            wx.showModal({
              title: course.name,
              content: `教师: ${course.teacher || '未知'}\n地点: ${course.location}\n时间: 周${day} 第${start}-${end}节`,
              showCancel: false
            });
          } else if (res.tapIndex === 1) {
            // 删除课程（实际项目中需要调用API）
            wx.showModal({
              title: '提示',
              content: '确定要删除该课程吗？',
              success: (res) => {
                if (res.confirm) {
                  // 这里应该调用删除API，目前只是前端删除
                  const courses = { ...this.data.courses };
                  delete courses[key];
                  this.setData({ courses });
                }
              }
            });
          }
        }
      });
    } else {
      // 如果没有课程，可以添加课程
      this.setData({
        'newCourse.day_of_week': parseInt(day),
        'newCourse.start_section': parseInt(start),
        'newCourse.end_section': parseInt(end),
        showAddCourseModal: true
      });
    }
  }
})