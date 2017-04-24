function _(id) {
  return document.getElementById(id);
}

var f = _("f");

var gCurrentFile = null;
var gCurrentFrame;

function get_files() {
 // get the list of frame directories
 window.fetch("..").then((r) => {
   if (!r.ok) {
     alert("Failed to fetch directory listing");
     return undefined;
   }
   return r.text();
 }).then((t) => {
   var r = new RegExp('<a href="([^"]+)\\.frames/">', 'g');
   var m;
   var s = _("video-file");
   s.innerHTML = '<option value="">(none)</option>';
   while ((m = r.exec(t)) !== null) {
     var filename = m[1];
     var o = document.createElement("option");
     o.value = filename;
     o.textContent = unescape(filename);
     s.appendChild(o);
   }
 });
}
get_files();
_("refresh-files").addEventListener("click", get_files);

_("video-file").addEventListener("change", function() {
  if (this.value == "") {
    gCurrentFile = null;
    f.removeAttribute("src");
    _("framecounter").classList.add("hidden");
  } else {
    gCurrentFile = this.value;
    gCurrentFrame = 1;
    setFrame();
  }
});

f.addEventListener("load", function() {
  var frameno = /frame(\d+).jpg/.exec(this.src)[1];
  _("frameno").textContent = frameno;

  _("framecounter").classList.remove("hidden");
});
f.addEventListener("error", function() {
  var frameno = /frame(\d+).jpg/.exec(this.src)[1];
  _("frameno").textContent = frameno + " (not found)";
});

function setFrame() {
  var url = "../" + gCurrentFile + ".frames/frame" + gCurrentFrame + ".jpg";
  f.src = url;
}

function go(d) {
  gCurrentFrame += d;
  if (gCurrentFrame < 1) {
    gCurrentFrame = 1;
  }
  setFrame();
}

_("controls").addEventListener("click", function(e) {
  if (!(e.originalTarget instanceof HTMLButtonElement)) {
    return;
  }
  switch (e.originalTarget.id) {
  case "wayback":
    go(-120);
  case "skipback":
    go(-15);
    break;
  case "backone":
    go(-1);
    break;
  case "fwdone":
    go(1);
    break;
  case "skipfwd":
    go(15);
    break;
  case "wayfwd":
    go(120);
    break;
  case "inputframe":
  case "go":
    var f = parseInt(_("inputframe").value);
    if (!isNaN(f) && f > 0) {
      gCurrentFrame = f;
      setFrame();
    }
    break;
  default:
    console.error("unexpected click event", e.originalTarget);
  }
});
