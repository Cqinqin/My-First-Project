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
