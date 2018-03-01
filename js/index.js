var eventHub = new Vue({
  data: {
    cachedWindow: null
  }
});

var Welcome = {
  template: '#welcome-template'
};

var Home = {
  template: '#home-template'
};

var Writing = {
  template: '#writing-template'
};

var Merge = {
  template: '#merge-template'
};

var Mensions = {
  template: '#mensions-template'
};

var Calendar = {
  template: '#calendar-template',
  mounted: function mounted() {
    new Countdown({
      selector: '#timeLeft',
      dateEnd: new Date('Nov 3, 2020 18:00:00'),
      msgPattern: '{days} days, {hours} hours, {minutes} minutes, {seconds} seconds!'
    });
  }
};

var triggerMouseEvent = function triggerMouseEvent(node, eventType) {
  var clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
};

var SITE_CONTENT = [{
  content: 'Im the welcome window',
  title: 'Bienvenue',
  id: 'welcome',
  isShowing: true,
  comp: Welcome
}, {
  content: 'Im the home window',
  title: 'My Home',
  id: 'home',
  isShowing: false,
  comp: Home
}, {
  content: 'Im the writing window',
  title: 'Game dev',
  id: 'writing',
  isShowing: false,
  comp: Writing
}, {
  content: 'Im the calendar window',
  title: 'Calendar',
  id: 'calendar',
  isShowing: false,
  comp: Calendar

},{
  content: 'Im the merge window',
  title: 'Merge paradigm',
  id: 'merge',
  isShowing: false,
  comp: Merge
},{
  content: 'Im the mensions window',
  title: 'Mensions légales',
  id: 'mensions',
  isShowing: false,
  comp: Mensions
}];

Vue.component('draggable-window', {
  template: '#draggable-window',
  props: ['id', 'title', 'content'],
  data: {
    draggable: null
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

    // LOL, "press"
    triggerMouseEvent(this.$el, 'mousedown');
    triggerMouseEvent(this.$el, 'mouseup');

    eventHub.cachedWindow = this.$el.id;
  }
});

new Vue({
  el: '#desktop',
  data: {
    windows: SITE_CONTENT,
    activeWindowTitle: 'MobOS'
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
    }
  }
});