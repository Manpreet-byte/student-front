import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import ProtectedRoute from './ProtectedRoute'
import Navbar from './Navbar'
import HomePage from './HomePage'
import StudentsPage from './StudentsPage'
import FilterPage from './FilterPage'
import ImprovementsPage from './ImprovementsPage'
import LoginPage from './LoginPage'
import './styles.css'

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<AuthProvider>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/*" element={
					<ProtectedRoute>
						<Navbar />
						<Routes>
							<Route path="/" element={<HomePage />} />
							<Route path="/students" element={<StudentsPage />} />
							<Route path="/filter" element={<FilterPage />} />
							<Route path="/improvements" element={<ImprovementsPage />} />
						</Routes>
					</ProtectedRoute>
				} />
			</Routes>
		</AuthProvider>
	</BrowserRouter>
)
