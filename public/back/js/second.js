/**
 * Created by Administrator on 2017/11/22.
 */
$(function () {
  //定义好参数，发送ajax请求，渲染表格然后分页功能，注意调用插件bootstrapPaginator的几个参数
  var currentPage=1;
  var pageSize=5;
  render();
  function render() {
      $.ajax({
        type:'get',
        url:'/category/querySecondCategoryPaging',
        data:{
          page:currentPage,
          pageSize:pageSize
        },
        success:function (info) {
          console.log(info);
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
  
//  点击添加分类按钮,显示模态框,发送ajax请求下拉菜单一级分类数据，注意此时data传参的处理
  $('.btn_add').on('click',function () {
      $('#addModal').modal('show');
    $.ajax({
      type:'get',
      url:'/category/queryTopCategoryPaging',
      data:{
        page:1,
        pageSize:100
      },
      success:function (info) {
        // console.log(info);
        $('.dropdown-menu').html(template('tpl2',info));
      }
    })
  });
  
  //点击下拉框时，此时应是委托事件，要处理三件事1.把a中的值放到span里面2获取自定义属性data-id的值设置给隐藏域3.改变字段时更新字段的状态updateStatus(field, status, validatorName)
  $('.dropdown-menu').on('click','a',function () {
    $('.dropdown-text').text($(this).text());
    $('[name="categoryId"]').val($(this).data('id'));
    console.log($(this).data('id'));
    $form.data("bootstrapValidator").updateStatus("categoryId", "VALID");
  })
  
  //图片上传功能，注意fileupload方法的参数，图片上传成功后，将图片的地址设置给img_box下面的img和隐藏域,改变字段时，更新状态
  $("#fileupload").fileupload({
    dataType:"json",
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址done图片上传成功的回调函数
    done:function (e, data) {
      // console.log(data);
      $('.img_box img').attr('src',data.result.picAddr);
      $('[name="brandLogo"]').val(data.result.picAddr);
      $form.data('bootstrapValidator').updateStatus('brandLogo','VALID')
    }
  });
  
  //表单校验，注意默认是hidden,disabled不校验,categoryId隐藏域，brandName,brandLogo隐藏域，
  var $form=$('form');
  $form.bootstrapValidator({
    excluded:[],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      categoryId:{
        validators:{
          notEmpty:{
            message:'请选择一级分类'
          }}
        },
        brandName:{
          validators:{
            notEmpty:{
              message:'请输入二级分类的名称'
            }
          }
        },
        brandLogo:{
          validators:{
            notEmpty:{
              message:'请上传品牌图片'
            }
          }
        }
    }
  });
  $('[name="hot"]').val("0");
  
//  给表单注册检验成功事件,阻止默认提交，发送ajax请求,表单序列化传data,成功后关闭模态框，从第一页渲染，重置内容（dom对象方法）和校验样式，手动重置图片，下拉框和两个隐藏域的值
  $form.on('success.form.bv',function (e) {
    e.preventDefault();
    $.ajax({
      type:'post',
      url:'/category/addSecondCategory',
      data:$form.serialize(),
      success:function (info) {
        if (info.success){
          $('#addModal').modal('hide');
          currentPage=1;
          render();
        //  重置内容和样式
          $form[0].reset();
          $form.data('bootstrapValidator').resetForm();
        //  重置下拉框组件和图片
          $('.dropdown-text').text('请选择一级分类');
          $('[name="categoryId"]').val('');
          $('.img_box img').attr('src','images/none.png');
          $('[name="brandLogo"]').val('');
          
        }
      }
    })
  })
  
  
});