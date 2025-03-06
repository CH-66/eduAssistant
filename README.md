# EduAssistant (教务助手)

## 📝 项目简介

EduAssistant是一个基于微信小程序的教务系统助手，旨在为学生提供更便捷的教务信息查询和管理服务。通过与教务系统对接，学生可以随时查看课表、成绩、考试安排等信息，同时支持自定义课程等个性化功能。

## 🛠 技术栈
### 前端
- 微信小程序原生框架
- Promise封装的网络请求库
- JWT身份验证
- ES6+语法支持
- PostCSS样式处理

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

### 后端部署
1. 克隆项目
```bash
git clone [项目地址]
cd eduAssistant-api/backend
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
DATABASE_URL=mysql+pymysql://用户名:密码@localhost/edu_assistant
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
服务将在 http://localhost:5000 运行

### 前端部署
1. 安装微信开发者工具
从[微信官方](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)下载并安装

2. 导入项目
- 打开微信开发者工具
- 选择「导入项目」
- 选择项目目录 `eduAssistant-api/frontend`
- 填入小程序AppID（在project.config.json中配置）

3. 配置开发环境
- 修改 `utils/api.js` 中的 `BASE_URL` 为后端服务地址

4. 预览和调试
- 点击开发者工具的「预览」按钮，使用微信扫码即可在手机上预览
- 可以使用开发者工具的调试功能进行代码调试

## 📄 许可证

[MIT License](LICENSE)

   