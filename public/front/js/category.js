/**
 * Created by Administrator on 2017/11/24.
 */
$(function () {
   $.ajax({
     type:'get',
     url:'/category/queryTopCategory',
     success:function (info) {
       console.log(info);
       $('.lt_category_l .mui-scroll').html(template('tpl_l',info));
       //渲染的是第一个i==0
       renderSecond(info.rows[0].id);
     }
   });
  function renderSecond(id) {
      $.ajax({
        type:'get',
        url:'/category/querySecondCategory',
        data:{
          id:id
        },
        success:function (info) {
          console.log(info);
          $('.lt_category_r .mui-scroll').html(template('tpl_r',info))
        }
      })
  };
//  给一级分类注册点击事件,委托事件,三件事给li添加类排他，重新渲染当前分类下的品牌，让右边区域滚回00
  $('.lt_category_l .mui-scroll').on('click','li',function () {
    $(this).addClass('now').siblings().removeClass('now');
    var id=$(this).data('id');
    renderSecond(id);
    //0对应左边，1对应右边
    mui('.mui-scroll-wrapper').scroll()[1].scrollTo(0,0,500);
  })
});