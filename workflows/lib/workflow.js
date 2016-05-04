function Item({
    uid,
    arg,
    autocomplete,
    valid,
    type
},{
    title,
    subtitle,
    icon,
    text
}){
    this.attr = {
        uid,
        arg,
        autocomplete,
        valid,
        type
    };
    this.ele = {
        title,
        subtitle,
        icon,
        text
    };
}
function WorkFlow(workflowName){
    this.items = [];
    this.cacheItems = [];
    this.name = workflowName;
    this.cachePath = this.name + '_cache.json';
}
WorkFlow.prototype._addItem = function(item){
    this.items.push(item);
};
WorkFlow.prototype._itemToNSXMLElement = function (item){
    var oXMLElement = $.NSXMLElement.alloc.initWithName('item');
    for(var key in item.attr){
        if(item.attr[key] !== undefined) {
            oXMLElement.addAttribute($.NSXMLNode.attributeWithNameStringValue(key,item.attr[key]));
        }
    }
    for(var key in item.ele){
        if(item.ele[key] !== undefined) {
            oXMLElement.addChild($.NSXMLNode.elementWithNameStringValue(key,item.ele[key]));
        }
    }
    return oXMLElement;
};
WorkFlow.prototype.filter = function(pattern){
    for(item of this.cacheItems){
        if(pattern.test(item.attr.autocomplete)){
            this._addItem(item);
        }
    }
};
WorkFlow.prototype.alfredXML = function(){
    var oXMLDoc = $.NSXMLDocument.alloc.initWithXMLStringOptionsError("<items></items>",0,null);
    for(var item of this.items){
        oXMLDoc.rootElement.addChild(this._itemToNSXMLElement(item));
    }
    return ObjC.unwrap(oXMLDoc.XMLStringWithOptions(0));
};
WorkFlow.prototype._cacheAge = function (){
     // current time - create time;
    var oFileManager = $.NSFileManager.defaultManager;
	if(!oFileManager.fileExistsAtPath(this.cachePath)) return Number.MAX_VALUE;
    var oFileAttrs = $.NSFileManager.defaultManager.attributesOfItemAtPathError(this.cachePath,null);
    var oCreateDate = oFileAttrs.objectForKey(ObjC.unwrap($.NSFileCreationDate));
    return ( ( new Date().getTime()) - ObjC.unwrap(oCreateDate).getTime() ) / 1000;
};
WorkFlow.prototype._cacheFetch = function(){
	var oFileHandle = $.NSFileHandle.fileHandleForReadingAtPath(this.cachePath);
    var data = oFileHandle.readDataToEndOfFile;
    var jsonStr = ObjC.unwrap($.NSString.alloc.initWithDataEncoding(data,$.NSUTF8StringEncoding));
    var jsonData = JSON.parse(jsonStr);
    var itemList = [];
    for(item of jsonData){
        itemList.push(new Item(item.attr,item.ele));
    }
    return itemList;
};
WorkFlow.prototype._cacheStore = function (cacheItems){
    var oFileManager = $.NSFileManager.defaultManager;
    var jsonStr = JSON.stringify(cacheItems);
    oFileManager.createFileAtPathContentsAttributes(this.cachePath,ObjC.wrap(jsonStr).dataUsingEncoding($.NSUTF8StringEncoding),$.NSDictionary.alloc.init);
};
WorkFlow.prototype.cacheData = function(funcGenItemList,maxAge){
    if(this._cacheAge() <= maxAge){
        this.cacheItems = this._cacheFetch();
    }else{
        this.cacheItems = funcGenItemList();
        this._cacheStore(this.cacheItems);
    }
};

exports.WorkFlow = WorkFlow;
exports.Item = Item;
