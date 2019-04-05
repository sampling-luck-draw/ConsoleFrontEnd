### 1 联调注意事项
+ go后台限制只能本机登录控制台，控制台给出弹幕审核管理员密码
+ 弹幕审核页面要单独做

### 2 接口说明文档
#### 2.1 登录
```json
POST {
    "username": "a string",
    "password": "a string"
}

RETURN {
    "success": "true" or "false"
}
```
#### 2.2 
### 3 前端描述文档
+ 参考后台模板`http://www.jq22.com/yanshi14058`