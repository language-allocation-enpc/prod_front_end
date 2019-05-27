import React, {Component} from 'react';
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import url from "./url";
import { CSVDownload } from "react-csv";

axios.defaults.withCredentials = true
class ResultPage extends Component {
  constructor(props) {
      super(props);
      this.state = {token:window.sessionStorage.getItem("jwt_token"), isAuth:null, course_list:null, student_has_course:null, course_has_student:null};

    }


  componentDidMount(){
    axios.get(url+'admin/check-auth', {withCredentials:true, headers:{Authorization: 'Bearer '+this.state.token}}).then(
      (res)=>{
        this.setState({isAuth:true});
        console.log("Successfully authentified")
    },
      (err)=>{
        console.log("in the error loop")
        this.setState({isAuth:false});
        this.props.history.push('/admin/login')
      }
    )
    axios.get(url+"courses/", {withCredentials:false})
    .then(
      (result) => {
        let new_state=this.state;
        new_state.course_list = result.data.result
        this.setState({
          new_state
        });
      },
      (error) => {
        console.log("something wrong occured while asking for course list")
      }
    );
  }

  getAuth=()=>{
    axios.get(url+'admin/check-auth', {withCredentials:false, Authorization: 'Bearer '+this.state.token}).then(
      (res)=>{
        this.state.isAuth=true;
        return true;
    },
      (err)=>{
        console.log(err);
        this.state.isAuth=false;
        return false;
      }
    )
  }

  logout=()=>{
    axios.delete(url+'admin/logout', {withCredentials:true, Authorization: 'Bearer '+this.state.token}).then(
      (res)=>{
        console.log(res.data.msg)
        this.state.isAuth=false;
        this.props.history.push('/admin/login');
    },
      (err)=>{
        console.log(err);
        this.state.isAuth=false;
        this.props.history.push('/admin/login');
      }
    )
  }
  makeAffectations=()=>{
    axios.post(url+'admin/solve-courses/',{withCredentials:false}).then(
      (res)=>{
        console.log("Affectation réussie");
      },
      (err)=>{
        console.log("Erreur d'affectation");
      }
    )
  }
  downloadAffectations=()=>{
    this.makeAffectations();
    axios.get(url+'users/students/get-courses', {withCredentials:true, headers:{Authorization: 'Bearer '+this.state.token}}).then(
      (res)=>{
        let data = res.data.result;
        console.log(data);
        let student_has_course=[["Nom", "Prénom", "Email", "Cours"]];
        let course_has_student=[["Cours", "Liste des Inscrits"]];
        for (let i=0;i<data.length;i++){
          let root = [data[i].name.split(' ')[1],data[i].name.split(' ')[0], data[i].email];
          for (let j=0;j<data[i].courses.length;j++){
            for (let n=0;n<this.state.course_list.length;n++){
              if (data[i].courses[j].id===this.state.course_list[n].id){
                let current = root + [data[i].courses[j].name];
                root = ['','',''];
              }
            }
          }
        }
        for (let i=0;i<this.state.course_list.length;i++){
          let root = [this.state.course_list[i].name];
          for (let j=0;j<data.length;j++){
            for (let n=0;n<data[j].courses.length;n++){
              if (this.state.course_list[i].id == data[j].courses[n].id){
                let current = root + [data[i].name];
                root = [''];
              }
            }
          }
        }
        console.log(student_has_course);
        console.log(course_has_student);
        return(<div><CSVDownload data={student_has_course} target="_blank" /><CSVDownload data={course_has_student} target="_blank" /></div>);
    },
      (err)=>{
        console.log(err);
        this.state.isAuth=false;
        return false;
      }
    )
  }
  sendAffectations=()=>{
    axios.post(url+"/users/students/send-affect", {withCredentials:false}).then(
      (res)=>{
        console.log('Mails are sent')
      },
      (err)=>{
        console.log("Error with mails")
      }
    )
  }

  render() {
      if (this.state.isAuth){
        return (
        <div className="buttonList" style={{
          textAlign:'center',
        position: 'absolute', left: '50%', top: '40%',
        transform: 'translate(-50%, -50%)'
    }}><h2>Bienvenue sur le portail de gestion du questionnaire de langues de la DLC<br/><br/></h2>
        <form>
        <input type="button" style={{  backgroundColor: "#4CAF50",border: "none",color: "white",padding: "15px 32px",textAlign: "center",textDecoration: "none",display: "inlineBlock",fontSize: "16px"}} value="Génerer les résultats & Télécharger les affectations" onClick={()=>this.downloadAffectations()} />
        </form>
        <br/>
        <form>
        <input type="button" style={{  backgroundColor: "#4CAF50",border: "none",color: "white",padding: "15px 32px",textAlign: "center",textDecoration: "none",display: "inlineBlock",fontSize: "16px"}} value="Envoyer les résultats" onClick={()=>this.sendAffectations()} />
        </form>
        <br/>
        <form>
        <input type="button" style={{  backgroundColor: "#BB3C21",border: "none",color: "white",padding: "15px 32px",textAlign: "center",textDecoration: "none",display: "inlineBlock",fontSize: "16px"}} value="Retour" onClick={()=>this.props.history.push('/admin/')} />
        </form>
        </div>
      )
    }
    else{
      return(<div>En cours d'authentification</div>)
    }

  }
}

export default ResultPage;
