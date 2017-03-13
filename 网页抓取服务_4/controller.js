var phantomjs = require('./dao');
var https = require('https');
var fs = require('fs');
var phantom = require('phantom'); 
var superagent = require('superagent');
var device_list = require('./config.json');
var mongo = require('./dao');

function addControllers(router) {
    router.post('/submit', async(ctx, next) => {
        var search = ctx.request.body.search;
        var device = ctx.request.body.device;
        let result = await task(search, device_list[device]);
        ctx.response.body = result;
        var dbResult = new mongo(result);
        dbResult.save();
    });
}

async function task(keyword, device) {
    try {
        keyword = encodeURIComponent(keyword);
        let searchURL = `https://www.baidu.com/s?wd=${keyword}`;

        const instance = await phantom.create([], {logLevel: 'error'});
        const page = await instance.createPage();

        let startTime = Date.now(); // 记录抓取开始时间

        const status = await page.open(searchURL);

        if (status !== 'success') throw Error({ message: '打开页面失败!' });
        // 检测是否为正确的设备配置
        if (device) {
            // 设置 User-Agent
            page.setting('userAgent', device['userAgent']);
        }

        // 在 page 中执行 JavaScript    由于百度自带jQuery我们可以直接使用jQuery选择器
        let dataList = await page.evaluate(function() {
            var dataList = $('#content_left .result.c-container').map(function() {
                var info = {};
                info.title = $(this).find('.t').text() || '';
                info.link = $(this).find('.t > a').attr('href') || '';
                info.info = $(this).find('.c-abstract').text() || '';
                info.pic = $(this).find('.general_image_pic img').attr('src') || '';
                return info;
            }).toArray();
            return dataList;
        })
        for (let i = 0; i < dataList.length; i ++) {
            dataList[i].path = (dataList[i].pic) ? await downloadPic(dataList[i].pic) : '';
        }

        let result = {
            code: 1,
            msg: '抓取成功',
            word: keyword,
            device: device,
            time: Date.now() - startTime,
            dataList: dataList
        }

        await instance.exit();

        return result;
    } catch (err) {
        return { code: 0, msg: '抓取失败', err: err.message };
    }
}

function downloadPic(link) {
    return new Promise((resolve, reject) => {
        let picName = `${Math.random().toString(36).substr(2)}${Date.now()}.jpg`;
        superagent.get(link)
            .pipe(fs.createWriteStream(`${process.cwd()}/imgs/${picName}`))
            .on('close', () => resolve(`/static/imgs/${picName}`));
    })
}

module.exports = function (dir) {
    let router = require('koa-router')();
    addControllers(router);
    return router.routes();
};