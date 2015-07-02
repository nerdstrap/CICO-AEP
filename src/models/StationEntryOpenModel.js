
define(function(require){
    var Backbone = require('backbone');
    
    var StationEntryOpenModel = Backbone.Model.extend({
        set: function(attributes, options) { 
            var currentContext = this;
//            this.stopListening();
            var result = Backbone.Model.prototype.set.call(this, attributes, options);
            if (this.get('currentCheckIn')){
                this.listenTo(this.get('currentCheckIn'), 'durationExpiredMax', function(){
                    currentContext.trigger('durationExpiredMax');
                });
            }
            if(this.get('station')){
                this.listenTo(this.get('station'), 'sync', function(){
                    this.trigger('sync');
                });
            }
            return Backbone.Model.prototype.set.call(this, attributes, options);
        }        
    });
    return StationEntryOpenModel;
});