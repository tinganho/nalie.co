
(function() {
  window.weixinShare = {
    title: '',
    description: '',
    imgURL: '',
    URL: window.location.href,
    appID: ''
  };
  function shareFriend() {
    WeixinJSBridge.invoke('sendAppMessage',{
      'title': weixinShare.title,
      'desc': weixinShare.description,
      'link': weixinShare.URL,
      'img_url': weixinShare.imgURL,
      'img_width': '640',
      'img_height': '640',
      'appid': weixinShare.appID,
    }, function(res) {
      _report('send_msg', res.err_msg);
    });
  }
  function shareTimeline() {
    WeixinJSBridge.invoke('shareTimeline',{
      'title': weixinShare.title,
      'desc': weixinShare.description,
      'img_url': weixinShare.imgURL,
      'img_width': '640',
      'img_height': '640',
      'link': weixinShare.URL
    }, function(res) {
      _report('timeline', res.err_msg);
    });
  }
  function shareWeibo() {
    WeixinJSBridge.invoke('shareWeibo',{
      'content': weixinShare.description,
      'url': weixinShare.URL,
    }, function(res) {
      _report('weibo', res.err_msg);
    });
  }
  document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
    WeixinJSBridge.on('menu:share:appmessage', function(argv){
      shareFriend();
    });
    WeixinJSBridge.on('menu:share:timeline', function(argv){
      shareTimeline();
    });
    WeixinJSBridge.on('menu:share:weibo', function(argv){
      shareWeibo();
    });
  }, false);
})();