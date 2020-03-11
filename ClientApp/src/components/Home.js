import React, { Component, } from 'react';
import { Button, Grid, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import './Home.css';

const url = "api/Login";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export class Home extends Component {
    displayName = Home.name

    constructor(props) {
        super(props);
        // Пришлось дублировать модели т.к. вложения в state не позволяют использовать setState
        this.state = {
            SignUpUsername: "",
            SignUpPassword: "",
            SignUpEmail: "",
            LogInUsername: "",
            LogInPassword: "",
            Mode: false,
            Active: false,
            validate_message_open: false,
            message: "",
            type_of_message: "error"
        };

        this.userSignUp = {
            Email: "",
            Username: "",
            Password: ""
        }
        this.userLogIn = {
            Username: "",
            Password: ""
        }

        this.toggle = this.toggle.bind(this);
        this.signup = this.signup.bind(this);
        this.login = this.login.bind(this);
        this.loginChangeUsername = this.loginChangeUsername.bind(this);
        this.loginChangePassword = this.loginChangePassword.bind(this);
        this.signupChangeEmail = this.signupChangeEmail.bind(this);
        this.signupChangeUsername = this.signupChangeUsername.bind(this);
        this.signupChangePassword = this.signupChangePassword.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    loginChangeUsername(event) {
        this.setState({ LogInUsername: event.target.value });
        this.userLogIn.Username = event.target.value;
    }

    loginChangePassword(event) {
        this.setState({ LogInPassword: event.target.value });
        this.userLogIn.Password = event.target.value;
    }

    signupChangeEmail(event) {
        this.setState({ SignUpEmail: event.target.value });
        this.userSignUp.Email = event.target.value;
    }

    signupChangeUsername(event) {
        this.setState({ SignUpUsername: event.target.value });
        this.userSignUp.Username = event.target.value;
    }

    signupChangePassword(event) {
        this.setState({ SignUpPassword: event.target.value });
        this.userSignUp.Password = event.target.value;
    }

    toggle() {
        this.setState({
            Mode: !this.state.Mode
        });
    }

    signup() {
        fetch(`${url}/Signup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.userSignUp)
        })
            .then(response => {
                if (response.ok) {
                    this.setState({
                        Active: true,
                        type_of_message: "success"
                    })
                }
                else {
                    this.setState({
                        type_of_message: "error"
                    })
                }
                return response.json()
            })
            .then(json => {
                this.setState({
                    message: json,
                    validate_message_open: true
                })
            })
            .catch(() => {
                this.setState({
                    type_of_message: "error",
                    message: "An error has occurred. Please, try again",
                    validate_message_open: true
                })
            });
    }

    login() {
        fetch(`${url}/Login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.userLogIn)
        })
            .then(response => {
                if (response.ok) {
                    localStorage.setItem('status', true);
                    window.location.reload();
                }
                else {
                    this.setState({
                        message: "Failed to log in",
                        type_of_message: "error",
                        validate_message_open: true
                    })
                }
            })
            .catch(() => {
                this.setState({
                    type_of_message: "error",
                    message: "An error has occurred. Please, try again",
                    validate_message_open: true
                })
            });
    }

    logout() {
        localStorage.setItem('status', false);
    }

    handleClose() {
        this.setState({ validate_message_open: false })
    }

    render() {
        return (
            <div>
                <Snackbar open={this.state.validate_message_open} autoHideDuration={5000} onClose={this.handleClose}>
                    <Alert onClose={this.handleClose} severity={this.state.type_of_message}>
                        {this.state.message}
                    </Alert>
                </Snackbar>
                <div className={`container ${this.state.Mode ? 'log-in' : ''} ${this.state.Active ? 'active' : ''}`}>
                    <div className="container-forms">
                        <div className="container-info">
                            <div className="info-item">
                                <div className="table">
                                    <div className="table-cell">
                                        <p>Have an account?</p>
                                        <Button className="btn" onClick={this.toggle}> Log in</Button>
                                    </div>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="table">
                                    <div className="table-cell">
                                        <Grid container justify="center" alignItems="center" >
                                            <p>Don't have an account?</p>
                                            <Button className="btn" onClick={this.toggle}>Sign up</Button>
                                        </Grid>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container-form">
                            <div className="form-item log-in">
                                <div className="table">
                                    <div className="table-cell">
                                        <input name="Username" placeholder="Username" type="text" required value={this.state.LogInUsername} onChange={this.loginChangeUsername} />
                                        <input name="Password" placeholder="Password" type="Password" required value={this.state.LogInPassword} onChange={this.loginChangePassword} />
                                        <Grid container justify="center" alignItems="center" >
                                            <Button className="btn" onClick={this.login}>Log in</Button>
                                        </Grid>
                                    </div>
                                </div>
                            </div>
                            <div className="form-item sign-up">
                                <div className="table">
                                    <div className="table-cell">
                                        <input name="email" placeholder="Email" type="email" required value={this.state.SignUpEmail} onChange={this.signupChangeEmail} />
                                        <input name="Username" placeholder="Username" type="text" pattern="^[a-zA-Z0-9_]{3,18}$" required value={this.state.SignUpUsername} onChange={this.signupChangeUsername} />
                                        <input name="Password" id="mainPassword" placeholder="Password" type="Password" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*#?&_]{8,50}$" required value={this.state.SignUpPassword} onChange={this.signupChangePassword} />
                                        <Grid container justify="center" alignItems="center" >
                                            <Button className="btn" onClick={this.signup}>Sign up</Button>
                                        </Grid>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Grid container justify="center" alignItems="center">
                    <div className={`log-in-btn ${this.state.Active ? 'visible' : 'hidden'}`}><Button className="btn" href="/">Log in</Button></div>
                </Grid>
            </div>
        );
    }
}
