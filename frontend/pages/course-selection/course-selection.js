const api = require('../../utils/api');

Page({
  data: {
    courses: [],
    filteredCourses: [],
    selectedCourses: [],
    totalCredits: 0,
    currentFilter: 'all',
    searchKeyword: '',
    currentSemester: '2023-2024-1'
  },

  onLoad() {
    this.loadAvailableCourses();
  },

  loadAvailableCourses() {
    wx.showLoading({
      title: '加载中',
    });

    api.getAvailableCourses()
      .then(courses => {
        // 处理课程数据，添加额外信息
        courses.forEach(course => {
          course.selected = false;
          course.time = `周${course.day_of_week} 第${course.start_section}-${course.end_section}节`;
          // 假设每门课程的学分为默认值，实际应从API获取
          course.credits = course.credits || 2;
        });

        this.setData({ 
          courses: courses,
          filteredCourses: courses
        });
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

  // 搜索课程
  searchCourse(e) {
    const keyword = e.detail.value.toLowerCase();
    this.setData({ searchKeyword: keyword });
    this.filterCourses();
  },

  // 设置过滤器
  setFilter(e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({ currentFilter: filter });
    this.filterCourses();
  },

  // 根据关键词和过滤器筛选课程
  filterCourses() {
    const { courses, currentFilter, searchKeyword } = this.data;
    
    let filtered = courses;
    
    // 按关键词筛选
    if (searchKeyword) {
      filtered = filtered.filter(course => 
        course.name.toLowerCase().includes(searchKeyword) || 
        course.teacher.toLowerCase().includes(searchKeyword)
      );
    }
    
    // 按课程类型筛选
    if (currentFilter !== 'all') {
      const type = currentFilter === 'required' ? '必修' : '选修';
      filtered = filtered.filter(course => course.course_type === type);
    }
    
    this.setData({ filteredCourses: filtered });
  },

  // 切换课程选择状态
  toggleCourseSelection(e) {
    const courseId = e.currentTarget.dataset.id;
    const { courses, selectedCourses } = this.data;
    
    // 找到对应课程
    const courseIndex = courses.findIndex(c => c.id === courseId);
    if (courseIndex === -1) return;
    
    const course = courses[courseIndex];
    const isSelected = !course.selected;
    
    // 更新课程选择状态
    const updatedCourses = [...courses];
    updatedCourses[courseIndex].selected = isSelected;
    
    // 更新已选课程列表
    let updatedSelectedCourses = [...selectedCourses];
    let updatedTotalCredits = this.data.totalCredits;
    
    if (isSelected) {
      updatedSelectedCourses.push(course);
      updatedTotalCredits += course.credits;
    } else {
      updatedSelectedCourses = updatedSelectedCourses.filter(c => c.id !== courseId);
      updatedTotalCredits -= course.credits;
    }
    
    this.setData({
      courses: updatedCourses,
      filteredCourses: this.getFilteredCourses(updatedCourses),
      selectedCourses: updatedSelectedCourses,
      totalCredits: updatedTotalCredits
    });
  },

  // 获取当前筛选条件下的课程
  getFilteredCourses(courses) {
    const { currentFilter, searchKeyword } = this.data;
    
    let filtered = courses;
    
    // 按关键词筛选
    if (searchKeyword) {
      filtered = filtered.filter(course => 
        course.name.toLowerCase().includes(searchKeyword) || 
        course.teacher.toLowerCase().includes(searchKeyword)
      );
    }
    
    // 按课程类型筛选
    if (currentFilter !== 'all') {
      const type = currentFilter === 'required' ? '必修' : '选修';
      filtered = filtered.filter(course => course.course_type === type);
    }
    
    return filtered;
  },

  // 提交选课
  submitSelection() {
    if (this.data.selectedCourses.length === 0) {
      wx.showToast({
        title: '请先选择课程',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: '提交中',
    });
    
    // 创建选课请求队列
    const promises = this.data.selectedCourses.map(course => 
      api.selectCourse(course.id, this.data.currentSemester)
    );
    
    Promise.all(promises)
      .then(() => {
        wx.hideLoading();
        wx.showToast({
          title: '选课成功',
        });
      })
      .catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: err.message || '选课失败',
          icon: 'none'
        });
      });
  },

  onPullDownRefresh() {
    this.loadAvailableCourses();
    wx.stopPullDownRefresh();
  }
})