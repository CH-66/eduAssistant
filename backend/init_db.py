import pymysql
import os
from flask import Flask
from models import db, User, Course, StudentCourse, Score, Exam, Announcement

# 创建数据库
def create_database():
    try:
        # 连接MySQL服务器
        conn = pymysql.connect(
            host='localhost',
            user='root',
            password='123456'
        )
        cursor = conn.cursor()
        
        # 创建数据库
        cursor.execute("CREATE DATABASE IF NOT EXISTS edu_assistant")
        print("数据库 'edu_assistant' 创建成功或已存在")
        
        conn.close()
        return True
    except Exception as e:
        print(f"创建数据库时出错: {e}")
        return False

# 初始化表结构
def init_tables():
    try:
        # 创建Flask应用
        app = Flask(__name__)
        app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:123456@localhost/edu_assistant'
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        
        # 初始化数据库
        db.init_app(app)
        
        # 在应用上下文中创建所有表
        with app.app_context():
            db.create_all()
            print("所有表创建成功")
        
        return True
    except Exception as e:
        print(f"初始化表结构时出错: {e}")
        return False

# 添加一些示例数据
def add_sample_data():
    try:
        app = Flask(__name__)
        app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:123456@localhost/edu_assistant'
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        db.init_app(app)
        
        with app.app_context():
            # 检查是否已有数据
            if User.query.count() > 0:
                print("数据库中已有数据，跳过示例数据添加")
                return True
            
            # 添加示例用户
            from werkzeug.security import generate_password_hash
            user = User(
                student_id="2021001",
                name="张三",
                department="计算机科学与技术学院",
                class_name="计算机2021-1班",
                password=generate_password_hash("password123"),
                wechat_id="wx_2021001"
            )
            db.session.add(user)
            
            # 添加示例课程
            courses = [
                Course(name="高等数学", teacher="李教授", course_type="必修", location="教学楼A-101", 
                       day_of_week=1, start_section=1, end_section=2),
                Course(name="大学英语", teacher="王教授", course_type="必修", location="教学楼B-201", 
                       day_of_week=2, start_section=3, end_section=4),
                Course(name="Python编程", teacher="张教授", course_type="选修", location="实验楼C-301", 
                       day_of_week=3, start_section=5, end_section=6)
            ]
            for course in courses:
                db.session.add(course)
            
            # 提交更改以获取ID
            db.session.commit()
            
            # 添加学生选课记录
            student_courses = [
                StudentCourse(student_id=user.id, course_id=courses[0].id, semester="2023-2024-1"),
                StudentCourse(student_id=user.id, course_id=courses[1].id, semester="2023-2024-1"),
                StudentCourse(student_id=user.id, course_id=courses[2].id, semester="2023-2024-1")
            ]
            for sc in student_courses:
                db.session.add(sc)
            
            # 添加成绩记录
            scores = [
                Score(student_id=user.id, course_id=courses[0].id, score=85.5, semester="2023-2024-1"),
                Score(student_id=user.id, course_id=courses[1].id, score=92.0, semester="2023-2024-1")
            ]
            for score in scores:
                db.session.add(score)
            
            # 添加考试记录
            from datetime import date, time
            exams = [
                Exam(course_id=courses[0].id, exam_date=date(2024, 1, 15), 
                     start_time=time(9, 0), end_time=time(11, 0), location="教学楼A-101"),
                Exam(course_id=courses[1].id, exam_date=date(2024, 1, 17), 
                     start_time=time(14, 0), end_time=time(16, 0), location="教学楼B-201")
            ]
            for exam in exams:
                db.session.add(exam)
            
            # 添加公告
            announcements = [
                Announcement(title="期末考试安排", content="请各位同学注意查看期末考试时间和地点。", is_important=True),
                Announcement(title="选课通知", content="下学期选课将于下周开始，请提前做好准备。", is_important=False)
            ]
            for announcement in announcements:
                db.session.add(announcement)
            
            # 提交所有更改
            db.session.commit()
            print("示例数据添加成功")
            
            return True
    except Exception as e:
        print(f"添加示例数据时出错: {e}")
        return False

if __name__ == "__main__":
    print("开始初始化数据库...")
    
    # 步骤1: 创建数据库
    if create_database():
        # 步骤2: 初始化表结构
        if init_tables():
            # 步骤3: 添加示例数据
            add_sample_data()
    
    print("数据库初始化完成")