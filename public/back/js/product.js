/**
 * Created by Administrator on 2017/11/23.
 */
$(function () {
  //渲染表格和分页
  var currentPage=1;
  var pageSize=5;
  render();
  function render() {
      $.ajax({
        type:'get',
        url:'/product/queryProductDetailList',
        data:{
          page:currentPage,
          pageSize:pageSize
        },
        success:function (info) {
          // console.log(info);
          $('tbody').html(template('tpl',info));
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
//  点击添加商品显示模态框
  $('.btn_addpro').on('click',function () {
    $('#addModal').modal('show');
  });
  
  
  //图片上传
  var picList=[];
  $('#fileupload').fileupload({
    dataType:'json',
    done:function (e,data) {
      // console.log(data);
      if (picList.length<3){
        $(this).parent().parent().next().append('<img src="'+data.result.picAddr+'" width="100" height="100">');
        picList.push(data.result.picAddr);
        console.log(picList);
        console.log($('#form'));
        // var validator=$('#form').data('bootstrapValidator')
        // console.log(validator);
      }
      if (picList.length=3){
        // $('#form').data('bootstrapValidator').updateStatus('pic','VALID');
      
      }
    }
  })
//  表单校验
  
  
  
})