var forbidden_words_list=new Array("优秀","太强了","天下第一");
var forbidden_times=new Array(0,0,0);
var black_users_list=new Array("李金牙","李金嘴","黄一凡");
var bullet_list_style=new Array("table-active","table-primary","table-secondary","table-sucess","table-danger","table-warning","table-info","table-light");
var bullet_num=0;
// let ws = new WebSocket('ws://127.0.0.1:1923/ws');
//
// ws.onmessage = function (message) {
//     console.log(message.data);
//     let msg = JSON.parse(message.data);
//
//     switch (msg.action) {
//         case "bullet":
//             for(var i=0;i<forbidden_words_list.length;i++){
//                 if(msg.content.bullet.indexOf(forbidden_words_list[i])>-1){
//                     ws.send(JSON.stringify({
//                         action: 'bullet_forbidden',
//                         content: msg.content.id
//                     }));
//                 }
//                 add_bullet(msg.content.time,msg.content.nickname,msg.content.bullet);
//             }
//         break;
//     }
// }


function add_forbidden() {
    if($('#add_a_forbidden_word').val()=="")
        return;
    console.log($('#add_a_forbidden_word').val());
    forbidden_words_list.push($('#add_a_forbidden_word').val());
    var tr=document.createElement('tr');
    var th=document.createElement('th');
    var td1=document.createElement('td');
    var td2=document.createElement('td');
    th.scope="row";
    th.innerText=forbidden_words_list.length;
    td1.innerText=$('#add_a_forbidden_word').val();
    td2.innerText=0;
    tr.appendChild(th);
    tr.appendChild(td1);
    tr.appendChild(td2);
    $('#forbidden_words_body').append(tr);
}
function add_black_user() {
    if($('#add_a_black_user').val()=="")
        return;
    console.log($('#add_a_black_user').val());
    black_users_list.push($('#add_a_black_user').val());
    var tr=document.createElement('tr');
    var th=document.createElement('th');
    var td1=document.createElement('td');
    var td2=document.createElement('td');
    th.scope="row";
    th.innerText=black_users_list.length;
    td1.innerText="--";
    td2.innerText=$('#add_a_black_user').val();
    tr.appendChild(th);
    tr.appendChild(td1);
    tr.appendChild(td2);
    $('#black_users_list_body').append(tr);

}
function add_bullet(a,b,c) {
        var tr=document.createElement('tr');
        var th=document.createElement('th');
        var td1=document.createElement('td');
        var td2=document.createElement('td');
        tr.className+=bullet_list_style[bullet_num%8];
    td2.style.paddingTop=8;
    td2.style.paddingRight=8;
        th.scope="row";
        th.innerText=a;
        td1.innerText=b;
        td2.innerHTML=c+'<div class="btn-group btn-group-sm right" role="group" aria-label="Basic example" style:"padding">\n' +
            '        <button type="button" class="btn btn-secondary">屏蔽该弹幕</button>\n' +
            '        <button type="button" class="btn btn-danger">将该用户加入到黑名单</button>\n' +
            '        </div>';
        tr.appendChild(th);
        tr.appendChild(td1);
        tr.appendChild(td2);
    $('#bullets_list').append(tr);
    bullet_num++;
}
for(var i=1;i<=100;i++){
    if(i<50)
        add_bullet("13213","frog","不要总想着搞什么大新闻");
    else
        add_bullet("13213","frog","安慕安格瑞");
}