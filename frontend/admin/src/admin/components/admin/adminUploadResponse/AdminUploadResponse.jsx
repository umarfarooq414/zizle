import React from 'react';
import styled from './style.module.css';
// import { faEdit, faEye, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';

const AdminUploadResponse = () => {
  return (
    <div>
      <div className={styled.adminUploadData}>
        <table className={styled.tableResponse} width='100%' cellpadding='0' cellspacing='0'>
          <tr>
            <td>Name</td>
            <td>Response</td>
          </tr>
          <tr>
            <td>
              <Link to='#'>Name</Link>
            </td>
            <td>Response</td>
          </tr>
          <tr>
            <td>
              <Link to='#'>Name</Link>
            </td>
            <td>Response</td>
          </tr>
          <tr>
            <td>
              <Link to='#'>Name</Link>
            </td>
            <td>Response</td>
          </tr>
          <tr>
            <td>
              <Link to='#'>Name</Link>
            </td>
            <td>Response</td>
          </tr>
          <tr>
            <td>
              <Link to='#'>Name</Link>
            </td>
            <td>Response</td>
          </tr>
          <tr>
            <td>
              <Link to='#'>Name</Link>
            </td>
            <td>Response</td>
          </tr>
          <tr>
            <td>
              <Link to='#'>Name</Link>
            </td>
            <td>Response</td>
          </tr>
          <tr>
            <td>
              <Link to='#'>Name</Link>
            </td>
            <td>Response</td>
          </tr>
          <tr>
            <td>
              <Link to='#'>Name</Link>
            </td>
            <td>Response</td>
          </tr>
          <tr>
            <td>
              <Link to='#'>Name</Link>
            </td>
            <td>Response</td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default AdminUploadResponse;
