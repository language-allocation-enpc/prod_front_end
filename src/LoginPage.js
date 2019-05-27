import React, { Component } from 'react';
import './LoginPage.css';
import axios from 'axios';
import url from "./url";
import queryString from 'query-string';
import {Cookies} from 'react-cookie';
import { Redirect } from 'react-router-dom'


class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {token:null, user_name:null, user_email:null, user_vows:null, got_data:null};
      }
    componentDidMount() {
        const token = queryString.parse(this.props.location.search).token;
        axios.get(url+"login/"+token,{withCredentials:false})
        .then(
          (result) => {
            let new_state=this.state;
            window.sessionStorage.setItem("token", token);
            window.sessionStorage.setItem("name", result.data.result.name)
            window.sessionStorage.setItem("email", result.data.result.email)
            window.sessionStorage.setItem("vows", result.data.result.vows)
            new_state.got_data=true;
            this.setState({
              new_state
            });
            this.props.history.push('/form')
          },
          (error) => {
            console.log("Error 404 : Invalid Token");
            this.props.history.push('/404')
          }
        );

      }

    getState=()=>{
        return this.state;
    }

    onSubmit=()=>{
        this.props.handlePageChange("questionnaire");//ajouter une requête
    }

    handleInputChange=(event)=>{
        const target = event.target;
        const value =  target.value;
        const name = target.name;

        let new_state= this.state;
        new_state[name]=value;
        this.setState(new_state);
    }

    render() {
      return(<div>login...</div>)
    }
  }


export default LoginPage;
