$(function () {
  //先封装一个获取本地存储的函数
  function getHistory() {
      //获取的就是一个json字符串，然后将其转成数组方便操作
      var history=localStorage.getItem('lt_search_history') || '[]';
      var arr=JSON.parse(history);
      return arr;
    
  }
  //在封装一个渲染数据的 函数
  function render() {
    var arr=getHistory();
    $('.lt_history').html(template('tpl',{arr:arr}))
  };
  //1.首先渲染列表
  render();
  // 2.清空搜索列表，注册点击事件,委托，先清空本地记录，然后再重新渲染页面
  $('.lt_history').on('click','.btn_empty',function () {
    mui.confirm("您是否要清空所有的历史记录?","温馨提示",["取消","确定"],function (e) {
      console.log(e);
      if (e.index==1){
        localStorage.removeItem('lt_search_history');
        render();
      }
    })

  });


// 删除搜索列表，注册点击事件，获取到对应的index，获取历史记录删除对应的值，再重新设置本地记录重新渲染
$('.lt_history').on('click','.btn_delete',function () {
  var that=this;
  mui.confirm("你确定要删除吗","温馨提示", ["否","是"], function (e) {
    // console.log(e);
    //e.index值为1表示确定，0表示删除
    if (e.index==1){
      var index=$(that).data('index');
      var arr=getHistory();
      arr.splice(index,1);
      localStorage.setItem('lt_search_history',JSON.stringify(arr));
      render();
    }
  })

});

// 添加搜索列表，注册点击事件，获取输入关键字,加个验证，(判断数组长度，超过就删除最老的一项，重复的就删除掉)设置到缓存最前面，重新渲染,跳转到详情页
  $('.search_btn').on('click',function () {
    var key=$('.search_input').val().trim();
    if (key==''){
      mui.toast('请输入搜索关键字');
      return false;
    }
    var arr=getHistory();
    var index = arr.indexOf(key);
    if (index!=-1){
      arr.splice(index,1);
    }
    if (arr.length>=10){
      arr.pop();
    }
    arr.unshift(key);
    localStorage.setItem('lt_search_history',JSON.stringify(arr));
    render();
    $('.search_input').val('');
    location.href='searchList.html?key='+key;

  })

});