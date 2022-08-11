import React from 'react';
import {Route, Link, Routes} from 'react-router-dom';

import './NotFound.css'

export default function PageNotFound() {
  return (
    <div className='d-flex justify-content-center align-items-center no-found'>
      <div className='no-found-child'>
        <h2>404 Page not found</h2>
      </div>
    </div>
  );
}