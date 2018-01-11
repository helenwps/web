import Base from 'base';
require('jquery');
require('swiper');
var Page = require('page');
var doT = require('doT');


class NewsListPage extends Base{

    constructor() {
        var config = {
            pageSize:10,
            pageNum:1,
            catagoryId:'',
            publishTime:'',
            id:'',

        }
        super(config);
    };

    //获取热门文章列表
    hotArticleList(_pageNum,catagoryId,isReload){
        var _self = this;
        //获取当前分类id和页码
        _self.config.catagoryId=catagoryId;
        _self.config.pageNum=_pageNum;
        let url='';
        if(isReload==0){
            url = _self.host+'/lawyer/information/find-article-list?page='+_pageNum+'&limit='+_self.config.pageSize+'&catagoryId='+catagoryId;
        }else{
            url = _self.host+'/lawyer/information/find-article-list?page='+_pageNum+'&limit='+_self.config.pageSize+'&catagoryId='+catagoryId+'&publishTime='+_self.config.publishTime+'&id='+_self.config.id;
        }
        $.ajax({
            url:url,
            type:"GET",
            success:function(res){
                if(res.code == 1){
                    //layer.alert(res.msg);
                    var data=res.data;
                    if(data.items.length>0){
                        var html="";
                        for(var i=0;i<data.items.length;i++){
                            html += _self.showHotList(data.items[i]);
                        }

                        //用户点击刷新按钮时往当前内容之前插入数据，点击查看更多是往后追加
                        if(isReload==1){
                            $(".allInstro").prepend(html);
                        }else{
                            //用户反复点击某一个分类只显示第一页内容
                            if(_pageNum==1){
                                $(".allInstro").html(html);
                            }else{
                                $(".allInstro").append(html);
                            }
                        }

                        //总数小于10时不显示查看更多按钮(点击刷新按钮不执行此操作)
                        if(isReload==0){
                            if(_pageNum*10 > data.total || _pageNum*10 == data.total){
                                $(".lookMore").hide();
                            }else{
                                $(".lookMore").show();
                            }
                        }
                        
                    }else{
                        //用户点击刷新无数据需要另外一种提示，和用户刷新整个页面无数据的提示信息不一样
                        if(isReload==1){
                            layer.alert("没有更多资讯")
                        }else{
                            var html="";
                            html+='<div class="noContent"><img src="static/images/noContent.png"><p>暂无内容</p></div>';
                            $(".lookMore").hide();
                            $(".allInstro").html(html);
                        }
                    }
                }
            }
        
        });
    }
    //填充热门文章列表元素
    showHotList(obj){
        var html="";
        html += '<div class="topicIntro" data-id="'+obj.id+'" data-time="'+obj.publishTime+'">\
                    <a href="news_detail.html?id='+obj.articleId+'">\
                        <div class="top">\
                            <img src="'+obj.logo+'">\
                            <p class="lawPlace">'+obj.realName+'</p>\
                        </div>\
                        <div class="newsDetail">\
                            <div class="letter">\
                                <p class="title">'+obj.title+'</p>\
                                <div class="detail">'+obj.shortContent+'</div>\
                                <div class="handle">\
                                    <p>'+obj.categoryName+'</p>\
                                    <ul>\
                                        <li>\
                                            <img src="static/images/readNum.png">\
                                            <span>'+obj.readNum+'</span>\
                                        </li>\
                                        <li class="line">|</li>\
                                        <li>\
                                            <img src="static/images/good.png">\
                                            <span>'+obj.concernNum+'</span>\
                                        </li>\
                                        <li class="line">|</li>\
                                        <li>\
                                            <img src="static/images/clock.png">\
                                            <span>'+this.diy_time(obj.publishTime)+'</span>\
                                        </li>\
                                    </ul>\
                                </div>\
                            </div>\
                            <div class="pic">\
                                <img src="'+obj.backGroundPic+'">\
                            </div>\
                        </div>\
                    </a>\
                </div>';
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

    //资讯列表分类
    newsTypeList(catagoryId){
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
                    //_self.hotArticleList(1,$(this).attr("data-id"),0);
                    var dataId=$(this).attr("data-id");
                    window.location.href="news_list.html?catagoryId="+dataId;
                });
                $(".hotType ul li").each(function(){
                    if($(this).attr("data-id")==catagoryId){
                        $(this).addClass("blue");
                    }
                })
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

    //资讯轮播
    infoSwiper(){
        var _self = this;
        let url = _self.host+'/lawyer/information/get-advert-center';
        $.get(url,function(res){
            if(res.code == 1){
                var data=res.data;//接口对象data
                var html=" ";
                if(data.items.length>0){
                    if(data.items.length<4 || data.items.length==4){
                        $(".go").hide();
                    }
                    for(var i=0;i<data.items.length;i++){
                        html += _self.showInfoSwiper(data.items[i]);
                   }
                }else{
                    $(".aday").hide();
                }
                $(".swiper-wrapper").html(html);
                //轮播
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    slidesPerView: 4,
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
            }
        });
    }

    //资讯轮播元素填充
    showInfoSwiper(obj){
        var html="";
        var url=obj.url;
        var articleId=url.substr(url.indexOf("articleId")+10);
        console.log(articleId);
        html+='<div class="swiper-slide">\
                    <a href="news_detail.html?id='+articleId+'">\
                        <img src="'+obj.pic+'">\
                    </a>\
                </div>';
        return html;
    }

    //页面刷新执行
    ready(){

        var _this=this;

        $('#header .news').addClass('cur');
        
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
        //获取当前资讯分类id
        var catagoryId=this.getQueryString("catagoryId");
        if(!catagoryId){
            catagoryId="all";
        }

        //点击分类执行的操作
        this.hotArticleList(1,catagoryId,0);
        //推荐律师
        this.recommendLawyer();
        //资讯列表
        this.newsTypeList(catagoryId);
        //轮播列表
        this.infoSwiper();
        //查看更多
        $(".lookMore").on('click',function(){
            var pageId=_this.config.pageNum;
            _this.hotArticleList(pageId+1,_this.config.catagoryId,0);
        })
        //查看全部文章
        $(".tit .all").on('click',function(){
            window.location.href="news_list.html?catagoryId=all";
            //_this.hotArticleList(1,'',0);
        })

        //回到顶部
        $(".reload .last").click(function() {
            $("html,body").animate({scrollTop:0}, 500);
        }); 

        //刷新当前时间点和用户最后一次刷新时间点之间发布的离最后一次刷新时间更近的10条数据（很绕吧，我也觉得很绕(▼へ▼メ)）
        $(".reload .first").on('click',function(){
            var publishTime=$(".allInstro").children(":first").attr("data-time");
            var id=$(".allInstro").children(":first").attr("data-id");
            _this.config.publishTime=publishTime;
            _this.config.id=id;
            _this.hotArticleList(1,'',1);
        })

    }

    loginBack(){
        
        // console.log("login back doing===")

    };
}

var pageView = new NewsListPage();
top.NewsListPage = pageView