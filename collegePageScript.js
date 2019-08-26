function makeCollegeRequest() {
  var searchedCollege = document.getElementById("inputCollege").value; //gets the text in the first textarea

  if (searchedCollege === "") {
    return; //if there's nothing in the textarea do nothing
  }

  var query = ("https://api.data.gov/ed/collegescorecard/v1/schools?school.name=" + searchedCollege + "&fields=school.name,latest.student.demographics.race_ethnicity.white,latest.student.demographics.race_ethnicity.black,latest.student.demographics.race_ethnicity.hispanic,latest.student.demographics.race_ethnicity.asian,latest.admissions.admission_rate.overall,latest.admissions.act_scores.midpoint.cumulative,latest.aid.median_debt_suppressed.overall,latest.cost.tuition.out_of_state,latest.student.size,school.city,school.price_calculator_url,school.school_url,school.state,school.zip,latest.earnings.6_yrs_after_entry.median,latest.admissions.sat_scores.average.overall,latest.cost.tuition.in_state,latest.student.demographics.women,latest.cost.attendance.academic_year&api_key=X0HKgUjXSPhlgoh8trYBOoj1ij1zLmBkeurY7HQf");
  //the query is very long because we don't want all the fields, only a few, so we have to specify that we want the tuition, debt, etc. this will give us the information we requested.
  query = query.replace(/ /g, "%20"); //replaces spaces with a format html can read

  collegeRequest = new XMLHttpRequest();
  collegeRequest.open('GET', query, false); //makes the http request with the url we created above
  collegeRequest.onload = processCollegeRequest; //when the request loads process the request
  collegeRequest.send();
}

function processCollegeRequest() {
  if (collegeRequest.readyState != 4) { //if we get 4 return
    return;
  }

  if (collegeRequest.status != 200 || collegeRequest === "") { //if the status is 200 (didn't work) or we input nothing return
    alert("Could not find the searched college.");
    return;
  }

  var collegeInformation = JSON.parse(collegeRequest.responseText); //parses the returned information into a format the computer can read
  collegeInformation = collegeInformation["results"][0]; //sets college information to the actual results
  console.log(collegeInformation); //for testing. should probably remove later.
  if (collegeInformation === undefined) {
    alert("Could not find the specified college.");
    document.getElementById("inputCollege").value = "";
    return;
  }

  var websiteUrl = collegeInformation["school.school_url"];
  if(websiteUrl === null) {
    websiteUrl = "N/A";
  }
  else if (websiteUrl.startsWith("https://")) {
    websiteUrl = "<a href=" + websiteUrl + ">" + websiteUrl + "</a>"
  } else {
    websiteUrl = "<a href=https://" + websiteUrl + ">" + websiteUrl + "</a>"
  }
  websiteUrl = websiteUrl.toString();

  var calculatorUrl = collegeInformation["school.price_calculator_url"];
  if(calculatorUrl === null) {
    calculatorUrl = "N/A";
  }
  else if (calculatorUrl.startsWith("https://")) {
    calculatorUrl = "<a href=" + calculatorUrl + ">" + calculatorUrl + "</a>"
  } else {
    calculatorUrl = "<a href=https://" + calculatorUrl + ">" + calculatorUrl + "</a>"
  }
  calculatorUrl = calculatorUrl.toString();

  var outStateTuition = collegeInformation["latest.cost.tuition.out_of_state"]; //all of these next statements set our easily-read variables to the information we got.
  var inStateTuition = collegeInformation["latest.cost.tuition.in_state"];
  var actScoreMedian = collegeInformation["latest.admissions.act_scores.midpoint.cumulative"];
  var satScoreAvg = collegeInformation["latest.admissions.sat_scores.average.overall"];
  var admissionsRate = parseFloat(collegeInformation["latest.admissions.admission_rate.overall"]) * 100;
  var percentWhite = parseFloat(collegeInformation["latest.student.demographics.race_ethnicity.white"]) * 100;
  var percentBlack = parseFloat(collegeInformation["latest.student.demographics.race_ethnicity.black"]) * 100;
  var percentAsian = parseFloat(collegeInformation["latest.student.demographics.race_ethnicity.asian"]) * 100;
  var percentHispanic = parseFloat(collegeInformation["latest.student.demographics.race_ethnicity.hispanic"]) * 100;
  var percentWomen = parseFloat(collegeInformation["latest.student.demographics.women"]) * 100;

  var collegeNum = collegeNames.indexOf(collegeInformation["school.name"]);
  if (collegeNum != -1) {
    var subjectInfo = category[collegeNum] + ": " + policy[collegeNum];
  } else {
    subjectInfo = "";
  }

  var recommendations = collegeNamesRec.indexOf(collegeInformation["school.name"]);
  if (recommendations != -1) {
    var recInfo = "<b>Teacher Recommendation Letters Required: </b>" + numTeachRecs[recommendations] + "<br><b>Counselor Recommendation Letter required? </b>" + counselorReq[recommendations] + "<br><b>Additional Info: </b>" + additionalInfo[recommendations];
  } else {
    recInfo = "";
  }

  document.getElementById("schoolName").innerHTML = collegeInformation["school.name"]; //changes the inner html to the college's name, which will change the text the screen has. the rest do the same
  document.getElementById("location").innerHTML = collegeInformation["school.city"] + ", " + collegeInformation["school.state"] + " " + collegeInformation["school.zip"];
  document.getElementById("schoolWebsite").innerHTML = websiteUrl;
  document.getElementById("calculator").innerHTML = calculatorUrl;
  document.getElementById("population").innerHTML = collegeInformation["latest.student.size"];
  document.getElementById("netCost").innerHTML = "$" + collegeInformation["latest.cost.attendance.academic_year"]
  document.getElementById("outStateTuition").innerHTML = "$" + outStateTuition;
  document.getElementById("inStateTuition").innerHTML = "$" + inStateTuition;
  document.getElementById("debt").innerHTML = "$" + collegeInformation["latest.aid.median_debt_suppressed.overall"];
  document.getElementById("act").innerHTML = actScoreMedian;
  document.getElementById("sat").innerHTML = satScoreAvg;
  document.getElementById("admissionRate").innerHTML = admissionsRate + "%";
  document.getElementById("earnings").innerHTML = "$" + collegeInformation["latest.earnings.6_yrs_after_entry.median"];
  document.getElementById("demographics").innerHTML = "<b>Percent White:</b> " + percentWhite + "%<br><b>Percent Black:</b> " + percentBlack + "%<br><b>Percent Asian:</b> " + percentAsian + "%<br><b>Percent Hispanic:</b> " + percentHispanic + "%<br><b>Percent Women:</b> " + percentWomen + "%\n"
  document.getElementById("subject").innerHTML = subjectInfo;
  document.getElementById("recs").innerHTML = recInfo;
  document.getElementById("inputCollege").value = ""; //resets the search bar
}

function makeCollegeRequestTwo() { //same function but for the second searchbar and column
  var searchedCollege = document.getElementById("inputCollegeTwo").value;

  if (searchedCollege === "") {
    return;
  }

  var query = ("https://api.data.gov/ed/collegescorecard/v1/schools?school.name=" + searchedCollege + "&fields=school.name,latest.student.demographics.race_ethnicity.white,latest.student.demographics.race_ethnicity.black,latest.student.demographics.race_ethnicity.hispanic,latest.student.demographics.race_ethnicity.asian,latest.admissions.admission_rate.overall,latest.admissions.act_scores.midpoint.cumulative,latest.aid.median_debt_suppressed.overall,latest.cost.tuition.out_of_state,latest.student.size,school.city,school.price_calculator_url,school.school_url,school.state,school.zip,latest.earnings.6_yrs_after_entry.median,latest.admissions.sat_scores.average.overall,latest.cost.tuition.in_state,latest.student.demographics.women,latest.cost.attendance.academic_year&api_key=X0HKgUjXSPhlgoh8trYBOoj1ij1zLmBkeurY7HQf");
  query = query.replace(/ /g, "%20");

  collegeRequest = new XMLHttpRequest();
  collegeRequest.open('GET', query, false);
  collegeRequest.onload = processCollegeRequestTwo;
  collegeRequest.send();
}

function processCollegeRequestTwo() {
  if (collegeRequest.readyState != 4) { //if we get 4 return
    return;
  }

  if (collegeRequest.status != 200 || collegeRequest === "") { //if the status is 200 (didn't work) or we input nothing return
    alert("Could not find the searched college.");
    return;
  }

  var collegeInformation = JSON.parse(collegeRequest.responseText);
  collegeInformation = collegeInformation["results"][0];
  console.log(collegeInformation);
  if (collegeInformation === undefined) {
    alert("Could not find the specified college.");
    document.getElementById("inputCollege").value = "";
    return;
  }

  var outStateTuition = collegeInformation["latest.cost.tuition.out_of_state"];
  var inStateTuition = collegeInformation["latest.cost.tuition.in_state"];
  var actScoreMedian = collegeInformation["latest.admissions.act_scores.midpoint.cumulative"];
  var satScoreAvg = collegeInformation["latest.admissions.sat_scores.average.overall"];
  var admissionsRate = parseFloat(collegeInformation["latest.admissions.admission_rate.overall"]) * 100;
  var percentWhite = parseFloat(collegeInformation["latest.student.demographics.race_ethnicity.white"]) * 100;
  var percentBlack = parseFloat(collegeInformation["latest.student.demographics.race_ethnicity.black"]) * 100;
  var percentAsian = parseFloat(collegeInformation["latest.student.demographics.race_ethnicity.asian"]) * 100;
  var percentHispanic = parseFloat(collegeInformation["latest.student.demographics.race_ethnicity.hispanic"]) * 100;
  var percentWomen = parseFloat(collegeInformation["latest.student.demographics.women"]) * 100;

  var websiteUrl = collegeInformation["school.school_url"];
  if(websiteUrl === null) {
    websiteUrl = "N/A";
  }
  else if (websiteUrl.startsWith("https://")) {
    websiteUrl = "<a href=" + websiteUrl + ">" + websiteUrl + "</a>"
  } else {
    websiteUrl = "<a href=https://" + websiteUrl + ">" + websiteUrl + "</a>"
  }
  websiteUrl = websiteUrl.toString();

  var calculatorUrl = collegeInformation["school.price_calculator_url"];
  if (calculatorUrl === null) {
    calculatorUrl = "N/A";
  }
  else if (calculatorUrl.startsWith("https://")) {
    calculatorUrl = "<a href=" + calculatorUrl + ">" + calculatorUrl + "</a>"
  } else {
    calculatorUrl = "<a href=https://" + calculatorUrl + ">" + calculatorUrl + "</a>"
  }
  calculatorUrl = calculatorUrl.toString();

  var collegeNum = collegeNames.indexOf(collegeInformation["school.name"]);
  if (collegeNum != -1) {
    var subjectInfo = category[collegeNum] + ": " + policy[collegeNum];
  } else {
    subjectInfo = "";
  }

  var recommendations = collegeNamesRec.indexOf(collegeInformation["school.name"]);
  if (recommendations != -1) {
    var recInfo = "<b>Teacher Recommendation Letters Required: </b>" + numTeachRecs[recommendations] + "<br><b>Counselor Recommendation Letter required? </b>" + counselorReq[recommendations] + "<br><b>Additional Info: </b>" + additionalInfo[recommendations];
  } else {
    recInfo = "";
  }

  document.getElementById("schoolNameTwo").innerHTML = collegeInformation["school.name"];
  document.getElementById("locationTwo").innerHTML = collegeInformation["school.city"] + ", " + collegeInformation["school.state"] + " " + collegeInformation["school.zip"];
  document.getElementById("schoolWebsiteTwo").innerHTML = websiteUrl;
  document.getElementById("calculatorTwo").innerHTML = calculatorUrl;
  document.getElementById("populationTwo").innerHTML = collegeInformation["latest.student.size"];
  document.getElementById("netCostTwo").innerHTML = "$" + collegeInformation["latest.cost.attendance.academic_year"]
  document.getElementById("outStateTuitionTwo").innerHTML = "$" + outStateTuition;
  document.getElementById("inStateTuitionTwo").innerHTML = "$" + inStateTuition;
  document.getElementById("debtTwo").innerHTML = "$" + collegeInformation["latest.aid.median_debt_suppressed.overall"];
  document.getElementById("actTwo").innerHTML = actScoreMedian;
  document.getElementById("satTwo").innerHTML = satScoreAvg;
  document.getElementById("admissionRateTwo").innerHTML = admissionsRate + "%";
  document.getElementById("earningsTwo").innerHTML = "$" + collegeInformation["latest.earnings.6_yrs_after_entry.median"];
  document.getElementById("demographicsTwo").innerHTML = "<b>Percent White:</b> " + percentWhite + "%<br><b>Percent Black:</b> " + percentBlack + "%<br><b>Percent Asian:</b> " + percentAsian + "%<br><b>Percent Hispanic:</b> " + percentHispanic + "%<br><b>Percent Women:</b> " + percentWomen + "%\n"
  document.getElementById("subjectTwo").innerHTML = subjectInfo;
  document.getElementById("recsTwo").innerHTML = recInfo;
  document.getElementById("inputCollegeTwo").value = "";
}
