/**
 * Created by Administrator on 2017/11/21.
 */
$(function () {
  var $form=$('form');
  //表单校验功能：用户名密码都不能为空，密码长度6-12，用表单校验插件
  $form.bootstrapValidator({
    //配置校验时的图标
    feedbackIcons:{
      valid:'glyphicon glyphicon-ok',
      invalid:'glyphicon glyphicon-remove',
      validating:'glyphicon glyphicon-refresh'
    },
    //配置校验的规则，你想要配置的哪些字段
    fields:{
      //username对应表单中的name属性
      username:{
        validators:{
          notEmpty:{
            message:'用户名不能为空'
          },
          callback :{
            message:'用户名不存在'
          }
        }
      },
      password:{
        validators:{
          notEmpty:{
            message:'用户名不能为空'
          },
          stringLength:{
            min:6,
            max:12,
            message:'密码长度是6-12位'
          },
          callback:{
            message:'密码错误'
          }
        }
      }
    }
  });
  
//  表单注册一个校验成功的事件,插件里有这个事件
  $form.on('success.form.bv',function (e) {
      //阻止浏览器的默认行为，不让登录按钮提交，用ajax请求，
      e.preventDefault();
    console.log('通过校验');
    $.ajax({
      type:'post',
      url:'/employee/employeeLogin',
      data:$form.serialize(),
      //dataType可以写可以不写，如果响应header是json格式可以不写，
      success:function (data) {
          console.log(data);
        //成功就跳转到首页
        if (data.success){
          location.href=='index.html';
        }
        if(data.error==1000){
        // alert(' 用户名不存在');
        //   updateStatus(field, status, validatorName)方法更新字段的状态
        //   第一个参数：改变哪个字段
          //第二个参数：改成什么状态  VALID:通过  INVALID:不通过
          //第三个参数：选择提示的信息
          $form.data('bootstrapValidator').updateStatus('username','INVALID','callback')
        }
        if (data.error==1001){
          //密码错误
          $form.data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
        }
      }
    })
  })
  //将隐藏所有错误提示和图标
  $('[type="reset"]').on('click',function () {
    $form.data('bootstrapValidator').resetForm();
  });
 
  
  
  
  
  
})