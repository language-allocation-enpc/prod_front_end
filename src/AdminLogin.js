import React, {Component} from 'react';
import axios from 'axios';
import url from "./url";
import "./Admin.css"
import error_panel from './images/error_panel.png';



class AdminPage extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      password: '',
      isAuth:false,
      error: null
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }
  login = user => {
    return axios.post(url+'admin/login', {
        email: user.email,
        password: user.password,
        withCredentials:true
      })
      .then(response => {
        if (!response.data.error){
            this.setState({
              isAuth:true
            })
            return response.data.token
        }
        else{
          this.setState({error: "Bad Identification : "+response.data.error});
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit(e) {
    e.preventDefault()

    const user = {
      email: this.state.email,
      password: this.state.password
    }

    this.login(user).then(res => {
      if (this.state.isAuth) {
        window.sessionStorage.setItem("jwt_token", res)
        this.props.history.push('/admin');
      }else{
        this.props.history.push('/admin/login');
      }
    })
  }


  render() {
    if (this.state.error){
      return (
        <div className="main">
        <div className="LoginPage">
        <span style={{backgound:"#0000FF", textAlign:"center",margin:"0 0 20 20", textColor:"#000000"}}>
        <div className="head_banner">
        Admin DLC
        </div>
        </span>


        <span style={{
          textAlign:'center',
        position: 'absolute', left: '50%', top: '40%',
        transform: 'translate(-50%, -50%)'
    }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6 mt-5 mx-auto">
              <form noValidate onSubmit={this.onSubmit}>
                <h1 className="h3 mb-3 font-weight-normal">Connectez-vous</h1>
                <div className="form-group">
                  <label htmlFor="email">Adresse mail <br/></label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.onChange}
                  />
                </div><br/>
                <div className="form-group">
                  <label htmlFor="password">Mot de passe <br/></label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Mot de passe"
                    value={this.state.password}
                    onChange={this.onChange}
                  />

                </div>
                <br/>
                <button
                  type="submit"
                  className="btn btn-lg btn-primary btn-block"
                >
                  Se connecter
                </button>
              </form>
              <br/><br/>

              <ErrorMessage text="Mauvais identifiant / email"/>
            </div>
          </div>
        </div>
        </span>
        </div>
        </div>
      )
    }else{
      return (
        <div className="LoginPage">
        <span style={{backgound:"#0000FF", textAlign:"center",margin:"0 0 20 20", textColor:"#000000",zIndex:'0'}}>
        <div className="head_banner">
        Admin DLC
        </div>
        </span>


        <span style={{
          textAlign:'center',
        position: 'absolute', left: '50%', top: '40%',
        transform: 'translate(-50%, -50%)'
    }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6 mt-5 mx-auto">
              <form noValidate onSubmit={this.onSubmit}>
                <h1 className="h3 mb-3 font-weight-normal">Connectez-vous</h1>
                <div className="form-group">
                  <label htmlFor="email">Adresse mail <br/></label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.onChange}
                  />
                </div><br/>
                <div className="form-group">
                  <label htmlFor="password">Mot de passe <br/></label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Mot de passe"
                    value={this.state.password}
                    onChange={this.onChange}
                  />

                </div>
                <br/>
                <button
                  type="submit"
                  className="btn btn-lg btn-primary btn-block"
                >
                  Se connecter
                </button>
              </form>
            </div>
          </div>
        </div>
        </span>
        </div>
      )
    }

  }
}

class ErrorMessage extends Component {
  render() {
    return (
      <div className="error-message" ><img src={error_panel} alt="error_panel" style={{height: "5vh"}}/>{this.props.text}</div>
    );
  }
}
export default AdminPage;
