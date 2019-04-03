/* global variable begin */
let drawing = false;
let running = false;
/* global variable end */

/** WebSocket initialization begin */
// let ws = new WebSocket('ws://127.0.0.1:1923/ws');

// ws.onmessage = function (message) {
//     console.log(message.data);
//     let msg = JSON.parse(message.data);
//     switch (msg.action) {
//         case 'append-user':
//             let username = msg.content.nickname;
//             let uid = msg.content.uid;
//             let avatarUrl = msg.content.avatar;
//             auto_add_user(avatarUrl, username, uid);
//         default:
//             console.log('unknown action:\n' + message.data);
//     }
// };
/** WebSocket initialization end */

/* input style implement begin */
$(".input-field input").on('focus', function() {
    $(this).parent().find("label").addClass("active");
});
$(".input-field input").on('blur', function() {
    if ($(this).val() == "")
        $(this).parent().find("label").removeClass("active");
});
/* input style implement end */

// TODO
function auto_add_user(img_url, username, uid) {
    $("#parts-list-head").html("<tr><td>头像</td><td>用户名</td><td>UID</td></tr>");
    $("#parts-list-body").append("<tr><td>" + "<img width='100px' height='100px' src='" + img_url + "'/></td><td>" + username + "</td><td>" + uid + "</td></tr>");
}

/* start draw begin */
function start_draw() {
    $("#draw-label").text("停止抽奖");
    $(".btn-draw-action").css("background-color", "orangered");
    $("#draw-action").attr("class", "mdi mdi-stop-circle-outline");
    // ws.send(JSON.stringify({
    //     action: 'start-drawing',
    //     content: {'dkind': $("#draw-style").val()}
    // }));
}
/* start draw end */

/* stop draw begin */
function stop_draw() {
    $("#draw-label").text("开始抽奖");
    $(".btn-draw-action").css("background-color", "#006400");
    $("#draw-action").attr("class", "mdi mdi-arrow-right-drop-circle-outline");
    // ws.send(JSON.stringify({
    //     action: 'stop-drawing'
    // }));
}
/* stop draw end */

/* draw button clicked begin */
function on_draw_btn_click() {
    if (!drawing) start_draw(); else stop_draw();
    drawing = !drawing;
}
/* draw button clicked end */

/* activity button clicked begin */
function on_activity_btn_click() {
    if (!running) {
        $("#activity-label").text("结束活动");
        $(".btn-activity-action").css("background-color", "orangered");
        $("#activity-action").attr("class", "mdi mdi-stop-circle-outline");
        $(".btn-draw-action").prop('disabled', false); 
    } else {
        $("#activity-label").text("活动结束");
        $(".btn-activity-action").css("background-color", "#006400");
        $("#activity-action").attr("class", "mdi mdi-arrow-right-drop-circle-outline");
        $(".btn-activity-action").prop('disabled', true); 
        $(".btn-draw-action").prop('disabled', true);
        stop_draw();
    }
    running = true;
}
/* activity button clicked end */

/* csv parser begin */
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
/* csv parser end */

/* import participants begin */
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
/* import participants end */

/* ecalendar plugin initialize begin */
var eCalendar = {
    type  : "time",   //模式，time: 带时间选择; date: 不带时间选择;
    stamp : false,    //是否转成时间戳，默认true;
    offset: [0, 2],   //弹框手动偏移量;
    format: "yyyy年mm月dd日 hh:ii",   //时间格式 默认 yyyy-mm-dd hh:ii;
    skin  : "#1B7690",   //皮肤颜色，默认随机，可选值：0-8,或者直接标注颜色值;
    step  : 10,   //选择时间分钟的精确度;
    callback:function(v,e) {} //回调函数
};
/* ecalendar plugin initialize end */

/* prize pool table operation begin */
    /* add a prize begin*/
    function add_prize() {
        if ($('input:focus').length != 0) return;
        if ($('#prize-list-body').find("tr").length == 0 || $('#prize-list-body tr:last').find('input').val()) {
            $("#prize-list-body").append(`<tr>
            <td><input class="table-input" style="margin-bottom: 0px;" type="text" draggable="true" ondragstart="drag_prize(event)" onblur="check_content(this)"></input></td>
            <td><div class="del-prize" onclick="del_row(this)"><i class="mdi mdi-trash-can-outline"></i></div></td>
            </tr>`);
        }
        $('#prize-list-body tr:last').find('input').focus();
    }
    /* add a prize end */

    /* add an item begin */
    function add_item() {
        if ($('input:focus').length != 0) return;
        if ($('#item-list-body').find("tr").length == 0 || $('#item-list-body tr:last').find('input.item-name').val()) {
            $("#item-list-body").append(`<tr>
            <td><input class="table-input item-name" style="margin-bottom: 0px;" type="text" onblur="check_content(this)"></input></td>
            <td><input readonly="readonly" style="margin-bottom: 0px; color: rgb(64, 77, 91);" ondrop="drop_prize(event)" ondragover="allowDrop(event)"></input></td>
            <td><input class="table-input" style="margin-bottom: 0px;" type="number" min="1"></input></td>
            <td><div class="del-item" onclick="del_row(this)"><i class="mdi mdi-trash-can-outline"></i></div></td>
            </tr>`);
        }
        $('#item-list-body tr:last').find('input.item-name').focus();
    }
    /* add an item end */

    /* check new item content begin */
    function check_content(obj) {
        if (obj.value == "") {
            del_row(obj);
            return false;
        }
        var tr = $(obj).parent().parent();
        var obj_index = tr.prevAll().length;
        $(tr.parent()).find("tr").each(function(index, element) {
            var input = $(this).children("td:first").find("input").val();
            if (index != obj_index && obj.value == input) {
                runNotify({
                    message: '内容重复',
                    messageTitle: 'title',
                    levelMessage: 'error',
                    timer: '1000'
                }); 
                obj.focus();
                return false;
            }
        });
        return true;
    }
    /* check new item content end */

    /* delete a row begin */
    function del_row(obj) {
        var tr = obj.parentNode.parentNode;
        tr.parentNode.removeChild(tr);
    }
    /* delete a row end */

    /* prize-name draggable begin */
    function drag_prize(event) {
        event.dataTransfer.setData("Text", event.target.value);
    }
    function drop_prize(event) {
        event.preventDefault();
        var data = event.dataTransfer.getData("Text");
        event.target.value = data;
    }
    function allowDrop(event) {
        event.preventDefault();
    }
    /* prize-name draggable begin */
/* prize pool table operation end */

/* range input filling begin */
function range_input() {
    var range = parseInt(parseInt(this.max) - parseInt(this.min));
    var percent = String(parseInt(parseInt(this.value) - parseInt(this.min)) * 100 / range);
    $(this).css('background', 'linear-gradient(to right, #343A40, #ebeff4 ' + percent + '%, #ebeff4)');
    $(this).next().text(String(this.value));
}
$.fn.RangeSlider = function() {
    var $input = $(this);
    $input.attr('min', this.min).attr('max', this.max).attr('step', 1);
    $input.bind("input", range_input);
};
/* range input filling end */

/* get lucky draw items for choice begin*/
function get_items() {
    $(this).val("");
    var items = "";
    $("#item-list-body tr").each(function() {
        var text = $(this).children("td:first").find("input").val() + ' ';
        if (text) {
            items += '<option value="' + text + '" />';
        }
    });
    if (items == "") {
        runNotify({
            message: '请先设置奖项',
            messageTitle: 'title',
            levelMessage: 'warn',
            timer: '1000'
        });
        $(this).blur();
    }
    $("#items").html(items);
    return false;
}
/* get lucky draw items for choice end*/

/* show luck dog begin */
function show_lucky_dog(username, prizename) {
    $("#lucky-list-body").append("<tr><td>" + username + "</td><td>" + prizename + "</td></tr>");
}
/* show luck dog end */

/* initialization and bindings */
$(document).ready(function () {

    /* Import participants binding */
    $("#participants").change(import_participants);
    
    /* Date input binding */
    $("#start-time").ECalendar(eCalendar);
    $("#end-time").ECalendar(eCalendar);

    /* select input plugin initialization */
    $('.form-control-chosen').chosen();

    /* add prize binding */
    $(".btn-add-prize").click(add_prize);
    $(".btn-add-item").click(add_item);

    /* color picker initialization */
    $('INPUT.minicolors').minicolors({letterCase: 'uppercase'});

    /* range input initialization */
    $('#font-size').RangeSlider();
    $('#opacity').RangeSlider();

    /* automatically get item when click cur-item-input */
    $("#cur-item-input").on('focus', get_items);

    /* draw and activity button clicked */
    $(".btn-draw-action").click(on_draw_btn_click);
    $(".btn-activity-action").click(on_activity_btn_click);
});