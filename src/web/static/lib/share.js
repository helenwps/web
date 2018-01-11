/**
*分享的构造函数，使用时请先实例化var s = new share();
**/
function share() { };
/**
*分享到qq
*url:要分享的链接
*desc:要发送的内容
**/
share.prototype.qq = function (url, desc) {
    if (!url) {
        return false;
    }
    
    window.open("http://connect.qq.com/widget/shareqq/index.html?url="+url+"&desc="+desc);
};

/**
*分享到微博
*title:内容（title不能为空，否则分享出去没有分享内容的链接）
*url:要分享的地址
**/
share.prototype.wb = function (title, url) {
    if (!url) {
        return false;
    }
    window.open("http://service.weibo.com/share/share.php?title="+title+"&url="+url);
};

/**
*分享到微信朋友圈
*url:要分享的地址
*返回的是一张二维码图片地址
**/
share.prototype.pyq = function (url) {
    if (!url) {
        return false;
    }
    //生成的二维码地址(img)
    return "http://qr.liantu.com/api.php?text=" + url;
};

/**
*分享给微信好友
*url:要分享的地址
**/
share.prototype.wxfriend = function (url) {
    if (!url) {
        return false;
    }
    //生成的二维码地址(img)
    return "http://qr.liantu.com/api.php?text=" + url;
};
module.exports = share

// var s =new  share();

