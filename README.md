# Attendance-System-Face-Recognition
A web appliation that performs attendance using with deep learning facial recognition

## Components
- Database
- Frontend
- API

## API ROUTES
This describes the functions of the various API routes

- /camera: Opens the camera to perform live recognition thereby marking attendance, then it packs the information into a JSON file and sends to (/receive_data) route.

- /receive_data: Receives the JSON data sent from the camera route, then fills the information into the Postgres database.

- /get_student: Takes the name of a student as a string request and then fetches all attendance records of the student in the database.

- /get_attendance_by_date: Takes a date input request and then fetches all attendance records of that date from the database.

- /get_5_last_entries: Returns the last 5 user/student seen by the camera. Which is also equivalent to the last 5 recent record in the database.

- /add_student: Takes an image + student name as input, appends the name to the image file and store it in a designated folder.

- /get_student_list: Returns all the student name in the designated folder.

- /delete_student: Takes a student name as input and then deletes it from the designated folder.
