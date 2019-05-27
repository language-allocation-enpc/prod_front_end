import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import url from "./url";
import "./CourseEditing.css"
import plus_button from "./images/plus_button.png"
import suppr_button from "./images/suppr_button.png"
import edit_button from "./images/edit_button.png"
import background_wall from "./images/background_image.jpg"



class CourseEditing extends Component {
    constructor(props) {
        super(props);
        this.state = { token:window.sessionStorage.getItem("jwt_token"), isAuth:false, page: "Cours",data:[],id_course :0,creneaux:[]};
      }
     /* async componentDidMount() {
        const { data: data_serv } = await axios.get(url + "//");
        console.log(data_serv)
        let new_state = this.state;
        new_state.data=data_serv;
       this.setState(new_state);
      }*/
      componentDidMount(){
        axios.get(url+'admin/check-auth', {withCredentials:true, headers:{Authorization: 'Bearer '+this.state.token}}).then(
          (res)=>{
            this.setState({isAuth:true});
        },
          (err)=>{
            this.setState({isAuth:false});
            this.props.history.push('/admin/login')
          }
        )
        axios.get(url + "creneaux/", {withCredentials:false})
         .then(res => {let creneaux= res.data.result;
           let new_state = this.state;
           new_state.creneaux=creneaux;
           this.setState(new_state);})
        axios.get(url + "courses/", {withCredentials:false})
        .then(res => {let data_serv= res.data.result;
          let new_state = this.state;
          new_state.data=data_serv;
         this.setState(new_state);})

      }

      handlePageChange = page_name => {
          let new_state=this.state;
          new_state.page=page_name;
          this.setState(new_state);
          axios.get(url + "courses/", {withCredentials:false})
          .then(res => {let data_serv= res.data.result;
            let new_state = this.state;
            new_state.data=data_serv;
           this.setState(new_state);
         this.forceUpdate();})

      }
      get_data = ()=> {
          return this.state.data;
      }


      get_creneaux = ()=>{
        return this.state.creneaux;
      }

      set_data = (course)=>{
        axios.post(url + "courses/" + course.id ,{name:course.name,language:course.language,creneaux:course.creneaux,min_students:course.min_students,max_students:course.max_students});
      }

      add_data = (course)=>{
        axios.put(url + "courses/", {name:course.name,language:course.language,creneaux:course.creneaux,min_students:course.min_students,max_students:course.max_students});
      }

      get_id = ()=>{
        return this.state.id_course;
      }

      delete_course = index =>{
        axios.delete(url + "courses/" + index);
        axios.get(url + "courses/", {withCredentials:false})
        .then(res => {let data_serv= res.data.result;
          let new_state = this.state;
          new_state.data=data_serv;
         this.setState(new_state);})
         this.props.history.push('/admin/manage-courses')

      }

      confirm = (index) => {
        let resultat = window.confirm("Voulez vous vraiment supprimer ce cours ?");
        if(resultat === true){
          this.delete_course(index);
        }
      };

      add_course = ()=>{
        let new_state = this.state;
        new_state.page="add";
        this.setState(new_state)
      }

      edit_course = id =>{
        let new_state = this.state;
        new_state.id_course = id;
        new_state.page="edit";
        this.setState(new_state);
      }
    render() {

        let page=null;
        if(this.state.page==="Cours"){
            page=<Cours get_data ={this.get_data} delete_course={this.delete_course}
            edit_course={this.edit_course} add_course={this.add_course} get_creneaux={this.get_creneaux} confirm ={this.confirm}/>
        } else if(this.state.page==="login"){
          page=<LoginPage handlePageChange={this.handlePageChange}/>
        } else if(this.state.page === "edit"){
          page=<Edit handlePageChange={this.handlePageChange} get_id ={this.get_id} get_data = {this.get_data} set_data = {this.set_data}
          get_creneaux={this.get_creneaux}/>
        } else if (this.state.page === "add"){
          page=<Add handlePageChange={this.handlePageChange} add_data = {this.add_data} get_creneaux={this.get_creneaux}/>
        }

      return (
        <div className="main-container">{page}</div>
      );
    }
    }

    class LoginPage extends Component {
      render() {
        return (
          <div>nothing for the moment</div>
        );
      }
    }

    class Cours extends Component {
      constructor(props) {
        super(props);
        this.state = {current_filters: {language:"", schedule:""}, criteria_with_options: this.buildCriteriaWithOptions()};//pas de filtrage par défaut
      }

      getCurrentFilters=()=>{
        return this.state.current_filters;
      }

      handleFilterChange=(event) => {
        const target = event.target;
        const value =  target.value;
        const name = target.name;

        let new_filters= this.state.current_filters;
        new_filters[name]=value;
        this.setState({current_filters: new_filters});
      }

      buildCriteriaWithOptions=()=>{
        let newdata=this.props.get_data();
        let L_creneaux = this.props.get_creneaux();
        let list_languages=[];
        let list_schedules=[];
        for(let index=0; index<newdata.length; index++){
          let current_course=newdata[index];
          if(!list_languages.includes(current_course.language)){list_languages.push(current_course.language)};
          for(let index_schedule=0; index_schedule<L_creneaux.length; index_schedule++){
            let schedule=L_creneaux[index_schedule].id;
            if(!list_schedules.includes(schedule)){list_schedules.push(schedule)};
          }
        }
        let criteria_with_options ={};
        if(list_languages.length>1){
          criteria_with_options.language=list_languages;
        }
        if(list_schedules.length>1){
          criteria_with_options.schedule=list_schedules;
        }
        return criteria_with_options;
      }

      buildListCoursesToDisplay=()=>{
        let list_courses_to_display=this.props.get_data();
        if(this.state.current_filters.language!==""){
          list_courses_to_display = list_courses_to_display.filter((value, index, arr)=>{return value.language===this.state.current_filters.language;});
        }
        if(this.state.current_filters.schedule!==""){
          list_courses_to_display = list_courses_to_display.filter((value, index, arr)=>{return value.creneaux.includes(parseInt(this.state.current_filters.schedule));});
        }
        return list_courses_to_display;
      }

      render() {
        this.state.criteria_with_options = this.buildCriteriaWithOptions();
        let L_creneaux = this.props.get_creneaux();
        let newdata=this.buildListCoursesToDisplay();
          let cours_L=[];
          let add_button=<img width = "25%" height = "25%" src = {plus_button} alt='' onClick={()=>this.props.add_course()}/>
          cours_L.push(<div className="img_button">{add_button}</div>);
          for(let index=0; index<newdata.length; index++){
            let quit_button=<img width="50%" height = "15%" src = {suppr_button} alt='' onClick={()=>this.props.confirm(newdata[index].id)}/>
            let course_info=[];
              course_info.push(<div  className="cours">
              <h1 className="name">{newdata[index].name}</h1>
              <div className="champs"><div className="caractéristiques">langue : </div><div className="attribut">{newdata[index].language}</div></div>
              <p></p>
              {newdata[index].creneaux.map((id)=>{
                return <p><div className="champs"><div className="caractéristiques"> horaires : </div><div className="attribut">{L_creneaux[id].day}</div>
                <div className="attribut">{L_creneaux[id].begin} / {L_creneaux[id].end}</div></div></p>})}
              </div>)
              let change_button=<img width = "50%" height = "15%" src = {edit_button} alt='' onClick={()=>this.props.edit_course(index)}/>
              course_info.push(<div className = "up-right_button">{quit_button}   {change_button}</div>)
            cours_L.push(<div className="course_info">{course_info}</div>)
            }
        return (
          <div><CourseListFilter className = "selection" criteriaWithOptions={this.state.criteria_with_options} getCurrentFilters={this.getCurrentFilters}
          handleFilterChange={this.handleFilterChange} getSchedules={this.props.get_creneaux}/>
          <div className="cours_L">{cours_L}</div></div>
        );
      }
    }

    class CourseListFilter extends Component {
      render() {
        let schedules=this.props.getSchedules();
        let criteria_selection=[];
        for(let criterion in this.props.criteriaWithOptions){
          let list_options=[<option value="" key={""}></option>];
          for(let index=0; index<this.props.criteriaWithOptions[criterion].length; index++){
            let option_name=this.props.criteriaWithOptions[criterion][index];
            if(criterion!=='schedule'){
              list_options.push(<option value={option_name} key={option_name}>{option_name}</option>);
            } else {
              list_options.push(<option value={option_name} key={option_name}>{schedules[option_name].day+(schedules[option_name].day==="hors-créneaux"? "":(" "+schedules[option_name].begin+"-"+schedules[option_name].end))}</option>);
            }

          }
          criteria_selection.push(
            <div className="course-list-filter-option" key={criterion}>
            <label >{criterion==="language"?<div className="texte">Langue : </div>:(criterion==="schedule"?<div className="texte">Horaire : </div>:"erreur")}</label>
            <select
                name={criterion}
                type='select'
                value={this.props.getCurrentFilters()[criterion]}
                onChange={this.props.handleFilterChange} >
                {list_options}
              </select>
          </div>

          );
          console.log(criteria_selection);
        }
        return (
          <div className="course-list-filter">{criteria_selection}</div>
        );
      }
      }

    class Edit extends Component{
      constructor(props){
        super(props);
        this.state = {data:this.props.get_data()}
      }

      handleInputChange= (event) => {
        const target = event.target;
        const value = target.value;
        const id_cren = target.id;
        const name = target.name;
        let id = this.props.get_id();
        if (name === "changer_horaires"){
          let new_state = this.state;
          new_state.data[id].creneaux[id_cren]=parseInt(value);
          this.setState(new_state);
        }
        else if(name === "changer_nom"){
          let new_state = this.state;
          new_state.data[id].name=[value];
          this.setState(new_state);
        }
        else if (name === "changer_minimum"){
          let new_state = this.state;
          let parse = parseInt(value)

          if (isNaN(parse)===true){
            new_state.data[id].min_students=0;
            this.setState(new_state);
          }
          else if (typeof parse === "number"){
           new_state.data[id].min_students=[parse];
           this.setState(new_state);
            }
          }
        else if (name === "changer_maximum"){

          let new_state = this.state;
          let parse = parseInt(value)
          if (isNaN(parse)===true){
            new_state.data[id].max_students=0;
            this.setState(new_state);
          }
          else if (typeof parse === "number"){
           new_state.data[id].max_students=[parse];
           this.setState(new_state);
            }
          }
      }

      submit = () =>{
        let id = this.props.get_id();
        this.props.set_data(this.state.data[id]);
        this.props.handlePageChange("Cours");
      }

      exit = () =>{
        this.props.handlePageChange("Cours");
      }

      render(){
        let id = this.props.get_id();
        let L_creneaux = this.props.get_creneaux();
        let change_course=[];
        let creneaux_op = [];
        for (let cren = 0;cren<L_creneaux.length; cren++){
          creneaux_op.push({ value:cren,label:L_creneaux[cren].day + " " + L_creneaux[cren].begin + " / " + L_creneaux[cren].end});
        }
        creneaux_op[0].label = "hors creneaux";
        change_course.push([<h1 className="Title">Modifier le cours {this.state.data[id].name}</h1>,<label className = "cat">Horaires : </label>,
        <div>{this.state.data[id].creneaux.map((cren)=>{
          return <select
          name="changer_horaires"
          type='select'
          value={cren}
          id = {this.state.data[id].creneaux.indexOf(cren)}
          onChange={this.handleInputChange} >
          {
              creneaux_op.map((creneaux)=>{
                return <option value ={creneaux.value} id = {this.state.data[id].creneaux.indexOf(cren)}>{creneaux.label} </option>;
              })
            }
             </select>
           })} </div>,,<p><label className = "cat">Nom : </label><input
          name="changer_nom"
          type="text"
          value={this.state.data[id].name}
          onChange={this.handleInputChange} /> </p>,<label className = "cat">Changer la capacité : <br/></label>,<p><label className ="cat">Minimum : </label><input
          name = "changer_minimum"
          type = "text"
          value = {this.state.data[id].min_students}
          onChange = {this.handleInputChange} /><label className = "cat">   Maximum : </label><input
          name = "changer_maximum"
          type = "text"
          value = {this.state.data[id].max_students}
          onChange = {this.handleInputChange} /> </p>])
          let submit_button = <Button text = "Soumettre" onClick={this.submit}/>;
          let exit_button = <Button text = "Sortir" onClick={this.exit}/>;
          change_course.push([submit_button,exit_button]);
        return(<div className="changing_page">{change_course}</div>)
      }
    }

    class Add extends Component{
      constructor(props){
        super(props);
        this.state = {course:{id: 0, name: "", language: "", creneaux: [1], min_students:0,max_students:0}}
      }

      handleInputChange= (event) => {

        const target = event.target;
        const value = target.value;
        const id_cren = target.id;
        const name = target.name;

        if (name === "ajouter_horaires"){
          let new_state = this.state;
          console.log("value",value,id_cren)
          new_state.course.creneaux[id_cren]=parseInt(value);
          this.setState(new_state);
        }
        else if(name === "ajouter_nom"){
          let new_state = this.state;
          new_state.course.name=[value];
          this.setState(new_state);
        }
        else if (name === "ajouter_minimum"){
          let new_state = this.state;
          let parse = parseInt(value)

          if (isNaN(parse)===true){
            new_state.course.min_students=0;
            this.setState(new_state);
          }
          else if (typeof parse === "number"){
           new_state.course.min_students=[parse];
           this.setState(new_state);
            }
          }
        else if (name === "ajouter_maximum"){

          let new_state = this.state;
          let parse = parseInt(value)
          if (isNaN(parse)===true){
            new_state.course.max_students=0;
            this.setState(new_state);
          }
          else if (typeof parse === "number"){
           new_state.course.max_students=[parse];
           this.setState(new_state);
            }
          }
        }


      submit = () =>{

        this.props.add_data(this.state.course);
        this.props.handlePageChange("Cours");
      }

      exit = () =>{
        this.props.handlePageChange("Cours");
      }

      change_nb_créneaux = (event)=>{
        const value = parseInt(event.target.value);
        let new_state = this.state;
        if (value === 1){
          new_state.course.creneaux = [1];
          }
        else if (value === 2){
          new_state.course.creneaux = [1,1];
        }
        this.setState(new_state);
      }

      render() {
        let add_course=[];
        let L_creneaux = this.props.get_creneaux();
        let creneaux_op = [];
        for (let cren = 0;cren<L_creneaux.length; cren++){
          creneaux_op.push({ value:cren,label:L_creneaux[cren].day + " " + L_creneaux[cren].begin + " / " + L_creneaux[cren].end});
        }
        creneaux_op[0].label = "hors creneaux";
        add_course.push([<h1 className="Title">Ajouter cours</h1> ,<label className = "cat">nombre de créneaux</label>,<select
          name="nombre_créneaux"
          type="select"
          value={this.state.course.creneaux.length}
          onChange={this.change_nb_créneaux}>
          <option value={1}>1</option>
          <option value={2}>2</option></select>
          ,<div>{this.state.course.creneaux.map((cren)=>{
            return <select
            name="ajouter_horaires"
            type='select'
            value={cren}
            id={this.state.course.creneaux.indexOf(cren)}
            onChange={this.handleInputChange} >
            {
                creneaux_op.map((creneaux)=>{
                  return <option value ={creneaux.value} id = {this.state.course.creneaux.indexOf(cren)}>{creneaux.label} </option>;
                })
              }
               </select>
              })} </div>,<p><label className = "cat">nom : </label><input
          name="ajouter_nom"
          type="text"
          value={this.state.course.name}
          onChange={this.handleInputChange} /> </p>,<label className = "cat">changer la capacité :</label>,<p><label className ="cat">minimum :</label><input
          name = "ajouter_minimum"
          type = "text"
          value = {this.state.course.min_students}
          onChange = {this.handleInputChange} /><label className = "cat"> maximum : </label><input
          name = "ajouter_maximum"
          type = "text"
          value = {this.state.course.max_students}
          onChange = {this.handleInputChange} /> </p>])
          let submit_button = <Button text = "submit" onClick={()=>this.submit()}/>;
          let exit_button = <Button text = "exit" onClick={this.exit}/>;
          add_course.push([submit_button,exit_button]);
        return(<div className="adding_page">{add_course}</div>)
      }
    }

    class Button extends Component {
      render() {
        return (
          <button className="button" onClick={this.props.onClick}>{this.props.text}</button>
        );
      }
    }

    export default CourseEditing;
