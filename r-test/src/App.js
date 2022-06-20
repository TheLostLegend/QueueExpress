import React from 'react'
import { Routes, Route, useRoutes, BrowserRouter as Router} from 'react-router-dom'
import { Login } from './components/login'
import { RequireAuth } from './components/RequireAuth'

const AppWrapper = () => {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route exact path='/profile' element={<RequireAuth/>}/>
      </Routes>
    </Router>
  );
};

export default AppWrapper;
