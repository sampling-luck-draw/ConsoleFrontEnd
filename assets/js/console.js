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

$(document).ready(function () {
    // $('select').material_select();
    // get_participant_list();
    $(".btn-draw-action").click(on_draw_btn_click);
    $(".btn-activity-action").click(on_activity_btn_click);
    // $("#reset-btn").click(on_reset_button_click);
});