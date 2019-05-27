////////////////////////// GLOBAL VARIABLES //////////////////////

let NUMBER_VOWS=10;

///////////////////////////////////////////////////////////

function weight(rank){
    return (rank+1)**2-1
  }

///////////////////////////FUNCTIONS TO CHECK VOW VALIDITY///////////////////////

function timeToMinutes(time){
    let hours=0;
    let minutes=0;
    let split=time.split('');
    if(split.length===4){
        hours=parseInt(split[0]);
        minutes=parseInt(split[2]+split[3]);
    } else if(split.length===5){
        hours=parseInt(split[0]+split[1]);
        minutes=parseInt(split[3]+split[4]);
    }
    return minutes+60*hours
}

function schedulesAreOverlapping(schedule1, schedule2){
    let begin1=timeToMinutes(schedule1.begin);
    let end1=timeToMinutes(schedule1.end);
    let begin2=timeToMinutes(schedule2.begin);
    let end2=timeToMinutes(schedule2.end);
    return (schedule1.day===schedule2.day)&&(schedule1.day!=="hors-créneaux")&&((end2-begin1)*(begin2-end1)<0);
}

function coursesAreOverlapping(course1, course2, schedules){
    let are_overlapping=false;
    let schedules1=course1.creneaux.map(schedule_index=>schedules[schedule_index]);
    let schedules2=course2.creneaux.map(schedule_index=>schedules[schedule_index]);
    for(let i=0; i<schedules1.length; i++){
        for(let j=0; j<schedules2.length; j++){
            are_overlapping=are_overlapping||(schedulesAreOverlapping(schedules1[i], schedules2[j]));
        }
    }
    return are_overlapping;
}

function vowIsValid(vow, schedules){ 
    let list_courses=vow.list;
     // checking for schedules compatibility
    for( let i=0; i<list_courses.length; i++){
        for(let j =i+1; j<list_courses.length; j++){
            if(coursesAreOverlapping(list_courses[i], list_courses[j], schedules)){
                return false;
            }
        }
    }
    // checking that there are at most two different languages
    let language_map={};
    for(let i=0; i<list_courses.length; i++){
        language_map[list_courses[i].language]=true;
    }
    if(Object.keys(language_map).length>2){
        return false;
    }
    return true;
}

/////////////////////////////////////////////////////////////////////////////////////
 
  function generate_combinations(l, n){
    let k = l.length
    let result = []
    for (let i=0; i<k; i++){
      if (n===1){
        result.push({"list":[l[i]],"weight":weight(i)})
      }
      else{
        for (let j=i+1; j<k; j++){
          if (n===2){
            result.push({"list":[l[i],l[j]],"weight":weight(i)+weight(j)})
          }
          else{
            for (let o=j+1; o<k; o++){
              if (n===3){
                result.push({"list":[l[i],l[j],l[o]],"weight":weight(i)+weight(j)+weight(o)})
              }
              else{
                for (let p=o+1; p<k; p++){
                  if (n===4){
                    result.push({"list":[l[i],l[j],l[o],l[p]],"weight":weight(i)+weight(j)+weight(o)+weight(p)})
                  }
              }
          }
        }
      }
    }
    }}
    return result
  }
  
  function mix(result_1, result_2){
    if(result_1.length===0){
        return result_2;
    } else if(result_2.length){
        return result_1;
    }
    let result=[]
    for (let i= 0; i<Object.keys(result_1).length; i++){
      for (let j = 0; j<Object.keys(result_2).length; j++){
        result.push({"list": result_1[i].list.concat(result_2[j].list), "weight": result_1[i].weight+result_2[j].weight})
      }
    }
    result.sort((a,b) => a.weight-b.weight)
    return result
  }
  
  function parse(json_file_name){
    const fs = require('fs');
    const fileContents = fs.readFileSync(json_file_name, 'utf8');
    let data = {}
    try {
      data = JSON.parse(fileContents)
    } catch(err) {
      console.error(err);
    }
    let result = []
    for (let i_student=0; i_student<data.length; i_student++){
      result.push({})
      const student_data = data[i_student]
      result[i_student].name = student_data.name
      const wanted_organization_unparsed = student_data.wanted_organization.split(" ")
      let wanted_organization = {}
      let nb_languages = 0
      for (let i_lang = 0; i_lang< wanted_organization_unparsed.length; i_lang+=2){
        nb_languages += 1
        wanted_organization[wanted_organization_unparsed[i_lang]] = wanted_organization_unparsed[i_lang+1]
      }
      let sortings_dic = {}
      let languages_name = Object.keys(wanted_organization)
      for (let i_lang = 0; i_lang<nb_languages; i_lang++){
        sortings_dic[languages_name[i_lang]] = student_data.sortings[i_lang].course_ids.split(" ")
  
      }
      if (nb_languages == 1){
        result[i_student].vows = generate_combinations(sortings_dic[languages_name[0]], parseInt(wanted_organization[languages_name[0]]))
      }
      else{
        result[i_student].vows = mix(generate_combinations(sortings_dic[languages_name[0]], parseInt(wanted_organization[languages_name[0]])),generate_combinations(sortings_dic[languages_name[1]], parseInt(wanted_organization[languages_name[1]])))
      }
      }
      return result
  }

  function vowGenerator(number_english_courses, number_other_courses, ranking_english_courses, ranking_other_courses, schedules){
    let raw_vow_list=mix(generate_combinations(ranking_english_courses, number_english_courses), generate_combinations(ranking_other_courses, number_other_courses))
    let checked_vow_list=raw_vow_list.filter(vow=>{return vowIsValid(vow, schedules)})
    checked_vow_list.sort((vow1, vow2)=>{return vow1.weight-vow2.weight});
    return checked_vow_list.slice(0, Math.min(NUMBER_VOWS, checked_vow_list.length));
  }
  
  /*const vows = parse('data_example.json')
  for (let i=0; i<vows.length;i++){
    console.log(vows[i].name)
    console.log(vows[i].vows)
  }*/

  export default vowGenerator;
