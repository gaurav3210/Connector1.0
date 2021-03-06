import React, {Fragment,useEffect} from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {getCurrentProfile} from "../../actions/profile";
import  Spinner from '../layout/Spinner';
import {Link} from "react-router-dom";
import Experience from "./Experience";
import Education from "./Education"
import DashboardEdit from "./DashboardEdit";
const Dashboard = ({getCurrentProfile,auth:{user},profile:{profile,loading}}) => {
    useEffect(() => {getCurrentProfile();},
        []);

     console.log("1",profile)
    return loading && profile === null?<Spinner/>:(<Fragment>
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
            <i className="fas fa-user"></i>Welcome {user && user.name}
        </p>
        {profile !== null? (

            <Fragment>

               <DashboardEdit/>

                <Experience experience={profile.profile.experience}/>
                <Education education={profile.profile.education}/>

                </Fragment>):
            (<Fragment>
                    <p> You have not yet setup Profile,please add some information about yourself</p>
                    <Link to='/create-profile' className='btn btn-primary my-1'>
                        Create Profile
                    </Link>
                </Fragment>


            )}
    </Fragment>
    );
};
Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile:PropTypes.object.isRequired,
};
const mapStateToProps = state =>({
    auth: state.auth,
    profile: state.profile
})
export default connect(mapStateToProps,{getCurrentProfile})(Dashboard);