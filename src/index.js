import "react-app-polyfill/stable";
import "core-js";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import axios from "axios";
import { HashRouter } from "react-router-dom";

window.addEventListener("storage", (event) => {
  if (event.key === null) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/";
  }
});

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById("root")
);
axios.interceptors.request.use(
  (config) => {
    // Get the authentication token from your authentication system
    const authToken = localStorage.getItem("jwtToken");
    if (authToken) {
      config.headers.Authorization = `${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    // If the response status is not 401, set the flag to true
    if (response.status !== 401) {
      localStorage.setItem("isAuth", true);
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      // Redirect to the login page
      window.location.href = "/";
    } else {
      // For other errors, set the flag to true
      localStorage.setItem("isAuth", true);
    }
    return Promise.reject(error);
  }
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
