# Alfred Workflow JXA
An alfred workflow library written in JXA(JavaScript for Automation on Mac OS).

# Features
- Script filter with cache

# Quick Start
```javascript
// Require Hack
ObjC.import('Foundation');
var fm = $.NSFileManager.defaultManager;
var require = function (path) {
  var contents = fm.contentsAtPath(path.toString()); // NSData
  contents = $.NSString.alloc.initWithDataEncoding(contents, $.NSUTF8StringEncoding);

  var module = {exports: {}};
  var exports = module.exports;
  eval(ObjC.unwrap(contents));

  return module.exports;
};

// Import lib
var lib = require('./lib/workflow.js');

// Fetch item list from Finder Services
function genList(){
    var itemList = [];
    var se = Application('System Events');
    var finder = se.processes.byName('Finder');
    var finderMenu = finder.menuBars[0].menuBarItems.byName('Finder');
    var serviceList = finderMenu.menus[0].menuItems.byName('Services').menus[0].menuItems();

    for(var i in serviceList){
        var mItem = serviceList[i];
        if(mItem.enabled())
            itemList.push(new lib.Item({
                uid: i,
                arg: i,
                autocomplete: mItem.title()
            },{
                title: mItem.title()
            }));
    };
	return itemList;
}

var workflow = new lib.WorkFlow(workflowName = 'FinderService');
var query = "{query}";
var regexp = new RegExp(query + '.*','i');
workflow.cacheData(genList,maxAge = 30);
workflow.filter(regexp);
workflow.alfredXML();
```

# Thanks
The `require hack` quotes from [JXA-cookbook](https://github.com/dtinth/JXA-Cookbook/wiki)

Interface of this lib is inspired by [alfred-workflow](https://github.com/deanishe/alfred-workflow)

