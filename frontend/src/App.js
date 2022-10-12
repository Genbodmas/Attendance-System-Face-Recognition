import React, { Fragment } from 'react'
// import './App.css'
import CameraFeed from './Components/CameraFeed/CameraFeed'
import Search from './Components/Search/SearchBar'
import LastArrival from './Components/LastArrival/LastArrivalList'
import AdminBlock from './Components/AdminBlock/AdminBlock'
import styled from 'styled-components'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Home from './pages/home'
import Admin from './pages/Admin'


function Layout(){
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
	return (
		<Fragment>
			<TitleOne>Attendance System With Facial Recognition</TitleOne>
			<MainContainer>
				<CameraFeed />
				<Search />
				<LastArrival />
				<AdminBlock />
			</MainContainer>
		</Fragment>
	)
}

function App() {

	return (
		<BrowserRouter>
		<Routes>
		  <Route index element={<Home />} />
		  <Route path="login" element={<Login />}/>
		  <Route path="admin" element={<Admin />}/>
		</Routes>
	  </BrowserRouter>
	)
}

export default App