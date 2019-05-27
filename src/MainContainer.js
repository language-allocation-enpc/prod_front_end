import React, { Component } from 'react'
import Questionnaire from "./Questionnaire";
import LoginPage from "./LoginPage";

import './MainContainer.css';

class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { page: "login" };
      }

    handlePageChange = page_name => {
        let new_state=this.state;
        new_state.page=page_name;
        this.setState(new_state);
    }
  render() {
      let page=null;
      if(this.state.page==="questionnaire"){
          page=<Questionnaire/>
      } else if(this.state.page==="login"){
        page=<LoginPage handlePageChange={this.handlePageChange}/>
      }
    return (

      <div className="main-container">
      {page}
      </div>
    );
  }
}


export default MainContainer;
