import React, { Component } from 'react';

const url = "api/Login";

export class Home extends Component {
    displayName = Home.name

    constructor(props) {
        super(props);
        this.state = {
            Email: "gmail@gmail.com",
            Login: "sobl",
            Password: "Do_1234567",
            ConfirmPassword: "Do_1234567"
        };
        this.registration = this.registration.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangeLogin = this.handleChangeLogin.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeSubPassword = this.handleChangeSubPassword.bind(this);
    }

    handleChangeEmail(event) {
        this.setState({ Email: event.target.value });
    }

    handleChangeLogin(event) {
        this.setState({ Login: event.target.value });
    }

    handleChangePassword(event) {
        this.setState({ Password: event.target.value });
    }

    handleChangeSubPassword(event) {
        this.setState({ ConfirmPassword: event.target.value });
    }

    registration() {
        //fetch(`${url}/Sum`, {
        //    method: 'POST',
        //    headers: {
        //        'Accept': 'application/json',
        //        'Content-Type': 'application/json'
        //    },
        //    body: JSON.stringify("aSd")
        //})
        //    .then(response => response.json())
        //    .then(data => {
        //        console.log(data);
        //    });
        fetch(`${url}/Registration`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => console.error('Unable to log in.', error));
    }

    render() {
        return (
            <div>
                <label>
                    Email:<input type="text" value={this.state.Email} onChange={this.handleChangeEmail} />
                </label>
                <label>
                    Логин:<input type="text" value={this.state.Login} onChange={this.handleChangeLogin} />
                </label>
                <label>
                    Пароль:<input type="text" value={this.state.Password} onChange={this.handleChangePassword} />
                </label>
                <label>
                    Повтор пароля:<input type="text" value={this.state.ConfirmPassword} onChange={this.handleChangeSubPassword} />
                </label>
                <button onClick={this.registration}>
                    Зарегистрироваться
                </button>
            </div>
        );
    }
}
