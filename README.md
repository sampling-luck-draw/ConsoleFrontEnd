### 1 联调注意事项
+ go后台限制只能本机登录控制台，控制台给出弹幕审核管理员密码
+ 弹幕审核页面要单独做
+ post和websocket的URL可能需要修改
+ username是唯一标识，应该对应微信号而不是nickname

### 2 接口说明文档
#### 2.1 登录界面
```json
POST {
    "username": "a string",
    "password": "a string"
}

RETURN {
    "success": "true" // or "false"
}
```
#### 2.2 开始界面
#### 2.3 控制台界面
```json
/* 后台发往前端 */

// 用户信息
{
    "action": "append-user",
    "content": {
        "nickname": "Justin Bieber",
        "uid": "1234567890", 
        "avatar": "assets/avatars/avatar0.png"
    }
}
// 初始化在线功能和服务权限
{
    "action": "initialize",
    "content": {
        "online": "true", // or "false"
        "userType": "vip" // or "normal" or "debug"
    }
}
// 发送中奖人和中奖项
{
    "action": "who-is-lucky-dog",
    "content": {
        "uid": "1234567890",
        "nickname": "Yeah...",
        "itemname": "一等奖"
    }
}

/* 前端发往后台 */

// 手动导入的用户信息
{
    "action": "manual-import",
    "content": {
        "username": "string", 
        // 多个不确定的"string": "string"
    }
}
// 切换展示页
{
    "action":"switch-page",
    "content":"签到墙"
}
// 活动开始时间
{
    "action":"activity-start-time",
    "content":"2019-3-7-0-3-42"
}
// 活动结束时间
{
    "action":"activity-end-time",
    "content":"2019-3-7-0-3-42"
}
// 展示活动
{
    "action":"show-activity",
    "content":""
}
// 隐藏活动
{
    "action":"hide-activity",
    "content":""
}
// 开始抽奖
{
    "action":"start-drawing",
    "content":{
        "dkind":"cube"
    }
}
// 停止抽奖
{
    "action":"stop-drawing",
    "content":""
}
// 中奖无效
{
    "action":"disable-lucky",
    "content":{
        "itemname":"一等奖",
        "uid":"1234567890",
        "username":"Yeah..."
    }
}
// 背景图片POST，JSON内容在data中
// base64Str这里会是一个很长的字符串
// 服务器收到后应返回 { "success": "true" }
{ 
    "type": "POST",
    "url": "http://localhost:1923/bg-img",
    "data": {
        "action": "background-image",
        "content": // base64Str
    },
}
```
#### 2.4 弹幕审核界面
### 3 前端描述文档
#### 3.1 框架版本
+ bootstrap 4.3.1
+ jQuery 2.1.1
#### 3.2 插件列表
+ 图标字体：materialdesignicons.min.css
+ 日期输入：Ecalendar.jquery.min.js
+ 下拉选择：chosen.jquery.js
+ Toast提示框：notifyMessage.js
+ 颜色选择器：jquery.minicolors.min.css