class volunteerOption { //creates a custom class called volunteerOption
    constructor(site, address, phone, hours) { //this will create an object of class volunteerOption with parameters site, address, phone, and hours. like print() with the text you'd like to print being the parameter
        this.site = site; //whatever is in the first position is the site of this object. same for the rest.
        this.address = address;
        this.phone = phone;
        this.hours = hours;
        this.print = function() { //function inside this object that prints out the information gathered from the volunteer site
          var info = ("<b>Site: </b>" + site + "<br><b>Address: </b>" + address + "<br><b>Phone: </b>" + phone + "<br><b>Hours: </b>" + hours + "<br>");
          info = info.toString(); //makes the info a string
          return info; //returns the string
        }
    }

}

function findVolunteer(info) {
  var table = document.getElementById("table");
  var row;
  var cell;

  while (table.rows.length > 0) {
    table.deleteRow(0);
  }

  for (i = 0; i < info.length; i ++) {
    var opportunity = new volunteerOption(info[i]["site"], info[i]["address"], info[i]["phone"], info[i]["hours_of_operation"]);
    row = table.insertRow(i);
    cell = row.insertCell(0);
    cell.innerHTML = opportunity.print();
  }
}

function makeVolunteerRequest() {
  var query = "https://data.cityofchicago.org/resource/bspy-6mw8.json";

  volunteerRequest = new XMLHttpRequest();
  volunteerRequest.open('GET', query, false);
  volunteerRequest.onload = processVolunteerRequest;
  volunteerRequest.send();
}

function processVolunteerRequest() {
  var volunteerInformation = JSON.parse(volunteerRequest.responseText); //parses the returned information into a format the computer can read
  console.log(volunteerInformation);
  findVolunteer(volunteerInformation);
}
