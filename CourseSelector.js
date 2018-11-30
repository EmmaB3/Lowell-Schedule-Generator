var boxes2 = [];
var checkedBoxes = [];
var selectedCourses = [];
var page = 0;
var pageElements = [[]];
var offBlockNum;
var blockArrays = [];
var schedules = [];
var error = false;

function checkboxPressed(box, type) {
    if (box.checked) {
        if (type == 0) {
            var listing = document.createElement("li");
            listing.id = box.id + "Listing";
            listing.innerHTML = box.id;
            document.getElementById("classList").appendChild(listing);
            for (a in allCourses) {
                if (allCourses[a].title == box.id) {
                    selectedCourses.push(allCourses[a]);
                }
            }
            if (selectedCourses.length > 8 && !error) {
                errorCode("It appears you've chosen too many classes! Please de-select any excess ones to continue");
            }
        } /*else if (type == 1) {
            for (a in selectedCourses) {
                var teacherNameIndexes = [];
                for (var b in selectedCourses[a].teacherNames) {
                    if (box.className == selectedCourses.title && box.id == selectedCourses[a].teacherNames[b]) {
                        teacherNameIndexes.push(b);
                    }
                }
                for (var b = selectedCourses[a].teacherNames.length - 1; b >= 0; b--) {
                    if (!inArray(b, teacherNameIndexes)) {
                        selectedCourses[a].teacherNames.splice(b, 1);
                        selectedCourses[a].teacherBlocks.splice(b, 1);
                    }
                }
                console.log(selectedCourses[a].teacherNames);
            }
        }*/
    } else if (!box.checked) {
        if (type == 0) {
            for (var a = selectedCourses.length - 1; a >= 0; a--) {
                if (selectedCourses[a].title == box.id) {
                    selectedCourses.splice(a, 1);
                }
            }
            document.getElementById("classList").removeChild(document.getElementById(box.id + "Listing"));
            if (error && selectedCourses.length <= 8) {
                removeError();
            }
        }/*else if (type == 1) {
            console.log("hey");
        }*/
    } 
}

function getSelectedCourses() {
    checkedBoxes = [];
    selectedCourses = [];
    error = false;
    for (var a = 0; a < boxes1.length; a++) {
        if (boxes1[a].checked) {
            checkedBoxes.push(boxes1[a]);
        }
    }
    /*if (checkedBoxes.length > 7) {
        error = true;
        errorCode("It seems like you've picked too many classes.");
    }*/
    //TODO:FIGURE OUT WHY IT'S BREAKING THE TEACHERS PAGE and also why it still changes page if you click next page again without changing anything
    //TODO: try again button at end of schedules
    //TODO: error code if schedules is empty after findGoodSchedules
    //TODO: maybe add in more complex error codes later (like what u were working on in beginning of generateschedules)
    for (var a = 0; a < allCourses.length; a++) {
        for (var b = 0; b < checkedBoxes.length; b++) {
            if (allCourses[a].title == checkedBoxes[b].id) {
                selectedCourses.push(allCourses[a]);
            }
        }
    }
    boxes1 = [];
}

function teacherCheckboxes() {
    for (var a = 0; a < selectedCourses.length; a++) {
        var header = document.createElement("h3");
        header.innerHTML = selectedCourses[a].title;
        //document.body.appendChild(header);
        document.getElementById("mainStuff").appendChild(header);
        pageElements[1].push(header);
        for (var b = 0; b < selectedCourses[a].teacherNames.length; b++) {
            var cb = document.createElement("input");
            cb.type = "checkbox";
            cb.id = selectedCourses[a].teacherNames[b];
            cb.className = selectedCourses[a].title;
            //cb.setAttribute("onclick", "checkboxPressed(this, 1)");
            //cb.class = "page1";
            //document.body.appendChild(cb);
            document.getElementById("mainStuff").appendChild(cb);
            boxes2.push(cb);
            pageElements[1].push(cb);
            var label = document.createElement("label");
            label.for = selectedCourses[a].teacherNames[b];
            label.innerHTML = selectedCourses[a].teacherNames[b];
            pageElements[1].push(label);
            //label.class = "page1";
            //document.body.appendChild(label);
            document.getElementById("mainStuff").appendChild(label);
            var br = document.createElement("br");
            //br.class = "page1";
            pageElements[1].push(br);
            //document.body.appendChild(br);
            document.getElementById("mainStuff").appendChild(br);
        }
    }
}

function nextPage() {
    switch (page) {
        case 0:
            pageElements.push([]);
            //getSelectedCourses();
            if (!error) {
                document.getElementById("header").innerHTML = "Choose Your Teachers";
                teacherCheckboxes();
                checkedBoxes = [];
                removeStuff(page);
                page++;
            }
            break;
        case 1:
            pageElements.push([]);
            getSelectedTeacherBlocks();
            removeStuff(page);
            document.getElementById("header").innerHTML = "Choose Your Off Blocks";
            var instruct = document.createElement("p");
            instruct.innerHTML = "Pick as many options for each off block as you see fit";
            document.getElementById("mainStuff").appendChild(instruct);
            pageElements[2].push(instruct);
            offCheckboxes();
            page++;
            break;
        case 2:
            document.getElementById("header").innerHTML = "Your Schedules:";
            makeOffBlocks();
            makeBlockArrays();
            generateSchedules();
            findGoodSchedules();
            displaySchedules();
            document.body.removeChild(document.getElementById("nextButton"));
            //tryAgainButton();
            removeStuff(page);
            break;
    }
}

function makeBlockArrays() {
    for (var a = 1; a <= selectedCourses.length; a++) {
        var arr = [];
        for (var b = 0; b < selectedCourses.length; b++) {
            var arr2 = selectedCourses[b].getBlocks();
            if (inArray(a, arr2)) {
                arr.push(selectedCourses[b]);
            }
        }
        blockArrays.push(arr);
    }
}

function errorCode(message) {
    error = true;
    var eHeader = document.createElement("h2");
    eHeader.innerHTML = "Error";
    eHeader.id = "eHeader";
    //eHeader.className = "error";
    document.getElementById("error").appendChild(eHeader);
    pageElements[page].push(eHeader);
    var eMessage = document.createElement("p");
    eMessage.innerHTML = message;
    eMessage.id = "eMessage";
    //eMessage.className = "error";
    document.getElementById("error").appendChild(eMessage);
    pageElements[page].push(eMessage);
}

function removeError() {
    error = false;
    document.getElementById("error").removeChild(document.getElementById("eHeader"));
    document.getElementById("error").removeChild(document.getElementById("eMessage"));
}

function tryAgainButton() {
    document.getElementById("buttonItself").innerHTML = "Try Again";
    document.getElementById("buttonItself").onClick = "Try Again";
    window.location.href = 'course-selector.html'; 
}

function findGoodSchedules() {
    //deletes duplicate schedules (can happen w/ off blocks) WAIT BUT THIS ISN'T BASED OFF TITLES SO IT DOESN'T MATTER UGH GOTTA DO THAT ANOTHER WAY I GUESS
    /*for (var a = 0; a < schedules.length; a++) {
        for (var b = schedules.length - a; b >= 1; b--) {
            if (schedules[a] == schedules[a + b]) {
                schedules.splice(a + b, 1);
            }
        }
    }*/
    //deletes generated schedules that have duplicate classes inside them
    for (var a = schedules.length - 1; a >= 0; a--) {
        var nope = false;
        for (var b = 0; b < schedules[a].length; b++) {
            for (var c = 0; c < schedules[a].length - b; c++) {
                if (schedules[a][b] == schedules[a][b + c] && b != b + c) {
                    nope = true;
                }
            }
        }
        if (nope) {
            schedules.splice(a, 1);
        }
    }
}

function displaySchedules() {
    if (schedules.length == 0) {
        errorCode("No possible schedules found. Please reload the page & try again with a wider range of options.")
    } else {
        for (var a = 0; a < schedules.length; a++) {
            makeHTML("h3", "Schedule " + (a + 1) + ":");
            for (var b = 0; b < schedules[a].length; b++) {
                teachersList = "";
                var teachersArr = schedules[a][b].getTeachersForBlock(b + 1);
                if (teachersArr.length == 1) {
                    teachersList = teachersArr[0];
                } else {
                    for (var c = 0; c < teachersArr.length; c++) {
                        //teachersList += teachersArr[c];
                        teachersList += c == teachersArr.length - 1 ? teachersArr[c] : teachersArr[c] + " or ";
                    }
                }
                makeHTML("p", (b + 1) + ": " + schedules[a][b].title + (schedules[a][b].title == "OFF" ? "" : " - " + teachersList));
            }
        }
    }
}
//TODO maybe instead of getting rid of next button make it be a try again or whatever button and it reloads the page?? (like just calls up the html page over again??)
function makeHTML(type, words) {
    var elem = document.createElement(type);
    elem.innerHTML = words;
    document.getElementById("mainStuff").appendChild(elem);
}
//TODO put either in here or in makeBlockArrays thing that checks if a class only has one block option and if so removes other classes from that block
function generateSchedules() {
    //UNTESTED SO IT'S PROBABLY A BUGGY MESS PLS CHECK ALL SYNTAX
    //ya know what we're just gonna save this for later
    /*for (var a = 0; a < 8; a++) {
        var singles = [];
        var zeroes = [];
        if (blockArrays[a].length == 0) {
            zeroes.push(blockArrays[a]);
        } else if (blockArrays[a].length > 1) {
            for (var b in blockArrays[a]) {
                if (blockArrays[a][b].getBlocks().length == 1) {
                    singles.push(blockArrays[a][b]);
                }
            }
        }
        if (singles.length == 1) {
            blockArrays[a] = [singles[0]];
        } else if (singles.length > 1) {
            var message = "It appears your courses ";
            for (var b in singles) {
                if (b == singles.length - 1) {
                    message += "and ";
                }
                message += singles[b].title();
                if (b != singles.length - 1 && singles.length > 2) {
                    message += ","
                }
                message += " ";
            }
            message += "are not compatible. Try choosing a wider range of teacher options, or talk to your counselor about dropping one of these courses.";
            errorCode(message);
            break;
        }
        if (zeroes.length >= 1) {
            var message = "It appears " + (zeroes.length == 1 ? "block " : "blocks ");
            for (var b in zeroes) {
                if (singles.length > 1 && b == singles.length - 1) {
                    message += " and";
                } 
                messsage += singles[b].title;
            }
            message += (zeroes.length == 1 ? " doesn't" : " don't") + " have any possible classes to fill  " + (zeroes.length == 1 ? "it " : "them ") + ". Try choosing a broader range of teachers, or putting " + (zeroes.length == 1 ? "this block as an option " : "these blocks as options ") + "for off blocks.";
            break;
        } 
    }*/
    for (var a in blockArrays[0]) {
        for (var b in blockArrays[1]) {
            for (var c in blockArrays[2]) {
                for (var d in blockArrays[3]) {
                    for (var e in blockArrays[4]) {
                        for (var f in blockArrays[5]) {
                            for (var g in blockArrays[6]) {
                                for (var h in blockArrays[7]) {
                                    var currentSchedule = [blockArrays[0][a], blockArrays[1][b], blockArrays[2][c], blockArrays[3][d], blockArrays[4][e], blockArrays[5][f], blockArrays[6][g], blockArrays[7][h]];
                                    schedules.push(currentSchedule);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function offCheckboxes() {
    boxes1 = [];
    offBlockNum = 8 - selectedCourses.length;
    for (var a = 1; a <= offBlockNum; a++) {
        var header = document.createElement("h3");
        header.innerHTML = "Off Block #" +  a;
        document.getElementById("mainStuff").appendChild(header);
        pageElements[2].push(header);
        for (var b = 1; b <= 8; b++) {
            var cb = document.createElement("input");
            cb.type = "checkbox";
            cb.id = "blk" + b;
            cb.className = "num" + a;
            document.getElementById("mainStuff").appendChild(cb);
            boxes1.push(cb);
            pageElements[2].push(cb);
            var label = document.createElement("label");
            label.for = "blk" + b;
            label.innerHTML = "Block " + b;
            pageElements[2].push(label);
            document.getElementById("mainStuff").appendChild(label);
            var br = document.createElement("br");
            pageElements[2].push(br);
            document.getElementById("mainStuff").appendChild(br);
        }
    }
}

function makeOffBlocks() {
    var blockChoices = [];
    for (var a = 1; a <= offBlockNum; a++) {
        var singleBlock = [];
        for (var b = 0; b < 8; b++) {
            if (boxes1[b].checked) {
                singleBlock.push(b + 1);
            }
        }
        blockChoices.push(singleBlock);
    }
    
    for (var a = 0; a < offBlockNum; a++) {
        let ob = new Course("OFF", 9, ["N/A"], [blockChoices[a]]);
        selectedCourses.push(ob);
    }
}

function getSelectedTeacherBlocks() {
    for (var a = 0; a < boxes2.length; a++) {
        if (boxes2[a].checked) {
            checkedBoxes.push(boxes2[a]);
        }
    }
 
    for (var a = 0; a < selectedCourses.length; a++) {
        var teacherNameIndexes = [];
        for (var b = 0; b < selectedCourses[a].teacherNames.length; b++) {
            for (var c = 0; c < checkedBoxes.length; c++) {
                if (checkedBoxes[c].className == selectedCourses[a].title && checkedBoxes[c].id == selectedCourses[a].teacherNames[b]) {
                    teacherNameIndexes.push(b);
                }
            }
        }

        for (var b = selectedCourses[a].teacherNames.length - 1; b >= 0; b--) {
            if (!inArray(b, teacherNameIndexes)) {
                selectedCourses[a].teacherNames.splice(b,1);
                selectedCourses[a].teacherBlocks.splice(b,1);
            }
        }
    }
} 

function inArray(obj, arr) {
    for (var a in arr) {
        if (arr[a] == obj) {
            return true;
        }
    }
    return false;
}

function removeStuff(page) {
    for (var a = 0; a < pageElements[page].length; a++) {
        document.getElementById(pageElements[page][a].parentElement.id).removeChild(pageElements[page][a]);
    }
}