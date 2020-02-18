import React, { Component, } from 'react';
import { Button } from 'react-bootstrap';
import './Home.css';

const url = "api/Login";

export class Home extends Component {
    displayName = Home.name

    constructor(props) {
        super(props);
        // Пришлось дублировать модели т.к. вложения в state не позволяют использовать setState
        this.state = {
            SignUpUsername: "sobl",
            SignUpPassword: "Do_1234567",
            SignUpEmail: "gmail@gmail.com",
            LogInUsername: "sobl",
            LogInPassword: "Do_1234567",
            Mode: false,
            Active: false
        };

        this.userSignUp = {
            Email: "gmail@gmail.com",
            Username: "sobl",
            Password: "Do_1234567"
        }
        this.userLogIn = {
            Username: "sobl",
            Password: "Do_1234567"
        }

        this.toggle = this.toggle.bind(this);
        this.signup = this.signup.bind(this);
        this.login = this.login.bind(this);
        this.loginChangeUsername = this.loginChangeUsername.bind(this);
        this.loginChangePassword = this.loginChangePassword.bind(this);
        this.signupChangeEmail = this.signupChangeEmail.bind(this);
        this.signupChangeUsername = this.signupChangeUsername.bind(this);
        this.signupChangePassword = this.signupChangePassword.bind(this);
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
                        Active: true
                    });
                }
                return response.json()
            })
            .then(json => {
                if (!this.Active) {
                    alert(json);
                }
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
        });
    }

    render() {
        return (
            <div>
                <div className={`container ${this.state.Mode ? 'log-in' : ''} ${this.state.Active ? 'active' : ''}`} >
                    <div className="box"></div>
                    <div className="container-forms">
                        <div className="container-info">
                            <div className="info-item">
                                <div className="table">
                                    <div className="table-cell">
                                        <p>
                                            Have an account?
                                    </p>
                                        <button className="btn" onClick={this.toggle}>
                                            Log in
                                    </button>
                                    </div>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="table">
                                    <div className="table-cell">
                                        <p>
                                            Don't have an account?
                                    </p>
                                        <button className="btn" onClick={this.toggle}>
                                            Sign up
                                    </button>
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
                                        <button className="btn btn-mode" onClick={this.login}>
                                            Log in
                                    </button>
                                    </div>
                                </div>
                            </div>
                            <div className="form-item sign-up">
                                <div className="table">
                                    <div className="table-cell">
                                        <input name="email" placeholder="Email" type="email" required required value={this.state.SignUpEmail} onChange={this.signupChangeEmail} />
                                        <input name="Username" placeholder="Username" type="text" required pattern="^[a-zA-Z0-9_]{3,18}$" required value={this.state.SignUpUsername} onChange={this.signupChangeUsername} />
                                        <input name="Password" id="mainPassword" placeholder="Password" type="Password" required pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*#?&_]{8,50}$" required value={this.state.SignUpPassword} onChange={this.signupChangePassword} />
                                        <button className="btn btn-mode" onClick={this.signup}>
                                            Sign up
                                    </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`btnContainer ${this.state.Active ? 'visible' : 'hidden'}`}><Button className="btn-start" href="/">Log in</Button></div>
            </div>
        );
    }
}
