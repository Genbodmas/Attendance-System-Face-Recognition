import React, { useState } from 'react';
import styled from 'styled-components'
import AddStudentForm from './AddStudentForm'
import DeleteStudent from './DeleteStudent'


const AdminBlock = () => {
    // * ---------- STYLE ---------- *
    const AdminBlockSection = styled.section`
        display: flex;
        flex-direction: column;
        margin: 40px 10px;
        background-color: #ffffff;
        padding: 20px;
        width: 45vw;
        h2 {
            margin-top : 0;
            font-size: 45px;
            line-height: 1;
            font-weight: normal;
            color: darkred;
            text-align: center;
        }
`
        const ComponentsContainer = styled.div`
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: flex-start;
`

    // * ---------- STATES --------- *

    return (
        <AdminBlockSection>
            <h2>Admin Section</h2>
            <ComponentsContainer>
                {/*Add student form*/}
                <AddStudentForm/>
                {/*List of student + delete button*/}
                <DeleteStudent />
            </ComponentsContainer>
        </AdminBlockSection>
    );
};

export default AdminBlock;