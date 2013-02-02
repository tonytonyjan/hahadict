var DICT, DICT_WINDOW;

$.ajax({
  url: 'dict.json',
  dataType: 'json'
}).done(function(data, status){
  DICT = data;
  DICT['笑典'] = {};
  DICT['笑典']['ㄒ｜ㄠˋ　ㄉ｜ㄢˇ'] = ['教育部重編國語辭典 Chrome 離線版，由 <a href="http://www.plurk.com/tonytonyjan" target="_blank">tonytonyjan</a> 在 <a href="http://3du.tw" target="_blank">3du.tw</a> 黑客松時所製作的玩具。'];
  console.log("dict loaded.")
}).fail(function(data, status){
  console.log(status);
});

function query(q){
  var obj = {};
  for(var i in DICT)
    if(i.indexOf(q)==0){ // DICT[i][0] begin with q
      obj[i] = DICT[i];
    }
  return obj;
}

function closeWindow(){
  if(DICT_WINDOW){
    chrome.windows.remove(DICT_WINDOW.id, function(){
      DICT_WINDOW = null;
    });
  }
}

function popWindow(query, top, left, width, height){
  if(query.match(/\w/)) return;
  if(typeof width === 'undefined') width = 800;
  if(typeof height === 'undefined') height = 400;
  closeWindow();
  chrome.windows.create({
      url: "index.html#" + query,
      width: width,
      height: height,
      top: top,
      left: left,
      type: 'popup'
  }, function(window){
    DICT_WINDOW = window;
  });
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
  switch(request.op){
  case "close":
    break;
  case "popWindow":
    popWindow(request.query, request.top, request.left, request.width, request.height);
    break;
  case "closeWindow":
    closeWindow();
    break;
  default:
    console.error('Unkown operation "' + request.op + '"')
  }
});

chrome.contextMenus.create({
  id: "haha_dict",
  title: "笑典",
  contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener(function(info, tab){
  chrome.storage.local.get("contextmenu", function(data){
    popWindow(info.selectionText, data.contextmenu.y, data.contextmenu.x);
  });
});
