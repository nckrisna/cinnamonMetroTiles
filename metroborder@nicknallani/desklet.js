const St        = imports.gi.St;
const Desklet   = imports.ui.desklet;
const Lang      = imports.lang;
const GLib      = imports.gi.GLib;
const Util      = imports.misc.util;
const Gettext   = imports.gettext;
const Cinnamon  = imports.gi.Cinnamon;
const Mainloop  = imports.mainloop;
const Settings  = imports.ui.settings;
const Main      = imports.ui.main;
const Clutter   = imports.gi.Clutter;
const GdkPixbuf = imports.gi.GdkPixbuf;
const Cogl      = imports.gi.Cogl;
const Gio       = imports.gi.Gio;
const uuid      = "metroborder@nicknallani";

const DESKLET_ROOT = imports.ui.deskletManager.deskletMeta[uuid].path;

Gettext.bindtextdomain(uuid, GLib.get_home_dir() + "/.local/share/locale")

function _(str) {
  return Gettext.dgettext(uuid, str);
}

function MetroBorderDesklet(metadata,desklet_id) {
    this._init(metadata,desklet_id);
}

MetroBorderDesklet.prototype = {
    __proto__: Desklet.Desklet.prototype,

    _init: function (metadata,desklet_id) {
        Desklet.Desklet.prototype._init.call(this, metadata);

        this.metadata = metadata;
        this.uuid = this.metadata["uuid"];

	this.settings = new Settings.DeskletSettings(this, this.metadata["uuid"], desklet_id);
	
	this.settings.bindProperty(Settings.BindingDirection.IN, "tile-title", "tileTitle", this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "border-color", "bordercolor", this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "borderwidth", "borderwidth", this.on_setting_changed);
    
    this.settings.bindProperty(Settings.BindingDirection.IN, "height", "height", this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "width", "width", this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "title-color", "titleColor", this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "title-font", "fontsize", this.on_setting_changed);
    

this.refreshDecoration();
        this.on_setting_changed();     
                
    },

	on_setting_changed: function() {
		this.refreshDecoration();
	},
	
  
	refreshDecoration: function() {
	    this._container = new St.BoxLayout({vertical: true});
        this._container.set_style('width:'+this.width+'px; height:'+this.height+'px;border: '+this.borderwidth+'px solid ' + this.bordercolor + ';padding:20px;');

        this._str = new St.Label({style_class:"notetext"});
        
        this._str.set_text(this.tileTitle);
        
		//this._str.style = "background-color:"+this.bordercolor+";text-align:center;font-size:"+this.fontsize+"px;color:" + this.titleColor + ";";
		this._str.style = "text-align:center;font-size:"+this.fontsize+"px;color:" + this.titleColor + ";";
								//+ "font-weight:" + (this.fontBold ? "bold" : "normal") + ";"
								//+ "font-style:" + (this.fontItalic ? "italic" : "normal") + ";";

        
        this._container.add(this._str);
        
        this.setContent(this._container);				
  
		this._updateDecoration();
	},
	    
    _hover:function(){
    },
    _clicked: function () {
    }
}

function main(metadata, desklet_id) {
    let desklet = new MetroBorderDesklet(metadata, desklet_id);
    return desklet;
}

