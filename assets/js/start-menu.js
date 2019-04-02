$(document).ready(function(){
    $('.modal').modal();
});
var tem=1;
if(tem==1){
    document.getElementById('create_opinion').href="#modal1";
    document.getElementById('title_opinion').innerText='新建活动';
    document.getElementById('explain_opinion').innerText='从零开始打造！';
    for(var i=1;i<5;i++){
        var div=document.createElement('div');
        var ii=document.createElement('i');
        // ii.class="small material-icons";
        ii.classList.add('small');
        ii.classList.add('material-icons');
        ii.style="display:block";
        ii.innerHTML='replay';
        div.appendChild(ii);
        // div.style.display="inline-bloc";
        var a=document.createElement('a');
        a.style=
        a.innerHTML='name<span class="badge" style="text-align:right">进入</span>';
        a.style="display:inline-block;width:100%; text-align:left;float: left;padding:0px";
        a.href="#!";
        a.classList.add("collection-item");
        div.appendChild(ii);
        div.appendChild(a);
        div.style="display:flex;";
        document.getElementById('ly1').appendChild(div);
        // document.getElementById('ly1').appendChild(ii);


    }

// <div style="display: inline-block;display: flex;margin-right:0px;">
//         <i class="small material-icons"  style="display:inline-block;float: left;">replay</i>
//         <a href="#!" class="collection-item" style="display:inline-block;width:100%; text-align:left;float: left;">2016年会抽奖<span class="badge" style="text-align:right">进入</span></a>
//     </div>


}
else if(tem==2){
    document.getElementById('create_opinion').href="#!";
    document.getElementById('title_opinion').innerText='回到控制台';
    document.getElementById('explain_opinion').innerText='继续您的活动';
    document.getElementById('explain_opinion').innerText='继续您的活动';
    document.getElementById('ly').style.display="none";
    document.getElementById('ly1').style.display="none";
}