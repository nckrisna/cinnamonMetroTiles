const Gio      = imports.gi.Gio;
const St       = imports.gi.St;

const Desklet  = imports.ui.desklet;

const Lang     = imports.lang;
const Mainloop = imports.mainloop;
const GLib     = imports.gi.GLib;
const Gettext  = imports.gettext;
const UUID     = "metroclock@nicknallani";

const Util      = imports.misc.util;
const Cinnamon  = imports.gi.Cinnamon;
const Settings  = imports.ui.settings;
const Main      = imports.ui.main;

// l10n/translation support

Gettext.bindtextdomain(UUID, GLib.get_home_dir() + "/.local/share/locale")

function _(str) {
  return Gettext.dgettext(UUID, str);
}

function MetroClockDesklet(metadata){
    this._init(metadata);
}

MetroClockDesklet.prototype = {
    __proto__: Desklet.Desklet.prototype,

    _init: function(metadata){
        Desklet.Desklet.prototype._init.call(this, metadata);
        
	this.settings = new Settings.DeskletSettings(this, this.metadata["uuid"]);
	
	this.settings.bindProperty(Settings.BindingDirection.IN, "tile-title"   , "tileTitle"  , this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "title-color"  , "titleColor" , this.on_setting_changed);

    this.settings.bindProperty(Settings.BindingDirection.IN, "title-font"   , "fontsize"   , this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "font"         , "fontname"   , this.on_setting_changed);

    this.settings.bindProperty(Settings.BindingDirection.IN, "bg-color"     , "bgcolor"    , this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "height"       , "height"     , this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "width"        , "width"      , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "btn-brdr-clr" , "btnbrdrclr" , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "btn-brdr-wdt" , "btnbrdrwdt" , this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "radius"       , "radius"     , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "padding"      , "padding"    , this.on_setting_changed);
    
            
       // this._clockContainer = new St.BoxLayout({vertical:true, style_class: 'clock-container'});

        //this._dateSettings = new Gio.Settings({schema: 'org.cinnamon.desklets.clock'});
        //this._dateSettings.connect("changed::font-size", Lang.bind(this, this._onFontSizeChanged));
        //this._onFontSizeChanged();
        this.on_setting_changed(); 
        this._updateDate();
    },
	on_setting_changed: function() {
		this._updateDate();
		
	},
    //_onFontSizeChanged: function(){
        //this._date.style="font-size: " + this._dateSettings.get_int("font-size") + "pt";
    //},
        
    on_desklet_removed: function() {
	Mainloop.source_remove(this.timeout);
    },

    _updateDate: function() {
    
        this._clockContainer = new St.BoxLayout({vertical:true});        
        this._clockContainer.set_style("background-color:"+this.bgcolor+";background-image: linear-gradient("+this.bgcolor+", yellow);height:"+this.height+"px;width:"+this.width+"px;border:"+this.btnbrdrwdt+"px solid "+this.btnbrdrclr+";-moz-border-radius:"+this.radius+"px "+this.radius+"px "+this.radius+"px "+this.radius+"px;-webkit-border-radius:"+this.radius+"px "+this.radius+"px "+this.radius+"px "+this.radius+"px;border-radius:"+this.radius+"px "+this.radius+"px "+this.radius+"px "+this.radius+"px;display:inline-block;padding:"+this.padding+"px; ");           

        let fontdata = getfontinfo(this.fontname);
        this._fontname =  fontdata.name;
        this._fontsize =  fontdata.size;
        this._fontweight =  fontdata.weight;
        this._fontstyle =  fontdata.style;
        

        this.dt_styl = "color:"+this.titleColor+";font-family: " + this._fontname + ";" + "font-size: " + this._fontsize + "pt;font-weight:"+this._fontweight+";font-style:" + this._fontstyle + ";";
        

        this.hr_styl = "color:"+this.titleColor+";font-family: " + this._fontname + ";" + "font-size: 50pt;font-weight:"+this._fontweight+";font-style:" + this._fontstyle + ";";

        this.mn_styl = "color:"+this.titleColor+";font-family: " + this._fontname + ";" + "font-size: 25pt;font-weight:"+this._fontweight+";font-style:" + this._fontstyle + ";";

        this.ss_styl = "color:"+this.titleColor+";font-family: " + this._fontname + ";" + "font-size:10pt;font-weight:"+this._fontweight+";font-style:" + this._fontstyle + ";";
        
//        this.hr_styl = "color:"+this.titleColor+";font-size:50pt";
//        this.mn_styl = "color:"+this.titleColor+";font-size:25pt";
//        this.ss_styl = "color:"+this.titleColor+";font-size:10pt";
//        
        this._hourContainer =  new St.BoxLayout({vertical:false});
        this._dateContainer =  new St.BoxLayout({vertical:false});
        
        this._dateContainer.style = "color:"+this.titleColor+";font-size:15pt;text-align: right";

        this._hour = new St.Label();
        this._min  = new St.Label();
        this._sec  = new St.Label();
        this._date = new St.Label();
        
this._hour.style = this.hr_styl;
this._min.style = this.mn_styl;
this._sec.style = this.ss_styl;
this._date.style = this.dt_styl;

        this._hourContainer.add(this._hour);
        this._hourContainer.add(this._min);
        this._hourContainer.add(this._sec);
        this._dateContainer.add(this._date);
        this._clockContainer.add(this._hourContainer);
        this._clockContainer.add(this._dateContainer);
        this.setContent(this._clockContainer);
        this.setHeader(_("Clock"));
        
       let hourFormat = "%H";
       let minFormat = "%M";
       let secFormat = "%S";
       let locale = GLib.getenv("LANG");
       if (locale) {
           // convert $LANG from format "en_GB.UTF-8" to "en-GB"
           locale = GLib.getenv("LANG").replace(/_/g, "-").replace(/\..+/, "");
       } else {
           // fallback locale
           locale = "en-US";
       }
       let displayDate = new Date();
       this._hour.set_text(displayDate.toLocaleFormat(hourFormat));
       this._min.set_text(displayDate.toLocaleFormat(minFormat));
       this._sec.set_text(displayDate.toLocaleFormat(secFormat));
       this._date.set_text(displayDate.toLocaleDateString(locale, {
           day: "numeric",
           month: "long",
           weekday: "long"
        }));
       this.timeout = Mainloop.timeout_add_seconds(1, Lang.bind(this, this._updateDate));
    }
}
 function getfontinfo(fontname){
        let fontSplitted = fontname.split(" ");
        let size = fontSplitted.pop();
        let name = fontSplitted.join(" "); 
        let weight =400;
        let style = "normal";

        if (name.toLowerCase().includes("ultra-light") || name.toLowerCase().includes("extra-light")) { weight=100;}
        if (name.toLowerCase().includes("light") || name.toLowerCase().includes("thin")) { weight=200;}
        if (name.toLowerCase().includes("book") || name.toLowerCase().includes("demi")) { weight=300;}
        if (name.toLowerCase().includes("normal") || name.toLowerCase().includes("regular")) { weight=400;}
        if (name.toLowerCase().includes("medium") ) { weight=500;}
        if (name.toLowerCase().includes("semibold") || name.toLowerCase().includes("demibold")) { weight=600;}
        if (name.toLowerCase().includes(" bold") ) { weight=700;}
        if (name.toLowerCase().includes("black") || name.toLowerCase().includes("extra-bold") || name.toLowerCase().includes("heavy")) { weight=800;}
        if (name.toLowerCase().includes("extra-black") || name.toLowerCase().includes("fat")|| name.toLowerCase().includes("poster") || name.toLowerCase().includes("ultra-black")) { weight=900;}

        if (name.toLowerCase().includes("italic")){style="italic"} 
        if (name.toLowerCase().includes("oblique")){style="oblique"} 


        
        return {
            name,
            size,
            weight,
            style
        };
 }

function main(metadata, desklet_id){
    let desklet = new MetroClockDesklet(metadata, desklet_id);
    return desklet;
}
