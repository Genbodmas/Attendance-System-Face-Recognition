import React, { useState } from 'react';
import styled from 'styled-components'


const AddStudentForm = props => {

    // * ----------- STYLE ---------- *
    const AddStudentForm = styled.div`
      display: flex;
      flex-direction: column;
      max-width: 350px;
`
    const AddStudentInput = styled.input`
         margin-bottom: 20px;
`
    const AddStudentInputText = styled.input`
        max-width: 200px;
        margin-bottom: 20px;
        outline: 0;
        border-width: 0 0 1px;
        border-color: #013087;
        padding: 5px;
`
    const AddStudentButton = styled.button`
      max-width: 100px;
      padding: 10px 20px;
      background: forestgreen;
      border: none;
      border-radius: 3px;
      color: white;
      font-weight: bold;
      cursor: pointer;
      align-self: center;
`
    const SuccessAddStudent = styled.p`
        padding: 10px;
        color: #25AD47;
        font-weight: bold;
    `
    const ConstErrorAddStudent = styled.p`
    padding: 10px;
    color: #E62727;
    font-weight: bold;
`
    const H3AddStudent = styled.h3`
    display: flex;
    align-items: center;
`

    // * ----------- STATES ---------- *
    const [isUserWellAdded, setIsUserWellAdded] = useState(false);
    const [errorWhileAddingUser, seterrorWhileAddingUser] = useState(false);

    const addStudentToDb = e => {
        e.preventDefault()
        // Send it to backend -> add_student as a POST request
        let name = document.getElementById("nameOfStudent").value
        let picture = document.getElementById('studentPictureToSend')

        let formData  = new FormData();

        formData.append("nameOfStudent", name)
        formData.append("image", picture.files[0])

        fetch('http://127.0.0.1:5000/add_student',{
            method: 'POST',
            body:  formData,
        })
            .then(response => response.json())
            .then(response => {
                console.log(response)
                setIsUserWellAdded(true)
            })
            .catch(error => seterrorWhileAddingUser(true))
    }

    return (
        <section>
            <H3AddStudent>Add a Student</H3AddStudent>
            <AddStudentForm>
                <AddStudentInputText id="nameOfStudent" name="name" placeholder='Name' type="text" />
                <AddStudentInput type="file" alt="student" id='studentPictureToSend' name='studentPictureToSend' />
                <AddStudentButton onClick={ addStudentToDb }>Add</AddStudentButton>
                { isUserWellAdded && <SuccessAddStudent>Student added to the Database Successfully!</SuccessAddStudent> }
                { errorWhileAddingUser && <ConstErrorAddStudent>Student not added to the Database. Please Retry...</ConstErrorAddStudent> }
            </AddStudentForm>
        </section>
    );
};

export default AddStudentForm;