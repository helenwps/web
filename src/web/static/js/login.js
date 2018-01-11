import Base from 'base';
require('jquery');
import md5 from 'md5';
require('layer');

class LoginPage extends Base{
    constructor() {
        var config = {
            token:'',
            pwd: ''
        }
        super(config);
    };
    
    //记住密码
    savePwd(){       		
        $('input[name="pwd"]').val(md5.hex_md5($('input[name="pwd"]').val()).toUpperCase());
        if($("#remberpwd").is(':checked')) {
            //选中状态
            localStorage.setItem("lawyerchecked", "checked");       //记住选中状态
            localStorage.setItem("user", name);
            localStorage.setItem("pwd_login", md5.hex_md5($('input[name="pwd"]').val()).toUpperCase());
        } else {
            //取消选中状态
            localStorage.removeItem("lawyerchecked");
            localStorage.removeItem("user");
            localStorage.removeItem("pwd_login");

        }
    }
    
    //登录
    loginInterface(name,pwd) {
        var _self = this;
        $.ajax({
	        url: _self.host+'/lawyer/user-center-login?caseId=1',
	        dataType: "json",
	        async: true,
	        data: { "user":name, "pwd":pwd},
	        type: "post",
	        success: function (req) {
	            if (req.code==1) {
	            	var userInfo = req.data;
					_self.config.token = req.data.token;
					var rel = req.data.user.realFogyyName;
					var user_logo = req.data.user.logo;
					sessionStorage.setItem("token", _self.config.token);
					sessionStorage.setItem("rel", rel);
					sessionStorage.setItem('user_logo',user_logo);
					sessionStorage.setItem('userInfo',JSON.stringify(userInfo));
					location.href = 'index.html';
	            } else {
	                layer.msg(req.msg);
	            }
	        }
	    });
    }

    ready(){   
    	var _self = this;
    	//获取任意焦点取消提示信息
      	$("#username,#userpwd").focus(function () {
            var content = $(".errorInfo");
            showerrorInfo(2, content);
       	});
       
        $(document).keydown(function(event){ 
			if(event.keyCode==13){ 				
				$(".sbtn").click(); 
			} 
		});
	 
       	$('.sbtn').on('click',function(){
            $("#errorInfo").html("");
            var name = $.trim($("#userName").val());
            var userPwd = $.trim($("#userPwd").val());
            
            //记住密码
            if(localStorage.getItem("pwd_login") && userPwd == '123456'){
            	_self.config.pwd = localStorage.getItem("pwd_login");
            }else{
            	_self.config.pwd = md5.hex_md5(userPwd).toUpperCase();
            }           
            
            var content = $(".errorInfo");
			if (!_self.checknll(name)) {
		        _self.showerrorInfo(1, content, "请输入用户名");
		        return;
		    }
		    if(!_self.checkphone(name)) {
		        _self.showerrorInfo(1, content, "您输入的用户名格式不正确，请重新输入");
		        return;
		    }
		    if (!_self.checknll(userPwd)) {
		        _self.showerrorInfo(1, content, "请输入密码");
		        return;
		    }	    
            if($("#remberpwd").is(':checked')) {
                //选中状态
                localStorage.setItem("lawyerchecked", "checked");       //记住选中状态
                localStorage.setItem("user", name); 
                localStorage.setItem("pwd_login", _self.config.pwd);
            } else {
                //取消选中状态
                localStorage.removeItem("lawyerchecked");
                localStorage.removeItem("user");
                localStorage.removeItem("pwd_login");
            }   
            
            _self.loginInterface(name,_self.config.pwd);
            		          
     	});
     	
     	if(_self.config.token){
          	_self.savePwd();
     	}
    	
		window.onload = function () {
		    if (localStorage.getItem("lawyerchecked") != null) {
		        $("#remberpwd").attr("checked", localStorage.getItem("lawyerchecked"));
		        //给账号密码赋值
		        $("input[name=user]").val(localStorage.getItem("user"));
		        $('input[name="pwd"]').val('123456');
		        _self.config.pwd = localStorage.getItem("pwd_login");
		    } else {
		        $("#remberpwd").removeAttr("checked");
//		        $('input[name="pwd"]').val("");		
		    }
		};    	
    }

    loginBack(){

    };
}

var page = new LoginPage();