# 教务助手API文档

## 基础信息

- 基础URL: `http://localhost:5000`
- 认证方式: JWT Token (在请求头中添加 `Authorization: Bearer {token}`)

## 认证相关接口

### 微信授权登录

- **URL**: `/api/auth/wechat-login`
- **方法**: POST
- **描述**: 通过微信ID进行登录认证

#### 请求参数

```json
{
  "wechat_id": "wx123456789"
}
```

#### 成功响应 (200 OK)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 失败响应 (401 Unauthorized)

```json
{
  "message": "请先绑定教务系统账号"
}
```

### 绑定教务系统账号

- **URL**: `/api/auth/bind-account`
- **方法**: POST
- **描述**: 将微信账号与教务系统账号绑定

#### 请求参数

```json
{
  "student_id": "2021123456",
  "password": "your_password",
  "wechat_id": "wx123456789"
}
```

#### 成功响应 (200 OK)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 课表相关接口

### 获取课表

- **URL**: `/api/schedule`
- **方法**: GET
- **描述**: 获取当前用户的课表信息
- **认证**: 需要JWT Token

#### 成功响应 (200 OK)

```json
[
  {
    "id": 1,
    "name": "高等数学",
    "teacher": "张教授",
    "location": "A101",
    "day_of_week": 1,
    "start_section": 1,
    "end_section": 2,
    "is_custom": false
  },
  {
    "id": 2,
    "name": "Web开发",
    "teacher": "李教授",
    "location": "在线课程",
    "day_of_week": 2,
    "start_section": 1,
    "end_section": 2,
    "is_custom": true
  }
]
```

### 添加自定义课程

- **URL**: `/api/schedule/custom`
- **方法**: POST
- **描述**: 添加一个自定义课程到课表
- **认证**: 需要JWT Token

#### 请求参数

```json
{
  "name": "自学Python",
  "teacher": "自学",
  "location": "图书馆",
  "day_of_week": 3,
  "start_section": 5,
  "end_section": 6,
  "semester": "2023-2024-1"
}
```

#### 成功响应 (200 OK)

```json
{
  "message": "添加成功"
}
```

## 成绩查询接口

### 获取成绩

- **URL**: `/api/scores`
- **方法**: GET
- **描述**: 获取当前用户的所有课程成绩
- **认证**: 需要JWT Token

#### 成功响应 (200 OK)

```json
[
  {
    "course_name": "高等数学",
    "score": 92,
    "semester": "2023-2024-1"
  },
  {
    "course_name": "大学英语",
    "score": 88,
    "semester": "2023-2024-1"
  },
  {
    "course_name": "程序设计",
    "score": 95,
    "semester": "2023-2024-1"
  }
]
```

## 选课系统接口

### 获取可选课程

- **URL**: `/api/courses/available`
- **方法**: GET
- **描述**: 获取所有可选的课程列表
- **认证**: 需要JWT Token

#### 成功响应 (200 OK)

```json
[
  {
    "id": 1,
    "name": "高等数学",
    "teacher": "张教授",
    "course_type": "选修",
    "location": "A101",
    "day_of_week": 1,
    "start_section": 1,
    "end_section": 2
  },
  {
    "id": 3,
    "name": "大学物理",
    "teacher": "李教授",
    "course_type": "必修",
    "location": "B203",
    "day_of_week": 3,
    "start_section": 3,
    "end_section": 4
  }
]
```

### 选择课程

- **URL**: `/api/courses/select`
- **方法**: POST
- **描述**: 选择一门课程
- **认证**: 需要JWT Token

#### 请求参数

```json
{
  "course_id": 1,
  "semester": "2023-2024-1"
}
```

#### 成功响应 (200 OK)

```json
{
  "message": "选课成功"
}
```

## 考试安排接口

### 获取考试安排

- **URL**: `/api/exams`
- **方法**: GET
- **描述**: 获取当前用户所选课程的考试安排
- **认证**: 需要JWT Token

#### 成功响应 (200 OK)

```json
[
  {
    "course_name": "高等数学",
    "exam_date": "2024-01-15",
    "start_time": "08:30",
    "end_time": "10:30",
    "location": "A101教室"
  },
  {
    "course_name": "大学英语",
    "exam_date": "2024-01-17",
    "start_time": "14:00",
    "end_time": "16:00",
    "location": "B203教室"
  }
]
```

## 个人信息接口

### 获取个人信息

- **URL**: `/api/user/profile`
- **方法**: GET
- **描述**: 获取当前用户的个人信息
- **认证**: 需要JWT Token

#### 成功响应 (200 OK)

```json
{
  "student_id": "2021123456",
  "name": "张三",
  "department": "计算机科学与技术学院",
  "class_name": "计算机2021-1班"
}
```

## 公告接口

### 获取公告

- **URL**: `/api/announcements`
- **方法**: GET
- **描述**: 获取最新的公告信息

#### 成功响应 (200 OK)

```json
[
  {
    "title": "期中考试安排",
    "content": "本周五下午有期中考试，请同学们做好准备。",
    "is_important": true,
    "created_at": "2023-10-15 10:30:00"
  },
  {
    "title": "图书馆开放时间调整",
    "content": "下周起图书馆开放时间调整为8:00-22:00。",
    "is_important": false,
    "created_at": "2023-10-14 15:45:00"
  }
]
```

## 数据模型

### User (用户)

```
id: Integer (主键)
student_id: String (学号，唯一)
name: String (姓名)
department: String (院系)
class_name: String (班级)
password: String (密码，加密存储)
wechat_id: String (微信ID，唯一)
created_at: DateTime (创建时间)
```

### Course (课程)

```
id: Integer (主键)
name: String (课程名称)
teacher: String (教师姓名)
course_type: String (课程类型：必修/选修)
location: String (上课地点)
day_of_week: Integer (星期几：1-5)
start_section: Integer (开始节次)
end_section: Integer (结束节次)
is_custom: Boolean (是否为自定义课程)
```

### StudentCourse (学生选课)

```
id: Integer (主键)
student_id: Integer (外键，关联User)
course_id: Integer (外键，关联Course)
semester: String (学期，例如：2023-2024-1)
created_at: DateTime (创建时间)
```

### Score (成绩)

```
id: Integer (主键)
student_id: Integer (外键，关联User)
course_id: Integer (外键，关联Course)
score: Float (分数)
semester: String (学期)
created_at: DateTime (创建时间)
```

### Exam (考试)

```
id: Integer (主键)
course_id: Integer (外键，关联Course)
exam_date: Date (考试日期)
start_time: Time (开始时间)
end_time: Time (结束时间)
location: String (考试地点)
created_at: DateTime (创建时间)
```

### Announcement (公告)

```
id: Integer (主键)
title: String (标题)
content: Text (内容)
is_important: Boolean (是否重要)
created_at: DateTime (创建时间)
```