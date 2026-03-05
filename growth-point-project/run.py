import random

from flask import Flask, render_template, url_for, request, flash, redirect, session, jsonify
import sqlite3

import os
import uuid
from datetime import datetime
from datetime import date
from werkzeug.utils import secure_filename

db = sqlite3.connect('db/_user.db', check_same_thread=False)

cur = db.cursor()

cur.execute(
    '''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        login TEXT NOT NULL,
        password TEXT NOT NULL,
        date_of_birth TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        registration_date TEXT
        phone_number VARCHAR(15),
        city TEXT,
        upcoming_events_id INTEGER
        saved_events_id TEXT,
        user_avatar TEXT
        
    )
    '''
)

db.commit()

cur.execute(
    '''
    CREATE TABLE IF NOT EXISTS admin_panel(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        describe TEXT NOT NULL,
        date TEXT NOT NULL,
        place TEXT NOT NULL,
        duration TEXT NOT NULL,
        cost INTEGER NOT NULL,
        amount INTEGER NOT NULL,
        url TEXT NOT NULL
    )
    '''
)

app = Flask(__name__)
app.secret_key = "qwerty"

# Конфигурация для загрузки изображений
app.config['AVATAR_FOLDER'] = 'static/avatars'
app.config['EVENT_FOLDER'] = 'static/img'
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5MB
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def generate_filename(original_filename):
    ext = original_filename.rsplit('.', 1)[1].lower()
    unique_id = uuid.uuid4().hex[:8]
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    return f"{timestamp}_{unique_id}.{ext}"


@app.route('/main', methods=['POST', 'GET'])
def main():
    cur.execute("SELECT * FROM admin_panel")
    events = cur.fetchall()

    if request.method == 'POST' and 'event_card' in request.form:
        event_id = request.form.get('event_card_id')
        return redirect(url_for('eventCard', event_id=event_id))

    if session.get('id'):
        return render_template('main.html', user_status=True, username=session['login'], events=events)
    else:
        return render_template('main.html', user_status=False, events=events)


# Создать возможность редактирования и просмотра зареганных на каждое мероприятие пользователей
@app.route('/admin', methods=['POST', 'GET'])
def admin_panel():
    if request.method == "POST":
        # Обработка формы добавления нового события
        if 'admin_form' in request.form:
            print("admin_form")
            name = request.form['name']
            category = request.form['category']
            describe = request.form['describe']
            date_time = request.form['datetime']
            place = request.form['place']
            duration = request.form['duration']
            cost = request.form['cost']
            amount = request.form['amount']

            image_filename = request.form.get('image_data', '')

            if image_filename:
                url = f'/static/img/{image_filename}'
                print("!!!")
            else:
                url = request.form.get('url', '')

            cur.execute(
                'INSERT INTO admin_panel(name, category, describe, date, place, duration, cost, amount, url) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
                (name, category, describe, date_time, place, duration, cost, amount, url))
            db.commit()

        action = request.form.get('action')
        event_id = request.form.get('event_id')

        if action == 'edit' and event_id:
            print(f"!!!EDIT {event_id}!!!")

            return redirect(url_for('admin_panel'))

        elif action == 'delete' and event_id:
            print(f"~~~DELETE {event_id}~~~")
            cur.execute('DELETE FROM admin_panel WHERE id=?', (event_id,))
            db.commit()
            return redirect(url_for('admin_panel'))

    cur.execute('SELECT * FROM admin_panel')
    events = cur.fetchall()

    cur.execute('SELECT COUNT(*) FROM admin_panel')
    total_events = cur.fetchone()[0]

    return render_template('admin.html',
                           events=events,
                           total_events=total_events)


@app.route('/login', methods=['POST', 'GET'], endpoint='login_page')
@app.route('/registration', methods=['POST', 'GET'], endpoint='registration_page')
def auth():
    if request.method == 'POST':
        if 'hidden_form' in request.form:
            login_input = request.form['Llogin']
            password_input = request.form['Lpassword']

            cur.execute('SELECT id, login FROM users WHERE login = ? AND password = ?',
                        (login_input, password_input))
            user = cur.fetchone()

            if user:
                session['id'] = user[0]
                session['login'] = user[1]

                return redirect(url_for('main'))
            else:
                flash('Неверный логин или пароль!', category='error')
                _active_form = True
                return redirect(url_for('login_page', active_form=_active_form))
        else:
            login = request.form['login']
            password = request.form['password']
            dob = request.form['date of birth']
            email = request.form['email']

            cur.execute("SELECT * FROM users")
            rows = cur.fetchall()
            for row in rows:
                if email == row[4]:
                    flash("Пользователь с данным email уже существует!", category='errorEmail')
                    return redirect(url_for('registration_page'))
                elif login == row[1]:
                    flash("Данное имя пользователя занято!", category='errorLogin')
                    return redirect(url_for('registration_page'))

            cur.execute(
                "INSERT INTO users (login, password, date_of_birth, email, registration_date) VALUES (?,?,?,?, ?)",
                (login, password, dob, email, date.today()))
            db.commit()

            session['id'] = cur.lastrowid
            session['login'] = login

        return redirect(url_for('main'))

    return render_template('registration.html')


@app.route('/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return {'success': False, 'message': 'Файл не найден'}

    file = request.files['image']

    if file.filename == '':
        return {'success': False, 'message': 'Файл не выбран'}

    if not allowed_file(file.filename):
        return {'success': False, 'message': 'Недопустимый тип файла'}

    try:
        original_filename = secure_filename(file.filename)
        new_filename = generate_filename(original_filename)

        file_path = os.path.join(app.config['EVENT_FOLDER'], new_filename)
        file.save(file_path)

        return {
            'success': True,
            'message': 'Файл успешно загружен',
            'filename': new_filename,
            'url': f'/static/img/{new_filename}'
        }
    except Exception as e:
        return {'success': False, 'message': f'Ошибка сервера: {str(e)}'}


@app.route('/upload-avatar', methods=['POST'])
def upload_avatar():
    # Берем user_id из сессии (он уже есть после авторизации)
    user_id = session.get('id')
    if not user_id:
        return jsonify({'success': False, 'message': 'Не авторизован'})

    file = request.files['avatar']

    # Генерируем имя файла
    from datetime import datetime
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"avatar_{user_id}_{timestamp}.jpg"

    # Сохраняем
    file.save(os.path.join(app.config['AVATAR_FOLDER'], filename))

    # URL для сохранения в БД
    avatar_url = f"/static/avatars/{filename}"

    # Обновляем БД
    cur.execute('UPDATE users SET user_avatar = ? WHERE id = ?',
                (avatar_url, user_id))
    db.commit()

    return jsonify({'success': True, 'url': avatar_url})


@app.route('/event/<int:event_id>', methods=['POST', 'GET'])
def eventCard(event_id):
    cur.execute('SELECT * FROM admin_panel WHERE id=?',
                (event_id,))
    event_info = cur.fetchone()

    db.commit()

    cur.execute('SELECT * FROM admin_panel WHERE category=?',
                (event_info[2],))

    event_random_similar_all = list(cur.fetchall())

    event_random_similar = tuple(random.sample(event_random_similar_all, min(3, len(event_random_similar_all))))
    db.commit()

    if request.method == "POST" and "event_card_id_similar" in request.form:
        event_id = request.form.get('event_card_id_similar')
        return redirect(url_for('eventCard', event_id=event_id))

    if request.method == "POST" and "saved_event_button" in request.form:
        cur.execute('SELECT saved_events_id FROM users WHERE id = ?',
                    (session.get('id'),))
        event = cur.fetchone()

        if event and event[0]:
            saved_list = event[0].split(',')
            if str(event_id) in saved_list:
                saved_list.remove(str(event_id))
            else:
                saved_list.append(str(event_id))

            new_saved = ','.join(saved_list)

        else:
            new_saved = str(event_id)

        cur.execute('UPDATE users SET saved_events_id = ? WHERE id = ?',
                    (new_saved, session.get('id'),))
        db.commit()

    def is_event_saved():
        cur.execute('SELECT saved_events_id FROM users WHERE id = ?',
                    (session.get('id'),))
        event = cur.fetchone()
        if event and event[0]:
            saved_list = event[0].split(',')
            return str(event_id) in saved_list

        return False

    return render_template('eventCard.html',
                           event_name=event_info[1], event_category=event_info[2], event_describe=event_info[3],
                           event_date=event_info[4], event_place=event_info[5], event_duration=event_info[6],
                           event_cost=event_info[7], event_amount=event_info[8], event_img=event_info[9],

                           event_similar_1=event_random_similar[0],
                           event_similar_2=event_random_similar[1],
                           event_similar_3=event_random_similar[2],

                           user_status=True if session.get('id') else False,
                           username=session['login'] if session.get('id') else None,
                           saved=True if is_event_saved() else False
                           )


@app.route('/profile', methods=['POST', 'GET'])
def profile_page():
    if request.method == 'POST':
        if 'exit_button' in request.form:
            session.clear()
            return redirect(url_for('registration_page'))

    cur.execute('SELECT * FROM users WHERE id=? ',
                (session.get('id'),))
    user_info = cur.fetchone()
    db.commit()

    cur.execute('SELECT * FROM admin_panel')
    events = cur.fetchall()

    count_events = len(events)

    db.commit()

    cur.execute('SELECT saved_events_id FROM users WHERE id = ?', (session.get('id'),))
    result = cur.fetchone()
    db.commit()
    amount_in_saved = 0
    saved_events_list = []

    if result and result[0]:

        saved_ids_string = result[0]

        id_list = saved_ids_string.split(',')

        id_list = [id_str.strip() for id_str in id_list if id_str.strip()]
        amount_in_saved = len(id_list)

        for event_id_str in id_list:
            cur.execute('SELECT * FROM admin_panel WHERE id = ?', (int(event_id_str),))
            event = cur.fetchone()
            if event:
                saved_events_list.append(event)
        db.commit()

    if request.method == "POST" and 'edit_profile_button' in request.form:
        return redirect(url_for('edit_profile'))

    return render_template(
        'profile.html',
        user_name=user_info[1],
        user_email=user_info[4],
        events=events,
        count_events=count_events,
        registration_date=user_info[10],
        user_avatar=user_info[9],
        amount_in_saved=amount_in_saved,
        amount_in_saved_event=saved_events_list,
        user_city=user_info[6],
        user_phone=user_info[5]
    )


@app.route('/edit_profile', methods=['GET', 'POST'])
def edit_profile():
    cur.execute('SELECT * FROM users WHERE id = ?',
                (session.get('id'),))
    user_info = cur.fetchone()

    if request.method == "POST" and 'edit_form' in request.form:
        new_username = request.form['name']
        new_email = request.form['email']
        new_phone = request.form['phone']
        new_city = request.form['city']
        print(f"{new_username}, {new_email}, {new_city}, {new_phone}")

        cur.execute('UPDATE users SET login = ?, email = ?, phone_number = ?, city = ? WHERE id = ?',
                    (new_username, new_email, new_phone, new_city, session.get('id'),))

        return redirect(url_for('profile_page'))



    return render_template(
        'edit_profile.html',
        username=user_info[1],
        user_email=user_info[4],
        user_avatar=user_info[9],
        user_city=user_info[6],
        user_phone=user_info[5]
    )


if __name__ == '__main__':
    app.run(debug=True)
