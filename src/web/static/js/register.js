import Base from 'base';
require('jquery');
import md5 from 'md5';
require('layer');

class RegisterPage extends Base{
    constructor() {
        var config = {
            token:''
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
	    var content = $(".errorInfo");
	    var yzmImg=$("#yzmImg").val();
	    if (!_self.checknll(yzmImg)) {
	        this.showerrorInfo(1, content, "图形验证码不能为空");
	        return;
	    }	    
	    //获取验证码
	    $.ajax({
	        url: _self.host + "/lawyer/checkCodeAndSendSms",
	        dataType: "json",
	        async: true,
	        data: { "user": phone,type:1,code:yzmImg},
	        type: "GET",
	        success: function (req) {
	            if (req.code==1) {
            		layer.msg("验证码发送成功");
                	_self.showonems(2, that, "获取验证码");
	            } else {
	                layer.msg(req.msg);
	                $("#pic").attr("src",_self.host+"/getVerifyCode?key="+phone);
	                $('#yzmimg').val('');
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
	        data: { "phone": phone, "type": 1 },
	        type: "GET",
	        success: function (req) {
	            if (req.code==1) {
            		layer.msg("验证码发送成功");
                	_self.showonems(2, that, "获取验证码");	            		                
	            } else {
	                if(req.code == -1){
	                    $(".content .regWrap").css("height","540px");
	                    $(".imgCode").show();
	                    $("#pic").attr("src",_self.host+"/getVerifyCode?key="+phone);	                    
	                }else{
	                    layer.msg(req.msg);
	                }
	
	            }
	        }
	    });
	}
	
	registerInterface(phone,md5pwd,yzm,caseId){
		var _self = this;
		//发起注册请求
	    $.ajax({
	        url: _self.host + "/lawyer/user-center-signup?userType=1" ,
	        dataType: "json",
	        async: true,
	        data: { "user": phone, "pwd": md5pwd,"code":yzm,"caseId":caseId },
	        type: "POST",
	        success: function (req) {
	            if (req.code == 1) {             	                
	                //注册成功后调取登录接口
	                var param  = 'user='+ phone +'&pwd=' + md5pwd + '&caseId='+caseId||0;
	                _self.loginBack(param,function(req){
	                    if(req.code == 1){
	                    	var userInfo = req.data;
	                    	_self.config.token = req.data.token;
							var rel = req.data.user.realFogyyName;
							var user_logo = req.data.user.logo;
	                        sessionStorage.setItem("token", _self.config.token);
	                        sessionStorage.setItem("rel", rel);
	                        sessionStorage.setItem('user_logo',user_logo);
	                        sessionStorage.setItem('userInfo',JSON.stringify(userInfo));
	                    }
	                });
//	                window.location.href ="index.html";
	                layer.open({
	                    type: 1,
	                    title: false,
	                    area: ['373px', '233px'],
	                    closeBtn: 0,
	                    content:$('#box')
	                });
	               
	            }else{					
					layer.alert(req.msg);
				}
	        }
	    });
	}

    ready(){     	
		var _self = this;
		var caseId = '';
		$("input").focus(function () {
		    var content = $(".error");
		    var content1 = $(".errorInfo");
		    _self.showerrorInfo(2, content);
		    _self.showerrorInfo(2, content1);
		});

		$(document).keydown(function(event){ 
			if(event.keyCode==13){ 				
				$(".sbtn").click(); 
				$("input").blur();
			} 
		});
				
		$(".getCode").click(function () {
		    var that = $(".getCode");		
		    var phone = $.trim($("#phone").val());
		    var content = $(".errorInfo");
		    //图形验证码
		    var yzmImg=$("#yzmImg").val();
		    if (!_self.checknll(phone)) {
		        _self.showerrorInfo(1, content, "手机号码不能为空");
		        return;
		    }
		    if(!_self.checkphone(phone)) {
		        _self.showerrorInfo(1, content, "您输入的手机号码有误，请核实后重新输入");
		        return;
		    }
		    var display =$('.imgCode').css('display');
		    if(display != 'none'){
		        _self.getCodeWithImg(phone,yzmImg,that);
		    }else{
		        _self.getCodeWithoutImg(phone,that);
		    }
		
		});	
		
		//点击图形验证码更换图片
		$("#pic").click(function(){
		    var p = $("#phone").val();//手机号
		    $("#pic").attr("src",_self.host + "/getVerifyCode?key="+p);
		    $('#yzmimg').val('');
		});		
		
		$(".sbtn").click(function () {
		    var phone = $.trim($("#phone").val());
		    var yzm = $.trim($("#yzm").val());
		    var pwd1 = $.trim($("#pwd1").val());
		    var pwd2 = $.trim($("#pwd2").val());
		    var content = $(".errorInfo");
		    if (!_self.checknll(yzm) || !_self.checknll(phone) || !_self.checknll(pwd1) || !_self.checknll(pwd2)) {
		        _self.showerrorInfo(1, content, "请输入完整信息");
		        return;
		    }
		    if(!_self.checkphone(phone)) {
		        _self.showerrorInfo(1, content, "您输入的手机号码有误，请核实后重新输入");
		        return;
		    }
		    if (!_self.checklength(pwd1)) {
		        _self.showerrorInfo(1, content, "请输入的密码范围在6-16位之间！");
		        return;
		    }
		    if (!_self.checkpwd(pwd1,pwd2)) {
		        _self.showerrorInfo(1, content, "两次输入的密码不一致");
		        return;
		    }
		
		    var md5pwd = md5.hex_md5(pwd1).toUpperCase();
		
			_self.registerInterface(phone,md5pwd,yzm,caseId);
		});	   	
   	}
}

var page = new RegisterPage();