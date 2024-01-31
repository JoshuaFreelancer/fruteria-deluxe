// App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Loader from './components/utils/Loader.jsx';
import HeaderSection from './components/HeaderSection.jsx';
import LoginForm from './components/Auth/LoginForm.jsx';
import RegistrationForm from './components/Auth/RegistrationForm.jsx';
import Dashboard from './components/Dashboard.jsx';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Loader />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeaderSection />
                <LoginForm />
                <RegistrationForm />
              </>
            }
          />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
