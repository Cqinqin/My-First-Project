/**
 * Created by Administrator on 2017/11/24.
 */
// mui('.mui-scroll-wrapper').scroll({
//   indicators: false
//   //不显示滚动条
// });
// mui('.mui-slider').slider({
//   interval:1000
// });
mui('.mui-scroll-wrapper').scroll({
  indicators:false
});

mui(".mui-slider").slider({
  interval: 1000
});

var tools={
  getSearchObj:function () {
    var search=location.search;
    search=decodeURI(search);
    search=search.slice(1);
    var arr=search.split('&');
    var obj={};
    arr.forEach(function (v) {
      var key=v.split('=')[0];
      var value=v.split('=')[1];
      obj[key]=value;
    });
    return obj;
  },
  getSearch:function (key) {
    return this.getSearchObj()[key];
  }
}

