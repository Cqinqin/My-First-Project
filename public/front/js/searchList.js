/**
 * Created by Administrator on 2017/11/25.
 */
$(function () {
   var  currentPage=1;
    var pageSize=100;
//获取地址参数，传递给输入框
  var key=tools.getSearch('key');
  $('.search_input').val(key);
  //1.页面一进来就渲染一次
  render();
//  封装一个render函数，因为需要多次重新渲染
  function render() {
    $(".lt_product").html('<div class="loading"></div>');
    var param={};
    param.page=currentPage;
    param.pageSize=pageSize;
    //设置proName这个参数,校验一下
    var key=$('.search_input').val().trim();
    if (key==''){
      mui.toast('请输入搜索关键字');
      return false;
    }
    param.proName=key;
    //对于price num参数，点击的时候才会发送，判断有没有now这个类就知道有没有点击了还要具体指导是哪个被点击了，然后再通过判断箭头的类就知道参数值了
    var $now=$('.lt_sort a.now');
    if ($now.length>0){
      var type=$now.data('type');
      var value=$now.find('span').hasClass('fa-angle-down')?2:1;
    //  2是降序1是升序
      param[type]=value;
    }
    
    
    $.ajax({
        type:'get',
        url:'/product/queryProduct',
        data:param,
        success:function (info) {
          // console.log(info);
          setTimeout(function () {
            $('.lt_product').html(template('tpl',info));
          },1000)
        }
      })
  }

//  点击搜索的时候重新渲染
  $('.search_btn').on('click',function () {
    render();
  });
//  点击a标签，进行排序,重新渲染
  //  如果a标签有now这个类，那么就改变箭头的方向
//    如果没有这个类，那么就给他加上这个类，并排他，让所有的a标签的箭头都向下
//  toggleClass没有这个类就添加，有就删除
  $('.lt_sort a[data-type]').on('click',function () {
    var $this=$(this);
    if ($this.hasClass('now')){
      $this.find('span').toggleClass('fa-angle-up').toggleClass('fa-angle-down');
    }else{
      $this.addClass('now').siblings().removeClass('now');
      $this.find('span').addClass('fa-angle-down').removeClass('fa-angle-up');
    }
    render();
  });
 
  
});