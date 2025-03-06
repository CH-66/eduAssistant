from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, User, Course, StudentCourse, Score, Exam, Announcement
from datetime import datetime, time
from werkzeug.security import generate_password_hash, check_password_hash
from os import environ
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# 配置数据库
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DATABASE_URL', 'mysql+pymysql://root:123456@localhost/edu_assistant')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = environ.get('JWT_SECRET_KEY', 'your-secret-key')

jwt = JWTManager(app)
db.init_app(app)

# 用户认证相关接口
@app.route('/api/auth/wechat-login', methods=['POST'])
def wechat_login():
    data = request.json
    wechat_id = data.get('wechat_id')
    print(wechat_id)
    user = User.query.filter_by(wechat_id=wechat_id).first()
    if user:
        access_token = create_access_token(identity=str(user.id))
        return jsonify({'token': access_token})
    
    # 创建临时用户，不强制要求绑定教务系统账号
    new_user = User(wechat_id=wechat_id)
    db.session.add(new_user)
    db.session.commit()
    
    access_token = create_access_token(identity=str(new_user.id))
    return jsonify({'token': access_token, 'is_bound': False})

@app.route('/api/auth/bind-account', methods=['POST'])
def bind_account():
    data = request.json
    student_id = data.get('student_id')
    password = data.get('password')
    wechat_id = data.get('wechat_id')
    
    # 这里应该调用教务系统API验证学生信息
    # 为演示目的，使用模拟数据
    user = User(
        student_id=student_id,
        password=generate_password_hash(password),
        wechat_id=wechat_id,
        name='张三',
        department='计算机科学与技术学院',
        class_name='计算机2021-1班'
    )
    db.session.add(user)
    db.session.commit()
    
    access_token = create_access_token(identity=str(user.id))
    return jsonify({'token': access_token})

# 课表相关接口
@app.route('/api/schedule', methods=['GET'])
@jwt_required()
def get_schedule():
    user_id = get_jwt_identity()
    student_courses = StudentCourse.query.filter_by(student_id=user_id).all()
    schedule = []
    for sc in student_courses:
        course = Course.query.get(sc.course_id)
        schedule.append({
            'id': course.id,
            'name': course.name,
            'teacher': course.teacher,
            'location': course.location,
            'day_of_week': course.day_of_week,
            'start_section': course.start_section,
            'end_section': course.end_section,
            'is_custom': course.is_custom
        })
    return jsonify(schedule)

@app.route('/api/schedule/custom', methods=['POST'])
@jwt_required()
def add_custom_course():
    data = request.json
    course = Course(
        name=data['name'],
        teacher=data['teacher'],
        course_type='自定义',
        location=data['location'],
        day_of_week=data['day_of_week'],
        start_section=data['start_section'],
        end_section=data['end_section'],
        is_custom=True
    )
    db.session.add(course)
    db.session.commit()
    
    student_course = StudentCourse(
        student_id=get_jwt_identity(),
        course_id=course.id,
        semester=data['semester']
    )
    db.session.add(student_course)
    db.session.commit()
    return jsonify({'message': '添加成功'})

# 成绩查询接口
@app.route('/api/scores', methods=['GET'])
@jwt_required()
def get_scores():
    user_id = get_jwt_identity()
    scores = Score.query.filter_by(student_id=user_id).all()
    result = []
    for score in scores:
        course = Course.query.get(score.course_id)
        result.append({
            'course_name': course.name,
            'score': score.score,
            'semester': score.semester
        })
    return jsonify(result)

# 选课系统接口
@app.route('/api/courses/available', methods=['GET'])
@jwt_required()
def get_available_courses():
    courses = Course.query.filter_by(is_custom=False).all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'teacher': c.teacher,
        'course_type': c.course_type,
        'location': c.location,
        'day_of_week': c.day_of_week,
        'start_section': c.start_section,
        'end_section': c.end_section
    } for c in courses])

@app.route('/api/courses/select', methods=['POST'])
@jwt_required()
def select_course():
    data = request.json
    student_course = StudentCourse(
        student_id=get_jwt_identity(),
        course_id=data['course_id'],
        semester=data['semester']
    )
    db.session.add(student_course)
    db.session.commit()
    return jsonify({'message': '选课成功'})

# 考试安排接口
@app.route('/api/exams', methods=['GET'])
@jwt_required()
def get_exams():
    user_id = get_jwt_identity()
    student_courses = StudentCourse.query.filter_by(student_id=user_id).all()
    course_ids = [sc.course_id for sc in student_courses]
    exams = Exam.query.filter(Exam.course_id.in_(course_ids)).all()
    result = []
    for exam in exams:
        course = Course.query.get(exam.course_id)
        result.append({
            'course_name': course.name,
            'exam_date': exam.exam_date.strftime('%Y-%m-%d'),
            'start_time': exam.start_time.strftime('%H:%M'),
            'end_time': exam.end_time.strftime('%H:%M'),
            'location': exam.location
        })
    return jsonify(result)

# 个人信息接口
@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({
        'student_id': user.student_id,
        'name': user.name,
        'department': user.department,
        'class_name': user.class_name
    })

# 公告接口
@app.route('/api/announcements', methods=['GET'])
def get_announcements():
    announcements = Announcement.query.order_by(Announcement.created_at.desc()).limit(5).all()
    return jsonify([{
        'title': a.title,
        'content': a.content,
        'is_important': a.is_important,
        'created_at': a.created_at.strftime('%Y-%m-%d %H:%M:%S')
    } for a in announcements])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
