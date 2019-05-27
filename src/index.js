import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import './index.css';
import * as serviceWorker from './serviceWorker';
import App from './App'
import Login from './LoginPage'
import Admin from './Admin'
import AdminLogin from './AdminLogin'
import CourseEditing from './CourseEditing'
import GetAffect from './getAffect'
import ManageStudents from './studentManagement'
import ChangeStudents from './changeStudent'
import ResultPage from './resultPage.js'
import Page404 from './404.js'
import Questionnaire from "./Questionnaire";

const routing = (
  <Router>
    <Switch>
      <Route exact path="/form" component={Questionnaire} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/admin" component={Admin} />
      <Route exact path="/admin/login" component={AdminLogin} />
      <Route exact path="/admin/manage-courses" component={CourseEditing} />
      <Route exact path="/admin/get-affect" component={ResultPage} />
      <Route exact path="/admin/manage-students" component={ManageStudents} />
      <Route exact path="/admin/change-students" component={ChangeStudents} />
      <Route component={Page404} />
    </Switch>
  </Router>
)
ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
