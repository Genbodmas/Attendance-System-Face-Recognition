# * ---------- IMPORTS --------- *
import smtplib
from email.message import EmailMessage
import requests
from flask import Flask, request, jsonify, Response
from flask_cors import CORS, cross_origin
import os
from datetime import date, datetime, timedelta
import face_recognition
import psycopg2
import cv2, time
import numpy as np
import re
import pandas as pd
import pickle
from datetime import datetime


# The directory where the images to be recognized are stored
IMAGE_DIR = os.path.dirname(os.path.realpath('C:/Users/Gen Bodmas/PycharmProjects/2nfFaceAttendance/Images/'))
FILE_PATH = os.path.dirname(os.path.realpath('C:/Users/Gen Bodmas/PycharmProjects/2nfFaceAttendance/'))

# * ---------- Create App --------- *
app = Flask(__name__)
CORS(app, support_credentials=True)


# ---- Compute Face Encodings and Face names from File names -----
known_face_encodings = []
known_face_names = []
known_faces_filenames = []
known_face_matric_numbers = []

# Use a regular expression pattern to extract the name and matric number from the filenames
pattern = re.compile(r'(.*) (CPE_[0-9]+_[0-9]+)')

# Construct the path to the student image directory
student_image_dir = os.path.join(os.getcwd(), "Images")

for (dirpath, dirnames, filenames) in os.walk(student_image_dir):
    known_faces_filenames.extend(filenames)
    break

for filename in known_faces_filenames:
    face = face_recognition.load_image_file(os.path.join(student_image_dir, filename))

    # Use the regular expression pattern to extract the name and matric number from the filename
    match = pattern.match(filename)
    name = match.group(1)
    matric_number = match.group(2)

    # Replace the underscore character in the matric number with a forward slash character
    matric_number = matric_number.replace('_', '/')

    known_face_names.append(name)
    known_face_matric_numbers.append(matric_number)

    known_face_encodings.append(face_recognition.face_encodings(face)[0])

    # Store the face encodings in a file
    with open("encodings.pkl", "wb") as f:
        pickle.dump((known_face_encodings, known_face_names, known_face_matric_numbers), f)

    # Get the current date and time
    #now = datetime.datetime.now()

    # Format the date and time as a string
    #date_time = now.strftime("%Y-%m-%d %H:%M:%S")

    #print("Last encoding was created at {}".format(date_time))
    print("Encoding Successful")

# ---- Camera object -----
camera = cv2.VideoCapture(0)

# * ---------- Initialise Face Endodings, Locations and Names to be used during recognition--------- *
face_locations = []
face_encodings = []
face_names = []
process_this_frame = True

# * ---------- Initialise JSON to EXPORT --------- *
json_to_export = {}

def gen_frames():
    # Load ENcodings
    with open("encodings.pkl", "rb") as f :
        known_face_encodings, known_face_names, known_face_matric_numbers = pickle.load(f)
    while True :
        success, frame = camera.read()  # read the camera frame
        if not success :
            break
        else :
            # Resize frame of video to 1/4 size for faster face recognition processing
            small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
            # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
            rgb_small_frame = small_frame[:, :, : :-1]

            # Only process every other frame of video to save time

            # Find all the faces and face encodings in the current frame of video
            face_locations = face_recognition.face_locations(rgb_small_frame)
            face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
            face_names = []
            for face_encoding in face_encodings :
                # See if the face is a match for the known face(s)
                matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
                name = "Unknown"
                matric_number = "Unknown"
                # Or instead, use the known face with the smallest distance to the new face
                face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = known_face_names[best_match_index]
                    matric_number = known_face_matric_numbers[best_match_index]

                    # * ---------- SAVE data to send to the API -------- *
                    json_to_export['name'] = name
                    json_to_export['matric_number'] = matric_number
                    json_to_export['hour'] = f'{time.localtime().tm_hour}:{time.localtime().tm_min}'
                    json_to_export[
                        'date'] = f'{date.today().year}-{date.today().month}-{date.today().day}'
                    json_to_export['picture_array'] = frame.tolist()

                    # * ---------- SEND data to API --------- *

                    r = requests.post(url='http://127.0.0.1:5000/receive_data', json=json_to_export)
                    print("Status: ", r.status_code)
                    # csvAttendance(name)

                face_names.append(name)

            # Display the results
            for (top, right, bottom, left), name in zip(face_locations, face_names) :
                # Scale back up face locations since the frame we detected in was scaled to 1/4 size
                top *= 4
                right *= 4
                bottom *= 4
                left *= 4

                # Draw a box around the face
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

                # Draw a label with a name below the face
                cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
                font = cv2.FONT_HERSHEY_DUPLEX
                cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


# * ---------- DATABASE CONNECTION --------- *
def connect_to_database():
    try:
        # Connect to the database
        conn = psycopg2.connect(user="postgres",
                                password="Sebohysa007",
                                host="127.0.0.1",
                                port="5432",
                                database="Attendance")
        return conn
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return None

# * --------------------  ROUTES ------------------- *
# * ---------- Create and Save Encodings ---------- *
#@app.route('/create_encodings', methods=['POST'])
#def create_encodings():


# * ---------- Camera feed ---------- *
@app.route('/camera', methods=['POST', 'GET'])
def live_recognition():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


# * ---------- Get data from the face recognition ---------- *
@app.route('/receive_data', methods=['POST', 'GET'])
def get_receive_data():
    if request.method == 'POST':
        # get the data from the model
        json_data = request.get_json()

        # Check if the user is already in the DB
        try:
            # Connect to the DB
            connection = connect_to_database()
            cursor = connection.cursor()

            # Query to check if the user as been seen by the camera today
            user_saw_today_sql_query = \
                f"SELECT * FROM students WHERE date = '{json_data['date']}' AND name = '{json_data['name']}' " \
                    f"AND matric_number = '{json_data['matric_number']}'"

            cursor.execute(user_saw_today_sql_query)
            result = cursor.fetchall()
            connection.commit()

            # If user is already in the DB for today:
            if result :
                print("student attendance already recorded")

                # Check if the arrival time was at least 10 minutes ago
                arrival_time = datetime.strptime(result[4], '%H:%M')
                current_time = datetime.strptime(json_data['hour'], '%H:%M')
                time_difference = current_time - arrival_time
                if time_difference.total_seconds >= 600 :  # 600 seconds = 10 minutes
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
                else :
                    print('User arrival time is less than 10 minutes ago')
            else :
                print("New Attendance")
                # Save image
                image_path = f"{FILE_PATH}history/{json_data['date']}/{json_data['name']}/arrival.jpg"
                os.makedirs(f"{FILE_PATH}history/{json_data['date']}/{json_data['name']}", exist_ok=True)
                cv2.imwrite(image_path, np.array(json_data['picture_array']))
                json_data['picture_path'] = image_path

                # Create a new row for the user today:
                insert_user_querry = f"INSERT INTO students (name, matric_number, date, arrival_time, arrival_picture) " \
                    f"VALUES (" \
                    f"'{json_data['name']}', '{json_data['matric_number']}', '{json_data['date']}', '{json_data['hour']}', '{json_data['picture_path']}')"
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
#@app.route('/get_student/<string:name>', methods=['GET'])
@app.route('/get_student', methods=['GET'])
def get_student():
    answer_to_send = []

    # Get the name from the request
    name = request.args.get('name')

    # Check if the student is already in the DB
    try:
        # Connect to DB
        connection = connect_to_database()
        cursor = connection.cursor()
        # Create a parameterized query to get all the data of a student:
        user_information_sql_query = "SELECT * FROM students WHERE name = %s"

        # Provide the student name as a separate argument to the query:
        cursor.execute(user_information_sql_query, (name,))
        result = cursor.fetchall()
        connection.commit()

        # if the student exist in the db:
        if result:
            # Get the column names from the cursor description
            column_names = [column[0] for column in cursor.description]
            print('Column names: ', column_names)

            # Structure the data and put the dates in string for the front
            for v in result:
                answer_to_send.append({})
                for ko, vo in enumerate(v):
                    answer_to_send[-1][column_names[ko]] = str(vo)
            print('answer_to_send: ', answer_to_send)
        else:
            answer_to_send = [{'error': 'Student not found...'}]

    except (Exception, psycopg2.DatabaseError) as error:
        print("ERROR DB: ", error)
    finally:
        # closing database connection:
        if (connection):
            cursor.close()
            connection.close()

    # Return the student's data to the front
    return jsonify(answer_to_send)

# * --------- Get attendance by date --------- *
#
#@app.route('/get_attendance_by_date/<string:date>', methods=['GET'])
@app.route('/get_attendance_by_date', methods=['GET'])
def get_attendance_by_date():
    answer_to_send = []

    # Get the date from the request
    date = request.args.get('date')

    # Check if the date is valid and exists in the database
    try:
        # Connect to the database
        connection = connect_to_database()
        cursor = connection.cursor()

        # Create a parameterized query to get all attendance records for the given date:
        attendance_by_date_sql_query = "SELECT * FROM students WHERE date = %s"

        # Provide the date as a separate argument to the query:
        cursor.execute(attendance_by_date_sql_query, (date,))
        result = cursor.fetchall()
        connection.commit()

        # If there are attendance records for the given date:
        if result:
            # Get the column names from the cursor description
            column_names = [column[0] for column in cursor.description]

            # Structure the data and put the dates in string for the front
            for v in result:
                answer_to_send.append({})
                for ko, vo in enumerate(v):
                    answer_to_send[-1][column_names[ko]] = str(vo)
        else:
            answer_to_send = [{'error': 'No attendance records found for the given date.'}]

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
    answer_to_send = []
    # Check if the student is already in the DB
    try:
        # Connect to DB
        connection = connect_to_database()

        cursor = connection.cursor()
        # Create a parameterized query to get the 5 most recent entries in the students table:
        lasts_entries_sql_query = "SELECT * FROM students ORDER BY id DESC LIMIT 5"

        # Execute the query without providing any additional arguments:
        cursor.execute(lasts_entries_sql_query)
        result = cursor.fetchall()
        connection.commit()

        # if DB is not empty:
        if result:
            # Get the column names from the cursor description
            column_names = [column[0] for column in cursor.description]

            # Structure the data and put the dates in string for the front
            for v in result:
                answer_to_send.append({})
                for ko, vo in enumerate(v):
                    answer_to_send[-1][column_names[ko]] = str(vo)
        else:
            answer_to_send = [{'error': 'error detect'}]

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
        name = request.form['nameOfStudent']
        print(name)

        # Construct the path to the student image directory
        student_image_dir = os.path.join(os.getcwd(), "Images")

        # Check if the student already exists
        file_path = os.path.join(student_image_dir, f'{name}.jpg')
        if not os.path.exists(file_path):
            # Store it in the folder of the know faces:
            image_file.save(file_path)
            answer = 'new student successfully added'
        else:
            answer = 'student already exists'
    except:
        answer = 'Error while adding new student. Please try later...'
    return jsonify(answer)


# * ---------- Get students list ---------- *
@app.route('/get_student_list', methods=['GET'])
def get_employee_list():
    student_list = []

    # Construct the path to the student image directory
    student_image_dir = os.path.join(os.getcwd(), "Images")

    # Check if the student image directory exists
    if not os.path.exists(student_image_dir) :
        return jsonify({"error" : "Student image directory does not exist"}), 404

    # Walk in the student folder to get the student list
    for file_name in os.listdir(student_image_dir) :
        # Get the student's name from the file name
        base_name, _ = os.path.splitext(file_name)
        student_list.append(base_name)

    return jsonify(student_list)


# * ---------- Delete student ---------- *
#@app.route('/delete_student/<string:name>', methods=['GET'])
@app.route('/delete_student', methods=['GET'])
def delete_student():
    # Get the name from the request
    name = request.args.get('name')
    try :
        # Construct the path to the student image directory
        student_image_dir = os.path.join(os.getcwd(), "Images")

        # Check if the student exists
        file_path = os.path.join(student_image_dir, f'{name}.jpg')
        if os.path.exists(file_path):
            # Remove the picture of the student from the student's folder:
            os.remove(file_path)
            answer = 'student succesfully removed'
        else :
            answer = 'student does not exist'
    except :
        answer = 'Error while deleting  student. Please try later'

    return jsonify(answer)

# * ---------- Attendance Record Emailing ---------- *
#@app.route('/send_attendance_email', methods=['GET'])
@app.route('/send_attendance_email/<string:email>/<string:frequency>', methods=['GET'])
def send_attendance_email(email, frequency):
    answer_to_send = {}
    # Get the email and frequency from the request
    #email = request.args.get('email')
    #frequency = request.args.get('frequency')

    # Check if the email and frequency are valid
    if email and frequency:
        # Check if the frequency is 'daily' or 'weekly'
        if frequency == 'daily' or frequency == 'weekly':
            # Connect to the database
            connection = connect_to_database()
            cursor = connection.cursor()

            # Create a parameterized query to get the attendance records based on the frequency:
            attendance_sql_query = "SELECT * FROM students WHERE date >= %s AND date <= %s"

            # Get the current date and time
            current_date_time = datetime.now()
            # If the frequency is daily, get the attendance records for the current date
            if frequency == 'daily':
                cursor.execute(attendance_sql_query, (current_date_time.date(), current_date_time.date()))
            # If the frequency is weekly, get the attendance records for the current week
            else:
                # Get the start and end date of the current week
                start_date = current_date_time - timedelta(days=current_date_time.weekday())
                end_date = start_date + timedelta(days=6)
                cursor.execute(attendance_sql_query, (start_date.date(), end_date.date()))

            # Fetch the results
            result = cursor.fetchall()
            connection.commit()

            # If there are attendance records:
            if result:
                # Convert the results to a Pandas DataFrame
                attendance_df = pd.DataFrame(result, columns=['id','name', 'matric_number', 'date', 'arrival_time','arrival_picture'])

                # Export the DataFrame to a CSV file
                attendance_file = attendance_df.to_csv(index=False)

                # Encode to bytes
                bs = attendance_file.encode('utf-8')

                # Create an email message with the CSV file as an attachment
                message = EmailMessage()
                message.set_content('Attached is the attendance report.')
                message.add_attachment(bs, maintype='text', subtype='csv', filename='attendance_report.csv')
                message['Subject'] = 'Attendance Report'
                message['From'] = 'genbodmas007@gmail.com'
                message['To'] = email

                # Connect to the email server and send the email
                with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
                    smtp.login('genbodmas007@gmail.com', 'imathwihtcylycwi')
                    smtp.send_message(message)
                    smtp.close()

                answer_to_send = {'success': 'Attendance report email sent successfully.'}
            else:
                answer_to_send = {'error': 'No attendance records found for the given frequency.'}

        else:
            answer_to_send = {'error': 'Invalid frequency. Valid frequencies are "daily" and "weekly".'}
    else:
        answer_to_send = {'error': 'Email and frequency are required parameters.'}

    # Return the result to the frontend
    return jsonify(answer_to_send)



# * -------------------- RUN SERVER -------------------- *
if __name__ == '__main__':
    # * --- DEBUG MODE: --- *
    app.run(host='127.0.0.1', port=5000, debug=True)
    #  * --- DOCKER PRODUCTION MODE: --- *
    # app.run(host='0.0.0.0', port=os.environ['PORT']) -> DOCKER