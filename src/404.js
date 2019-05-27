import React, { Component } from 'react';


class ErrorPage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="404">
      <h1>Erreur 404</h1><br/>Que fais-tu ici ?</div>
    );
  }
}

export default ErrorPage;
