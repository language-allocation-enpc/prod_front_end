import React from "react";
import { render } from "react-dom";
import axios from "axios";
import url from './url';
import CSVReader from 'react-csv-reader';
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class ChangeStudents extends React.Component {
  constructor() {
    super();
    this.state = {
      data: []
    };
    this.renderEditable = this.renderEditable.bind(this);
  }
  componentDidMount() {
    axios.get(url+'users/students/', {withCredentials:true, headers:{Authorization: "Bearer "+window.sessionStorage.getItem("jwt_token")}}).then(
      (res) =>{
        console.log(res)
        let result = res.data.result;
        result.push({first_name:'', last_name:'',email:'', token:''});
        this.setState({data:result});
      },
      (err) =>{
        this.props.history.push('/admin/login');
      }
    )

  }
  renderEditable(cellInfo) {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.data];
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ data });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.data[cellInfo.index][cellInfo.column.id]
        }}
      />
    );
  }
  generateToken = ()=>{
    let s = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 35; i++ ) {
      s += characters.charAt(Math.floor(Math.random() * characters.length));
   }
   return s;
  }
  handleFileUpload= (dataFromCSV)=> {
    let parsedData = [];
    for (let i=1; i<dataFromCSV.length-1;i++){
      let current = {};
      for (let key=0;key<dataFromCSV[0].length;key++){

        current[dataFromCSV[0][key]] = dataFromCSV[i][key]
      }
      current["token"] = this.generateToken();
      parsedData.push(current);
    }
    this.setState({data: parsedData});
}
submitData = ()=>{
  axios.put(url+"admin/students/", this.state.data, {withCredentials:true, headers:{Authorization : "Bearer "+ window.sessionStorage.getItem("jwt_token")}}).then(
    (res)=>{
      console.log("successfully changed");
    },
    (err)=>{
      console.log("woops");
    }
  );
}
clearData =()=>{
  this.setState({data: [{first_name:'', last_name:'',email:'', token:''}]});
}

// Component render
  render() {
    const { data } = this.state;

    console.log(data);
    return (
      <div>
      <div style={{textAlign:'center'}}>
      <CSVReader
      cssClass="csv-reader-input"
      label="Rentrez le csv contenant les élèves : "
      onFileLoaded={this.handleFileUpload}
      inputId="Student_CSV"
      inputStyle={{color: 'red'}}
    /></div><br/><br/>
        <ReactTable
          data={data}

          columns={[
            {
              Header: "Prénom",
              accessor: "first_name",
              Cell: this.renderEditable
            },
            {
              Header: "Nom",
              accessor: "last_name",
              Cell: this.renderEditable
            },
            {
              Header: "E-mail",
              accessor: "email",
              Cell: this.renderEditable
            },
            {
              Header: "Token",
              accessor: "token",
              Cell: this.renderEditable
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        <br />
        <div style={{textAlign:'center'}}>
        <form>
        <input type="button" style={{  backgroundColor: "#4CAF50",border: "none",color: "white",padding: "15px 32px",textAlign: "center",textDecoration: "none",display: "inlineBlock",fontSize: "16px"}} value="Enregistrer" onClick={()=>this.submitData()} />
        </form>
        <br/>
        <form>
        <input type="button" style={{  backgroundColor: "#4CAF50",border: "none",color: "white",padding: "15px 32px",textAlign: "center",textDecoration: "none",display: "inlineBlock",fontSize: "16px"}} value="Vider le tableau" onClick={()=>this.clearData()} />
        </form>
        <br/>
        <form>
        <input type="button" style={{  backgroundColor: "#4CAF50",border: "none",color: "white",padding: "15px 32px",textAlign: "center",textDecoration: "none",display: "inlineBlock",fontSize: "16px"}} value="Retour" onClick={()=>this.props.history.push('/admin/manage-students')} />
        </form>
        </div>
      </div>
    );
  }
}

export default ChangeStudents;
