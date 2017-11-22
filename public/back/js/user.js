/**
 * Created by Administrator on 2017/11/22.
 */
$(function () {
  var currentPage=1;
  var pageSize=5;
  render();//页面一加载就需要渲染一次
  function render() {
    $.ajax({
      type:'get',
      url:'/user/queryUser',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function (info) {
        console.log(info);
        var html=template('tpl',info);
        $('tbody').html(html);
        //  渲染分页是在渲染表格之后
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage:currentPage,
          totalPages:Math.ceil(info.total/pageSize),
          onPageClicked:function (a,b,c,page) {
            currentPage=page;
            render()
          }
        })
      }
    })
  };
  
  //启用与禁用模态框功能
  $('tbody').on('click','.btn',function () {
    $('#userModal').modal('show');
    var id=$(this).parent().data('id')
    // console.log(id);
    var isDelete=$(this).hasClass('btn-danger')?0:1;
  //  给确定按钮注册点击事件发送ajax请求
    $('.btn_confirm').off().on('click',function () {
        $.ajax({
          type:'post',
          url:'/user/updateUser',
          data:{
            id:id,
            isDelete:isDelete
          },
          success:function (info) {
            // console.log(info);
            if (info.success){
              $('#userModal').modal('hide');
              render();
            }
          }
        })
    })
    
  })
 
})