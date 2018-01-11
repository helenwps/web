import Base from 'base';
require('jquery');
require('swiper');
require('layer');
var Page = require('page');
var doT = require('doT');


class TopicListPage extends Base{

    constructor() {
        var config = {
            pageSize:10,
            pageNum:1,
            moduleId:''
        }

        super(config);
    }

    //获取最新文章列表
    newTopicList(_pageNum,moduleId){
        var _self = this;
        //获取当前分类id和页码
        _self.config.moduleId=moduleId;
        _self.config.pageNum=_pageNum;

        let url = _self.host+'/lawyer/topic/new-topic?page='+_pageNum+'&limit='+_self.config.pageSize+'&moduleId='+moduleId;
        $.ajax({
            url:url,
            type:"GET",
            headers:{
                "X-Requested-With": "XMLHttpRequest",
                "token":sessionStorage.token
            },
            success:function(res){
                if(res.code == 1){
                    var data=res.data;//接口对象data
                    var html=" ";
                    if(data.items.length>0){
                        for(var i=0;i<data.items.length;i++){
                            html += _self.showTopicList(data.items[i]);
                        }
                    }else{
                        var html="";
                        html+='<div class="noContent"><img src="static/images/noContent.png"><p>暂无内容</p></div>';
                        $(".lookMore").hide();
                        $(".allInstro").html(html);
                    }

                    if(_pageNum==1){
                        $(".allInstro").html(html);
                    }else{
                        $(".allInstro").append(html);
                    }
                    _self.showAllFn(".seeAll");
                    $(".lookMore").show();

                    //总数小于10时不显示查看更多按钮
                    if(_pageNum*10 > data.total || _pageNum*10 == data.total){
                        $(".lookMore").hide();
                    }
                }else{
                    layer.msg(res.msg);
                }
            }
        });
    }

    //填充最新话题元素
    showTopicList(obj){
        var html=" ";
        html +='<div class="topicIntro">\
                <a href="topic_detail.html?newId='+obj.id+'">\
                    <div class="top">\
                        <img src="'+obj.userImage+'">\
                        <div>\
                            <p>'+obj.userName+'</p>\
                        </div>\
                        <span class="rightTime">'+this.diy_time(obj.createTime)+'</span>\
                    </div>\
                    <div class="content">';
        if(obj.content.length>190){
            html+=  '<p class="strSub">'+this.substrFn(obj.content,190)+'</p>\
                                        <p class="strAll">'+obj.content+'</p>\
                                        <p class="seeAll"><span>展开全文</span><img src="static/images/bottom.png"></p>';
        }else{
            html+='<p class="event">'+obj.content+'</p>';
        }

        html+='</div>\
                    <ul class="picture">';
        if(obj.imageUrls){
            for(var i=0;i<obj.imageUrls.length;i++){
                html +=  '<li><img src="'+obj.imageUrls[i]+'"></li>';
            }
        }
        html += '</ul>\
                    <div class="handle">\
                        <p>来自话题：<span class="author">'+obj.moduleName+'</span></p>\
                        <ul>\
                            <li><img src="static/images/comment.png"><span>'+obj.commentCount+'</span></li>\
                            <li class="line">|</li>\
                            <li><p class="good"></p><span>'+obj.concernCount+'</span></li>\
                        </ul>\
                    </div>\
                </a>\
                </div>';
        return html;
    }

    //获取推荐律师列表
    recommendLawyer(){
        var _self = this;
        let url = _self.host+'/lawyer/topic/recommend-lawyers';
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
                            <p class="lawyerName"><span>'+obj.lawyerName+'</span></p>';
        if(obj.lawFirmName){
            html+='<p class="lawyerArt">'+obj.lawFirmName+'</p>';
        }

        html+='</div>\
                </div>';
        return html;
    }

    //获取话题类别
    topicType(){
        var _self = this;
        let url = _self.host+'/lawyer/topic/topic-types';
        $.get(url,function(res){
            if(res.code == 1){
                var data=res.data;//接口对象data
                var html=" ";
                if(data.items.length>0){
                    if(data.items.length<3 || data.items.length==3){
                        $(".go").hide();
                    }
                    for(var i=0;i<data.items.length;i++){
                        html += _self.showTypeList(data.items[i]);
                    }
                }else{
                    $(".aday").hide();
                }
                $(".swiper-wrapper").append(html);
                //轮播
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    slidesPerView: 3,
                    paginationClickable: true,
                    loop : false,
                    spaceBetween: 10
                });
                $('#prev').click(function(){
                    swiper.slidePrev();
                })
                $('#next').click(function(){
                    swiper.slideNext();
                })
                //根据模块分类查询相应内容
                $(".swiper-slide").on('click',function(){
                    var moduleId=$(this).attr("data-id");
                    var moduleName=$(this).attr("data-name");
                    window.location.href="topic_list.html?moduleId="+moduleId+"&moduleName="+moduleName;
                })
            }else{

            }
        });
    }

    //填充话题类别元素
    showTypeList(obj){
        //var _this=this;

        var html =`
    <div data-id="${obj.id}" data-name="${obj.name}" class="swiper-slide">
            <img src="${obj.imageUrl}">
            <span class="letter">${obj.name}</span>
            </div>
                `;
        return html;
    }
    ready(){

        var _this = this;
        $('#header .topic').addClass('cur');

        //获取当前话题分类id
        var moduleId=this.getQueryString("moduleId");
        if(!moduleId){
            moduleId='';
        }
        var moduleName=this.getQueryString("moduleName");
        if(!moduleName){
            moduleName="最新话题";
        }

        $(".topicName").html(moduleName);
        //获取话题列表
        this.newTopicList(1,moduleId);
        //推荐律师列表
        this.recommendLawyer();
        //话题分类列表
        this.topicType();



        $(window).on('scroll load', function(event) {
            var scrollT = $(document).scrollTop();
            if(scrollT>=90){
                $(".header").removeClass('index-header');
                $(".logo img").attr('src', 'static/images/logo1.png');
            }else{
                $(".header").addClass('index-header');
                $(".logo img").attr('src', 'static/images/logo.png');
            }
        });

        $("#readIndex").addClass("b_border");
        $("#classify").hide();

        //查看更多
        $(".lookMore").on('click',function(){
            var pageId=_this.config.pageNum;
            _this.newTopicList(pageId+1,_this.config.moduleId);

        })

        //查看全部话题
        $(".tit .all").on('click',function(){
            _this.newTopicList(1,'');
            $('.topicName').text("全部话题");
        })
        //回到顶部
        $(".reload .last").click(function() {
            $("html,body").animate({scrollTop:0}, 500);
        }); 

        $(".reload .first").click(function() {
            window.location.reload();
        });
    }

    loginBack(){

        // console.log("login back doing===")

    };
}

var pageView = new TopicListPage();
top.TopicListPage = pageView