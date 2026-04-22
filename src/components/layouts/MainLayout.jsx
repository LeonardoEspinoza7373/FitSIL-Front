// src/components/Layout/MainLayout.jsx
import React from 'react';
import GlobalNavbar from '../Navbar/GlobalNavbar';
import { useTheme } from '../../context/ThemeContext';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const { darkMode } = useTheme();

  return (
    <div className={`main-layout ${darkMode ? 'dark' : ''}`}>
      <GlobalNavbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;