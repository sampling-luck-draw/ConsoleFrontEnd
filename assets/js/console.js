/* global variable begin */
let drawing = false;
let running = false;
let started = false;
let isOnline = true;
let userType = "debug";
let cheat_data = new Array();
/* global variable end */

/** WebSocket initialization begin */
let ws = new WebSocket('ws://127.0.0.1:1923/ws');

ws.onmessage = function (message) {
    console.log(message.data);
    let msg = JSON.parse(message.data);
    switch (msg.action) {
        case 'append-user':
            let username = msg.content.nickname;
            let uid = msg.content.uid;
            let avatarUrl = msg.content.avatar;
            auto_add_user(avatarUrl, username, uid);
            break;
        case 'initialize':
            isOnline = (msg.content.online == "true");
            userType = msg.content.userType;
            console.log(isOnline, userType);
            if (isOnline) {
                $("#online-symbol").text("ONLINE");
                $('.import-participants').attr("disabled", "true");
            } else {
                $("#online-symbol").text("OFFLINE");
            }
            break;
        case 'who-is-lucky-dog':
            show_lucky_dog(msg.content.nickname, msg.content.itemname);
            console.log(msg.content.nickname + " gets " + msg.content.itemname);
            break;
        default:
            console.log('unknown action:\n' + msg.action);
    }
};
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
    $("#parts-list-body").append("<tr><td>" + "<img width='60px' height='60px' src='" + img_url + "'/></td><td>" + username + "</td><td>" + uid + "</td></tr>");
}

/* start draw begin */
function start_draw() {
    $("#draw-label").text("停止抽奖");
    $(".btn-draw-action").css("background-color", "orangered");
    $("#draw-action").attr("class", "mdi mdi-stop-circle-outline");
    ws.send(JSON.stringify({
        action: 'start-drawing',
        content: {'dkind': $("#draw-style").val()}
    }));
}
/* start draw end */

/* stop draw begin */
function stop_draw() {
    $("#draw-label").text("开始抽奖");
    $(".btn-draw-action").css("background-color", "#006400");
    $("#draw-action").attr("class", "mdi mdi-arrow-right-drop-circle-outline");
    ws.send(JSON.stringify({
        action: 'stop-drawing',
        content: ""
    }));
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
        $("#activity-label").text("隐藏活动");
        $(".btn-activity-action").css("background-color", "orangered");
        $("#activity-action").attr("class", "mdi mdi-stop-circle-outline");
        $(".btn-draw-action").prop('disabled', false);
        if (!started) {
            var t = new Date();
            var now = t.getFullYear() + "-" + t.getMonth() + "-" + t.getDate() + "-" + 
            t.getHours() + "-" + t.getMinutes() + "-" + t.getSeconds();
            ws.send(JSON.stringify({
                action: 'activity-start-time',
                content: now
            }));
            started = true;
        }
        ws.send(JSON.stringify({
            action: 'show-activity',
            content: ''
        }));
    } else {
        $("#activity-label").text("展示活动");
        $(".btn-activity-action").css("background-color", "#006400");
        $("#activity-action").attr("class", "mdi mdi-arrow-right-drop-circle-outline");
        $(".btn-draw-action").prop('disabled', true);
        if (drawing) stop_draw();
        ws.send(JSON.stringify({
            action: 'hide-activity',
            content: ''
        }));
    }
    running = !running;
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
            var t = $.trim(record[i]).split(",");
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
        $('#participants').val("");
        $("#parts-list-head").empty();
        $("#parts-list-body").empty();
        $('.parts-label').addClass("active");
        var data = this.result;
        $(function() {
            $.csv(data, function(data) {
                if (!data) return;
                if (data && !data[0].hasOwnProperty('username')) {
                    for (var item in data[0]) console.log(item);
                    runNotify({
                        message: 'CSV必须包含username字段',
                        messageTitle: 'title',
                        levelMessage: 'warn',
                        timer: '2000'
                    });
                    $('#parts').val("");
                    $('#parts').blur();
                    return;
                }
                var head_str = "<tr>";
                for (item in data[0])
                    head_str += "<th>" + item + "</th>";
                $("#parts-list-head").append(head_str + "</tr>");
                for (var i = 0; i < data.length; ++i) {
                    var record_str = "<tr>";
                    var content = {};
                    for (item in data[0]) {
                        record_str += "<td>" + data[i][item] + "</td>";
                        content[item] = data[i][item];
                    }
                    ws.send(JSON.stringify({
                        action: 'manual-import',
                        content: content
                    }));
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
            <td class="icon-td"><div class="del-prize table-icon" onclick="del_row(this)"><i class="mdi mdi-trash-can-outline"></i></div></td>
            </tr>`);
            $(".table-input").attr("onkeydown", "input_keydown(this, event)");
        }
        $('#prize-list-body tr:last').find('input').focus();
    }
    /* add a prize end */

    /* add an item begin */
    function add_item() {
        if ($('input:focus').length != 0) return;
        if ($('#item-list-body').find("tr").length == 0 || $('#item-list-body tr:last').find('input.item-name').val()) {
            var cheat_functions = `<div class="cfg-cheat table-icon" onclick="cfg_cheat(this)"><i class="mdi mdi-settings"></i></div>`
            if (userType == "normal") cheat_functions = '';
            $("#item-list-body").append(`<tr>
            <td><input class="table-input item-name" style="margin-bottom: 0px;" type="text" onblur="check_content(this)"></input></td>
            <td><input readonly="readonly" style="margin-bottom: 0px; color: rgb(64, 77, 91);" ondrop="drop_prize(event)" ondragover="allowDrop(event)"></input></td>
            <td><input class="table-input" style="margin-bottom: 0px;" type="number" min="1" value="1"></input></td>
            <td class="icon-td">
            ` + cheat_functions + `
            <div class="del-item table-icon" onclick="del_item(this)"><i class="mdi mdi-trash-can-outline"></i></div>
            </td>
            </tr>`);
            $(".table-input").attr("onkeydown", "input_keydown(this, event)");
            $(".cfg-cheat").attr("onmouseover", "show_cheat_info(this, event)");
            $(".cfg-cheat").attr("onmouseout", "hide_cheat_info(this, event)");
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

    /* delete an item begin */
    function del_item(obj) {
        var item_name = $(obj).parent().parent().find(".item-name").val();
        if (item_name != '' && item_name in cheat_data) {
            delete cheat_data[item_name];
            // console.log(cheat_data);
        }
        del_row(obj);
    }
    /* delete an item end */

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
        var text = $(this).children("td:first").find("input").val();
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
    $("#lucky-list-body").append("<tr><td width='50%'>" + username + "</td><td width='50%'>" + prizename + "</td></tr>");
}
/* show luck dog end */

/* cheat function begin */
function cfg_cheat(obj) {
    var item_name = $(obj).parent().parent().find(".item-name").val();
    $("#cheat-kind").text(item_name);
    if (item_name in cheat_data) {
        cheat_data[item_name].winner.forEach(function(value, i) {
            $("#cheat-winner").append(`<tr>
            <td><input class="table-input" value="` + value + `"style="margin-bottom: 0px;" type="text" onblur="check_content(this)"></input></td>
            <td class="icon-td"><div class="del-winner table-icon" onclick="del_row(this)"><i class="mdi mdi-trash-can-outline"></i></div></td>
            </tr>`);
        });
        cheat_data[item_name].loser.forEach(function(value, i) {
            $("#cheat-loser").append(`<tr>
            <td><input class="table-input" value="` + value + `" style="margin-bottom: 0px;" type="text" onblur="check_content(this)"></input></td>
            <td class="icon-td"><div class="del-loser table-icon" onclick="del_row(this)"><i class="mdi mdi-trash-can-outline"></i></div></td>
            </tr>`);
        });
        $(".table-input").attr("onkeydown", "input_keydown(this, event)");
    }
    $(".modal").modal('show');
}
function show_cheat_info(obj, event) {
    // console.log("hover");
    var max_len = 3;
    var item_name = $(obj).parent().parent().find(".item-name").val();
    if (item_name in cheat_data) {
        // console.log("show hover");
        if (cheat_data[item_name].winner.length == 0) {
            $("#cheat-winner-info").append(`<tr><td>无</td></tr>`);
        } else {
            for (var i = 0; i < cheat_data[item_name].winner.length; i ++) {
                $("#cheat-winner-info").append(`<tr><td>` + cheat_data[item_name].winner[i] + `</td></tr>`);
                if (i + 1 >= max_len) break;
            }
            if (cheat_data[item_name].winner.length >= max_len) {
                $("#cheat-winner-info").append(`<tr><td>. . .</td></tr>`);
            }
        }
        if (cheat_data[item_name].loser.length == 0) {
            $("#cheat-loser-info").append(`<tr><td>无</td></tr>`);
        } else {
            for (var i = 0; i < cheat_data[item_name].loser.length; i ++) {
                $("#cheat-loser-info").append(`<tr><td>` + cheat_data[item_name].loser[i] + `</td></tr>`);
                if (i + 1 >= max_len) break;
            }
            if (cheat_data[item_name].loser.length >= max_len) {
                $("#cheat-loser-info").append(`<tr><td>. . .</td></tr>`);
            }
        }
        $("#cheat-info").show();
    }
}
function hide_cheat_info(obj, event) {
    $("#cheat-info").hide();
    $("#cheat-winner-info").empty();
    $("#cheat-loser-info").empty();
}
function echo_info(statebar, state, content) {
    var prefix = "";
    var _class = "alert alert-dismissible ";
    if (state == 0) {
        prefix = "成功";
        _class += "alert-success";
    } else if (state == 1) {
        prefix = "警告";
        _class += "alert-warning";
    } else if (state == 2) {
        prefix = "错误";
        _class += "alert-danger";
    }
    $(statebar).html("<strong>" + prefix + ": </strong>" + content);
    $(statebar).attr("class", _class);
    $(statebar).show();
    setTimeout(
        function () {
            $(statebar).hide();
        }, 2000
    );
}
function check_cheat_content(obj) {
    if (obj.value == "") {
        del_row(obj);
        return false;
    }
    var tr = $(obj).parent().parent();
    var obj_index = tr.prevAll().length;
    
    $(tr.parent()).find("tr").each(function(index, element) {
        var input = $(this).children("td:first").find("input").val();
        if (index != obj_index && obj.value == input) {
            echo_info("#cheat-statebar", 2, "用户ID存在冲突");
            obj.focus();
            return false;
        }
    });
    var other = tr.parent().attr('id') == "cheat-winner" ? "#cheat-loser": "#cheat-winner";
    // console.log(other);
    $(other).find("tr").each(function(index, element) {
        var input = $(this).children("td:first").find("input").val();
        if (obj.value == input) {
            echo_info("#cheat-statebar", 2, "用户ID存在冲突");
            obj.focus();
            return false;
        }
    });
    return true;
}
let max_winner = 1;
function add_winner() {
    if ($('input:focus').length != 0) return;
    if ($("#cheat-winner").find("tr").length >= max_winner) {
        echo_info("#cheat-statebar", 1, "中奖人选超出上限");
        return;
    }
    $("#cheat-winner").append(`
        <tr draggable="true" ondragstart="drag_cheat_item(this, event)">
            <td><input class="table-input" style="margin-bottom: 0px;" type="text" onblur="check_cheat_content(this)"></input></td>
            <td class="icon-td"><div class="del-winner table-icon" onclick="del_row(this)"><i class="mdi mdi-trash-can-outline"></i></div></td>
        </tr>`);
    $(".table-input").attr("onkeydown", "input_keydown(this, event)");
    $('#cheat-winner tr:last').find('input').focus();
}
function add_loser() {
    if ($('input:focus').length != 0) return;
    $("#cheat-loser").append(`
        <tr draggable="true" ondragstart="drag_cheat_item(this, event)">
            <td><input class="table-input" style="margin-bottom: 0px;" type="text" onblur="check_cheat_content(this)"></input></td>
            <td class="icon-td"><div class="del-loser table-icon" onclick="del_row(this)"><i class="mdi mdi-trash-can-outline"></i></div></td>
        </tr>`);
    $(".table-input").attr("onkeydown", "input_keydown(this, event)");
    $('#cheat-loser tr:last').find('input').focus();
}
let drag_element = new Object();
function drag_cheat_item(obj, event) {
    $('input:focus').blur();
    drag_element = obj;
}
function drop_cheat_item(obj, event) {
    var $tbody = $(obj).find("table tbody");
    if ($tbody.attr("id") == "cheat-winner" && $tbody.find("tr").length >= max_winner) {
        echo_info("#cheat-statebar", 1, "中奖人选超出上限");
        return;
    }
    event.preventDefault();
    $tbody.append($(drag_element).clone());
    drag_element.parentNode.removeChild(drag_element);
}
function allowDrop(event) {
    event.preventDefault();
}
function save_cheat_info() {
    var item_name = $("#cheat-kind").text();
    cheat_data[item_name] = {winner: [], loser: []};
    $("#cheat-winner tr").each(function() {
        var text = $(this).children("td:first").find("input").val();
        cheat_data[item_name].winner.push(text);
    });
    $("#cheat-loser tr").each(function() {
        var text = $(this).children("td:first").find("input").val();
        cheat_data[item_name].loser.push(text);
    });
    if (cheat_data[item_name].winner.length == 0 && cheat_data[item_name].loser.length == 0) {
        delete cheat_data[item_name];
    }
    // console.log(cheat_data[item_name]);
    quit_cheat_cfg();
}
function quit_cheat_cfg() {
    $(".modal").modal('hide');
    $("#cheat-winner").empty();
    $("#cheat-loser").empty();
}
/* cheat function end */

/* switch stage page begin */
function switch_page() {
    $("#page-name").text($(this).text());
    ws.send(JSON.stringify({
        action: "switch-page",
        content: $("#page-name").text()
    }));
}
/* switch stage page end */

/* shotcut key functions begin */
function global_keydown(e) { // global

}
function input_keydown(obj, event) { // input
    if (event.key == 'Enter') {
        $(obj).blur();
        // console.log("blured");
    }
}
/* shotcut key functions end */

//-------------------------------bjz-begin---------------------------------
//-------------------------------bjz-begin---------------------------------
//-------------------------------bjz-begin---------------------------------
//-------------------------------bjz-begin---------------------------------

// function getQueryString(name) {//获取name参数的值
//     var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
//     if (result == null || result.length < 1) {
//         return "";
//     }
//     return result[1];
// }

// var path=getQueryString('path');
// // console.log(path);
// // var fso=new ActiveXObject(Scripting.FileSystemObject);
// // var f=fso.opentextfile(path,1,true);
// // while (!f.AtEndOfStream) {
// //     console.log(f.Readline());
// // }
// // f.close();
// function get_history_information(){///得到历史活动参数

//     let data =  {
//         username: path,
//         // password: $('#inputPassword').val(),
//     };
//     if (data.username === '' || data.password === '')

//     $.ajax({
//         url: 'signin',//老才的服务器名
//         method: 'POST',
//         contentType: 'json',
//         dataType: 'json',
//         data: JSON.stringify(data),
//         success: function(e) {
//             if (e.result === 'success') {
//                 window.location.href="usercenter"
//             } else {
//                 console.log(e.msg);
//                 $("#toast-body").html(e.msg);
//                 $('.toast').toast('show');
//             }
//             console.log('活动名称'+e.activity_name);
//             console.log('最大人数'+e.activity_maxnum);
//             console.log('结束时间'+e.endtime);
//             console.log('奖项信息'+e.reward_information);

//         },
//         error: function (e) {
//             console.log(e);
//         }
//     })
// }
// function save_information_as_history(){///保存活动信息
//     let data =  {
//         activity_id:'tem_activity_id',
//         activity_name:'tem_activity_name',
//         activity_maxnum:'tem_activity_maxnum',
//         reward_information:'tem_reward_information',
//         // password: $('#inputPassword').val(),
//     };
//     $.ajax({
//         url: 'signin',//老才的服务器名
//         method: 'POST',
//         contentType: 'json',
//         dataType: 'json',
//         data: JSON.stringify(data),
//         success: function(e) {
//             console.log('保存成功');
//         },
//         error: function (e) {
//             console.log(e);
//         }
//     })

// }
// jsReadFiles(path);
//-------------------------------bjz-end---------------------------------
//-------------------------------bjz-end---------------------------------
//-------------------------------bjz-end---------------------------------
//-------------------------------bjz-end---------------------------------

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

    /* cheat binding */
    $("#btn-add-winner").click(add_winner);
    $("#btn-add-loser").click(add_loser);

    /* switch page binding */
    $(".dropdown-item.page").click(switch_page);

    /* shotcut key map */
    document.onkeydown = global_keydown;
    $("#cur-item-input").keydown(input_keydown);
});
