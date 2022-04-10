import React, { useState } from 'react';
import styled from 'styled-components';

// * --------- COMPONENTS --------- *
import SearchBarResult from './SearchBarResult'


const SearchBar = props => {

    // * ---------- STATES ---------- *
    const [studentList, setStudentList] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    // * ---------- STYLE ---------- *
    const SearchSection = styled.section`
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
            color: #013087;
            text-align: center;
        }
`
    const SearchContainer = styled.section`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    `
    const AnswerDiv = styled.div`
        min-width: 90%;
`
    const SearchInput = styled.input`
        max-width: 200px;
        margin-bottom: 20px;
        outline: 0;
        border-width: 0 0 1px;
        border-color: #013087;
        padding: 5px;
    `
     const SearchButton = styled.button`
     max-width: 100px;
     padding: 10px 20px;
     background: forestgreen;
     border: none;
     border-radius: 3px;
     color: white;
     font-weight: bold;
     margin:0;
     cursor: pointer;
`
    const FormDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 90%;
    `


    const searchForStudent = () => {
        const name = document.getElementById('searchForStudent').value.toLowerCase()


        if(name){
        console.log(name)
            fetch(`http://127.0.0.1:5000/get_student/${name}`)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                if(response){
                   setStudentList(response)
                } else {
                  setErrorMessage(response.Error)
                  // setLoading(false)
                }
            })
        }
        else{
           setStudentList(['No name find...'])
        }
    }
    const SearchListAnswer = props => {
        let obj = props.answer
        let answerList = Object.keys(obj).map(key => {
            return <SearchBarResult result={ obj[key] } />
        })
        return answerList
    }

    return (
            <SearchSection>
				<h2>Search for a student</h2>
                <SearchContainer>
                    <FormDiv>
                        <SearchInput name='searchForStudent' id='searchForStudent' placeholder='John Doe' type="text"/>
                        <SearchButton onClick={ searchForStudent } id='searchButton'>Search</SearchButton>
                    </FormDiv>
                    <AnswerDiv>
                        {/* Show user's data if user found */}
                        { ( studentList && !studentList['error'] ) ? <SearchListAnswer answer={ studentList } /> : null }

                        {/* Show an error if user is not found */}
                        { studentList['error'] ? <p>Student not found...</p> : null }
                    </AnswerDiv>
                </SearchContainer>
			</SearchSection>
    );
};

export default SearchBar;
