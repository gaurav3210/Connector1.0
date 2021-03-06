import React,{Fragment,useState,useEffect} from "react";
import PropTypes from 'prop-types';
import {Link,withRouter} from 'react-router-dom';
import {connect} from "react-redux";
import {addEducation} from "../../actions/profile";

const AddEducation = ({addEducation,history}) => {
    const initialState = {
        school: '',
        degree: '',
        fieldofstudy: '',
        from: '',
        to: '',
        current: false,
        description: ''
    };
    const [toDateDisable,toggleDisable] = useState(false);
    const [formData,setFormData] = useState(initialState);

    const {school,degree,fieldofstudy,from,to,current,description} = formData;
    const onSubmit = e => {
        e.preventDefault();
        addEducation(formData,history)

    }
    const onChange = e => setFormData({...formData,[e.target.name]:e.target.value});
    return (
        <Fragment>
            <h1 className="large text-primary">
                Add An Education
            </h1>
            <p className="lead">
                <i className="fas fa-code-branch"></i> Add any school/college that you have attended
            </p>
            <small>* = required field</small>
            <form className="form" onSubmit={e=>onSubmit(e)}>
                <div className="form-group">
                    <input type="text" placeholder="* Degree" name="degree" value={degree} onChange={e=>onChange(e)} required/>
                </div>
                <div className="form-group">
                    <input type="text" placeholder="* School" name="school" value={school} onChange={e=>onChange(e)}required/>
                </div>
                <div className="form-group">
                    <input type="text" placeholder="fieldofstudy" name="fieldofstudy" value={fieldofstudy} onChange={e=>onChange(e)} required/>
                </div>
                <div className="form-group">
                    <h4>From Date</h4>
                    <input type="date" name="from" value={from} onChange={e=>onChange(e)}/>
                </div>
                <div className="form-group">
                    <p><input type="checkbox" name="current" checked={current} value={current} onChange={e=>{
                        setFormData({...formData,current: !current});
                        toggleDisable(!toDateDisable);
                    }}/> Currently Studying</p>
                </div>
                <div className="form-group">
                    <h4>To Date</h4>
                    <input type="date" name="to" value={to} onChange={e=>onChange(e)}
                    disabled={toDateDisable? 'disabled':''} />
                </div>
                <div className="form-group">
          <textarea
              name="description"
              cols="30"
              rows="5"
              placeholder="description"
              value={description} onChange={e=>onChange(e)}
          ></textarea>
                </div>
                <input type="submit" className="btn btn-primary my-1"/>
                <Link  className="btn btn-light my-1" to="/dashboard">Go Back</Link>
            </form>
        </Fragment>
    )
}

AddEducation.propTypes = {
addEducation: PropTypes.func.isRequired
}
export default connect(null,{addEducation})(withRouter(AddEducation));