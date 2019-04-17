/* input style implement begin */
$(".input-field input").on('focus', function() {
    $(this).parent().find("label").addClass("active");
});
$(".input-field input").on('blur', function() {
    if ($(this).val() == "")
        $(this).parent().find("label").removeClass("active");
});
/* input style implement end */
/* panel switch begin */
function show_history() {
    $("#create-guide").fadeIn();
    $("#create-guide").css('display', 'flex');
    $("#history-guide").css('display', 'none');
    $("#create-form").css('display', 'none');
    $("#history-form").fadeIn();
    $("#history-form").css('display', 'block');
}
function show_create() {
    $("#create-guide").css('display', 'none');
    $("#history-guide").fadeIn();
    $("#history-guide").css('display', 'flex');
    $("#create-form").fadeIn();
    $("#create-form").css('display', 'block');
    $("#history-form").css('display', 'none');
}
/* panel switch end */

var history_id=new Array();
var history_name=new Array();
var history_number;
history_name[0]='才明洋表彰大会';
history_name[1]='才明洋表彰大会';
history_name[2]='才明洋表彰大会';
history_name[3]='才明洋表彰大会';
history_name[4]='才明洋表彰大会';
history_id[0]='000';
history_id[1]='001';
history_id[2]='002';
history_id[3]='003';
history_id[4]='004';

let data =  {
};
$.ajax({
    url: '127.0.0.1:1923/get-activities',//老才的服务器名
    method: 'get',
    contentType: 'json',
    dataType: 'json',
    data: JSON.stringify(data),
    success: function(e) {
        history_number=e.content.length;
        for(var i=0;i<e.content.length;i++){
            history_id[i]=content[i].id;
            history_name[i]=content[i].name;
        }
        console.log('获取历史记录成功');
    },
    error: function (e) {
        console.log(e);
        console.log('获取历史记录失败');
    }
})

history_number=5;
var tem=1;
if(tem==1) {
    $(function() {
        $("#resume").css('display', 'none');
        $("#create-or-history").css('display', 'block');
    });
    for(var i=0;i<history_number;i++) {
        var href_str="http://localhost:63342/ConsoleFrontEnd-master/console.html?set-from-history="+history_id[i];
        var a=document.createElement('a');
        a.innerText=history_name[i];
        a.href=href_str;
        a.className = "list-group-item list-group-item-action";
        $('#history-list').append(a);
    }
}
else if(tem==2) {
    $(function() {
        $("#resume").css('display', 'block');
        $("#create-or-history").css('display', 'none');
    });
}