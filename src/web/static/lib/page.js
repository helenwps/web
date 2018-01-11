
function page(context) {
    this.context = context;
 };
/*
*初始化
*html:生成页码标签
*content:容器
*pageindex:当前页码
*total:总页码
*pd:当前页码
*shownum:每页显示条数
*/
page.prototype.init =
{
    html: "<label id='pageBegin' class='page pf'>|<</label><label id='pagePrev' class='page pup' ><</label><label id='pageNext' class='page pdown'>></label><label id='pageEnd' class='page pl'>>|</label><span> 第<input type='number' id='pageCurrInput' class='page dq'value = '1'>/<span class='totalpage'></span></span><label id='pageGo' class='page go'>GO</label>",
    content: "",
    pageindex: 1,
    total: 60,
    shownum: 10,
    url:""
}

/*
*生成标签
*
*/
page.prototype.createhtml = function (content) {
    var that = this;
    content.html(that.init.html);
    //填充当前页码
    $(".dq").val(that.init.pageindex);
    //填充总页码
    $(".totalpage").html(that.init.total + "页");
    
    ////////////////////////////////////////////////////
    $("#pageBegin").on('click', function(){
        that.context.restfulPage(1)
        that.init.pageindex = 1;
    });
    $("#pagePrev").on('click', function(){
        var pageCurr = Number($("#pageCurrInput").val());
        var pageNum = (pageCurr-1) <=1 ? 1 : (pageCurr-1); 
        that.context.restfulPage(pageNum);
        that.init.pageindex = pageNum;
    });
    $("#pageNext").on('click', function(){
        var pageCurr = Number($("#pageCurrInput").val());
        var pageTotal = Number(that.init.total);
        var pageNum = (pageCurr+1)>=pageTotal ? pageTotal : (pageCurr+1); 
        that.context.restfulPage(pageNum);
        that.init.pageindex = pageNum;
    });
    $("#pageEnd").on('click', function(){
        var pageNum = Number(that.init.total);
        that.context.restfulPage(pageNum);
        that.init.pageindex = pageNum;
    });
    $("#pageGo").on('click', function(){
        var pageNum = Number($("#pageCurrInput").val());
        var pageTotal = Number(that.init.total);
        (pageNum>=pageTotal)&&(pageNum=pageTotal);
        that.context.restfulPage(pageNum);
        that.init.pageindex = pageNum;
    });
}

// page.prototype.updateHtml = function(){
//     //console.log(this.init.pageindex)
// }

/*
*
*计算总页码
*totalInfo：总条数
*shownum：每页显示的条数
*/
page.prototype.creattotal = function (shownum, totalInfo) {
    var that = this;
    that.init.total = (totalInfo / shownum) % 1 == 0 ? totalInfo / shownum : parseInt((totalInfo / shownum)) + 1;
}

/*
*点击GO
*/
page.prototype.go = function () {
    if ($(".dq").val() > this.init.total || $(".dq").val() < 1)
    {
        return false;
    }
    this.init.pageindex = $(".dq").val();         //获取输入的页码
}


/**显示页码信息**/
page.prototype.showInfo = function (content) {
    content = $(".dq");
    var that = this;
    content.val(that.init.pageindex);
}

module.exports = page