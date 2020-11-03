const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');

// Routes

app.engine('html', require('express-art-template'));
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production'
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');


app.get(`/`, async (req, res) => {
    res.render('index');
})
app.get(`/en`, async (req, res) => {
    res.render('en_index');
})
app.get(`/w`, async (req, res) => {
    res.send(req.query.echostr);
})

//微信对接
const wechat = require('wechat');
const config = {
    token: 'token',
    appid: 'appid',
    encodingAESKey: 'encodingAESKey',
    checkSignature: false
};


app.use('/w', wechat(config, async function (req, res, next) {
    // 微信输入信息都在req.weixin上

    const message = req.weixin;
    if (message.Content) {
        //处理消息
        let message_content = message.Content;
        if (message_content.indexOf("，") > -1) {
            message_content = message_content.replace('，', ',');
        }
        if (message_content.indexOf("，") > -1) {
            message_content = message_content.replace('，', ',');
        }

        if (message_content.indexOf('GITHUB') > -1 && message_content.split(',').length === 3) {
            const githubId = trimStr(message_content.split(',')[1]);
            const year = trimStr(message_content.split(',')[2]);

            const data = await getGithubCommits(githubId, year);
            res.reply({
                type: 'text',
                content: githubId + ' 在 ' + year + '年\nGITHUB Commits 数量为 ' + data.toString() + ' 次\n' +
                    '访问网站，生成GIT年历！https://您的 Serverless 应用 网页地址/\n\n' +
                    githubId + ' in ' + year + '\nGITHUB Commits: ' + data.toString() + ' times\n'+
                    'Visit website, generate your git year Chart! https://您的 Serverless 应用 网页地址/en'
            });

        } else if (message_content.indexOf('GITLAB') > -1 && message_content.split(',').length === 3) {
            const gitlabId = trimStr(message_content.split(',')[1]);
            const year = trimStr(message_content.split(',')[2]);

            const data = await getGitlabCommits(gitlabId, year);
            res.reply({
                type: 'text',
                content: gitlabId + ' 在 ' + year + '年\nGITLAB Commits 数量为 ' + data.toString() + ' 次\n' +
                    '访问网站，生成GIT年历！https://您的 Serverless 应用 网页地址/\n\n' +
                    gitlabId + ' in ' + year + '\nGITLAB Commits: ' + data.toString() + ' times\n'+
                    'Visit website, generate your git year Chart! https://您的 Serverless 应用 网页地址/en'
            });

        } else {
            //显示帮助
            res.reply({
                type: 'text',
                content: '帮助：\n' +
                    '这是腾讯 Serverless 提供服务的微信公众号！您可以在下方输入\n' +
                    'GITHUB,您的GITHUB ID,四位数年份\n' +
                    '来查询年份内您在github或gitlab上提交代码次数,例如：\n' +
                    '———————————————————\n' +
                    'GITHUB,LanHao0,2020\n' +
                    '———————————————————\n' +
                    '就可以查询GITHUB用户LanHao0在2020年提交代码次数\n' +
                    'GITLAB同理\n' +
                    '通过访问 serverless 搭建的网页端，可以生成您的commit图表！地址：\n' +
                    'https://您的 Serverless 应用 网页地址/\n\n' +
                    'Help：\n' +
                    'This is powered by Tencent Serverless, you can input \n' +
                    'GITHUB,GITHUB ID,year(four numbers)\n' +
                    'to get the commits times of your github or gitlab, for example：\n' +
                    '———————————————————\n' +
                    'GITHUB,LanHao0,2020\n' +
                    '———————————————————\n' +
                    'this command can get the commits times of github user <<LanHao0>> \n' +
                    'same for GITLAB\n' +
                    'you can also visit Serverless web page，generate your commit chart of year！ website：\n' +
                    'https://您的 Serverless 应用 网页地址/en'
            });

        }

    }
}));
app.get('/api_github_commits/:ID', async (req, res) => {
    const data = await axios.get('https://github-contributions.now.sh/api/v1/' + req.params.ID)
        .then(data => {
            return data.data;
        })

    res.send(data)
})

app.get('/api_gitlab_commits/:ID', async (req, res) => {
    const data = await axios.get('https://gitlab.com/users/' + req.params.ID + '/calendar.json')
        .then(data => {
            return data.data;
        })

    res.send(data)
})


app.get('/404', (req, res) => {
    res.status(404).send('Not found')
})

app.get('/500', (req, res) => {
    res.status(500).send('Server Error')
})

// Error handler
app.use(function (err, req, res, next) {
    console.error(err)
    res.status(500).send('Internal Serverless Error')
})

app.listen(8080)


async function getGithubCommits(GithubID, year) {
    return await axios.get('https://github-contributions.now.sh/api/v1/' + GithubID)
        .then(res => {
            if (res.data) {
                return res.data.contributions.filter(item => item.date.substr(0, 4) === year).reduce((a, b) => a + b.count, 0);
            } else {
                return 0
            }
        })
}


async function getGitlabCommits(GitlabID, year) {
    //整理gitlab数据
    return await axios.get('https://gitlab.com/users/' + GitlabID + '/calendar.json')
        .then(res => {
            if (res.data) {
                let gitlabCommits = [];
                let a = JSON.stringify(res.data);
                a = a.replace('{', '').replace('}', '');
                let b = a.split(",");
                for (let item of b) {
                    let c = item.split(":");
                    gitlabCommits.push({
                        date: c[0].replace('"', '').replace('"', ''),
                        count: parseInt(c[1])
                    })
                }
                return gitlabCommits.filter(item => item.date.substr(0, 4) === year).reduce((a, b) => a + b.count, 0)
            } else {
                return 0
            }
        });
}

function trimStr(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

module.exports = app
