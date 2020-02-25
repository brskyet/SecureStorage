import React, { Component, } from 'react';
import './Home.css';

const url = "api/Login";

export class MainPage extends Component {
    displayName = MainPage.name

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    logout() {
        localStorage.setItem('status', false);
        window.location.reload();
    }

    render() {
        return (
            <div>
                MainPage
                <button className="btn btn-mode" onClick={this.logout}>
                    Log out
                </button>
            </div>
        );
    }
}
