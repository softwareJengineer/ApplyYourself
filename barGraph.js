function makeActRequest() {
  var searchedCollege = document.getElementById("chosenCollege").value; //gets the text in the first textarea

  if (searchedCollege === "") {
    return; //if there's nothing in the textarea do nothing
  }

  var query = ("https://api.data.gov/ed/collegescorecard/v1/schools?school.name=" + searchedCollege + "&fields=school.name,latest.admissions.act_scores.midpoint.cumulative,latest.admissions.sat_scores.average.overall&api_key=X0HKgUjXSPhlgoh8trYBOoj1ij1zLmBkeurY7HQf");
  //the query is very long because we don't want all the fields, only a few, so we have to specify that we want the tuition, debt, etc. this will give us the information we requested.
  query = query.replace(/ /g, "%20"); //replaces spaces with a format html can read

  collegeRequest = new XMLHttpRequest();
  collegeRequest.open('GET', query, false); //makes the http request with the url we created above
  collegeRequest.onload = processActRequest; //when the request loads process the request
  collegeRequest.send();
}


function processActRequest() {
  if (collegeRequest.readyState != 4) { //if we get 4 return
    return;
  }

  if (collegeRequest.status != 200 || collegeRequest === "") { //if the status is 200 (didn't work) or we input nothing return
    alert("Could not find the searched college.");
    return;
  }

  var collegeInformation = JSON.parse(collegeRequest.responseText); //parses the returned information into a format the computer can read
  collegeInformation = collegeInformation["results"][0];
  collegeActScore = collegeInformation["latest.admissions.act_scores.midpoint.cumulative"]; //sets college information to the actual results
  collegeSatScore = collegeInformation["latest.admissions.sat_scores.average.overall"];
  console.log(collegeInformation); //for testing. should probably remove later.
  if (collegeInformation === undefined) {
    alert("Could not find the specified college.");
    document.getElementById("inputCollege").value = "";
    return;
  }
  var test;
  var scoreToUse;

  inputScore = document.getElementById("yourScore").value;
  inputScore = parseInt(inputScore);

  document.getElementById("yourScore").value = "";
  document.getElementById("chosenCollege").value = "";

  if (inputScore >= 200 && inputScore <= 1600) {
    test = "SAT";
    scoreToUse = collegeSatScore;
  }
  else if (inputScore > 0 && inputScore <= 36) {
    test = "ACT";
    scoreToUse = collegeActScore;
  }
  else {
    alert("That is not a valid score!");
    return;
  }

  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    theme: "light2", // "light1", "light2", "dark1", "dark2"
    title: {
      text: "Scores"
    },
    axisY: {
      title: "Score"
    },
    data: [{
      type: "column",
      dataPoints: [{
          y: inputScore,
          label: "Your " + test + " Score"
        },
        {
          y: scoreToUse,
          label: collegeInformation["school.name"] + "'s Median " + test + " Score"
        },
      ]
    }]
  });
  chart.render();

}

window.onload = function() {
  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    theme: "light2", // "light1", "light2", "dark1", "dark2"
    title: {
      text: "Scores"
    },
    axisY: {
      title: "Score"
    },
    data: [{
      type: "column",
    }]
  });
  chart.render();

}
