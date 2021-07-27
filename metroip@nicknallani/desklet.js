const Desklet = imports.ui.desklet;
const St = imports.gi.St;
const Soup = imports.gi.Soup;
const Util = imports.misc.util;
const Lang = imports.lang;
const GLib = imports.gi.GLib;
const Mainloop = imports.mainloop;
const uuid     = "metroip@nicknallani";

const _httpSession = new Soup.SessionAsync();
_httpSession.timeout = 5;

Soup.Session.prototype.add_feature.call(_httpSession, new Soup.ProxyResolverDefault());

function remoteiptile(metadata, deskletId) {
    this._init(metadata, deskletId);
}

remoteiptile.prototype = {
    __proto__: Desklet.Desklet.prototype,

    _init: function(metadata, deskletId) {
        Desklet.Desklet.prototype._init.call(this, metadata, deskletId);
        this.configFile = GLib.get_home_dir() + "/.local/share/cinnamon/desklets/metroip@nicknallani/metadata.json";
        this._menu.addAction("Edit Config", Lang.bind(this, function() {
            Util.spawnCommandLine("xdg-open " + this.configFile);
        }));
 this.urlstr = metadata["url"];
 this.stylestr = metadata["styles"];
        this.window = new St.Bin();
        this.text = new St.Label();
        this.text.style = this.stylestr;
        //"font-size: " + metadata["font-size"];
        this.text.set_text(this.urlstr);
        this.window.add_actor(this.text);
        this.setContent(this.window);

        this._update_ip();
    },
    _tick: function() {
        this._update_ip();
        this.timeout = Mainloop.timeout_add_seconds(60, this._tick.bind(this));
    },
    _update_ip: function() {
        var that = this;
        let message = Soup.Message.new("GET", this.urlstr);
        _httpSession.queue_message(message, function(session, message) {
            if (message.status_code === 200) {
                let ip = message.response_body.data.toString();
                that.text.set_text(ip);
            } else {
                that.text.set_text("");
            }
        });
    },
    on_desklet_clicked: function(event) {
        this.text.set_text("Getting data...");
        this._update_ip();
    },
    on_desklet_removed: function() {
        Mainloop.source_remove(this.timeout);
    }
};

function main(metadata, deskletId) {
    return new remoteiptile(metadata, deskletId);
}
