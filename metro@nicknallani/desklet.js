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
const uuid      = "metro@nicknallani";

Gettext.bindtextdomain(uuid, GLib.get_home_dir() + "/.local/share/locale")

function _(str) {
  return Gettext.dgettext(uuid, str);
}

function MetroTileDesklet(metadata,desklet_id) {
    this._init(metadata,desklet_id);
}

MetroTileDesklet.prototype = {
    __proto__: Desklet.Desklet.prototype,

    _init: function (metadata,desklet_id) {
        Desklet.Desklet.prototype._init.call(this, metadata);

        this.metadata = metadata;
        this.uuid = this.metadata["uuid"];
    
	this.settings = new Settings.DeskletSettings(this, this.metadata["uuid"], desklet_id);
	
	//this.settings.bindProperty(Settings.BindingDirection.IN, "file"    , "file", this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "app-cmd"      , "appCmd"     , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "tile-title"   , "tileTitle"  , this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "bg-color"     , "bgcolor"    , this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "height"       , "height"     , this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "width"        , "width"      , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "btn-brdr-clr" , "btnbrdrclr" , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "btn-brdr-wdt" , "btnbrdrwdt" , this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "radius"       , "radius"     , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "padding"      , "padding"    , this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "icon"         , "icon"       , this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "iconsize"     , "iconsize"   , this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "title-color"  , "titleColor" , this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "title-font"   , "fontsize"   , this.on_setting_changed);
    
     try{    
		this.appCmd = this.appCmd.replace("file://","");
     }catch(e){
        
     }
 
        this.on_setting_changed();     
                
    },
	on_setting_changed: function() {
		this.refreshDecoration();
	},
	
  
	refreshDecoration: function() {
	   try{
		this.appCmd = this.appCmd.replace("file://","");
	   }catch(e){
	   }
	    
        this._container = new St.BoxLayout({vertical:true});        
        this._container.set_style("background-color:"+this.bgcolor+";background-image: linear-gradient("+this.bgcolor+", yellow);height:"+this.height+"px;width:"+this.width+"px;border:"+this.btnbrdrwdt+"px solid "+this.btnbrdrclr+";-moz-border-radius:"+this.radius+"px "+this.radius+"px "+this.radius+"px "+this.radius+"px;-webkit-border-radius:"+this.radius+"px "+this.radius+"px "+this.radius+"px "+this.radius+"px;border-radius:"+this.radius+"px "+this.radius+"px "+this.radius+"px "+this.radius+"px;display:inline-block;padding:"+this.padding+"px; ");           
	    
        this._str = new St.Label({style_class:"titletext"});
        
        this._str.set_text(this.tileTitle);
        
		this._str.style = "background-color:"+this.bgcolor+";text-align:center;font-size:"+this.fontsize+"px;color:" + this.titleColor + ";";

        
        this._btn = new St.Button();
        this._lastClickedTimestamp = new Date() - 10000;
        this._btn.connect("clicked", Lang.bind(this, this._clicked));
        
        this._btn.set_style('border:2px solid '+this.bgcolor+';vertical-align:middle;background-position: center;  display:block;background-color:'+this.bgcolor+'height:'+this.height+'px;width:'+this.width+'px;');
       
        
        this.iconbutton=new St.Icon({ icon_name: ''+this.icon+'',  icon_type: St.IconType.FULLCOLOR, icon_size: ''+this.iconsize+''});

        if(this.tileTitle!="") {
          this._container.add(this._str);
        }
        
        this._btn.set_child(this.iconbutton);
        this._container.add(this._btn);
        this.setContent(this._container);
        
		this._updateDecoration();
	},
    
    _clicked: function () {
            Util.spawnCommandLine(this.appCmd);
    }
}

function main(metadata, desklet_id) {
    let desklet = new MetroTileDesklet(metadata, desklet_id);
    return desklet;
}

