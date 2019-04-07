let next_page = "file:///C:/Users/MAC/Desktop/软件工程/ConsoleFrontEnd/console.html";
$(function() {
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
    });
    var storage = window.localStorage;
    var username = $("#username"),
        password = $('#password'),
        check = $('#remember-me');
    var localUser = storage.getItem('user') || '';
        localPass = storage.getItem('pass') || '';
    if (localUser !== '' && localPass !== '') {
        username.val(localUser);
        password.val(localPass);
        check.attr('checked', 'true');
    }
    $("#login, #offline").click(function remember() {
        if (check.get(0).checked) {
            storage.setItem('user', username.val());
            storage.setItem('pass', password.val());
        } else {
            storage.setItem('user', '');
            storage.setItem('pass', '');
        }
    });
    $("#offline").click(function() {
        self.location.href = next_page;
    });
    $("#login").click(function() {
        $("#login-form").ajaxSubmit({
            // type: "POST",
            // url: "http://localhost:1923/login",
            // timeout : 1000,
            // data: {
            //     'username': $("#username").val(),
            //     'password': $("#password").val()
            // },
            type: "POST",
            url: "http://localhost:1923/post",
            timeout : 1000,
            data: {
                    action: "login",
                    content: JSON.stringify({
                        'username': $("#username").val(),
                        'password': $("#password").val()
                    })
            },
            success: function(data) {
                var res = JSON.parse(data);
                if (res.success === "true") {
                    self.location.href = next_page;
                } else {
                    $(".log-bar").text("用户名或密码错误");
                }
            },
            complete: function(XMLHttpRequest, status) {
                if (status == 'timeout') {
                    $(".log-bar").text("网络超时错误");
                }
        　　}
        });
        return false;
    });
});