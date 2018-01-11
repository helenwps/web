import Base from 'base';
require('jquery');
import md5 from 'md5';
require('layer');

class ForgetpwdPage extends Base{
    constructor() {
        var config = {
        }
        super(config);
    };
    
    /*
	*content:操作对象
	*禁用60S的方法
	*type1:表示显示与原来的值，type2:显示60S倒计时
	*title显示的信息对象
	*/
    showonems(type,content,title){
	
	    var t = 60;
	    var s;
	    if (type==1) {
	        content.html(title);
	    } else {
	        content.attr("disabled", "disabled");
	        s = setInterval(function () {
	            content.attr("disabled", "disabled");
	            t--;
	            content.html(t);
	            if (t < 1) {
	                content.removeAttr("disabled");
	                clearInterval(s);
	                content.html(title);
	            }
	        }, 1000);
	    }
	}
    	
	//需要图形验证码获取手机验证码
	getCodeWithImg(phone,yzmImg,that){
		var _self = this;
	    var tsInfo = $("#tsInfo");//错误信息的显示位置
	    var yzmimg=$("#yzmimg").val();//图形验证码
	    if (!_self.checknll(yzmimg)) {
	        _self.showerrorInfo(1,tsInfo,"图形验证码不能为空");
	        return false;
	    }
	    //获取验证码
	    $.ajax({
	        url: _self.host + "/lawyer/checkCodeAndSendSms",
	        dataType: "json",
	        async: true,
	        data: { "user": phone,type:4,code:yzmImg},
	        type: "GET",
	        success: function (req) {
	            if (req.code==1) {
            		layer.msg("验证码发送成功");
                	_self.showonems(2, that, "获取验证码");
	            } else {
	                layer.msg(req.msg);
	                $("#pic").attr("src",_self.host + "/getVerifyCode?key=" + phone);
	                $("#yzmimg").val('');
	            }
	        }
	    });
	}
	
	//不需要图形验证码获取手机验证码
	getCodeWithoutImg(phone,that){
		var _self = this;
	    //获取验证码
	    $.ajax({
	        url: _self.host + "/lawyer/verifiedSendSms",
	        dataType: "json",
	        async: true,
	        data: { "phone": phone, "type": 4 },
	        type: "GET",
	        success: function (req) {
	            if (req.code==1) {
            		layer.msg("验证码发送成功");
                	_self.showonems(2, that, "获取验证码");
	            } else {
	                if(req.code==-1){
	                    $(".picimg").show();
	                    $("#pic").attr("src",_self.host + "/getVerifyCode?key=" + phone);
	                }else{
	                    layer.msg(req.msg);
	                }
	
	            }
	        }
	    });
	}
		
	//重置密码
	resetPwd(phoneNum,codeNum,md5pwd){
		var _self = this;
		$.ajax({
            type:"post",
            url : _self.host + "/lawyer/forget-password",
            data :{
                newPwd : md5pwd,
                phoneNo : phoneNum,
                checkCode : codeNum
            },
            dataType : "text",
            success: function(json){
                var data = JSON.parse(json);
                if(data.code == 1){
                	localStorage.clear();
					layer.confirm('重置密码成功', {
						title: "",
						closeBtn: 0,
						btn: ['确定'] ,
						area:["150px","150px"]						   
					}, function () {
					    location.href ="?type=2";
					});
				}else{
                    layer.alert(data.msg);
                }
            }
        });
	}
	
	ready(){
		var _self = this;    	
		//获取任意焦点取消提示信息
		$("input").focus(function () {
		    var tsInfo = $("#tsInfo");
		    _self.showerrorInfo(2, tsInfo);  
		    $("#tsInfo1").html('');
		});
				
		$("#getYzm").click(function () {
		    var that = $("#getYzm");//获取验证码的按钮
		    var phoneNum = $("#tphone").val();//手机号
		    var tsInfo = $("#tsInfo");//错误信息的显示位置
		    var yzmimg=$("#yzmimg").val();//图形验证码
		
	        if (!_self.checknll(phoneNum)) {
	            _self.showerrorInfo(1,tsInfo,"请输入手机号码");
	            return false;
	        }
	
	        if (!_self.checkphone(phoneNum)) {
	            _self.showerrorInfo(1, tsInfo, "您输入的手机号码格式不正确，请重新输入");
	            return false;
	        }
		    var display =$('.picimg').css('display');
		    if(display != 'none'){
		        _self.getCodeWithImg(phoneNum,yzmimg,that);//需要图形验证码
		    }else{
		        _self.getCodeWithoutImg(phoneNum,that)//不需要图形验证码
		    }
		    
		});
		
		$("#pic").click(function(){
		    var phoneNum = $.trim($("#tphone").val());//手机号
		    $("#pic").attr("src",_self.host + "/getVerifyCode?key=" + phoneNum);
		    $("#yzmimg").val('');
		});		
			
	    $("#next1").click(function () {
            var pwd1 = $.trim($("#pwd1").val());
            var pwd2 = $.trim($("#pwd2").val());
            var tsInfo = $("#tsInfo1");
            var phoneNum = $.trim($("#tphone").val());
		    var codeNum = $.trim($("#tyzm").val());
		    var tsInfo = $("#tsInfo");
	        if (!_self.checknll(phoneNum)) {
	            _self.showerrorInfo(1,tsInfo,"请输入手机号码");
	            return false;
	        }	
	        if (!_self.checkphone(phoneNum)) {
	            _self.showerrorInfo(1, tsInfo, "您输入的手机号码格式不正确，请重新输入");
	            return false;
	        }
		    if (!_self.checknll(codeNum)) {
	            _self.showerrorInfo(1,tsInfo,"请输入短信验证码");
	            return false;
	        }		  
						
            if (!_self.checknll(pwd1)) {
            	_self.showerrorInfo(1,tsInfo,"请输入新密码");
                return false;
            }
            if (!_self.checklength(pwd1)) {
            	_self.showerrorInfo(1,tsInfo,"请输入的密码范围在6-16位之间！");
                return false;
            }
            if (!_self.checknll(pwd2)) {
            	_self.showerrorInfo(1,tsInfo,"请输入确认密码");
                return false;
            }
            if (!_self.checkpwd(pwd1,pwd2)) {
            	_self.showerrorInfo(1,tsInfo,"两次输入的密码不一致");
                return false;
            }
            var md5pwd = md5.hex_md5(pwd1).toUpperCase();           //md5加密处理
            _self.resetPwd(phoneNum,codeNum,md5pwd);
        }); 
        
        $('#succBtn').click(function(){
        	window.location.href = "login.html";
        });        

		if(_self.getQueryString("type") && _self.getQueryString("type") == 2){				
			$('.forgetPwd1').hide();
	        $('.forgetPwd2').show();
		}else{
			$('.forgetPwd1').show();
	        $('.forgetPwd2').hide();
		}	
		
    }

    loginBack(){

    };
}

var page = new ForgetpwdPage();