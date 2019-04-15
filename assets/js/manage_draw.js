var forbidden_words_list=new Array("优秀","太强了","天下第一");
var forbidden_times=new Array(0,0,0);
var black_users_list=new Array("李金牙","李金嘴","黄一凡");
var bullet_list_style=new Array("table-warning","table-light");
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
    var str=$('#add_a_forbidden_word').val();
    if(distinctive_check(forbidden_words_list,str)==false){
        toastr.error('敏感词汇:'+str+'已经被屏蔽！');
        return;
    }
    if(str=="")
        return;
    console.log(str);
    forbidden_words_list.push(str);
    var tr=document.createElement('tr');
    var th=document.createElement('th');
    var td1=document.createElement('td');
    var td2=document.createElement('td');
    th.scope="row";
    th.innerText=forbidden_words_list.length;
    td1.innerText=str;
    td2.innerHTML='0'+'<a onclick="delete_this_word(this)" style="float:right" href="#!">删除</a>';
    tr.appendChild(th);
    tr.appendChild(td1);
    tr.appendChild(td2);
    $('#forbidden_words_body').append(tr);
    document.getElementById('add_a_forbidden_word').value="";
    toastr.success('已添加屏蔽词'+str);
}
function add_black_user() {
    var str=$('#add_a_black_user').val();
    if(distinctive_check(black_users_list,str)==false){
        toastr.error('用户:'+str+'已经在黑名单中！');
        return;
    }
    if(str=="")
        return;
    console.log(str);
    black_users_list.push(str);
    var tr=document.createElement('tr');
    var th=document.createElement('th');
    var td1=document.createElement('td');
    var td2=document.createElement('td');
    td2.value=str;
    th.scope="row";
    th.innerText=black_users_list.length;
    td1.innerText="--";
    td2.innerHTML=str+'<a  onclick="delete_this_people(this)" style="float:right" href="#!">删除</a>';
    tr.appendChild(th);
    tr.appendChild(td1);
    tr.appendChild(td2);
    $('#black_users_list_body').append(tr);
    document.getElementById('add_a_black_user').value="";

    toastr.success('已将用户'+str+'添加到黑名单');
}
var tem=0;
function add_bullet(a,b,c) {
    tem++;
        var tr=document.createElement('tr');
        var th=document.createElement('th');
        var td1=document.createElement('td');
        var td2=document.createElement('td');
        var div=document.createElement('div');
        // tr.className+=bullet_list_style[bullet_num%bullet_list_style.length];
    tr.style.background="#ffffff"
    td2.style.paddingTop=8;
    td2.style.paddingRight=8;
        th.scope="row";
        th.innerText=a;
        td1.innerText=b;
        div.innerText=c;
        td2.style.display='flex';
        td2.appendChild(div);
        td2.innerHTML+='<div class="btn-group btn-group-sm right" role="group" aria-label="Basic example" >\n' +
            '        <button type="button" class="btn btn-secondary" onclick="forbidden_this_draw(this)">屏蔽该弹幕</button>\n' +
            '        <button type="button" class="btn btn-danger" onclick="forbidden_this_user(this)">将该用户加入到黑名单</button>\n' +
            '        </div>';
        tr.appendChild(th);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.id=tem;
    $('#bullets_list').append(tr);
    bullet_num++;
}
for(var i=1;i<=100;i++){
    if(i&1)
        add_bullet("13213","frog","不要总想着搞什么大新闻");
    else
        add_bullet("13213","frog","安慕安格瑞");
}
function forbidden_this_draw(e) {
    // this.parent.style.display=none;
    e.disabled=true;
    var str=e.parentElement.previousSibling.innerText;
    console.log(str);
    var par=e.parentElement;
    var par_presib=e.parentElement.previousSibling;
    var par_par=e.parentElement.parentElement;
    var del=document.createElement('strike');
    del.innerText=str;
    par_par.removeChild(par_presib);
    par_par.prepend(del);


    console.log(e.parentElement.parentElement.parentElement.id);
    e.parentElement.parentElement.parentElement.disabled=false;
    // this.parent.parent.pointer-events=

    e.parentNode.parentNode.parentNode.style.background="#919191"
    toastr.success('已屏蔽弹幕: “'+str+'”');
}

function forbidden_this_user(e) {
    var str=e.parentElement.parentElement.previousSibling.innerText;
    if(distinctive_check(black_users_list,str)==false){
        toastr.error('用户:'+str+'已经在黑名单中！');
        return;
    }
    black_users_list.push(str);
    var tr=document.createElement('tr');
    var th=document.createElement('th');
    var td1=document.createElement('td');
    var td2=document.createElement('td');
    td2.value=str;
    th.scope="row";
    th.innerText=black_users_list.length;
    td1.innerText="--";
    td2.innerHTML=str+'<a  onclick="delete_this_people(this)" style="float:right" href="#!">删除</a>';
    tr.appendChild(th);
    tr.appendChild(td1);
    tr.appendChild(td2);
    $('#black_users_list_body').append(tr);

    e.disabled=true;


    toastr.success('已将用户'+e.parentElement.parentElement.previousSibling.innerText+'添加到黑名单');
}

function delete_this_word(e) {
    var str=e.parentNode.previousSibling.innerText;
    console.log('str'+str);
    var loc=removearr(forbidden_words_list,str)+1;
    console.log(loc);
    var tem=e.parentNode.parentNode;
    while($(tem).next().length!=0){
        tem=tem.nextSibling;
        tem.firstElementChild.innerText=loc;
        loc++;
    }
    $(e).parents("tr").remove();
}

function delete_this_people(e) {
    var str=e.parentNode.value;
    console.log('str'+str);
    var loc=removearr(black_users_list,str)+1;
    console.log(loc);
    var tem=e.parentNode.parentNode;
    while($(tem).next().length!=0){
        tem=tem.nextSibling;
        tem.firstElementChild.innerText=loc;
        loc++;
    }
    $(e).parents("tr").remove();
}

function removearr(a,b) {
    var loc=0;
    var flag=0;
    for(var i=0;i<a.length;i++){
        if(flag==1){
            a[i-1]=a[i];
        }else{
            console.log(a[i]+','+b);
            if(a[i]==b){
                flag=1;
                loc=i;
            }
        }
    }
    a.pop();
    return loc;
}
function distinctive_check(a,b) {
    for(var i=0;i<a.length;i++){
        if(a[i]==b)
            return false;
    }
    return true;
}