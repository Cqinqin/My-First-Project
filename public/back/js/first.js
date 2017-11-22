/**
 * Created by Administrator on 2017/11/22.
 */
$(function () {
  var currentPage=1;
  var pageSize=3;
  render();
  function render() {
      $.ajax({
        type:'get',
        url:'/category/queryTopCategoryPaging',
        data:{
          page:currentPage,
          pageSize:pageSize
        },
        success:function (info) {
            // console.log(info);
          var html=template('tpl',info);
          $('tbody').html(html);
        //  渲染表格完渲染分页
          $('#paginator').bootstrapPaginator({
            bootstrapMajorVersion:3,
            currentPage:currentPage,
            totalPages:Math.ceil(info.total/pageSize),
            onPageClicked:function (a,b,c,page) {
              currentPage=page;
              render();
            }
          })
        }
      })
  }
//  一级分类的添加功能
  $('.btn_add').on('click',function () {
      $('#addModal').modal('show')
  });
  
//  表单校验功能
  var $form = $("#form");
  $form.bootstrapValidator({
    feedbackIcons:{
      valid: 'glyphicon glyphicon-ok',
      invalid:'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      categoryName:{
        validators:{
          notEmpty:{
            message:"请输入一级分类的名称"
          }
        }
        
      }
    }
  });
  
//  注册表单成功事件,阻止默认事件，发送ajax请求,关闭模态框，重新渲染,重置表单
  $form.on('success.form.bv',function (e) {
    e.preventDefault();
    $.ajax({
      type:'post',
      url:'/category/addTopCategory',
      data:$form.serialize(),
      success:function (info) {
        if (info.success){
          $('#addModal').modal('hide');
          currentPage=1;
          render();
          //重置样式
          $form.data('bootstrapValidator').resetForm();
          //内容重置这个方法是dom对象的
          $form[0].reset();

        }
      }
    })
  })
  
  
});