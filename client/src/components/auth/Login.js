import React,{Fragment, useState } from "react";
import axios from "axios";
import {Link,Redirect} from "react-router-dom";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {login} from "../../actions/auth";

const Login = ({login,isAuthenticated}) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const {email,password} = formData;
    const onChange = e =>setFormData({...formData,[e.target.name]: e.target.value})
    const onSubmit = async e =>{
        e.preventDefault();


            // const newUser ={
            //     name,
            //     email,
            //     password
            // }
            // try{
            //     const config = {
            //         headers: {
            //             'Content-Type': 'application/json'
            //         }
            //     }
            //     const body = JSON.stringify(newUser);
            //     const res = await axios.post('/api/users',body,config);
            //     console.log(res.data);
            //
            // }catch (e) {
            //    console.error(e.response.data);
            // }
           login(email,password);

    }
    // redirect if logged in
    if(isAuthenticated){
        return <Redirect to ="/dashboard"/>
    }
    return (
        <Fragment>
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
            <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
            <p className="my-1">
                Dont have an account? <Link to="/register">Sign In</Link>
            </p>
        </Fragment>
    )
};

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
}
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})
export default connect(mapStateToProps,{login})(Login);