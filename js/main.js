function to_html(entry, heteronyms){
  var html = '<div class="well"><div class="page-header"><h1>'+entry+'</h1></div>';
  for(var i in heteronyms){
    html += '<h2 class="muted">'+i+'</h2>';
    html += '<ul>';
    for(var j in heteronyms[i])
      html += '<li>'+heteronyms[i][j]+'</li>'
    html += '</ul>'
  }
  html += '</div>'
  return html;
}

function show(entries_obj){
  var target = $('#definitions');
  var html = '';
  for(var i in entries_obj){
    var entry = i;
    html += to_html(i, entries_obj[i]);
  }
  target.html(html);
}

$(function(){
  $('#query-form').submit(function(){
    $('#query').autocomplete('close');
    return false;
  });
  $('#query').val(location.hash.substr(1)).keyup(function(){
    location.hash = this.value
  }).focus();
});

chrome.runtime.getBackgroundPage(function(bg){
  $(function(){
    // control
    var ans;
    $('#query').autocomplete({
      source: function(request, response){
        ans = bg.query(request.term);
        response(Object.keys(ans));
      },
      focus: function(e, ui){
        var obj = {};
        for(var i in ans)
          if(i.indexOf(ui.item.value) == 0)
            obj[i] = ans[i];
        show(obj);
      },
      response: function(e, ui){
        var ary = ui.content.slice(0, 5);
        var entries = $.map(ary, function(item, key){return item.value});
        var obj = {}
        for(var i in entries){ 
          var entry = entries[i];
          obj[entry] = ans[entry];
        }
        show(obj);
      },
    });

    $('#query').autocomplete("search", location.hash.substr(1)).autocomplete("close");
  });
});