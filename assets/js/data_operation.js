
ws.onmessage = function (message) {
    console.log(message.data);
    let msg = JSON.parse(message.data);
    switch (msg.action) {
        case 'init-from-history':///从历史记录导入数据
    }
}

function getJsonLength(jsonData){
    var jsonLength = 0;
    for(var item in jsonData){
        jsonLength++;
    }
    return jsonLength;
}

function getQueryString(name) {//获取name参数的值
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}

// var fso=new ActiveXObject(Scripting.FileSystemObject);
// var f=fso.opentextfile(path,1,true);
// while (!f.AtEndOfStream) {
//     console.log(f.Readline());
// }
// f.close();

function save_information_as_history(){///保存活动信息

    ws.send(JSON.stringify({
        action: 'save-activity-information',
        content: ""
    }));
}

// jsReadFiles(path);

function get_history_information(e){///得到历史活动参数


    var path=getQueryString('set-from-history');
    console.log(path);

    let data =  {
        activity_id:path,
    };
    $.ajax({
        url: '127.0.0.1:1923/get-participants',//老才的服务器名
        method: 'get',
        contentType: 'json',
        dataType: 'json',
        data: JSON.stringify(data),
        success: function(e) {

            for(var i=0;i<e.content.length;i++){
                auto_add_user(e.content[i].avatar,e.content[i].nickname,i);///导入用户名字头像id
            }
            console.log('保存成功');
        },
        error: function (e) {
            console.log(e);
        }
    })

    $.ajax({
        url: '127.0.0.1:1923/get-activities',//老才的服务器名
        method: 'get',
        contentType: 'json',
        dataType: 'json',
        data: JSON.stringify(data),
        success: function(e) {

            for(var i=0;i<e.content.length;i++){
                    $("#activity-name").val(msg.content.name);///导入活动名字信息
            }
            console.log('保存成功');
        },
        error: function (e) {
            console.log(e);
        }
    })


}