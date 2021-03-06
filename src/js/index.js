import '@babel/polyfill'

const EasyScrollEffect = {
  options: {},
  scrollTimer: null,
  optionsDef: {
    selector: '.js-scroll-effect',
    initialDelay: 0,
    timeout: 1000/60,
    addedClass: 'is-active',
    startPosDef: 0,
    //isDebug: false,
    debugMode: null,// 'force' / 'limit' / null
  },
  debugInfo: {
    target: {
      domain: 'example.com',
      query: 'se_debug',
    },
    delayTimeToSetPos: 2000,
    baseElm: null,
    scrollInfoElm: null,
    triggerInfoElm: null,
    eachInfoElms: [],
  },

  handleEvent: function(scopeElm, eventElm = null, type, func, isRemove = false) {
    if (scopeElm == null) scopeElm = document
    let listener = null

    var els = scopeElm.querySelectorAll(this.options.selector)
    if (els === null || !els.length) return

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

  handleLoadEvent: function(func, isRemove = false) {
    const listener = {
      handleEvent: func,
      options: this.options,
    }
    if (isRemove) {
      window.removeEventListener('load', listener)
    } else {
      window.addEventListener('load', listener)
    }
  },

  init: function(scopeElm = null, options = {}) {
    this.initOptions(options)
    this.handleLoadEvent(this.execInitial)
    this.handleEvent(scopeElm, window, 'scroll', this.execForScroll)
    this.handleEvent(scopeElm, window, 'touchmove', this.execForScroll)
  },

  destroy: function(scopeElm = null, options = {}) {
    this.initOptions(options)
    this.handleLoadEvent(this.execInitial, true)
    this.handleEvent(scopeElm, window, 'scroll', this.execForScroll, true)
    this.handleEvent(scopeElm, window, 'touchmove', this.execForScroll, true)
  },

  initOptions: function(options = {}) {
    this.options = Object.assign(this.optionsDef, options)

    if (this.options.isDebug) return
    if (!this.options.debugMode) return

    switch (this.options.debugMode) {
      case 'force':
        this.options.isDebug = true
        break
      case 'limit':
        if (this.isDebugTargetEnv()) {
          this.options.isDebug = true
        }
        break
    }
  },

  execForScroll: function() {
    if (this.scrollTimer) return
    this.scrollTimer = setTimeout(() => {
      EasyScrollEffect.addClassByPos(this.eventElm, this.options)
      this.scrollTimer = 0
    }, this.options.timeout)
  },

  execInitial: function() {
    setTimeout(() => {
      EasyScrollEffect.addClassByPosAll()
    }, this.options.initialDelay)
  },

  addClassByPosAll: function() {
    let els = document.querySelectorAll(this.options.selector)
    if (els == null || els.length == 0) return

    if (this.options.isDebug) EasyScrollEffect.addDebugBlock()

    for (let i = 0, n = els.length; i < n; i++) {
      EasyScrollEffect.addClassByPos(els[i], this.options)

      if (this.options.isDebug) {
        EasyScrollEffect.addEachDebugInfo(i, els[i], this.options)
      }
    }
  },

  addClassByPos: function(elm, options) {
    const addedClass = elm.dataset.addedClass != null ?
      elm.dataset.addedClass : options.addedClass
    const startPos = elm.dataset.startPos != null ?
      parseInt(elm.dataset.startPos) : options.startPosDef

    if (elm.classList.contains(addedClass)) return

    const windowHeight = window.innerHeight
    const scrollY = this.getScrollY()
    const rect = elm.getBoundingClientRect()
    const posY = rect.top + scrollY

    if (options.isDebug) this.setScrollValueForDebug(scrollY)

    if (scrollY < posY - windowHeight + startPos) return

    elm.classList.add(addedClass)
  },

  getScrollY: function() {
    return window.scrollY || window.pageYOffset
  },

  isDebugTargetEnv: function() {
    if (!('target' in this.debugInfo) || !this.debugInfo.target) return false
    if (!('domain' in this.debugInfo.target) || !this.debugInfo.target.domain) return false
    if (window.location.hostname != this.debugInfo.target.domain) return false
    if (('query' in this.debugInfo.target) && this.debugInfo.target.query) {
      const targetQuery = this.getUriParamValue(this.debugInfo.target.query)
      if (targetQuery !== '1') return false
    }
    return true
  },

  getUriParamValue: function(key) {
    const match = window.location.search.match(new RegExp(key + '=(.*?)(&|$)'));
    if (match) return decodeURIComponent(match[1]);
    return '';
  },

  // For debug
  addDebugBlock: function() {
    const bodyElms = document.getElementsByTagName('body')
    if (bodyElms.length < 1) return

    // parent
    this.debugInfo.baseElm = document.createElement('div')
    this.debugInfo.baseElm.setAttribute('id', 'eseInfoBlock')
    const styleObj = {
      position: 'fixed',
      bottom: '5px',
      right: '5px',
      'z-index': '90000',
      width: '210px',
      height: '200px',
      border: 'solid 1px #a0a0a0',
      background: '#f7f7f7',
      padding: '5px',
      overflow: 'scroll'
    }
    let styleItems = []
    Object.keys(styleObj).map((key) => {
      styleItems.push(`${key}:${styleObj[key]}`)
    })
    this.debugInfo.baseElm.setAttribute('style', styleItems.join(';'))

    // scrollInfo
    this.debugInfo.scrollInfoElm = this.createDebugElm('scroll', 0)

    // windowHeightInfo
    let value = window.innerHeight
    this.createDebugElm('windowHeight', value)

    // triggerHeightInfo
    this.debugInfo.triggerInfoElm = this.createDebugElm('triggerHeight', 0)

    bodyElms[0].appendChild(this.debugInfo.baseElm)
  },

  addEachDebugInfo: function(index, elm, options) {
    if (this.debugInfo.eachInfoElms.indexOf(index) != -1) return

    const startPos = elm.dataset.startPos != null ?
      parseInt(elm.dataset.startPos) : options.startPosDef

    setTimeout(() => {
      const rect = elm.getBoundingClientRect()
      const scrollY = this.getScrollY()
      const value = rect.top + scrollY + startPos
      const viewValue = Math.round(value * 10) / 10

      // scrollInfo
      const eachDiv = document.createElement('div')
      let labelSpan = document.createElement('span')
      labelSpan.textContent = `${index} pos: `
      eachDiv.appendChild(labelSpan)
      let valueSpan = document.createElement('span')
      valueSpan.textContent = `${viewValue} (add: ${startPos})`
      eachDiv.appendChild(valueSpan)
      this.debugInfo.baseElm.appendChild(eachDiv)
      this.debugInfo.eachInfoElms[index] = eachDiv
    }, this.debugInfo.delayTimeToSetPos)
  },

  setScrollValueForDebug: function(scrollY) {
    if (this.debugInfo.scrollInfoElm != null) {
      this.debugInfo.scrollInfoElm.textContent = scrollY
    }
    if (this.debugInfo.triggerInfoElm != null) {
      this.debugInfo.triggerInfoElm.textContent = scrollY + window.innerHeight
    }
  },

  createDebugElm: function(label, value) {
    let div = document.createElement('div')
    let labelSpan = document.createElement('span')
    labelSpan.textContent = `${label}: `
    div.appendChild(labelSpan)
    let valueSpan = document.createElement('span')
    valueSpan.textContent = value
    div.appendChild(valueSpan)
    this.debugInfo.baseElm.appendChild(div)
    return valueSpan
  },
}

export default EasyScrollEffect
