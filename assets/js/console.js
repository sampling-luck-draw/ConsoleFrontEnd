// let ws = new WebSocket('ws://localhost:1923');
// ws.onopen = function() {
//     console.log("open");
//     ws.send("hello");
// };
// ws.onmessage = function(evt) {
//   console.log(evt.data)
// };
// ws.onclose = function(evt) {
//   console.log("WebSocketClosed!");
// };
// ws.onerror = function(evt) {
//   console.log("WebSocketError!");
// };

// ws.onmessage = function (message) {
//     console.log(message.data);
//     let msg = JSON.parse(message.data);
//     // switch (msg.action) {
//     //     case 'who-is-lucky-dog':
//     //         add_luck_dog(msg);
//     //         break;
//     //     default:
//     //         console.log('unknown action:\n' + message);
//     // }
// };

let drawing = false;
let running = false;

function start_draw() {
    $("#draw-label").text("停止抽奖");
    $(".btn-draw-action").css("background-color", "orangered");
    $("#draw-action").attr("class", "mdi mdi-stop-circle-outline right");
}

function stop_draw() {
    $("#draw-label").text("开始抽奖");
    $(".btn-draw-action").css("background-color", "forestgreen");
    $("#draw-action").attr("class", "mdi mdi-arrow-right-drop-circle-outline right");
}

function on_draw_btn_click() {
    if (!drawing) start_draw(); else stop_draw();
    drawing = !drawing;
}

function on_activity_btn_click() {
    if (!running) {
        $("#activity-label").text("结束活动");
        $(".btn-activity-action").css("background-color", "orangered");
        $("#activity-action").attr("class", "mdi mdi-stop-circle-outline right");
        $(".btn-draw-action").removeClass("disabled");
    } else {
        $("#activity-label").text("活动结束");
        $(".btn-activity-action").css("background-color", "forestgreen");
        $("#activity-action").attr("class", "mdi mdi-arrow-right-drop-circle-outline right");
        $(".btn-activity-action").addClass("disabled");
        $(".btn-draw-action").addClass("disabled");
        stop_draw();
    }
    running = true;
}

// function on_reset_button_click() {
//     ws.send(JSON.stringify({
//         action: 'reset-page'
//     }));
// }


// msg: JSON Object
// function add_luck_dog(msg) {
//     let user_id = msg['content']['uid'];
//     let content = $("#user_" + user_id).html();
//     let user_info_template = `<div id="won_${user_id}" class="valign-wrapper">${content}</div>`;
//     $("#won-list").append('<li class="collection-item">' + user_info_template + '</li>')
// }

// function get_participant_list() {
//     $.ajax({
//         url: 'get-exist-user',
//         dataType: 'json',
//         method: 'GET',
//         success: function (result) {
//             for (let i in result) {
//                 let user_id = result[i]['uid'];
//                 let user_avatar = result[i]['avatar'];
//                 let user_name = result[i]['nickname'];
//                 let user_info_template = `<div id="user_${user_id}" class="valign-wrapper"><img class="circle img" src="${user_avatar}" alt="avatar"><span>${user_name}</span></div>`;
//                 $("#user-list").append('<li class="collection-item">' + user_info_template + '</li>')
//             }
//         }
//     })
// }
$.extend({
    csv: function (record, f) {
        record = record.split(/\n/);
        var title = record[0].split(",");
        record.shift();
        var data = [];
        for (var y = 0; y < title.length; y++) {
            title[y] = title[y].trim();
        }
        for (var i = 0; i < record.length; i++) {
            var t = record[i].split(",");
            for (var y = 0; y < t.length; y++) {
                if (!data[i]) data[i] = {};
                data[i][title[y]] = t[y];
            }
        }
        f.call(this, data);
        data = null;
    }
});
function import_participants() {
    var file = document.getElementById("participants").files[0];
    var fileName = file.name.substring(0, file.name.lastIndexOf('.'));
    var reader = new FileReader();
    reader.onload = function(f) {
        $('#parts').val($('#participants').val());
        $('.parts-label').addClass("active");
        var data = this.result;
        $(function() {
            $.csv(data, function(data) {
                if (!data) return;
                if (data && !data[0].hasOwnProperty('username')) {
                    for (var item in data[0]) console.log(item);
                    return;
                }
                var head_str = "<tr>";
                for (item in data[0])
                    head_str += "<th>" + item + "</th>";
                $("#parts-list-head").append(head_str + "</tr>");
                for (var i = 0; i < data.length; ++i) {
                    var record_str = "<tr>";
                    for (item in data[0])
                        record_str += "<td>" + data[i][item] + "</td>"
                    $("#parts-list-body").append(record_str + "</tr>");
                }
            });
        });
    };
    reader.readAsText(file);
}

var eCalendar = {
    type  : "time",   //模式，time: 带时间选择; date: 不带时间选择;
    stamp : false,   //是否转成时间戳，默认true;
    offset: [0, 2],   //弹框手动偏移量;
    format: "yyyy年mm月dd日 hh:ii",   //时间格式 默认 yyyy-mm-dd hh:ii;
    skin  : "#1B7690",   //皮肤颜色，默认随机，可选值：0-8,或者直接标注颜色值;
    step  : 10,   //选择时间分钟的精确度;
    callback:function(v,e) {} //回调函数
};

$(document).ready(function () {
    $(".btn-draw-action").click(on_draw_btn_click);
    $(".btn-activity-action").click(on_activity_btn_click);
    $("#participants").change(import_participants);
    $("#start-time").ECalendar(eCalendar);
    $("#end-time").ECalendar(eCalendar);
});