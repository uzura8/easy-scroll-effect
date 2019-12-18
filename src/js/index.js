import '@babel/polyfill'

const EasyScrollEffect = {
  handleEvent: function(scopeElm, targetSelector, type, func, isRemove = false) {
    var els = scopeElm.querySelectorAll(targetSelector)
    if (els == null || els.length == 0) return
    for (let i = 0, n = els.length; i < n; i++) {
      console.log(els[i]);//!!!!!!
      let listener = {
        handleEvent: func,
        scopeElm: scopeElm,
        eventElm: els[i],
        targetSelector: targetSelector
      };
      if (isRemove) {
        els[i].removeEventListener(type, listener);
      } else {
        els[i].addEventListener(type, listener);
      }
    }
  },

  optionsDef: {
    selector: '.js-scroll-effect',
    timeout: 100,
    typeDef: 'fade-in',
    startPosDef: 0,
  },

  init: function(scopeElm = null, optionsSet = {}) {
    if (scopeElm == null) scopeElm = document
    const options = Object.assign(this.optionsDef, optionsSet)
    this.apply(scopeElm, options)
  },

  apply: function(scopeElm, options) {
    this.addClassByPosAll(scopeElm, options)

    const timeout = options.timeout || 100
    let timer = 0
    window.addEventListener('scroll', () => {
      if (timer) return
      timer = setTimeout(() => {
        this.addClassByPosAll(scopeElm, options)
        timer = 0
      }, timeout);
    }, { passive: true })
  },

  addClassByPosAll: function(scopeElm, options) {
    const targetSelector = (options.selector != null) ?
      options.selector : options.selector;

    var els = scopeElm.querySelectorAll(targetSelector)
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
    if (scrollY > posY - windowHeight + startPos){
      elm.classList.add(type);
    }
  },
}

export default EasyScrollEffect;
