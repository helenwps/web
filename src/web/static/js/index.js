import Base from 'base';
require('jquery');
require('swiper');

class IndexPage extends Base{
    constructor() {
        super();
    };

    ready(){  
    	
    	$('#header .index').addClass('cur');
    	
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
	    
	    new Swiper('.swiper-container', {
	        pagination: '.swiper-pagination',
	        paginationClickable: true,
//	        loop:true,
//	        autoplay: 3000,
	        speed:800
	   	}); 
	   	
	   	$('.aTitle a').click(function(){
	   		$(this).addClass('cur').siblings().removeClass('cur');
	   		var i = $(this).index();
	   		$('.article > div').eq(i).show().siblings().hide();
	   	});
	   	$('.article ul li').hover(function(){
	   		$(this).addClass('cur').siblings().removeClass('cur');
	   		var i = $(this).index();
	   		$(this).parents('.articleContent').find('.insertContent').eq(i).show().siblings().hide();
	   	});
    }

    loginBack(){

    };
}

var page = new IndexPage();