import { firebaseConfig } from "./firebase.js"

var currentTime = Date.now();
var count = 1;
var currentTimeMillis = Date.now();
firebase.initializeApp(firebaseConfig);
var contestListdb = firebase.firestore();
var contestTextdb = firebase.firestore();
drawContestList();

function drawContestList() {
    contestListdb.collection("contest")
        .orderBy("timeline", 'desc')
        .get()
        .then((result) => {
            result.forEach((allDoc) => {
                var currentTimeMillis2 = Date.now();
                console.log(currentTimeMillis2 - currentTimeMillis);
                $('#num_' + count).ready(function () {
                    var date, year, month, day;

                    var text_num = $('<div class="num" id="num_' + count + '">' + count + "</div>");
                    var title_span = $('<a href="contestview.html"></a>');
                    var text_title = $('<div class="title" style="cursor:pointer;" id="title_' + count + '"></div>');
                    $("title_" + count).ready(function () {
                        $("#title_" + count).append(title_span);
                    });
                    var text_writer = $('<div class="writer" id="writer_' + count + '"></div>');
                    var text_date = $('<div class="date" id="date_' + count + '"></div>');
                    var div = $("<div id=text_" + count + "><div>");
                    $('text_' + count).ready(function () {
                        $('#text_' + count).empty();
                    })
                    $("#board_list_box").append(div);
                    $('text_' + count).ready(function () {
                        $("#text_" + count).append(text_num);
                        $("#text_" + count).append(text_title);
                        $("#text_" + count).append(text_writer);
                        $("#text_" + count).append(text_date);
                    });

                    $('#num_' + count).ready(function () {

                        year = String(allDoc.data()["year"]);
                        month = String(allDoc.data()["month"]);
                        day = String(allDoc.data()["day"]);
                        if (allDoc.data()["month"] < 10) month = String("0" + month);
                        if (allDoc.data()["day"] < 10) day = String("0" + day);
                        date = year + "." + month + "." + day;

                        $("[id^=num_" + count + "]").html(allDoc.data()["timeline"]);
                        $("[id^=title_" + count + "]").html(allDoc.data()["title"]);
                        $("[id^=writer_" + count + "]").html(allDoc.data()["writer"]);
                        $("[id^=date_" + count + "]").html(date);
                        count += 1;
                    });
                });
            });
        });
}

$(document).ready(function () {
    $(document).on('click', "[id^='title_']", function () {
        var id = $(this).attr("id");
        acyncMovePage(id)
    });
})

function acyncMovePage(tagID) {
    var date;
    var title = $('#' + tagID).text();
    // ajax option
    var ajaxOption = {
        url: "https://aislhomepage.web.app/contestview.html",
        header: "application/x-www-form-urlencoded",
        timeout: 0,
    };
    $.ajax(ajaxOption).done(function (resp) {
        // Contents 영역 삭제
        history.pushState(null, null, "/contest.html");
        $("#board_list_box").children().remove();
        // Contents 영역 교체
        $("#board_list_box").html(resp);
    }).done(function () {
        contestTextdb.collection("contest")
            .where("title", "==", title)
            .get()
            .then((result) => {
                result.forEach((allDoc) => {
                    $("#selected_title").ready(function () {
                        date = String(allDoc.data()["year"] + "." + allDoc.data()["month"] + "." + allDoc.data()["day"]);
                        var publication_content = "주최측: " + allDoc.data()["host"] + "</br></br>" +
                            "수상: " + allDoc.data()["awards"] + "</br></br>" +
                            "팀이름: " + allDoc.data()["teamname"] + "</br></br>" +
                            "구성원: " + allDoc.data()["members"] + "</br></br>" +
                            "프로젝트 이름: " + allDoc.data()["projectname"] + "</br></br>" +
                            "프로젝트 설명: " + allDoc.data()["project description"] + "</br></br>";
                        $("[id^=selected_title").html(allDoc.data()["title"]);
                        $("[id^=selected_timeline").html(allDoc.data()["timeline"]);
                        $("[id^=selected_date").html(date);
                        $("[id^=selected_content").html(publication_content);
                        $("[id^=selected_writer").html(allDoc.data()["writer"]);
                        // document.getElementById("selected_title").innerHTML = allDoc.data()["title"];
                        // document.getElementById("selected_timeline").innerHTML = allDoc.data()["timeline"];
                        // document.getElementById("selected_date").innerHTML = date;
                        // document.getElementById("selected_content").innerHTML = publication_content;
                        // document.getElementById("selected_writer").innerHTML = allDoc.data()["writer"];

                        var photoURL = allDoc.data()["photoRefFromURL_1"];

                        $("#selected_content").ready(function () {
                            firebase
                                .storage()
                                .refFromURL(photoURL)
                                .getDownloadURL()
                                .then((url) => {
                                    // `url` is the download URL for 'images/stars.jpg'
                                    // console.log(url);
                                    // Or inserted into an <img> element
                                    var img_1 = $('<img src="' + url + '" style="width :100%; height : 100%" /img>');
                                    $("selected_content").ready(function () {
                                        $("#selected_content").append(img_1);
                                    });
                                })
                                .catch((error) => {
                                    // Handle any errors
                                });
                        });
                    });
                });
            });
    })
    $(window).on("popstate", function (event) {
        window.location = document.location.href;
    });
}


export { drawContestList };