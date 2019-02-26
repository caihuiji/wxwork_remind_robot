const cheerio = require('cheerio');
const axios = require('axios');


const getInfo = function (url) {
    return axios.get(url).then((response) => {
        const $ = cheerio.load(response.data);
        var result = {items: [], title: '' , url : url};
        result.title = $('.archive_title').get(0).firstChild.nodeValue.replace(/\s+?/gi, '');

        $('.grid-item').each((i, elem) => {
            result.items.push({
                title: $(elem).find('.title h1').text(),
                desc: $(elem).find('.title h2').text(),
                href: $(elem).find('a').attr('href'),
            })
        })
        return result;
    }).catch((error) => {
        console.log(error);
        return {};
    });
}


axios.all([
    getInfo('https://www.underconsideration.com/brandnew/archives/type/before-after/index.php?page=1'),
    getInfo('https://www.underconsideration.com/brandnew/archives/type/friday-likes/index.php?page=1'),
]).then((results) => {
    var toWebhook = [];
    results.forEach((item) => {

        if (item.items.length) {
            toWebhook.push('## '+ item.title);
            toWebhook.push('\n')
            var index = 1;
            item.items.forEach((item) => {
                // toWebhook.push('[' + item.title + '](' + item.href + ')');

                if (item.title && item.desc) {
                    toWebhook.push(index + '、'+ item.title + '. [detail](' + item.href + ')');
                    // toWebhook.push('> ' + item.desc + '.');
                } else {
                    toWebhook.push(index + '、'+ item.desc + '. [detail](' + item.href + ')');
                    // toWebhook.push( '> no description.' );
                }
                index++;
                toWebhook.push('\n')
            });
            toWebhook.push('> [more]('+ item.url +')')
            toWebhook.push('\n')
        }

    })

    console.log( toWebhook.join('\n'))


    // return ;;
    axios.post('https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=5a3946a2-3234-4b24-9c0f-67d938ee1cdd', {
        "msgtype": "markdown",
       // "chatid": "wrkSFfCgAALFgnrSsWU38puiv4yvExuw",
        "markdown": {
            "content": toWebhook.join('\n'),
        }
    })
        .then(function (response) {
            //console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });

})
