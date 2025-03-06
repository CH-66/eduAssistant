from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String(20), unique=True, nullable=True)
    name = db.Column(db.String(50), nullable=True)
    department = db.Column(db.String(100), nullable=True)
    class_name = db.Column(db.String(50), nullable=True)
    password = db.Column(db.String(255), nullable=True)
    wechat_id = db.Column(db.String(100), unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Course(db.Model):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    teacher = db.Column(db.String(50), nullable=False)
    course_type = db.Column(db.String(20), nullable=False)  # 必修/选修
    location = db.Column(db.String(50))
    day_of_week = db.Column(db.Integer, nullable=False)  # 1-5 代表周一到周五
    start_section = db.Column(db.Integer, nullable=False)  # 第几节课开始
    end_section = db.Column(db.Integer, nullable=False)    # 第几节课结束
    is_custom = db.Column(db.Boolean, default=False)       # 是否为自定义课程

class StudentCourse(db.Model):
    __tablename__ = 'student_courses'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    semester = db.Column(db.String(20), nullable=False)  # 例如：2023-2024-1
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Score(db.Model):
    __tablename__ = 'scores'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    score = db.Column(db.Float, nullable=False)
    semester = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Exam(db.Model):
    __tablename__ = 'exams'
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    exam_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    location = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Announcement(db.Model):
    __tablename__ = 'announcements'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    is_important = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)