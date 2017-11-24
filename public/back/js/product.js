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
          // //console.log(info);
          $('tbody').html(template('tpl',info));
          $('#paginator').bootstrapPaginator({
            bootstrapMajorVersion:3,
            currentPage:currentPage,
            totalPages:Math.ceil(info.total/pageSize),
            itemTexts:function (type,page,current) {
              // console.log(type);
              switch (type){
                case 'first':
                  return "首页";
                case 'prev':
                  return "上一页";
                case 'next':
                  return "下一页";
                case 'last':
                  return "尾页";
                default:
                  return page;
              }
            },
            tooltipTitles:function (type,page,current) {
           switch (type){
             case 'first':
               return '首页';
             case 'prev':
               return '上一页';
             case 'next':
               return '下一页';
             case 'last':
               return '尾页';
             default :
               return '跳转到'+page;
           }
            },
            onPageClicked:function (a,b,c,page) {
              currentPage=page;
              render();
            }
          })
        }
      })
  }
//  点击添加商品显示模态框，渲染二级分类下拉菜单
  $('.btn_addpro').on('click',function () {
    $('#addModal').modal('show');
    $.ajax({
      type:'get',
      url:'/category/querySecondCategoryPaging',
      data:{
        page:1,
        pageSize:100
      },
      success:function (info) {
        //console.log(info);
        $('.dropdown-menu').html(template('tpl2',info));
      }
      
    })
  });
  //点击下拉菜单中的a时，注册委托事件,做三件事
  $('.dropdown-menu').on('click','a',function () {
    $('.dropdown-text').text($(this).text());
    $('[name="brandId"]').val($(this).data('id'));
    $form.data('bootstrapValidator').updateStatus('brandId','VALID')
  })
  
  //  表单校验
  var $form=$('form');
  $form.bootstrapValidator({
    excluded:[],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      brandId:{
        validators:{
          notEmpty:{
            message:"请选择二级分类"
          }
        }
      },
      proName:{
        validators:{
          notEmpty:{
            message:'请输入商品的名称'
          }
        }
      },
      proDesc:{
        validators:{
          notEmpty:{
            message:"请输入商品的描述"
          }
        }
      },
      num:{
        validators:{
          notEmpty:{
            message:'请输入商品的库存'
          },
        //  正则校验
          regexp:{
            //不能是0开头必须是数字，精确校验
            regexp:/^[1-9]\d*$/,
            message:'请输入合法的库存'
          }
        }
      },
      size:{
        validators:{
          notEmpty:{
            message:"请输入商品的尺码"
          },
          regexp:{
            //不能0开头必须是数字
            regexp:/^\d{2}-\d{2}$/,
            message:'请输入合法的尺码,例如(32-46)'
          }
        }
      },
      oldPrice:{
        validators:{
          notEmpty:{
            message:'请输入商品的原价'
          }
        }
      },
      price:{
        validators:{
          notEmpty:{
            message:'请输入商品的价格'
          }
        }
      },
      brandLogo:{
        validators:{
          notEmpty:{
            message:"请上传3张图片"
          }
        }
      }
     
    }
    
  })
  
  //图片上传,上传成功就把图片地址追加到img_box中，并且把结果存储到数组中，判断数组长度==3就手动更新校验状态为合法，否则就不合法
  var picList=[];
  $('#fileupload').fileupload({
    dataType:'json',
    done:function (e,data) {
      // console.log(data);
      if (picList.length>=3){
        return false;
      };
      $('.img_box').append('<img src="'+data.result.picAddr+'" width="100" height="100">');
        picList.push(data.result);
        // console.log(picList);
      if (picList.length===3){
        $form.data('bootstrapValidator').updateStatus('brandLogo','VALID');
      }else{
        $form.data('bootstrapValidator').updateStatus('brandLogo','INVALID');
      }
    }
  })

//  给表单注册校验成功事件，注意拼接图片参数的处理
//  成功就关闭模态框，从第一页开始渲染，重置内容和样式，手动重置下拉框文字，隐藏域，图片 和图片数组
  $form.on('success.form.bv',function (e) {
    e.preventDefault();
    var param=$form.serialize();
    param+='&picName1'+picList[0].picName+"&picAddr1"+picList[0].picAddr;
    param+='&picName2'+picList[1].picName+'&picAddr2'+picList[1].picAddr;
    param+='&picName3'+picList[2].picName+'&picAddr3'+picList[2].picAddr;
    $.ajax({
      type:'post',
      url:'/product/addProduct',
      data:param,
      success:function (info) {
          if (info.success){
            $('#addModal').modal('hide');
            currentPage=1;
            render();
            $form[0].reset();
            $form.data('bootstrapValidator').resetForm();
          //  图片和下拉框和隐藏域需要手动重置
            $('.dropdown-text').text('请选择二级分类');
            $('[name="brandId"]').val('');
            $('.img_box img').remove();
            picList=[];

          }
      }
    })

  })
  
  
})