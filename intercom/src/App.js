import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import Callback from './components/Callback';
import Users from './components/Users/Users';
import SingleUser from './components/Users/SingleUser';
import Intro from './components/Intro/Intro';
import Team from './components/Team/Team';
import Register from './components/Register/Register';
import auth0Client from './components/Auth';
// import Auth0Lock from 'auth0-lock';



import './App.css';

// let lock = new Auth0Lock(
//   'UoCaR6kp7Fw9utIWr3Wcr8qsFQPT1m8M',
//   'dev-6iblqc4g.auth0.com',
//   {
//     auth: {
//       redirect: false
//       // redirectUri: `http://localhost:3000/callback`
//     }
//   }
// )

class App extends Component {


  signIn = (e) => {
    e.preventDefault();
    auth0Client.signIn()
    // lock.show()
  }

  signOut = () => {
    auth0Client.signOut()
  }
  render() {
    return (
      <Router>
        <div className="App">
          <header>
            <nav>
              <NavLink to="/team">Team Members </NavLink>
              <NavLink to="/users">Users </NavLink>
              {localStorage.getItem('jwt') ? <button onClick={this.signOut}>Sign Out</button> :
                <button onClick={this.signIn}>Sign In</button>
              }
            </nav>
          </header>
          <main>
            <Route exact path="/" component={Intro} />
            <Route path="/team" component={Team} />
            <Route path='/callback' component={Callback} />
            <Route exact path="/users" component={Users} />
            <Route exact path="/users/:id" component={SingleUser} />
            <Route path="/register" component={Register} />
          </main>
        </div>
      </Router>
    );
  }
}

export default App;
