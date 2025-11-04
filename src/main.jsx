import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './Navbar'
import HomePage from './HomePage'
import StudentsPage from './StudentsPage'
import FilterPage from './FilterPage'
import ImprovementsPage from './ImprovementsPage'
import './styles.css'

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<Navbar />
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/students" element={<StudentsPage />} />
			<Route path="/filter" element={<FilterPage />} />
			<Route path="/improvements" element={<ImprovementsPage />} />
		</Routes>
	</BrowserRouter>
)
