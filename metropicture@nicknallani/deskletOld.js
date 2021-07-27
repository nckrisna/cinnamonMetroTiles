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

const DESKLET_ROOT = imports.ui.deskletManager.deskletMeta[uuid].path;

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
	
	this.settings.bindProperty(Settings.BindingDirection.IN, "file"    , "file", this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "app-cmd", "appCmd", this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "tile-title", "tileTitle", this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "bg-color", "bgcolor", this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "height", "height", this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "width", "width", this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "icon", "icon", this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "iconsize", "iconsize", this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "title-color", "titleColor", this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "title-font", "fontsize", this.on_setting_changed);
    
				
	    this._container = new St.BoxLayout({vertical: true});
        this._container.set_style('width:'+this.width+'px; height:'+this.height+'px;background-color:'+this.bgcolor+';border: 5px solid ' + this.bgcolor + ';padding:0px;');

        this._str = new St.Label({style_class:"notetext"});
        
        this._str.set_text(this.tileTitle);
        
        //this._str.set_style('color:rgb(255,255,255);text-align:center;background-color:#000000');
		this._str.style = "background-color:"+this.bgcolor+";text-align:center;font-size:"+this.fontsize+"px;color:" + this.titleColor + ";";
								//+ "font-weight:" + (this.fontBold ? "bold" : "normal") + ";"
								//+ "font-style:" + (this.fontItalic ? "italic" : "normal") + ";";

        
        this._btn = new St.Button();
        this._lastClickedTimestamp = new Date() - 10000;
        this._btn.connect("clicked", Lang.bind(this, this._clicked));
        this._btn.set_style('border:2px solid '+this.bgcolor+';background-position: center;  display:block;background-color:'+this.bgcolor+'');
       
        
        this.iconbutton=new St.Icon({ icon_name: ''+this.icon+'',  icon_type: St.IconType.FULLCOLOR, icon_size: ''+this.iconsize+''});


        if(this.tileTitle!="") {
          this._container.add(this._str);
//          this._btn.set_child(this._str);
        }
        
        this._btn.set_child(this.iconbutton);

        this._container.add(this._btn);
        
        this.setContent(this._container);

        this.on_setting_changed();     
                
    },

	on_setting_changed: function() {
		this.refreshDecoration();
	},
	
  
	refreshDecoration: function() {
			
    this._container = new St.BoxLayout({vertical: true});
        this._container.set_style('width:'+this.width+'px; height:'+this.height+'px;background-color:'+this.bgcolor+';border: 5px solid ' + this.bgcolor + ';padding:0px;');

        this._str = new St.Label({style_class:"notetext"});
        this._str.set_text(this.tileTitle);
        //this._str.set_style('color:rgb(255,255,255);text-align:center;background-color:#000000');
        this._str.style = "background-color:"+this.bgcolor+";text-align:center;font-size:"+this.fontsize+"px;color:" + this.titleColor + ";";
		//this._str.style = "font-size:12px;color:rgb(255,255,255)";
        
        this._btn = new St.Button();
        this._lastClickedTimestamp = new Date() - 10000;
        this._btn.connect("clicked", Lang.bind(this, this._clicked));
        this._btn.set_style('border:2px solid '+this.bgcolor+';background-position: center;  display:block;background-color:'+this.bgcolor+'');
       
        
        this.iconbutton=new St.Icon({ icon_name: ''+this.icon+'',  icon_type: St.IconType.FULLCOLOR, icon_size: ''+this.iconsize+'' });

        if(this.tileTitle!="") {
         // this._btn.set_child(this._str);
            this._container.add(this._str);
        }

        this._btn.set_child(this.iconbutton);
        

        this._container.add(this._btn);
        
        this.setContent(this._container);
				
  //----------------------------
  
		this._updateDecoration();
	},
	    
    _hover:function(){
            this._btn.set_style('color:rgb(255,255,255);background-position: 0px 0px; width:'+this.width+'px; height:'+this.height+'px; display:block;background-color:'+this.metadata["hovercolor"]+'');
    },
    _clicked: function () {
        let clickedTimestamp = new Date();
        if (clickedTimestamp - this._lastClickedTimestamp > 250) {
            this._lastClickedTimestamp = clickedTimestamp;
            return;
        }
      //  try{
      //              Util.spawnCommandLine("xdg-open " + this.appCmd);
       //  }catch( e){}
        try{
        Util.spawnCommandLine(this.appCmd);
        }
        catch( e){
        }
    }
}

function main(metadata, desklet_id) {
    let desklet = new MetroTileDesklet(metadata, desklet_id);
    return desklet;
}

