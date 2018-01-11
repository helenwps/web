require('jquery');
require('layer');
let loadjs = require('loadjs')

import ApiConfig from '../../config/config.js'
let __SiteEnv__ = ApiConfig[process.env.NODE_ENV +'Env']
if(!__SiteEnv__){
	__SiteEnv__ = {}
}
var doT = require('doT');

class Base{
    constructor(_config) {
		
		let init = ()=>{
			this.host = __SiteEnv__.host;
			this.mobileHost = __SiteEnv__.mobileHost;
			this.envData = {};
			this.config = _config || {};
			let _self = this;
			this.renderHeader();
			this.renderFooter();
			this.ready();
			this.doLogout();
			this.inputPlaceholder();
			
			layer.config({
				path: 'static/lib/layer/' 
			});
		}

		//增加测试可修改API地址配置
		if(__isProd__){
			loadjs(['static/server/api_cfg.js'],{
				success(){
					__SiteEnv__.host = top.BASE_URL
					__SiteEnv__.mobileHost = top.MOBILEHOST_URL
					init()
				}
			})
			
		}else{
			init()
		}

	};

	/**
     * 登录校验
     */
    checkLogin(){
        if(sessionStorage.getItem("token")=="" || sessionStorage.getItem("token")==null){
			return false
		}
		return true
    }
	
	ready(){ };
	
	loginBack(param,callback){
		let _self = this;
        $.ajax({
	        url: _self.host+'/lawyer/user-center-login',
	        dataType: "json",
	        async: true,
	        data: param,
	        type: "post",
	        success: function (json) {
	            if(callback) callback(json);
	        }
	    });
    }
	
	//用户登出（注销）
    doLogout() {   
        $('body').on('click','.exit', function(){
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user_logo'); 
            sessionStorage.removeItem('rel');
            sessionStorage.removeItem('userInfo');         
            if(token){
               location.href = 'index.html'; 
            }else{
               // location.href = 'login.html';  
            }
        });       
    }
	
//  loginBack(){ };

    //渲染头部底部内容
	renderFooter(){		
		var footerTemplate = '<div class="bottom">' +
									'<div class="intro">' +
										'<ul>' +
											'<li>' +
												'<h3>友情链接</h3>' +
												'<p><a target="_blank" href="http://user.fy13322.com/">法义用户端</a></p>' +
												'<p><a target="_blank" href="http://www.huahaileying.com/">华海乐盈</a></p>' +
											'</li>' +
											'<li class="last">' +
												'<h3>联系方式</h3>' +
												'<p>联系电话：0755-86338109</p>' +
												'<p>公司地址：深圳市南山区粤海街道高新技术园中区科苑大道讯美科技广场2栋16楼 </p>' +
											'</li>' +
										'</ul>' +
									'</div>' +
									'<div class="code">' +
										'<dl>' +
											'<dt><img src="static/images/footer-code.png" alt="律正二维码"></dt>' +
										'</dl>' +
									'</div>' +				
								'</div>' +
								'<div class="corporation">' +
									'<p>深圳法义网络科技有限公司 <br/>Copyright 2014-2017. All Rights Reserved<br/>备案号：<i class="recordNumber"></i></p>' +
								'</div>';
		$("#footer").html(footerTemplate);
		
		if(!!location.href.match("www.hao13322.com")  || !!location.href.match("hao13322.com")){
			$('.recordNumber').html("粤ICP备17002773号-1");
	    }else if(!!location.href.match("www.fy13322.cn")  || !!location.href.match("fy13322.cn")){
	    	$('.recordNumber').html("粤ICP备17002773号-2");
	    }else if(!!location.href.match("www.fy13322.net") || !!location.href.match("fy13322.net")){
	    	$('.recordNumber').html("粤ICP备17002773号-3");
	    }else{
	    	$('.recordNumber').html("粤ICP备17002773号-1");
	    }
	}
	renderHeader(){
		var headerTemplate = '<div class="head-top">' +
					        		'<div class="logo">' +
										'<a href="index.html"><img src="static/images/logo1.png" alt="律师logo"></a>' +
										'<span>律师端</span>' +
									'</div>' +
									'<div class="list">';
							if(this.checkLogin()){
								headerTemplate += '<div class="loginOk">' +
											'<ul class="laywer">' +
												'<li><span id="lawyerName">'+ sessionStorage.getItem('rel') +'</span>律师<i></i></li>';
												if(sessionStorage.getItem('user_logo')){
													headerTemplate += '<li><img src="' + sessionStorage.getItem('user_logo') + '" alt="律师头像"></li>';
												}else{
													headerTemplate += '<li><img src="static/images/lawyer_1.png" alt="律师头像"></li>';
												}
						 headerTemplate += '</ul>' +
						 					'<div class="mask"></div>' +
											'<div class="laywerCenter">' +
												'<p><a href="/ucenter/">进入后台</a></p>' +
												'<p class="exit"><a href="index.html">退出登录</a></p>' +
											'</div>' +
										'</div>';
							}else{ 
								headerTemplate +=  '<div class="loginBtn">' +
											'<a class="noUser" href="register.html">注 册</a>' +
											'<a class="noUser" href="login.html">登 录</a>' +
										'</div>';
							}
								headerTemplate +=	'<ul class="title">' +
										'<li class="index"><a href="index.html">首页</a></li>' +
										'<li class="news"><a href="news_list.html">资讯</a></li>' +
										'<li class="topic"><a href="topic_list.html">话题</a></li>' +	
										'<li class="subList">' +
											'<a href="javascript:;">APP下载<i></i></a>' +
											'<div>' +
												'<img src="static/images/header-code.jpg" />' +
											'</div>' +
										'</li>' +
									'</ul>' +										
								'</div>';
		let EncodeText = doT.template(headerTemplate);
		let data = {name:'joyco', indexTitleCss:'class="b_border"', readTitleCss:''};
		$("#header").html(EncodeText(data));
		$(".list li.subList a").hover(function(){
   			$(this).parent().children('div').show();
   		},function(){
   			$(".list li.subList").children('div').hide();		
	   	});
	   	$(".list li.subList > div").mouseover(function(){
   			$(this).show();
   		}).mouseout(function(){
   			$(this).hide();
   		});
   		$('.laywer').click(function(){
   			$('.laywerCenter').slideToggle();
   			$('.mask').slideToggle();
   			$(this).find('i').toggleClass('cur');
   			return false;
   		});
   		
   		$('.mask').click(function(){
   			$(this).hide();
   			$('.laywerCenter').slideUp();
   			$('.laywer').find('i').removeClass('cur');
   			return false;
   		});
	}

	//utils function begin----------------------------------------------------------------------------------------
    //设置cookie
	setCookie(name, value, days){
		(!days) && (days=0);
		if(days == 0){
			document.cookie = name + "="+ escape (value);
		}else{
			var Days = days;
			var exp = new Date();
			exp.setTime(exp.getTime() + Days*24*60*60*1000);
			document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
		}
	}
	getCookie(name){
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg))
		return unescape(arr[2]);
		else
		return null;
	}
        
    //获取页面参数
    getQueryString(name){
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var r = window.location.search.substr(1).match(reg);
		if (r != null) {
		   return decodeURI(r[2]);
		}
		return "";
	}
	//截取字符串
    substrFn(str,l){
        var str = str;
        str = str.substr(0,l).replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]$/g,"")+"...";
        return str;
    }
    //收起-显示全部
    showAllFn(dom){
        $(dom).on('click', function(event) {
        	var letter=$(this).children("span");
        	var pic=$(this).children("img");
            if(letter.text()=="展开全文"){
                $(this).parent().addClass('showAll');
                letter.text("收起全文");
                pic.attr('src','static/images/top.png')
            }else{
                $(this).parent().removeClass('showAll');
                letter.text("展开全文");
                pic.attr('src','static/images/bottom.png')
            }
        });
    }
    //获取系统当前时间
    getNowFormatDate(){
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        return currentdate;
    }
    //时间差的计算
    //当前时间减去传参的时间得到最终的时间差
    diy_time(parameterTime){
        var currentTime=this.getNowFormatDate();//表示当前时间
        var time1 = Date.parse(new Date(currentTime));
        var time2 = Date.parse(new Date(parameterTime));
        var time=(time1 - time2)/1000/3600;
        var time3;
        if(time>24){
            return time3=Math.abs(parseInt(time/24))+'天前';
        }else if(time>1){
            return time3=Math.abs(parseInt(time))+'小时前';
        }else{
            if(Math.abs(parseInt(time*60))>0){
                return time3=Math.abs(parseInt(time*60))+'分钟前';
            }else{
                return time3='刚刚';
            }
        }
    }
	//utils function end----------------------------------------------------------------------------------------
	/*
	*错误信息提示
	*type1:要显示的提示信息，type2:清空信息
	*title:信息内容
	*/
	showerrorInfo(type,content,title){
	    if (type == 1) {
	        content.html(title);
	    } else {
	        content.html("");
	    }   
	}
	
	/*
	*验证空值
	*/
	checknll(){
	    if (arguments[0] == undefined || arguments[0].length == 0 || arguments[0]== "") {
	        return false;
	    } else {
	        return true;
	    }
	}
	
	checklength() {
	    if (arguments[0].length < 6 || arguments[0].length > 16) {
	        return false;
	    } else {
	        return true;
	    }
	}
	/*
	*验证电话号码
	*/
	checkphone(phonenum) {
	    var regex = /^1[3,4,5,7,8]\d{9}$/;
	    if (regex.test(phonenum)) {
	        return true;
	    } else {
	        return false;
	    }
	}
	/*
	*验证密码是否一致
	*/
	checkpwd(pwd1, pwd2) {
	    if (pwd1 == pwd2) {
	        return true;
	    } else {
	        return false;
	    }
	}
	
	inputPlaceholder(){
		if (!('placeholder' in document.createElement('input'))) {  
	        $('[placeholder]').each(function () {  
	            var $tag = $(this); //当前 input  
	            var $copy = $tag.clone();   //当前 input 的复制  
	            if($copy.attr("type") == "password"){
                	$copy.attr("type","text");
                }
	            if ($copy.val() == "") {  
	                $copy.css("color", "#999");  
	                $copy.val($copy.attr('placeholder'));	                
	            }             
	            $copy.focus(function () {  
	                if (this.value == $copy.attr('placeholder')) {	                	
	                    this.value = '';  
	                    this.style.color = '#000';	                    
	                }
	                if($copy.attr('placeholder').indexOf("密码") >= 0){
	                	$copy.attr("type","password");
	                }
	                
	            });  
	            $copy.blur(function () {  
	                if (this.value=="") {  
	                    this.value = $copy.attr('placeholder');  
	                    $tag.val("");  
	                    this.style.color = '#999'; 
	                    if($copy.attr("type") == "password"){
		                	$copy.attr("type","text");
		                }
	                } else {  
	                    $tag.val(this.value);  
	                }  
	            });  
	            $tag.hide().after($copy.show());    //当前 input 隐藏 ，具有 placeholder 功能js的input显示  
	        });  
	    }  
	}
    
}
module.exports = Base

Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}

