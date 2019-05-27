import React, { Component } from 'react';
import MainContainer from "./MainContainer";
import './App.css';
import { CookiesProvider } from 'react-cookie';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { user_answers: {} };
  }
  render() {
    return (
      <div className="app"><MainContainer/></div>
    );
  }
}

export default App;
