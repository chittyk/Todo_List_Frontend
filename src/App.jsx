
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import DashBoard from './pages/DashBoard'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {

  function PrivateRoute({children}) {
    return localStorage.getItem('token') ? children : <Navigate to="/login" replace/>
  }
  function UnPrivateRoute({children}) {
    return localStorage.getItem('token') ? <Navigate to="/" ></Navigate> : children
  }
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute><DashBoard /></PrivateRoute>} />
      <Route path="/signup" element={ <UnPrivateRoute><Signup/></UnPrivateRoute> } ></Route>
      <Route path='/login' element={ <UnPrivateRoute><Login></Login></UnPrivateRoute> } ></Route>
    </Routes>
  )
}

export default App
