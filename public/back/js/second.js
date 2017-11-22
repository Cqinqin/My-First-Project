/**
 * Created by Administrator on 2017/11/22.
 */
$(function () {
  var currentPage=1;
  var pageSize=5;
  render();
  //表格渲染和分页功能
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
          //分页渲染
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
//  点击添加二级分类显示模态框,请求下拉菜单数据
  $('.btn_add').on('click',function () {
      $('#addModal').modal('show');
    $.ajax({
      type:'get',
      url:'/category/querySecondCategoryPaging',
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
  
  //给下拉框中所有的a注册点击事件，要处理三件事1.把当前的值放到容器里面2获取当前id的值设置给隐藏域3.让他自己变成校验成功状态
  //用updateStatus(field, status, validatorName)方法更新字段的状态
  $('.dropdown-menu').on('click','a',function () {
    $('.dropdown-text').text($(this).text());
    $('[name="categoryId"]').val($(this).data('id'));
    $form.data("bootstrapValidator").updateStatus("categoryId", "VALID");
  })
  //图片上传功能，图片上传成功后也应该做三件事情
  $("#fileupload").fileupload({
    dataType:"json",
    //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址done图片上传成功的回调函数
    done:function (e, data) {
      // console.log(data);
      //设置给img_box中 img的src属性
      $('.img_box img').attr('src',data.result.picAddr);
    //  把图片的地址设置给brandLogo
      $('[name="brandLogo"]').val(data.result.picAddr);
      $form.data('bootstrapValidator').updateStatus('brandLogo','VALID')
    }
  });
  
  //表单校验,三个隐藏域
  var $form=$('form');
  $form.bootstrapValidator({
    excluded:[], //默认hidden disabled不检验，让隐藏域里面的也校验
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
  
//  给表单注册检验成功事件,阻止默认提交，发送ajax请求
  $form.on('success.form.bv',function (e) {
    e.preventDefault();
    $.ajax({
      type:'post',
      url:'/category/updateSecondCategory',
      data:$form.serialize(),
      success:function (info) {
        if (info.success){
          $('#addModal').modal('hide');
          currentPage=1;
          render();
        //  重置内容和样式
          $form[0].reset();
          $form.data('b  ootstrapValidator').resetForm();
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