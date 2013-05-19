!function (name, context, definition) {
    if (typeof module !== 'undefined') module.exports = definition(name, context);
    else if (typeof define === 'function' && typeof define.amd  === 'object') define(definition);
    else context[name] = definition(name, context);
}('bacon', this, function (name, context) {
    var agent = {
        found: false,
        s: navigator.userAgent.toLowerCase(),
        find: function(str){
            if (!this.found){
                this.found = (this.s.search(str) >= 0);
            }
            return this.found;
        }
    };
    return {
        isMobile: function(){
            var result = false;
            result = agent.find('nokia');
            result = agent.find('blackberry');
            result = agent.find('android');
            result = agent.find('ipad');
            result = agent.find('ipod');
            result = agent.find('iphone');
            result = agent.find('opera mini');
            result = agent.find('opera mobi');
            return result;
        }
    };
});