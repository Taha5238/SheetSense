import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import TaskPane from './components/TaskPane.jsx'
import './index.css'

/* global Office */

const root = ReactDOM.createRoot(document.getElementById('root'));

const render = (Component) => {
    root.render(
        <React.StrictMode>
            <Component />
        </React.StrictMode>,
    );
};

// Initialize Office JS
if (window.Office) {
    Office.onReady((info) => {
        if (info.host === Office.HostType.Excel) {
            render(TaskPane);
        } else {
            render(App);
        }
    });
} else {
    // Fallback for browser testing if Office.js fails to load or for non-Office environments
    render(App);
}
