import React, { Component } from 'react';
import { MainPage } from './components/MainPage';
import PrivateRoute from './components/PrivateRoute';

export default class App extends Component {
    displayName = App.name

    render() {
        return (
            <PrivateRoute component={MainPage} />
        );
    }
}