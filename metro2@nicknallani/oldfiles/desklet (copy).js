const St = imports.gi.St;
const Desklet = imports.ui.desklet;
const Lang = imports.lang;
const GLib = imports.gi.GLib;
const Util = imports.misc.util;
const Gettext = imports.gettext;
const Cinnamon  = imports.gi.Cinnamon;
const Mainloop  = imports.mainloop;
const Settings  = imports.ui.settings;
const Main      = imports.ui.main;
const Clutter   = imports.gi.Clutter;
const GdkPixbuf = imports.gi.GdkPixbuf;
const Cogl      = imports.gi.Cogl;
const Gio       = imports.gi.Gio;

const uuid = "metro2@nicknallani";

Gettext.bindtextdomain(uuid, GLib.get_home_dir() + "/.local/share/locale")

function _(str) {
  return Gettext.dgettext(uuid, str);
}

function MetroDesklet(metadata,desklet_id) {
    this._init(metadata,desklet_id);
}

MetroDesklet.prototype = {
    __proto__: Desklet.Desklet.prototype,

    _init: function (metadata,desklet_id) {
        Desklet.Desklet.prototype._init.call(this, metadata);

        this.metadata = metadata;
        this.uuid = this.metadata["uuid"];
        
	this.settings = new Settings.DeskletSettings(this, this.metadata["uuid"], desklet_id);
	
	this.settings.bindProperty(Settings.BindingDirection.IN, "bg-color"    , "bgcolor", this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "width"       , "width"  , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "height"      , "height" , this.on_setting_changed);
    this.settings.bindProperty(Settings.BindingDirection.IN, "radius"      , "radius" , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "padding"     , "padding" , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "issinglerow" , "issinglerow" , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "applySS"     , "applySS" , this.on_setting_changed);

	this.settings.bindProperty(Settings.BindingDirection.IN, "showtitlebar"     , "showtitlebar" , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "showtitlebaricon"     , "showtitlebaricon" , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "titletext"     , "titletext" , this.on_setting_changed);
	
	
	this.settings.bindProperty(Settings.BindingDirection.IN, "type"        , "stylestr" , this.on_setting_changed);

	this.settings.bindProperty(Settings.BindingDirection.IN, "app-cmd-1"   , "appCmd1"   , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "icon-1"      , "icon1"     , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "iconsize-1"  , "iconsize1" , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "app-cmd-1"   , "appCmd1"   , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "bg-1"        , "bg1"       , this.on_setting_changed);

	this.settings.bindProperty(Settings.BindingDirection.IN, "app-cmd-2"   , "appCmd2"   , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "icon-2"      , "icon2"     , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "iconsize-2"  , "iconsize2" , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "app-cmd-2"   , "appCmd2"   , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "bg-2"        , "bg2"       , this.on_setting_changed);
	
	this.settings.bindProperty(Settings.BindingDirection.IN, "app-cmd-3"   , "appCmd3"   , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "icon-3"      , "icon3"     , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "iconsize-3"  , "iconsize3" , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "app-cmd-3"   , "appCmd3"   , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "bg-3"        , "bg3"       , this.on_setting_changed);

	this.settings.bindProperty(Settings.BindingDirection.IN, "app-cmd-4"   , "appCmd4"   , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "icon-4"      , "icon4"     , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "iconsize-4"  , "iconsize4" , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "app-cmd-4"   , "appCmd4"   , this.on_setting_changed);
	this.settings.bindProperty(Settings.BindingDirection.IN, "bg-4"        , "bg4"       , this.on_setting_changed);
	
        
/*
      //  this._container = new St.BoxLayout({vertical:true, style_class: "MainContainer"});
  this._container = new St.BoxLayout({vertical:true});        
this._container.set_style("background-color:"+this.bgcolor+";");        
        
        this._row1 = new St.BoxLayout({style_class: "RowContainer"});

if(this.issinglerow==false)   this._row2 = new St.BoxLayout({style_class: "RowContainer"});

if(this.showtitlebar){

  if(this.showtitlebaricon){
      this._label = new St.Label({style_class: "ButtonMove"});    
  }else{
  
        this._label = new St.Label();
        this._label.setText(this.titletext);
        this._container.add(this._label);
  }
        
}        

       if(this.stylestr == "stylesheet"){
            //Pear shaped
           this._btn1 = new St.Button({style_class: "ButtonOne"});
           this._btn2 = new St.Button({style_class: "ButtonTwo"});
           this._btn3 = new St.Button({style_class: "ButtonThree"});
           this._btn4 = new St.Button({style_class: "ButtonFour"});
       }
      else if(this.stylestr == "style1"){
          
           this._btn1 = new St.Button({style_class: "Btn1"});
           this._btn2 = new St.Button({style_class: "Btn2"});
           this._btn3 = new St.Button({style_class: "Btn3"});
           this._btn4 = new St.Button({style_class: "Btn4"});
           this._btn1.set_style("height:"+this.height+"px;width:"+this.width+"px; background-color:"+this.bg1+";-moz-border-radius:"+this.radius+"px "+this.radius+"px 0 "+this.radius+"px;-webkit-border-radius:"+this.radius+"px "+this.radius+"px 0 "+this.radius+"px;border-radius:"+this.radius+"px "+this.radius+"px 0 "+this.radius+"px;display:inline-block;padding:"+this.padding+"px; border:0px solid #aba367;	background-position: 15px 15px; background-size: 32px 32px; margin-bottom: 5px;	margin-right: 5px;cursor:pointer;");
           this._btn2.set_style("height:"+this.height+"px;width:"+this.width+"px; background-color:"+this.bg2+";-moz-border-radius:"+this.radius+"px "+this.radius+"px "+this.radius+"px 0;-webkit-border-radius:"+this.radius+"px "+this.radius+"px "+this.radius+"px 0;border-radius:"+this.radius+"px "+this.radius+"px "+this.radius+"px 0;display:inline-block;padding:"+this.padding+"px; border:0px solid #aba367;	background-position: 15px 15px; background-size: 32px 32px; margin-bottom: 5px;	margin-right: 5px;cursor:pointer;");
           this._btn3.set_style("height:"+this.height+"px;width:"+this.width+"px; background-color:"+this.bg3+";-moz-border-radius:"+this.radius+"px 0px "+this.radius+"px "+this.radius+"px;-webkit-border-radius:"+this.radius+"px 0px "+this.radius+"px "+this.radius+"px;border-radius:"+this.radius+"px 0px "+this.radius+"px "+this.radius+"px;display:inline-block;padding:"+this.padding+"px; border:0px solid #aba367;background-position: 15px 15px; background-size: 32px 32px; margin-bottom: 5px;	margin-right: 5px;	cursor:pointer;");
           this._btn4.set_style("height:"+this.height+"px;width:"+this.width+"px; background-color:"+this.bg4+";-moz-border-radius:0 "+this.radius+"px "+this.radius+"px "+this.radius+"px;-webkit-border-radius:0 "+this.radius+"px "+this.radius+"px "+this.radius+"px;border-radius:0 "+this.radius+"px "+this.radius+"px "+this.radius+"px;display:inline-block;padding:"+this.padding+"px; border:0px solid #aba367;	background-position: 15px 15px; background-size: 32px 32px; margin-bottom: 5px;	margin-right: 5px;cursor:pointer;");
      }
     else if(this.stylestr == "style2"){
        this._btn1 = new St.Button();
        this._btn2 = new St.Button();
        this._btn3 = new St.Button();
        this._btn4 = new St.Button();
        var stl="height:"+this.height+"px;width:"+this.width+"px; background-color:"+this.bg1+";-moz-border-radius:"+this.radius+"px "+this.radius+"px "+this.radius+"px "+this.radius+"px;-webkit-border-radius:"+this.radius+"px "+this.radius+"px "+this.radius+"px "+this.radius+"px;border-radius:"+this.radius+"px "+this.radius+"px "+this.radius+"px "+this.radius+"px;display:inline-block;padding:"+this.padding+"px; border:0px solid #aba367;	background-position: 15px 15px; background-size: 32px 32px; margin-bottom: 5px;	margin-right: 5px;cursor:pointer;";
        //stl=".Btn1";
        this._btn1.set_style(stl);
        this._btn2.set_style(stl);
        this._btn3.set_style(stl);
        this._btn4.set_style(stl);
      
    }   
     else{
         //Squares
         if(this.applySS){
           this._btn1 = new St.Button({style_class: "Btn1"});
           this._btn2 = new St.Button({style_class: "Btn2"});
           this._btn3 = new St.Button({style_class: "Btn3"});
           this._btn4 = new St.Button({style_class: "Btn4"});
         }else{
           this._btn1 = new St.Button();
           this._btn2 = new St.Button();
           this._btn3 = new St.Button();
           this._btn4 = new St.Button();
            this._btn1.set_style('height:'+this.height+'px;width:'+this.width+'px;border:0px solid rgba(0,0,0,.9);padding:'+this.padding+'px;background-position: center;  display:block;background-color:'+this.bg1+'');
            this._btn2.set_style('height:'+this.height+'px;width:'+this.width+'px;border:0px solid rgba(0,0,0,.9);padding:'+this.padding+'px;background-position: center;  display:block;background-color:'+this.bg2+'');
            this._btn3.set_style('height:'+this.height+'px;width:'+this.width+'px;border:0px solid rgba(0,0,0,.9);padding:'+this.padding+'px;background-position: center;  display:block;background-color:'+this.bg3+'');
            this._btn4.set_style('height:'+this.height+'px;width:'+this.width+'px;border:0px solid rgba(0,0,0,.9);padding:'+this.padding+'px;background-position: center;  display:block;background-color:'+this.bg4+'');
         }
   }

        this._btn1.connect("clicked", Lang.bind(this, this._btn1ClickAction));
        this._btn2.connect("clicked", Lang.bind(this, this._btn2ClickAction));
        this._btn3.connect("clicked", Lang.bind(this, this._btn3ClickAction));
        this._btn4.connect("clicked", Lang.bind(this, this._btn4ClickAction));


        this.iconbutton1=new St.Icon({ icon_name: ''+this.icon1+'',  icon_type: St.IconType.FULLCOLOR, icon_size: ''+this.iconsize1+'' });
        this.iconbutton2=new St.Icon({ icon_name: ''+this.icon2+'',  icon_type: St.IconType.FULLCOLOR, icon_size: ''+this.iconsize2+'' });
        this.iconbutton3=new St.Icon({ icon_name: ''+this.icon3+'',  icon_type: St.IconType.FULLCOLOR, icon_size: ''+this.iconsize3+'' });
        this.iconbutton4=new St.Icon({ icon_name: ''+this.icon4+'',  icon_type: St.IconType.FULLCOLOR, icon_size: ''+this.iconsize4+'' });
        

        this._btn1.set_child(this.iconbutton1);
        this._btn2.set_child(this.iconbutton2);
        this._btn3.set_child(this.iconbutton3);
        this._btn4.set_child(this.iconbutton4);        
        
        this._row1.add(this._btn1);
        this._row1.add(this._btn2);
        

        if(this.issinglerow){
           this._row1.add(this._btn3);
           this._row1.add(this._btn4);
           this._container.add(this._row1);
        }else{
           this._container.add(this._row1);
           this._row2.add(this._btn3);
           this._row2.add(this._btn4);
           this._container.add(this._row2);        
        }

        this.setContent(this._container);
        
        */
        this.refreshDecoration();
        
         this.on_setting_changed(); 
    },
    
	on_setting_changed: function() {
		this.refreshDecoration();
	},
	
	refreshDecoration: function() {
			
       // this._container = new St.BoxLayout({vertical:true, style_class: "MainContainer"});
  this._container = new St.BoxLayout({vertical:true});        
this._container.set_style("background-color:"+this.bgcolor+";");           
        this._row1 = new St.BoxLayout({style_class: "RowContainer"});
        this._row2 = new St.BoxLayout({style_class: "RowContainer"});

      //  this._label = new St.Label({style_class: "ButtonMove"});
      //  this._container.add(this._label);
if(this.showtitlebar){

  if(this.showtitlebaricon){
      this._label = new St.Label({style_class: "ButtonMove"});    
      if(this.titletext==""){
                //do nothing
      }else{
                this._label.set_text(this.titletext);
      }
  }else{
        this._label = new St.Label();
        this._label.set_text(this.titletext);
  }
        this._container.add(this._label);        
}   

       if(this.stylestr == "stylesheet"){
           this._btn1 = new St.Button({style_class: "ButtonOne"});
           this._btn2 = new St.Button({style_class: "ButtonTwo"});
           this._btn3 = new St.Button({style_class: "ButtonThree"});
           this._btn4 = new St.Button({style_class: "ButtonFour"});
       }
   else if(this.stylestr == "style1"){
           this._btn1 = new St.Button();
           this._btn2 = new St.Button();
           this._btn3 = new St.Button();
           this._btn4 = new St.Button();
           this._btn1.set_style("height:"+this.height+"px;width:"+this.width+"px; background-color:"+this.bg1+";-moz-border-radius:"+this.radius+"px "+this.radius+"px 0 "+this.radius+"px;-webkit-border-radius:"+this.radius+"px "+this.radius+"px 0 "+this.radius+"px;border-radius:"+this.radius+"px "+this.radius+"px 0 "+this.radius+"px;display:inline-block;padding:"+this.padding+"px; border:0px solid #aba367;	background-position: 15px 15px; background-size: 32px 32px; margin-bottom: 5px;	margin-right: 5px;cursor:pointer;");
           this._btn2.set_style("height:"+this.height+"px;width:"+this.width+"px; background-color:"+this.bg2+";-moz-border-radius:"+this.radius+"px "+this.radius+"px "+this.radius+"px 0;-webkit-border-radius:"+this.radius+"px "+this.radius+"px "+this.radius+"px 0;border-radius:"+this.radius+"px "+this.radius+"px "+this.radius+"px 0;display:inline-block;padding:"+this.padding+"px; border:0px solid #aba367;	background-position: 15px 15px; background-size: 32px 32px; margin-bottom: 5px;	margin-right: 5px;cursor:pointer;");
           this._btn3.set_style("height:"+this.height+"px;width:"+this.width+"px; background-color:"+this.bg3+";-moz-border-radius:"+this.radius+"px 0px "+this.radius+"px "+this.radius+"px;-webkit-border-radius:"+this.radius+"px 0px "+this.radius+"px "+this.radius+"px;border-radius:"+this.radius+"px 0px "+this.radius+"px "+this.radius+"px;display:inline-block;padding:"+this.padding+"px; border:0px solid #aba367;background-position: 15px 15px; background-size: 32px 32px; margin-bottom: 5px;	margin-right: 5px;	cursor:pointer;");
           this._btn4.set_style("height:"+this.height+"px;width:"+this.width+"px; background-color:"+this.bg4+";-moz-border-radius:0 "+this.radius+"px "+this.radius+"px "+this.radius+"px;-webkit-border-radius:0 "+this.radius+"px "+this.radius+"px "+this.radius+"px;border-radius:0 "+this.radius+"px "+this.radius+"px "+this.radius+"px;display:inline-block;padding:"+this.padding+"px; border:0px solid #aba367;	background-position: 15px 15px; background-size: 32px 32px; margin-bottom: 5px;	margin-right: 5px;cursor:pointer;");
   }
   else if(this.stylestr == "style2"){
        this._btn1 = new St.Button();
        this._btn2 = new St.Button();
        this._btn3 = new St.Button();
        this._btn4 = new St.Button();
        var stl="height:"+this.height+"px;width:"+this.width+"px; background-color:"+this.bg1+";-moz-border-radius:"+this.radius+"px "+this.radius+"px "+this.radius+"px "+this.radius+"px;-webkit-border-radius:"+this.radius+"px "+this.radius+"px "+this.radius+"px "+this.radius+"px;border-radius:"+this.radius+"px "+this.radius+"px "+this.radius+"px "+this.radius+"px;display:inline-block;padding:"+this.padding+"px; border:0px solid #aba367;	background-position: 15px 15px; background-size: 32px 32px; margin-bottom: 5px;	margin-right: 5px;cursor:pointer;";
        //stl=".Btn1";
        this._btn1.set_style(stl);
        this._btn2.set_style(stl);
        this._btn3.set_style(stl);
        this._btn4.set_style(stl);
      
   }   
   else{
         if(this.applySS){
           this._btn1 = new St.Button({style_class: "Btn1"});
           this._btn2 = new St.Button({style_class: "Btn2"});
           this._btn3 = new St.Button({style_class: "Btn3"});
           this._btn4 = new St.Button({style_class: "Btn4"});
         }else{
           this._btn1 = new St.Button();
           this._btn2 = new St.Button();
           this._btn3 = new St.Button();
           this._btn4 = new St.Button();
            this._btn1.set_style('height:'+this.height+'px;width:'+this.width+'px;border:0px solid rgba(0,0,0,.9);padding:'+this.padding+'px;background-position: center;  display:block;background-color:'+this.bg1+'');
            this._btn2.set_style('height:'+this.height+'px;width:'+this.width+'px;border:0px solid rgba(0,0,0,.9);padding:'+this.padding+'px;background-position: center;  display:block;background-color:'+this.bg2+'');
            this._btn3.set_style('height:'+this.height+'px;width:'+this.width+'px;border:0px solid rgba(0,0,0,.9);padding:'+this.padding+'px;background-position: center;  display:block;background-color:'+this.bg3+'');
            this._btn4.set_style('height:'+this.height+'px;width:'+this.width+'px;border:0px solid rgba(0,0,0,.9);padding:'+this.padding+'px;background-position: center;  display:block;background-color:'+this.bg4+'');
         }
       }

        this._btn1.connect("clicked", Lang.bind(this, this._btn1ClickAction));
        this._btn2.connect("clicked", Lang.bind(this, this._btn2ClickAction));
        this._btn3.connect("clicked", Lang.bind(this, this._btn3ClickAction));
        this._btn4.connect("clicked", Lang.bind(this, this._btn4ClickAction));




        this.iconbutton1=new St.Icon({ icon_name: ''+this.icon1+'',  icon_type: St.IconType.FULLCOLOR, icon_size: ''+this.iconsize1+'' });
        this.iconbutton2=new St.Icon({ icon_name: ''+this.icon2+'',  icon_type: St.IconType.FULLCOLOR, icon_size: ''+this.iconsize2+'' });
        this.iconbutton3=new St.Icon({ icon_name: ''+this.icon3+'',  icon_type: St.IconType.FULLCOLOR, icon_size: ''+this.iconsize3+'' });
        this.iconbutton4=new St.Icon({ icon_name: ''+this.icon4+'',  icon_type: St.IconType.FULLCOLOR, icon_size: ''+this.iconsize4+'' });
        

        this._btn1.set_child(this.iconbutton1);
        this._btn2.set_child(this.iconbutton2);
        this._btn3.set_child(this.iconbutton3);
        this._btn4.set_child(this.iconbutton4);        
        
        this._row1.add(this._btn1);
        this._row1.add(this._btn2);
        

        if(this.issinglerow){
           this._row1.add(this._btn3);
           this._row1.add(this._btn4);
           this._container.add(this._row1);
        }else{
           this._container.add(this._row1);
           this._row2.add(this._btn3);
           this._row2.add(this._btn4);
           this._container.add(this._row2);        
        }


        this.setContent(this._container);
  
		this._updateDecoration();
	},

    _btn1ClickAction: function () {
        Util.spawnCommandLine(this.appCmd1);
    },

    _btn2ClickAction: function () {
        Util.spawnCommandLine(this.appCmd2);
    },

    _btn3ClickAction: function () {
        Util.spawnCommandLine(this.appCmd3);
    },

    _btn4ClickAction: function () {
        Util.spawnCommandLine(this.appCmd3);
    }
}

function main(metadata, desklet_id) {
    let desklet = new MetroDesklet(metadata, desklet_id);
    return desklet;
}
