import Base from 'base';
require('jquery');

var Page = require('page');
var doT = require('doT');
var share = require('share');


class NewsDetailPage extends Base{

    constructor() {
        var config = {
            pageSize:10,
            pageNum:1,
            post_flag: false //设置一个对象来控制是否进入AJAX过程
        }
        super(config);
    };

    //获取热门文章详情
    getNewsDetail(articleId){
        var _self = this;
        let url = _self.host+'/lawyer/information/find-article?articleId='+articleId;
        $.ajax({
            url:url,
            type:"GET",
            headers:{
                "X-Requested-With": "XMLHttpRequest",
                "token":sessionStorage.token
            },
            success:function(res){
                if(res.code == 1){
                    var data=res.data;
                    var html="";
                    html+='\
                        <h1>'+data.title+'</h1>\
                        <div class="author">\
                            <img src="'+data.logo+'">\
                            <div>\
                                <p class="name">'+data.realName+'</p>\
                            </div>\
                            <ul>\
                                <li>发表于 '+data.publishTime+'</li>\
                                <li>阅读 '+data.readNum+'</li>\
                                <li>点赞 <span class="goodNum">'+data.concernNum+'</span></li>\
                            </ul>\
                        </div>\
                        <div class="content">\
                            <p>'+data.content+'</p>\
                        </div>';
                    $(".newsDetail").html(html);
                    //判断文章是否点赞
                    if(data.isConcern==true){
                        _self.config.isConcern=true;
                        $(".one").addClass("red");
                    }else{
                        $(".one").removeClass("red");
                    }
                    //判断文章是否收藏
                    if(data.isCollect==true){
                        _self.config.isCollect=true;
                        $(".two").addClass("green");
                    }else{
                        $(".two").removeClass("green");
                    }
                }
            }
        });
    }

    //资讯列表分类
    newsTypeList(){
        var _self = this;
        let url = _self.host+'/lawyer/information/find-catagory-list';
        $.get(url,function(res){
            if(res.code == 1){
                var data=res.data;//接口对象data
                var html=" ";
                if(data.length>0){
                    for(var i=0;i<data.length;i++){
                        html += _self.showTypeList(data[i]);
                   }
                }else{

                }
                $(".hotType ul").html(html);
                $(".hotType ul li").on('click',function(){
                    var catagoryId=$(this).attr("data-id");
                    window.location.href="news_list.html?catagoryId="+catagoryId;
                });
            }else{

            }
        });
    }
    //填充资讯列表分类
    showTypeList(obj){
        var html='';
        html +='<li data-id="'+obj.categoryId+'">'+obj.categoryName+'</li>';
        return html;
    }

    //获取推荐律师列表
    recommendLawyer(){
        var _self = this;
        let url = _self.host+'/lawyer/information/recommend-lawyers';
        $.get(url,function(res){
            if(res.code == 1){
                var data=res.data;//接口对象data
                var html=" ";
                if(data.items.length>0){
                    for(var i=0;i<data.items.length;i++){
                        html += _self.showLawyerList(data.items[i]);
                   }
                }else{

                }
                $(".lawyerInstro").html(html);
            }else{

            }
        });
    }

    //填充推荐律师元素
    showLawyerList(obj){
        var html=" ";
        html +='<div class="lawyerList">';
                    if(obj.logo){
                        html+='<img src="'+obj.logo+'">';
                    }else{
                        html+='<img src="static/images/lawyer_1.png">';
                    }
                        
                html+=' <div>\
                            <p class="lawyerName"><span>'+obj.name+'</span></p>';
                            if(obj.lawFirmName){
                                html+='<p class="lawyerArt">'+obj.lawFirmName+'</p>';
                            }
                            
                html+='</div>\
                </div>';
        return html;
    }

    //点赞和收藏
    goodAndCollect(articleId,type){
        var _self = this;
        let url = _self.host+'/lawyer/information/operator?type='+type+'&articleId='+articleId;
        $.ajax({
            url:url,
            type:"POST",
            headers:{
                "X-Requested-With": "XMLHttpRequest",
                "token":sessionStorage.token
            },
            success:function(res){
                if(res.code == 1){
                    layer.msg(res.msg);
                    if(type==3){
                        //点赞或者取消点赞
                        var goodNum=$(".goodNum");
                        if(res.msg=="点赞成功"){
                            $(".one").addClass("red");
                            goodNum.text(parseInt(goodNum.text())+1);
                        }else{
                            $(".one").removeClass("red");
                            goodNum.text(parseInt(goodNum.text())-1);
                        }
                        
                    }else{
                         //收藏或者取消收藏
                        if(res.msg=="收藏成功"){
                            $(".two").addClass("green");
                        }else{
                            $(".two").removeClass("green");
                        }
                        
                    }
                }else{
                    layer.msg(res.msg);
                }
            }
            
        });
    }

    //评论列表
    //第一个参数表示页数，第二参数表明当前资讯，第三个参数表示是否是添加评论后执行的操作（1表示是0表示否）
    getComments(pageId,articleId,ifAdd){
        var _self = this;
        _self.config.pageNum=pageId;
        let url = _self.host+'/lawyer/information/get-comment-list?page='+pageId+'&limit=10&articleId='+articleId;
        $.ajax({
            url:url,
            type:"GET",
            headers:{
                "X-Requested-With": "XMLHttpRequest",
                "token":sessionStorage.token
            },
            success:function(res){
                if(res.code == 1){
                    var data=res.data;
                    var html="";
                    if(data.items.length!=0){
                        for (var i=0;i<data.items.length;i++) {
                            html+=_self.showComments(data.items[i]);
                        }
                    }else{
                        html+='<div class="noContent"><img src="static/images/noContent.png"><p>暂无评论</p></div>';
                    }
                    //从添加评论进来不需要向后追加
                    if(ifAdd==1){
                        $(".commentsList").html(html);
                    }else{
                        $(".commentsList").append(html);
                    }
                    //控制分页的显示和隐藏
                    if(pageId*10>data.total || pageId*10==data.total){
                        $(".lookMore").hide();
                    }else{
                        $(".lookMore").show();
                    }
                    $(".haveLogin textarea").val("");
                }
            }
        });
    }

    replyBox(){
        var html=" ";
        html+='<!--回复框-->\
                <div class="resBox">\
                    <div>\
                        <textarea class="ta" placeholder="回复ANT" maxlength="500"></textarea>\
                        <p><span class="textNum">0</span>/500</p>\
                    </div>\
                    <button>发表</button>\
                </div>';
        return html;
    }

    //补充评论列表
    showComments(obj){
        var user={};
        if(sessionStorage.userInfo){
            user=JSON.parse(sessionStorage.userInfo).user;
        }else{
            user.id='';
        }
        var html="";
        html+= '<div class="lists">\
                    <img class="userHead" src="'+obj.logo+'">\
                    <div class="info" data-uuid="'+obj.uuid+'">\
                        <p>'+obj.commenter+'<span>'+this.diy_time(obj.createTime)+'</span></p>';

                if(obj.commenterId!=user.id){
                    
                html+='<ul>';
                    if(obj.selfThumbUp==true){
                        html+='<li class="good haveGive" data-commentId="'+obj.uuid+'"><span>'+obj.thumbUpCount+'</span></li>';
                    }else{
                        html+='<li class="good" data-commentId="'+obj.uuid+'"><span>'+obj.thumbUpCount+'</span></li>';
                    }
                
                        html+='<li class="res" data-commenter="'+obj.commenter+'"><span>回复</span></li>\
                        </ul>';
                }
                
                html+='<div class="content">'+obj.content+'</div>';
            if(obj.replies.length!=0){
                html+='<!--回复内容板块-->\
                        <div class="resArea">';
                    for(var i=0;i<obj.replies.length;i++){
                    html+='<div class="info again" data-uuid="'+obj.replies[i].uuid+'">\
                                <p>'+obj.replies[i].commenter+'<span>'+this.diy_time(obj.replies[i].createTime)+'</span></p>';
                                if(obj.replies[i].commenterId!=user.id){
                    
                                html+='<ul>';
                                    if(obj.replies[i].selfThumbUp==true){
                                        html+='<li class="good haveGive" data-commentId="'+obj.replies[i].uuid+'"><span>'+obj.replies[i].thumbUpCount+'</span></li>';
                                    }else{
                                        html+='<li class="good" data-commentId="'+obj.replies[i].uuid+'"><span>'+obj.replies[i].thumbUpCount+'</span></li>';
                                    }
                                
                                        html+='<li class="res" data-commenter="'+obj.replies[i].commenter+'"><span>回复</span></li>\
                                        </ul>';
                                }
                                if(obj.replies[i].second==true){
                                    html+='<div class="content"><span>回复@'+obj.replies[i].replyTo+'：</span>'+obj.replies[i].content+'</div>';
                                }else{
                                    html+='<div class="content">'+obj.replies[i].content+'</div>';
                                }
                                
                        html+='</div>';
                    }
                html+='</div>';
            }
                
             html+='</div>\
                </div>';
        return html;
    }
    //添加评论
    addComments(articleId,content,fatherId){
        var _self = this;
        if(_self.config.post_flag) return; //如果正在提交则直接返回，停止执行
        _self.config.post_flag = true;//标记当前状态为正在提交状态
        let url='';
        if(fatherId){
            url = _self.host+'/lawyer/information/save-comment?articleId='+articleId+'&content='+content+'&fatherId='+fatherId;
        }else{
            url = _self.host+'/lawyer/information/save-comment?articleId='+articleId+'&content='+content;
        }
        $.ajax({
            url:url,
            type:"POST",
            headers:{
                "X-Requested-With": "XMLHttpRequest",
                "token":sessionStorage.token
            },
            success:function(res){
                _self.config.post_flag = false;
                if(res.code == 1){
                    layer.msg(res.msg);
                    _self.getComments(1,articleId,1);
                }else{
                    alert(2);
                    layer.msg(res.msg);
                }
            }
        });
    }

    //点赞
    giveGood(commentId,self){
        var _self = this;
        let url = _self.host+'/lawyer/information/commentThumUp?commentId='+commentId;
        $.ajax({
            url:url,
            type:"POST",
            headers:{
                "X-Requested-With": "XMLHttpRequest",
                "token":sessionStorage.token
            },
            success:function(res){
                if(res.code == 1){
                    layer.msg(res.msg);
                    var span=$(self).children("span");
                    var num=span.html();
                    if(res.msg=="点赞成功"){
                        $(self).addClass("haveGive");
                        span.html(parseInt(num)+1);
                    }else{
                        $(self).removeClass("haveGive");
                        span.html(parseInt(num)-1);
                    }
                }else{
                    layer.msg(res.msg);
                }
            }
        });
    }

    ready(){
        var _this=this;
        $('#header .news').addClass('cur');
        $(".header").removeClass('index-header');
        
        var articleId=this.getQueryString("id");
        //资讯详情
        this.getNewsDetail(articleId);
        //评论列表
        this.getComments(1,articleId,0);
        //律师推荐
        this.recommendLawyer();
        //资讯分类列表
        this.newsTypeList();

        $(".share dl").on('click',function(){
            var type="";
            var index=$(this).index();
            if(index!=2){
                if(index==0){
                    type=3;
                }else if(index==1){
                    type=6;
                }
                _this.goodAndCollect(articleId,type);
            }
        })

        $(".ta").focus(function(){
            $(this).parent().parent().addClass("change");
        })
        $(".ta").blur(function(){
            $(this).parent().parent().removeClass("change");
        })

        //判断是否登录显示不同的评论框
        if(sessionStorage.token){
            $('.haveLogin').show();
            $('.noLogin').hide();
            $(".loginUser img").attr('src',sessionStorage.user_logo);
            $(".loginUser span").html(sessionStorage.rel);
        }else{
            $('.noLogin').show();
            $('.haveLogin').hide();
        }

        //提交评论
        $(".submit p").unbind('click').on('click',function(){
            var content=$(".haveLogin textarea").val();
            if(!content){
                layer.msg("评论内容不能为空");
            }else if(content.length>500){
                layer.msg("评论内容不能超过500字");
            }else{
                _this.addComments(articleId,content);
            }
        })
        //回复
        $("body").delegate('.resBox button','click',function(){
            var content=$(".ta").val();
            var fatherId=$(this).parent().parent().attr("data-uuid");
            if(!content){
                layer.msg("回复内容不能为空");
            }else if(content.length>500){
                layer.msg("回复内容不能超过500字");
            }else{
                _this.addComments(articleId,content,fatherId);
            }
        })
        //点击回复出现回复框
        $("body").delegate('.res','click',function(){
            var commenter=$(this).attr("data-commenter");
            var replyBox=_this.replyBox();
            $('.resBox').remove();
            $(this).parent().siblings('.content').after(replyBox);
            $('.resBox textarea').attr("placeholder","回复"+commenter);
        })

        //500字限制
        $("body").delegate('.resBox textarea','keyup',function(){
            var lenInput = $('.resBox textarea').val().length;
            lenInput = $(this).val().length;
            if(lenInput>=0 && lenInput<=500){
                $('.textNum').html(lenInput);
            }
        });

        //评论点赞
        $("body").delegate('.good','click',function(){
            var commentId=$(this).attr("data-commentId");
            _this.giveGood(commentId,this);
        })

        //分享微博
        var sare=new share;
        $(".sa").on('click',function(){
            sare.wb("写点什么吧",window.location.href);
        })

        //分享朋友圈
        $(".wc").on('mouseover',function(){
            var url=_this.mobileHost+"/static/front/platformshare/v1.0.0/templates/lawyer-news-share.html?articaleId="+articleId;
            var codeUrl=sare.pyq(url);
            $(".code").html('<img src="'+codeUrl+'">');
        })

        //评论分页（查看更多）
        $(".lookMore").on('click',function(){
            var pageId=_this.config.pageNum;
            _this.getComments(pageId+1,articleId,0);
        })

        //回到顶部
        $(".reload .last").click(function() {
            $("html,body").animate({scrollTop:0}, 500);
        }); 
    }

    loginBack(){
        
        // console.log("login back doing===")

    };
}

var pageView = new NewsDetailPage();
top.NewsDetailPage = pageView


