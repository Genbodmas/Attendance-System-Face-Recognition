import React, { Fragment } from 'react'
import './App.css'
import CameraFeed from './Components/CameraFeed/CameraFeed'
import Search from './Components/Search/SearchBar'
import LastArrival from './Components/LastArrival/LastArrivalList'
import AdminBlock from './Components/AdminBlock/AdminBlock'
import styled from 'styled-components'

function App() {

	// * ---------- STYLE ---------- *
	const TitleOne = styled.h1`
		margin-top : 30px;
		font-size: 50px;
		line-height: 1;
		font-weight: bold;
		color: #013087;
		text-align: center;
`
	const MainContainer = styled.main`
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
`


	return(
		<Fragment>
			<TitleOne>Attendance System With Facial Recognition</TitleOne>
			<MainContainer>
				<CameraFeed />
				<Search />
				<LastArrival />
				<AdminBlock />
			</MainContainer>
		</Fragment>
	)}

export default App