import '@babel/polyfill'

const EasyScrollEffect = {
  options: {},
  scrollTimer: null,
  optionsDef: {
    selector: '.js-scroll-effect',
    timeout: 100,
    typeDef: 'fade-in',
    startPosDef: 0,
  },

  handleEvent: function(scopeElm, eventElm = null, type, func, isRemove = false) {
    if (scopeElm == null) scopeElm = document
    let listener = null

    var els = scopeElm.querySelectorAll(this.options.selector)
    if (els === null || !els.length) return;

    for (let i = 0, n = els.length; i < n; i++) {
      if (eventElm == null) eventElm = els[i]
      listener = {
        handleEvent: func,
        scopeElm: scopeElm,
        eventElm: els[i],
        scrollTimer: this.scrollTimer,
        options: this.options,
      }
      if (isRemove) {
        eventElm.removeEventListener(type, listener)
      } else {
        eventElm.addEventListener(type, listener)
      }
    }
  },

  init: function(scopeElm = null, options = {}) {
    this.options = Object.assign(this.optionsDef, options)

    this.addClassByPosAll(document, this.options)
    this.handleEvent(scopeElm, window, 'scroll', this.execForScroll)
  },

  destroy: function(scopeElm = null, options = {}) {
    this.options = Object.assign(this.optionsDef, options)
    this.handleEvent(scopeElm, window, 'scroll', this.execForScroll, true)
  },

  execForScroll: function() {
    if (this.scrollTimer) return
    this.scrollTimer = setTimeout(() => {
      EasyScrollEffect.addClassByPos(this.eventElm, this.options)
      this.scrollTimer = 0
    }, this.options.timeout)
  },

  addClassByPosAll: function(scopeElm = null, options) {
    if (scopeElm == null) scopeElm = document
    let els = scopeElm.querySelectorAll(options.selector)
    if (els == null || els.length == 0) return

    for (let i = 0, n = els.length; i < n; i++) {
      this.addClassByPos(els[i], options)
    }
  },

  addClassByPos: function(elm, options) {
    const type = elm.dataset.type != null ? elm.dataset.type : options.typeDef
    const startPos = elm.dataset.startPos != null ?
      parseInt(elm.dataset.startPos) : options.startPosDef
    if (elm.classList.contains(type)) return

    const windowHeight = window.innerHeight
    const scrollY = window.pageYOffset || document.documentElement.scrollTop
    const rect = elm.getBoundingClientRect()
    const posY = rect.top +  scrollY
    if (scrollY < posY - windowHeight + startPos) return

    elm.classList.add(type)
  },
}

export default EasyScrollEffect
