
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
if(tem==1){
    // document.getElementById('create-or-resume-div').style.left=43+'rem';
    console.log($("#create-or-resume-div").val());
    $(function(){
        $("#create-or-resume-div").css("left","27rem");
        $("#create-or-resume").text("新建活动");
        $('#create-or-resume-son').text('开始一场抽奖或弹幕活动，重新设置您的抽奖参数，参加人员等数据');
    })
    // innerText='新建活动';
    for(var i=0;i<history_number;i++){
        var href_str="http://localhost:63342/ConsoleFrontEnd/console.html?set-from-history="+history_id[i];
        var div=document.createElement('div');
        var a=document.createElement('a');
        a.innerText=history_name[i];
        a.href=href_str;
        div.appendChild(a);
        $('#history-list').append(div);


    }

// <div style="display: inline-block;display: flex;margin-right:0px;">
//         <i class="small material-icons"  style="display:inline-block;float: left;">replay</i>
//         <a href="#!" class="collection-item" style="display:inline-block;width:100%; text-align:left;float: left;">2016年会抽奖<span class="badge" style="text-align:right">进入</span></a>
//     </div>


}
else if(tem==2){
    $('#create-or-resume-button').attr('data-target',"!#");


    ws.send(JSON.stringify({
        action: 'resume-activity',
        content: ""
    }));


    $(function () {
        $("#create-or-resume-img").attr("src","assets/img/resume-to-activity.jpg");
        $("#create-or-resume-div").css("left","48rem");
        $('#create-from-history-div').css('display','none');
        $("#create-or-resume").text("继续活动");
        $('#create-or-resume-son').text('您有一场尚未结束的活动，请返回继续或终止');
    })
    document.getElementById('create_opinion').href="#!";
    document.getElementById('title_opinion').innerText='回到控制台';
    document.getElementById('explain_opinion').innerText='继续您的活动';
    document.getElementById('explain_opinion').innerText='继续您的活动';
    document.getElementById('ly').style.display="none";
    document.getElementById('ly1').style.display="none";
}