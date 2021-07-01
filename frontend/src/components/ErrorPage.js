import React from 'react';
import Navbar from './Navbar';

const ErrorPage = () => {
    return(
        <div>
            <Navbar />
            <div className='error-page-text'>Sorry, this page isn't available.</div>
        </div>
    )
};

export default ErrorPage;