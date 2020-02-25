import React from 'react';
import { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

export default class PrivateRoute extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authenticated: false
        };
    }

    render() {
        const { component: Component, ...rest } = this.props;
        return <Route {...rest}
            render={(props) => {
                if (localStorage.getItem('status') === 'true') {
                    return <Component {...props} />
                } else {
                    return <Redirect to={"/"} />
                }
            }} />
    }
}