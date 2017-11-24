/**
 * Created by Administrator on 2017/11/21.
 */
//禁用进度环
NProgress.configure({showSpinner:false});
//注册全局的事件
$(document).ajaxStart(function () {
    NProgress.start();
});
$(document).ajaxStop(function () {
  setTimeout(function () {
    NProgress.done();
  },500);
    
})


//判断用户是否登录 ，每个页面都要
if (location.href.indexOf('login.html')==-1){
  $.ajax({
    type:'get',
    url:'/employee/checkRootLogin',
    success:function (data) {
      if (data.error==400){
        location.href='login.html';
      }
    }
  })
}



//二级分类显示隐藏功能
$('.child').prev().on('click',function () {
  $(this).next().slideToggle();
})
$('.icon_menu').on('click',function () {
  $('.lt_aside').toggleClass('now');
  $('.lt_main').toggleClass('now');
  $('.lt_topbar').toggleClass('now');
})
//模态框显示与隐藏
$('.icon_logout').on('click',function () {
    $('#logoutModal').modal('show');
    //先解绑所有的事件
    $('.btn_logout').off().on('click',function () {
      $.ajax({
        type:'get',
        url:'/employee/employeeLogout',
        success:function (data) {
            if (data.success){
              location.href='login.html';
            }
        }
      })
    })
});

