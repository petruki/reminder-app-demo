import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';

import { authService } from '../_services';
import { procEnv } from '../_environment';

const LoginComponent = (props) => {
    const [auth, setAuth] = useState(false);

    return (
        <div className="card width-70 margin-auto">
            <h5 className="card-header bg-secondary text-white">Login</h5>
            <div className="card-body">
            <Formik
                initialValues={{
                    username: '',
                    password: ''
                }}

                onSubmit={({ username, password }, { setStatus, setSubmitting }) => {
                    setAuth(true);
                    setStatus();
                    authService.login(username, password)
                        .then(user => {
                            const { from } = props.location.state || { from: { pathname: '/' } };
                            props.history.push(from);
                        }, error => {
                            setSubmitting(false);
                            setAuth(false);
                            setStatus('Invalid username/password');
                        });
                }}
                
                render={({ status, isSubmitting, errors }) => (
                    <Form>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <Field name="username" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <Field name="password" type="password" className="form-control" />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                <i className="fa fa-check"></i> Login</button>

                            <Link to="/signup">
                                <button className="btn btn-secondary margin-left-10" >
                                    <i className="fa fa-sign-out"></i> Sign Up</button>
                            </Link>
                        </div>

                        { status &&
                            <div className={'alert alert-danger'}>{ status }</div>
                        }
                    </Form>
                )}
            />
            </div>
            <div className="card-footer">
                {auth ?
                    <div className="center">
                            <hr className="left-separator" />
                                <div className="spinner-border text-secondary center" role="status" />
                            <hr className="right-separtor" />
                    </div>
                    : <p className="margin-auto text-muted">Running at {procEnv || 'development'}</p>
                }
            </div>
        </div>
    );
}

export { LoginComponent }; 