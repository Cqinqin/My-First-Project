/**
 * Created by Administrator on 2017/11/25.
 */
$(function () {
   var id=tools.getSearch('productId');
  console.log(id);
  
  $.ajax({
    type:'get',
    url:'/product/queryProductDetail',
    data:{id:id},
    success:function (info) {
      console.log(info);
      
      $('.lt_main').html(template('tpl',info));
    }
  })

  
  
});