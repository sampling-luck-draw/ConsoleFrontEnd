$(document).ready(function(){
    $('.modal').modal();
});
var tem=2;
if(tem==1){
    document.getElementById('create_opinion').href="#modal1";
    document.getElementById('title_opinion').innerText='新建活动';
    document.getElementById('explain_opinion').innerText='从零开始打造！';

}
else if(tem==2){
    document.getElementById('create_opinion').href="#!";
    document.getElementById('title_opinion').innerText='回到控制台';
    document.getElementById('explain_opinion').innerText='继续您的活动';
    document.getElementById('explain_opinion').innerText='继续您的活动';
    document.getElementById('ly').style.display="none";
    document.getElementById('ly1').style.display="none";
}
