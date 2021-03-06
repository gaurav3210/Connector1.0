import React, {Fragment} from "react";
import PropTypes from 'prop-types';
import Moment from "react-moment";
import {connect} from "react-redux";

const Education=({education}) => {

    const educations = education.map((exp)=>(
        <tr key={exp._id}>
            <td>{exp.school}</td>
            <td className='hide-sm'>{exp.degree}</td>
            <td>
                <Moment format='YYYY/MM/DD'>{exp.from}</Moment> - {' '}
                {exp.to === null ? ('Now'):(<Moment format='YYYY/MM/DD'>{exp.to}</Moment>)}

            </td>
            <td>
                <button className='btn btn-danger'>Delete</button>
            </td>
        </tr>
    ));

    return (
        <Fragment>
        <h2 className='my-2'>Education:</h2>
            <table className='table'>
                <thead>
                <tr>
                    <th>Company</th>
                    <th className='hide-sm'>Title</th>
                    <th className='hide-sm'>Years</th>
                </tr>
                </thead>
               <tbody>{educations}</tbody>

            </table>
        </Fragment>
    )


}


Education.propTypes = {
    education: PropTypes.array.isRequired,

};

export default Education;