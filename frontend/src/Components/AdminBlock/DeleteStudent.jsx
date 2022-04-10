import React, { useState } from 'react';
import styled from 'styled-components'

// IMPORT IMG
import realodImg from "../../assets/img/reload.png"

const EmployeeToDeleteList = props => {
    // * ---------- STYLE ---------- *
        const ItemLi = styled.li`
            list-style: none;
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            background: rgba(242, 242, 242, 0.5);
            padding: 10px;
            border-radius: 3px;
`
        const ItemButton = styled.button`
            background: #f73131;
            color: #fff;
            font-weight: bold;
            border: none;
            border-radius: 3px;
            padding: 5px 10px;
            cursor: pointer;
            margin-left: 10px;
`
    const ReloadImgTag = styled.img`
        height: 30px;
        margin-left: 10px;
        cursor: pointer;
`
    const H3WithReload = styled.h3`
    display: flex;
    align-items: center;
`


    // * ---------- SATES --------- *
    const [nameList, setNameList] = useState({});
    const [isStudentListLoaded, setIsStudentListLoaded] = useState(false);

    // Get the list of all student from the API
    const getStudentList = () => {
        fetch('http://127.0.0.1:5000/get_student_list')
            .then(response => response.json())
            .then (response =>{
                if(!isStudentListLoaded){
                    setNameList(response)
                    setIsStudentListLoaded(true)
                }
            })
    }
    getStudentList()

    // Component that map all the students's name
    const EmployeeListItem = props => {
        let obj = props.list
        let studentList = Object.keys(obj).map(key => {
            return <EmployeeItem name={ obj[key] } />
        })
        return studentList
    }

    // Component that contain the Students's name and a button to delete it
    const EmployeeItem = props => {

        // Function that send the employee's name to delete
        const deleteEmployee = name => {
            fetch(`http://127.0.0.1:5000/delete_student/${name}`)
                .then(response => response.json())
                .then(() => setIsStudentListLoaded(false))
        }
        return(
            <ItemLi> { props.name } <ItemButton onClick={ () => deleteEmployee(props.name) }>DELETE</ItemButton></ItemLi>
        )
    }

    return (
        <section>
            <H3WithReload>Delete a Student <ReloadImgTag onClick={ () => setIsStudentListLoaded(false) } src={ realodImg } alt="reload"/> </H3WithReload>
            <ul>
                { nameList ? <EmployeeListItem list={ nameList } /> : null}
            </ul>
        </section>
    );
};

export default EmployeeToDeleteList;