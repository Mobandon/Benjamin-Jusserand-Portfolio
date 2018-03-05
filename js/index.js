var SITE_TRAD = [{
  home: 'Presentation',
  bien: 'Bienvenue',
  comp: 'Competences',
  zic: 'Musique',
  legal: 'Mentions legales',
  contrast: 'Contraste',
  help: 'Aide',
  contact: 'Contactez-moi!',
  lang: '<i class="fas fa-language mr1"></i>'
},
{
  home: 'Who I am',
  bien: 'Welcome',
  comp: 'Skills',
  zic: 'Music',
  legal: 'Legal mentions',
  contrast: 'Contrast',
  help: 'Help',
  contact: 'Contact me!',
  lang: '<i class="fas fa-language mr1"></i>'
}];

var currentlang = 0;

var eventHub = new Vue({
  data: {
    cachedWindow: null,
  }
});


var SITE_TEMPLATE = [{
  Welcome: {template: '#welcome-templateFR'},
  Home: {template: '#home-templateFR'},
  Writing: {template: '#writing-templateFR'},
  Merge: {template: '#merge-templateFR'},
  Mentions: {template: '#mentions-templateFR'}
},
{
  Welcome: {template: '#welcome-templateEN'},
  Home: {template: '#home-templateEN'},
  Writing: {template: '#writing-templateEN'},
  Merge: {template: '#merge-templateEN'},
  Mentions: {template: '#mentions-templateEN'}
}];

var triggerMouseEvent = function triggerMouseEvent(node, eventType) {
  var clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
};

var SITE_CONTENT = [];

SITE_CONTENT[0] = [{
  content: 'Im the welcome window',
  title: 'Bienvenue',
  id: 'welcome',
  isShowing: true,
  comp: SITE_TEMPLATE[0].Welcome
}, {
  content: 'Im the home window',
  title: 'Presentation',
  id: 'home',
  isShowing: false,
  comp: SITE_TEMPLATE[0].Home
}, {
  content: 'Im the writing window',
  title: 'Game dev',
  id: 'writing',
  isShowing: false,
  comp: SITE_TEMPLATE[0].Writing
},{
  content: 'Im the merge window',
  title: 'Merge paradigm',
  id: 'merge',
  isShowing: false,
  comp: SITE_TEMPLATE[0].Merge
},{
  content: 'Im the mentions window',
  title: 'Mentions légales',
  id: 'mentions',
  isShowing: false,
  comp: SITE_TEMPLATE[0].Mentions
}];

//EN
SITE_CONTENT[1] = [{
  content: 'Im the welcome window',
  title: 'Welcome',
  id: 'welcome',
  isShowing: true,
  comp: SITE_TEMPLATE[1].Welcome
}, {
  content: 'Im the home window',
  title: 'Presentation',
  id: 'home',
  isShowing: false,
  comp: SITE_TEMPLATE[1].Home
}, {
  content: 'Im the writing window',
  title: 'Game dev',
  id: 'writing',
  isShowing: false,
  comp: SITE_TEMPLATE[1].Writing
},{
  content: 'Im the merge window',
  title: 'Merge paradigm',
  id: 'merge',
  isShowing: false,
  comp: SITE_TEMPLATE[1].Merge
},{
  content: 'Im the mentions window',
  title: 'Legal',
  id: 'mentions',
  isShowing: false,
  comp: SITE_TEMPLATE[1].Mentions
}];

Vue.component('draggable-window', {
  template: '#draggable-window',
  props: ['id', 'title', 'content'],
  data: function(){
    return{draggable: null,texto: "hey"};
  },
  methods: {
    closeWindow: function closeWindow() {
      eventHub.$emit('close-window', this.$el);
    }
  },
  mounted: function mounted() {
    var id = '#' + this.$el.id;
    var title = this.title;
    var x = 0,
        y = 0;

    if (eventHub.cachedWindow && document.getElementById(eventHub.cachedWindow)) {
      var windowEl = document.getElementById(eventHub.cachedWindow);
      x = windowEl.getBoundingClientRect().left + 15;
      y = windowEl.getBoundingClientRect().top + 15;
    }

    TweenLite.set(id, {
      x: x,
      y: y
    });

    this.draggable = Draggable.create(id, {
      type: "x,y",
      edgeResistance: 0.65,
      bounds: ".restrictor",
      onPress: function onPress() {
        eventHub.$emit('window-focused', title);
      }
    });


    triggerMouseEvent(this.$el, 'mousedown');
    triggerMouseEvent(this.$el, 'mouseup');

    eventHub.cachedWindow = this.$el.id;
  }
});

new Vue({
  el: '#desktop',
  data: {
      windows: SITE_CONTENT[currentlang],
      activeWindowTitle: 'MobOS',
      texto: SITE_TRAD[currentlang]
  },
  created: function created() {
    eventHub.$on('close-window', this.closeWindow);
    eventHub.$on('window-focused', this.focusWindow);
  },
  methods: {
    closeWindow: function closeWindow(element) {
      var match = _.find(this.windows, {
        id: element.id
      });
      match.isShowing = false;

      var closedWindowCount = _.chain(this.windows).filter({
        isShowing: false
      }).size().value();

      if (closedWindowCount === SITE_CONTENT.length) {
        this.focusWindow('mobOS');
      }
    },
    focusWindow: function focusWindow(title) {
      this.activeWindowTitle = title;
    },
    openWindow: function openWindow(category) {
      var match = _.find(this.windows, {
        id: category
      });
      if (match.isShowing) {
        var el = document.getElementById(match.id);
        triggerMouseEvent(el, 'mousedown');
        triggerMouseEvent(el, 'mouseup');
      } else {
        match.isShowing = true;
      }
    },
    changelang: function changelang(choix) {
      console.log(currentlang);
      currentlang = choix;
      this.texto = SITE_TRAD[currentlang];
      this.windows = SITE_CONTENT[currentlang];
    },
    switchlang: function switchlang(){
      
      if (currentlang == 0) {this.changelang(1); return}
      if (currentlang == 1) {this.changelang(0); return}
    },
  }
});