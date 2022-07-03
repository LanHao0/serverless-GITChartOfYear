## Tencent Serverless  代码年历
### 简介
本项目使用了使用 **腾讯Serverless  + express + ECharts**，并同时用Serverless对接微信公众号的消息
用户可以通过网页/公众号查询到自己近期代码提交活动, 并在网页端生成年历图表！

本项目为腾讯云云函数 Serverless 最佳玩家 优秀应用奖： https://mp.weixin.qq.com/s?__biz=Mzg4NzEyMzI1NQ==&mid=2247487869&idx=1&sn=922ccfd88bf5c63a54e29f8461de2103
![image](https://user-images.githubusercontent.com/14994590/173582698-c89af124-8b63-4fa8-8e7c-1060fce3a756.png)

#### 体验地址：
网页端体验：(暂无，腾讯云函数收费，暂停展示)
<s>[https://service-a4gbsyqw-1251935409.gz.apigw.tencentcs.com/release/](https://service-a4gbsyqw-1251935409.gz.apigw.tencentcs.com/release/)
</s>

## 搭建
### 1.克隆项目
clone 本项目到本地
```
git clone https://github.com/LanHao0/serverless-GITChartOfYear
```

#### 2.微信部分（不需要公众号查询可跳过此步）
1. 在公众号后台 左侧菜单-开发-基本配置 中设置好
- 服务器地址(URL)
填写serverless的链接+/w
例如： 
```
https://您的 Serverless 应用链接/w
```
- 令牌(Token)

- 消息加解密密钥(EncodingAESKey)

2. 更改 sls.js 代码中27行开始的 config 中的参数
3. 更改sls.js 代码中微信回复消息为您的 Serverless 应用链接
 
### 3.部署
运行以下命令
```
serverless deploy
```


### 开始使用
#### 网页
直接访问serverless应用链接即可, 您可以在网页上输入id与年份获取到自己的代码年历图

#### 微信
发送任意字符到公众号可获取帮助信息

输入  
GITHUB,您的GITHUB ID,四位数年份  
来查询年份内您在github或gitlab上提交代码次数,例如：
```
GITHUB,LanHao0,2020
```
就可以查询 GITHUB 用户 LanHao0 在2020年提交代码次数
GITLAB同理



[网页体验]: https://service-a4gbsyqw-1251935409.gz.apigw.tencentcs.com/release/
