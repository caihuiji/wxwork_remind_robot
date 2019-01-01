const Koa = require('koa');
var cron = require('node-cron');
const app = new Koa();


var setTimeoutMap = {};


var processGet = function (obj){
    var msgArr = obj.msg.split('|');
    if(msgArr.length !=3){
        return '';
    }
    var msgObj = {
        'replyMember' : msgArr[0],
        'replyMessage' : msgArr[1],
        'replyDate' : msgArr[2],
    }
    var nowDate = Date.now();
    var nowYear = nowDate.getFullYear() + '-' +(nowDate.getMonth()+1) +'-'+ nowDate.getDate() ;
    if(msgObj.replyDate){
        var goReplyDate ;
        if(!isNaN(new Date(msg.replyDate) )){
            goReplyDate = nowDate - new Date(msg.replyDate);
        } else if (!isNaN(new Date( nowYear +' '+ msg.replyDate ) )){
            goReplyDate = nowDate - new Date( nowYear +' '+ msg.replyDate );
        } else if (cron.validate(msg.replyDate)){
            var task = cron.schedule(msg.replyDate, () =>  {
                console.log('will not execute anymore, nor be able to restart');
            });
        }


        if (!goReplyDate || goReplyDate < 0) {
            throw new Error('Invalid Date');
        }
    }
}
app.use(async ctx => {
    ctx.body = 'Hello World';
});

app.listen(3000);
