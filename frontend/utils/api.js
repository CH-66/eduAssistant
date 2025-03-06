// api.js
const BASE_URL = 'http://localhost:5000';

const request = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token');
    if (token) {
      options.header = {
        ...options.header,
        'Authorization': `Bearer ${token}`
      };
    }

    wx.request({
      url: `${BASE_URL}${url}`,
      ...options,
      success: (res) => {
        if (res.statusCode === 401) {
          wx.removeStorageSync('token');
          wx.redirectTo({
            url: '/pages/index/index'
          });
          reject(new Error('未授权，请重新登录'));
        } else if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '请求失败'));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

const api = {
  // 认证相关
  wechatLogin: (wechatId) => {
    return request('/api/auth/wechat-login', {
      method: 'POST',
      data: { wechat_id: wechatId }
    });
  },

  bindAccount: (studentId, password, wechatId) => {
    return request('/api/auth/bind-account', {
      method: 'POST',
      data: { student_id: studentId, password, wechat_id: wechatId }
    });
  },

  // 课表相关
  getSchedule: () => {
    return request('/api/schedule');
  },

  addCustomCourse: (courseData) => {
    return request('/api/schedule/custom', {
      method: 'POST',
      data: courseData
    });
  },

  // 成绩相关
  getScores: () => {
    return request('/api/scores');
  },

  // 选课相关
  getAvailableCourses: () => {
    return request('/api/courses/available', {
      method: 'GET'
    });
  },

  selectCourse: (courseId, semester) => {
    return request('/api/courses/select', {
      method: 'POST',
      data: { course_id: courseId, semester }
    });
  },

  // 考试相关
  getExams: (semester) => {
    return request('/api/exams', {
      method: 'GET',
      data: { semester }
    });
  },

  // 个人信息相关
  getProfile: () => {
    return request('/api/user/profile', {
      method: 'GET'
    });
  },

  // 公告相关
  getAnnouncements: () => {
    return request('/api/announcements', {
      method: 'GET'
    });
  }
};

module.exports = api;