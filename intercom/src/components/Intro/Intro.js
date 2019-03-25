import React, { Component } from 'react';


class Intro extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <header className="App-header">
                {localStorage.getItem('name') && `Hello ${localStorage.getItem('name')}`}
                <p>
                    Welcome to Intercom!
                </p>

            </header>
        );
    }
}

export default Intro;