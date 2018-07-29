var allCourses = [];
var deptTitles = ["Math", "Science", "English", "History", "VPA", "World Language", "PE", "Other"];
var currentClass = "none";
var rawData;

class Course {
    constructor(title, dept, teacherNames, teacherBlocks) {
        this.title = title;
        this.dept = dept;
        this.teacherNames = teacherNames;
        this.teacherBlocks = teacherBlocks;
        allCourses.push(this);
    }

    getBlocks() {
        var blocks = [];
        for (var a = 0; a < this.teacherNames.length; a++) {
            blocks = blocks.concat(this.teacherBlocks[a]);
        }
        return blocks;
    }

    getTeachersForBlock(block) {
        var teachers = [];
        for (var a = 0; a < this.teacherBlocks.length; a++) {
            if (inArray(block, this.teacherBlocks[a])) {
                teachers.push(this.teacherNames[a]);
            }
        }
        return teachers;
    }
}

var stuff = Tabletop.init({
    key: '1v85ZUS42eJ2fh_kCk3VGzlp3HBWwdvN5C6hYfg3WvWE',
    callback: processData,
    simpleSheet: true
})

function showInfo(data, tabletop) {
    alert('Successfully processed!')
    //rawData = (stuff.sheets("Sheet1").toArray());
    processData();
}

function processData() {
    rawData = stuff.sheets("Sheet1").toArray();
    while (rawData.length > 0) {
        if (currentClass == "none") {
            currentClass = rawData[0][2];
        } else {
            var pertainingRows = [];
            var teacherNames = [];
            var teacherBlocks = [];
            for (var a in rawData) {
                if (rawData[a][2] == currentClass) {
                    pertainingRows.push(rawData[a]);
                }
            }
            for (var a in pertainingRows) {
                teacherNames.push(pertainingRows[a][7])
            }
            removeDuplicates(teacherNames);
            for (var a in teacherNames) {
                teacherBlocks.push([]);
                for (var b in pertainingRows) {
                    if (pertainingRows[b][7] == teacherNames[a]) {
                        teacherBlocks[a].push(pertainingRows[b][5]);
                    }
                }
            }
            let result = new Course(currentClass, parseInt(pertainingRows[0][0],10), teacherNames, teacherBlocks);
            for (var a = rawData.length - 1; a >= 0; a--) {
                if (rawData[a][2] == currentClass) {
                    rawData.splice(a, 1);
                }
            }
            currentClass = "none";
        }
    }
    console.log(allCourses);
}

function removeDuplicates(arr) {
    for (var a = 0; a < arr.length; a++) {
        for (var b = arr.length - a; b >= 1; b--) {
            if (arr[a] == arr[a + b]) {
                arr.splice(a + b, 1);
            }
        }
    }
}

/*let precalcH = new Course("Precalc Honors", 1, ["Li", "Gribler"], [[2, 6, 8], [3, 7]]);
let latin3 = new Course("Latin 3", 6, ["TCHR XY"], [[2]]);
let apPhys2 = new Course("AP Physics 2", 2, ["Cooley"], [[5, 7]]);
let apComp = new Course("AP Comp Sci", 1, ["Simon"], [[1, 3, 6, 7]]);
let ush = new Course("US History", 4, ["Sloan", "Furey", "Starr", "Staff B", "Prophet", "Worth"], [[1, 3], [2, 4, 8], [2, 4, 6], [3, 6, 8], [5, 7], [5, 7]]);
let apEng7577 = new Course("AP English 75/77", 3, ["Moffit"], [[2, 4]]);
let chemH = new Course("Chemistry A Honors", 2, ["Fong", "Trimble"], [[1], [2, 3, 4, 6]]);
let advDrama = new Course("Advanced Drama", 5, ["Ullman"], [[5, 6]]);
let yoga = new Course("Yoga", 7, ["Doherty", "Staff A"], [[3], [6]]);
let health = new Course("Health", 8, ["Cole", "Brooks"], [[2, 3, 4, 6, 8], [3, 5, 7]]);*/

/*function tabletopInit(){
    var announcer = Tabletop.init({
        key: "https://docs.google.com/spreadsheets/d/1v85ZUS42eJ2fh_kCk3VGzlp3HBWwdvN5C6hYfg3WvWE/edit?usp=sharing",
        callback: showInfo,
        simpleSheet: true
    })
}
function showInfo(data, tabletop) {
    alert('Successfully processed!')
    document.getElementById("tester").innerHTML = data;
}
tabletopInit();

var rawData = announcer.toArray();*/
//document.getElementById("tester").innerHTML = rawData.length;

//window.addEventListener('DOMContentLoaded', tabletopInit)

function inArray(obj, arr) {
    for (var a in arr) {
        if (arr[a] == obj) {
            return true;
        }
    }
    return false;
}