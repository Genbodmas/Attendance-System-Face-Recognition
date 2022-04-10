# * ---------- IMPORTS --------- *
from flask import Flask, request, jsonify, Response
from flask_cors import CORS, cross_origin
import os
import face_recognition
import psycopg2
import cv2
import numpy as np
import re
#from camera import recognition

camera = cv2.VideoCapture(0)

# Get the relativ path to this file (we will use it later)
FILE_PATH = os.path.dirname(os.path.realpath('C:/Users/Gen Bodmas/PycharmProjects/2nfFaceAttendance/'))

# * ---------- Create App --------- *
app = Flask(__name__)
CORS(app, support_credentials=True)

# * ---------- DATABASE CONFIG --------- *
#DATABASE_USER = os.environ['postgres']
#DATABASE_PASSWORD = os.environ['Sebohysa007']
#DATABASE_HOST = os.environ['127.0.0.1']
#DATABASE_PORT = os.environ['5432']
#DATABASE_NAME = os.environ['Attendance']

# * ---------- CAMERA STREAM --------- *
def camera_feed():
    while True :
        success, frame = camera.read()  # read the camera frame
        if not success :
            break
        else :

            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n') # concat frame one by one and show result


# * ---------- DATABASE CONNECTION --------- *
def DATABASE_CONNECTION():
    return psycopg2.connect(user="postgres",
                                  password="Sebohysa007",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="Attendance")


# * --------------------  ROUTES ------------------- *
# * ---------- Camera feed ---------- *
@app.route('/camera', methods=['POST', 'GET'])
def camera_view():
    #recognition()
    return Response(camera_feed(), mimetype='multipart/x-mixed-replace; boundary=frame')

# * ---------- Get data from the face recognition ---------- *
@app.route('/receive_data', methods=['POST', 'GET'])
def get_receive_data():
    if request.method == 'POST':
        # get the data from the model
        json_data = request.get_json()

        # Check if the user is already in the DB
        try:
            # Connect to the DB
            connection = DATABASE_CONNECTION()
            cursor = connection.cursor()

            # Query to check if the user as been saw by the camera today
            user_saw_today_sql_query = \
                f"SELECT * FROM students WHERE date = '{json_data['date']}' AND name = '{json_data['name']}'"

            cursor.execute(user_saw_today_sql_query)
            result = cursor.fetchall()
            connection.commit()

            # If use is already in the DB for today:
            if result:
                print("student attendance already recorded")
                '''''
                print('user IN')
                image_path = f"{FILE_PATH}{json_data['date']}/{json_data['name']}/departure.jpg"

                # Save image
                os.makedirs(f"{FILE_PATH}{json_data['date']}/{json_data['name']}", exist_ok=True)
                cv2.imwrite(image_path, np.array(json_data['picture_array']))
                json_data['picture_path'] = image_path

                # Update user in the DB
                update_user_querry = f"UPDATE students SET departure_time = '{json_data['hour']}', departure_picture = " \
                    f"'{json_data['picture_path']}'WHERE name = '{json_data['name']}' AND date = '{json_data['date']}'"
                cursor.execute(update_user_querry)
                '''

            else: 
                print("New Attendance")
                # Save image
                image_path = f"{FILE_PATH}history/{json_data['date']}/{json_data['name']}/arrival.jpg"
                os.makedirs(f"{FILE_PATH}history/{json_data['date']}/{json_data['name']}", exist_ok=True)
                cv2.imwrite(image_path, np.array(json_data['picture_array']))
                json_data['picture_path'] = image_path

                # Create a new row for the user today:
                insert_user_querry = f"INSERT INTO students (name, date, arrival_time, arrival_picture) VALUES (" \
                    f"'{json_data['name']}', '{json_data['date']}', '{json_data['hour']}', '{json_data['picture_path']}')"
                cursor.execute(insert_user_querry)

                #return jsonify({"message":"Error "})

        except (Exception, psycopg2.DatabaseError) as error:
            print("ERROR DB: ", error)
        finally:
            connection.commit()

            # closing database connection.
            if connection:
                cursor.close()
                connection.close()
                print("PostgreSQL connection is closed")

        # Return user's data to the front
        return jsonify(json_data)




# * ---------- Get all the data of a student ---------- *
@app.route('/get_student/<string:name>', methods=['GET'])
def get_student(name):
    answer_to_send = {}
    # Check if the student is already in the DB
    try:
        # Connect to DB
        connection = DATABASE_CONNECTION()
        cursor = connection.cursor()
        # Query the DB to get all the data of a student:
        user_information_sql_query = f"SELECT * FROM students WHERE name = '{name}'"

        cursor.execute(user_information_sql_query)
        result = cursor.fetchall()
        connection.commit()

        # if the student exist in the db:
        if result:
            print('RESULT: ', result)
            # Structure the data and put the dates in string for the front
            for k, v in enumerate(result):
                answer_to_send[k] = {}
                for ko, vo in enumerate(result[k]):
                    answer_to_send[k][ko] = str(vo)
            print('answer_to_send: ', answer_to_send)
        else:
            answer_to_send = {'error': 'Student not found...'}

    except (Exception, psycopg2.DatabaseError) as error:
        print("ERROR DB: ", error)
    finally:
        # closing database connection:
        if (connection):
            cursor.close()
            connection.close()

    # Return the student's data to the front
    return jsonify(answer_to_send)


# * --------- Get the 5 last users seen by the camera --------- *
@app.route('/get_5_last_entries', methods=['GET'])
def get_5_last_entries():
    answer_to_send = {}
    # Check if the student is already in the DB
    try:
        # Connect to DB
        connection = DATABASE_CONNECTION()

        cursor = connection.cursor()
        # Query the DB to get all the data of a student:
        lasts_entries_sql_query = f"SELECT * FROM students ORDER BY id DESC LIMIT 5;"

        cursor.execute(lasts_entries_sql_query)
        result = cursor.fetchall()
        connection.commit()

        # if DB is not empty:
        if result:
            # Structure the data and put the dates in string for the front
            for k, v in enumerate(result):
                answer_to_send[k] = {}
                for ko, vo in enumerate(result[k]):
                    answer_to_send[k][ko] = str(vo)
        else:
            answer_to_send = {'error': 'error detect'}

    except (Exception, psycopg2.DatabaseError) as error:
        print("ERROR DB: ", error)
    finally:
        # closing database connection:
        if (connection):
            cursor.close()
            connection.close()

    # Return the student's data to the front
    return jsonify(answer_to_send)


# * ---------- Add new students ---------- *
@app.route('/add_student', methods=['POST','GET'])
@cross_origin(supports_credentials=True)
def add_student():
    try:
        # Get the picture from the request
        image_file = request.files['image']
        print(request.form['nameOfStudent'])

        # Store it in the folder of the know faces:
        file_path = os.path.join(f"C:/Users/Gen Bodmas/PycharmProjects/2nfFaceAttendance/Images/{request.form['nameOfStudent']}.jpg")
        image_file.save(file_path)
        answer = 'new student succesfully added'
    except:
        answer = 'Error while adding new student. Please try later...'
    return jsonify(answer)


# * ---------- Get students list ---------- *
@app.route('/get_student_list', methods=['GET'])
def get_employee_list():
    student_list = {}

    # Walk in the student folder to get the student list
    walk_count = 0
    for file_name in os.listdir("C:/Users/Gen Bodmas/PycharmProjects/2nfFaceAttendance/Images/"):
        # Capture the student's name with the file's name
        name = re.findall("(.*)\.jpg", file_name)
        if name:
            student_list[walk_count] = name[0]
        walk_count += 1

    return jsonify(student_list)


# * ---------- Delete student ---------- *
@app.route('/delete_student/<string:name>', methods=['GET'])
def delete_student(name):
    try:
        # Remove the picture of the student from the student's folder:
        print('name: ', name)
        file_path = os.path.join(f'C:/Users/Gen Bodmas/PycharmProjects/2nfFaceAttendance/Images/{name}.jpg')
        os.remove(file_path)
        answer = 'student succesfully removed'
    except:
        answer = 'Error while deleting  student. Please try later'

    return jsonify(answer)


# * -------------------- RUN SERVER -------------------- *
if __name__ == '__main__':
    # * --- DEBUG MODE: --- *
    app.run(host='127.0.0.1', port=5000, debug=True)
    #  * --- DOCKER PRODUCTION MODE: --- *
    # app.run(host='0.0.0.0', port=os.environ['PORT']) -> DOCKER