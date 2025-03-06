# EduAssistant (教务助手)

## 📝 项目简介

EduAssistant是一个基于微信小程序的教务系统助手，旨在为学生提供更便捷的教务信息查询和管理服务。通过与教务系统对接，学生可以随时查看课表、成绩、考试安排等信息，同时支持自定义课程等个性化功能。

## 🛠 技术栈
### 前端

### 后端
- Flask: Python Web框架
- Flask-CORS: 处理跨域请求
- Flask-JWT-Extended: 处理JWT认证
- SQLAlchemy: ORM工具，用于数据库操作
- MySQL: 关系型数据库

## ✨ 功能特性

- 用户认证
  - 微信登录
  - 教务系统账号绑定
- 课程管理
  - 课表查询
  - 自定义课程
  - 选课功能
- 成绩查询
  - 学期成绩查询
- 考试安排
  - 考试时间查询
  - 考试地点查询
- 个人信息
  - 基本信息查看
- 系统公告
  - 重要通知查看

## 🚀 安装部署

1. 克隆项目
```bash
git clone [项目地址]
cd eduAssistant-api
```

2. 创建虚拟环境并安装依赖
```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

3. 配置环境变量
创建.env文件，添加以下配置：
```
DATABASE_URL=mysql+pymysql://username:password@localhost/edu_assistant
JWT_SECRET_KEY=your-secret-key
```

4. 初始化数据库
```bash
python init_db.py
```

5. 启动服务
```bash
python app.py
```

## 📚 API接口文档

### 认证相关
- POST `/api/auth/wechat-login`: 微信登录
- POST `/api/auth/bind-account`: 绑定教务系统账号

### 课表相关
- GET `/api/schedule`: 获取课表
- POST `/api/schedule/custom`: 添加自定义课程

### 成绩相关
- GET `/api/scores`: 查询成绩

### 选课相关
- GET `/api/courses/available`: 获取可选课程
- POST `/api/courses/select`: 选课

### 考试相关
- GET `/api/exams`: 获取考试安排

### 个人信息
- GET `/api/user/profile`: 获取个人信息

### 公告相关
- GET `/api/announcements`: 获取系统公告

## 📄 开源协议

MIT License

   