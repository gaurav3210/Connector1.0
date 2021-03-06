import React, {Fragment,useEffect } from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from "./components/layout/Alert";
import Dashboard from "./components/Dashboard/Dashboard";
import CreateProfile from "./components/profile-forms/CreateProfile";
import PrivateRoute from "./components/routing/PrivateRoute";
import EditProfile from "./components/profile-forms/EditProfile";
import AddExperience from "./components/profile-forms/addExperience";
import AddEducation from "./components/profile-forms/addEducation";

// redux
import {Provider} from 'react-redux';
import  store from  './store';
import './App.css';
import setAuthtoken from "./utils/setAuthtoken";
import {loadUser} from "./actions/auth";

if(localStorage.token){
            setAuthtoken(localStorage.token);
        }

const App = () => {

    useEffect(() => {store.dispatch(loadUser())},[]);
        return (
    <Provider store={store}>
        <Router>
            <Fragment>
                <Navbar/>
                <Route exact path='/' component={Landing}/>
                <section className="container">
                    <Alert/>
                    <Switch>
                        <Route exact path='/login' component={Login}/>
                        <Route exact path='/register' component={Register}/>
                        <PrivateRoute exact path='/dashboard' component={Dashboard}/>
                        <PrivateRoute exact path='/create-profile' component={CreateProfile}/>
                         <PrivateRoute exact path='/edit-profile' component={EditProfile}/>
                        <PrivateRoute exact path='/add-experience' component={AddExperience}/>
                        <PrivateRoute exact path='/add-education' component={AddEducation}/>
                    </Switch>
                </section>
            </Fragment>
        </Router>
    </Provider>

        )};

export default App;
