(self.webpackChunktradingview=self.webpackChunktradingview||[]).push([[7707],{84740:e=>{e.exports={tabbar:"tabbar-eYOhHEJX",tabs:"tabs-eYOhHEJX",compact:"compact-eYOhHEJX",fakeTabs:"fakeTabs-eYOhHEJX",tab:"tab-eYOhHEJX",menuButtonWrap:"menuButtonWrap-eYOhHEJX",hover:"hover-eYOhHEJX",active:"active-eYOhHEJX",title:"title-eYOhHEJX",menuButton:"menuButton-eYOhHEJX",titleText:"titleText-eYOhHEJX",tabWithHint:"tabWithHint-eYOhHEJX",hintPlaceholder:"hintPlaceholder-eYOhHEJX"}},55323:e=>{e.exports={"css-value-footer-widget-horizontal-margin":"4px"}},65283:e=>{e.exports={"css-value-footer-widget-horizontal-margin":"4px",footerPanel:"footerPanel-glKypJku",tabs:"tabs-glKypJku",buttons:"buttons-glKypJku",hidden:"hidden-glKypJku",button:"button-glKypJku",hover:"hover-glKypJku",overlap:"overlap-glKypJku"}},16059:e=>{e.exports={menuWrap:"menuWrap-8MKeZifP",isMeasuring:"isMeasuring-8MKeZifP",scrollWrap:"scrollWrap-8MKeZifP",momentumBased:"momentumBased-8MKeZifP",menuBox:"menuBox-8MKeZifP",isHidden:"isHidden-8MKeZifP"}},23576:e=>{e.exports={"tablet-small-breakpoint":"screen and (max-width: 428px)",item:"item-4TFSfyGO",hovered:"hovered-4TFSfyGO",isDisabled:"isDisabled-4TFSfyGO",isActive:"isActive-4TFSfyGO",shortcut:"shortcut-4TFSfyGO",toolbox:"toolbox-4TFSfyGO",withIcon:"withIcon-4TFSfyGO",icon:"icon-4TFSfyGO",labelRow:"labelRow-4TFSfyGO",label:"label-4TFSfyGO",showOnHover:"showOnHover-4TFSfyGO"}},72571:(e,t,s)=>{"use strict";s.d(t,{Icon:()=>i});var n=s(59496);const i=n.forwardRef((e,t)=>{const{icon:s="",...i}=e;return n.createElement("span",{...i,ref:t,dangerouslySetInnerHTML:{__html:s}})})},417:(e,t,s)=>{"use strict";function n(e){return o(e,r)}function i(e){return o(e,a)}function o(e,t){const s=Object.entries(e).filter(t),n={};for(const[e,t]of s)n[e]=t;return n}function r(e){const[t,s]=e;return 0===t.indexOf("data-")&&"string"==typeof s}function a(e){return 0===e[0].indexOf("aria-")}s.d(t,{filterDataProps:()=>n,filterAriaProps:()=>i,filterProps:()=>o,isDataAttribute:()=>r,isAriaAttribute:()=>a})},51157:(e,t,s)=>{"use strict";s.r(t),s.d(t,{FooterWidgetRenderer:()=>k});var n=s(59496),i=s(87995),o=s(97754),r=s(25177),a=s(44377),l=s(92063),c=s(72571),h=s(88537),u=s(32133),d=s(84740);class p extends n.PureComponent{constructor(){super(...arguments),this._ref=e=>{const{name:t,reference:s}=this.props;s&&s(t,e)},this._onToggle=()=>{this._toggleWidget()},this._activationCallback=()=>{this._toggleWidget(!0)}}render(){const{name:e,isActive:t,title:s,customTitleComponent:i,buttonOpenTooltip:r,buttonCloseTooltip:a,dataName:l,compact:c}=this.props,h=t?a:r,u=i;return n.createElement("div",{className:o(d.tab,u&&d.customTab,h&&"apply-common-tooltip",t&&d.active),title:h,ref:this._ref},u?n.createElement(u,{onClick:this._onToggle,activationCallback:this._activationCallback,isActive:t,dataName:l,compact:c}):n.createElement("div",{onClick:this._onToggle,className:d.title,"data-name":this.props.dataName,"data-active":t},n.createElement("span",{className:d.titleText},s||e)))}_toggleWidget(e){const{name:t,onToggle:s,_gaEvent:n}=this.props;n&&(0,
u.trackEvent)("Platform widgets",n),s(t,e)}}var m=s(98584);class g extends n.PureComponent{constructor(e){super(e),this._menuButton=null,this._fakeTabs={},this._fakeMenuButton=null,this._hintRef=n.createRef(),this._moveNotesFeatureEnabled=!1,this._forceShowNotesTab=!1,this._handleHeightChange=()=>{this._showNotesTab()&&this._showNotesHint()&&this.state.hasNotes&&this._hintRef.current&&this._hintRef.current.close()},this._handleHintClick=()=>{var e;null===(e=window.widgetbar)||void 0===e||e.setPage("base"),showSymbolNotesGroups(),this._forceShowNotesTab=!0},this._getActualWidgets=()=>{const{widgets:e}=this.props,{hasNotes:t}=this.state;return this._showNotesHint()&&t?e:e.filter(e=>"text_notes"!==e.name)},this._handleNotesStoreUpdate=e=>{if(!this._showNotesTab()||!this._showNotesHint()||!fetchSymbolNotesThunk.fulfilled.match(e))return;const t=symbolNotesStore.getState().symbolNotes,s=Object.keys(t.notes).length>0;this.setState({hasNotes:s});const{settingsActiveWidget:n,widgets:i,setActiveWidget:o}=this.props;if("text_notes"===n&&!s){o(i[0].name,!1,!0)}s||TVSettings.setValue("hint.notesTransfer",!1)},this._showNotesHint=()=>this._moveNotesFeatureEnabled&&window.is_authenticated&&void 0===TVSettings.getBool("hint.notesTransfer"),this._showNotesTab=()=>!1,this._refFakeTabs=(e,t)=>{this._fakeTabs[e]=t},this._refFakeMenuButton=e=>{this._fakeMenuButton=e},this._refMenuButton=e=>{this._menuButton=e},this._resize=e=>{if(!e)return;const t=(0,h.ensureNotNull)(this._fakeMenuButton).offsetWidth,{activeWidgetName:s}=this.props;let n=[],i=[],o=0;"string"==typeof s&&(i=[s],o=(0,h.ensureNotNull)(this._fakeTabs[s]).offsetWidth);const r=this.props.widgets.map(e=>e.name),a=r.filter(e=>e!==s);let l=!1;a.forEach(s=>{if(!this._fakeTabs[s])return;const a=(0,h.ensureNotNull)(this._fakeTabs[s]).offsetWidth,c=r.length-i.length==1?e:e-t;!l&&o+a<c?(o+=a,i.push(s)):(l=!0,n.push(s))}),0===i.length&&(i=[r[0]],n=n.filter(e=>e!==r[0])),i=r.filter(e=>i.includes(e)),this.setState({visibleTabs:i,hiddenTabs:n})},this._onToggle=(e,t)=>{void 0!==e&&(this._trackButtonClick(e),this.props.setActiveWidget(e,t),this._resize(this.props.width))},this._getDropdownPosition=()=>{const e=(0,h.ensureNotNull)(this._menuButton).getBoundingClientRect();return{x:e.left,y:e.top+e.height}},this._onMenuItemClick=e=>{this._onToggle(e,!0)},this._handleMenuClick=()=>{this._trackButtonClick("menu"),this._toggleMenu()},this._toggleMenu=()=>{this.setState(e=>({isMenuOpened:!e.isMenuOpened}))},this._trackButtonClick=e=>{0},this.state={visibleTabs:[],hiddenTabs:[],isMenuOpened:!1,hasNotes:!1}}componentDidMount(){const{heightWV:e,settingsActiveWidget:t,setActiveWidget:s,widgets:n}=this.props;if(this._resize(this.props.width),e&&e.subscribe(this._handleHeightChange),this._showNotesTab()&&this._showNotesHint()){const e=symbolNotesStore.getState().symbolNotes;e.status===SymbolNotesStatus.Idle?(symbolNotesStore.dispatch(fetchSymbolNotesThunk()),
GlobalEventsStorage.on("NOTIFY_OLD_TEXT_NOTES",this._handleNotesStoreUpdate,this)):e.status===SymbolNotesStatus.Fetching?GlobalEventsStorage.on("NOTIFY_OLD_TEXT_NOTES",this._handleNotesStoreUpdate,this):this.setState({hasNotes:Object.keys(e.notes).length>0})}else if(!this._showNotesTab()&&"text_notes"===t){s(n[0].name,!1,!0)}}componentWillUnmount(){const{heightWV:e}=this.props;e&&e.unsubscribe(this._handleHeightChange)}componentDidUpdate(e){const{widgets:t,activeWidgetName:s,width:n}=this.props;e.widgets===t&&e.activeWidgetName===s&&e.width===n||this._resize(n)}getMinWidth(){const e=this.props.activeWidgetName||this.props.widgets[0].name;return(0,h.ensureNotNull)(this._fakeTabs[e]).offsetWidth+(0,h.ensureNotNull)(this._fakeMenuButton).offsetWidth}render(){const{visibleTabs:e}=this.state,{widgets:t,compact:s}=this.props,i=this._getActualWidgets().filter(t=>e.includes(t.name));return n.createElement("div",{className:d.tabbar},n.createElement("div",{className:o(d.tabs,1===e.length&&s&&d.compact)},this._renderTabs(i,!1)),n.createElement("div",{className:o(d.tabs,d.fakeTabs)},this._renderTabs(t,!0)))}_renderTabs(e,t){const{activeWidgetName:s,compact:i}=this.props,{visibleTabs:r,hiddenTabs:a,isMenuOpened:l}=this.state,h=e.map(e=>{const o=n.createElement(p,{...e,key:e.name,isActive:s===e.name,onToggle:this._onToggle,dataName:t?void 0:e.name,reference:t?this._refFakeTabs:void 0,compact:!t&&i&&1===r.length});if("text_notes"===e.name){const s=this._showNotesHint()&&this.state.hasNotes;return n.createElement("div",{className:d.tabWithHint,key:e.name},!t&&s&&this._getNotesHint(),o)}return o});return(t||a.length>0)&&h.push(n.createElement("div",{key:"menu-button",className:d.menuButtonWrap,ref:t?this._refFakeMenuButton:this._refMenuButton},n.createElement("div",{className:o(d.menuButton,l&&d.active),onClick:this._handleMenuClick},n.createElement(c.Icon,{icon:m})))),!t&&a.length>0&&h.push(this._renderMenu()),h}_getNotesHint(){return n.createElement(HintReferenceable,{text:(0,r.t)("Heads up: we're moving Notes to the Details area in the right-hand panel."),placement:"auto",placeHolderClassName:d.hintPlaceholder,escapeWithReference:!0,hideWithReference:!0,onClick:this._handleHintClick,settingsHintKey:"hint.notesTransfer",ref:this._hintRef})}_renderMenu(){const{hiddenTabs:e,isMenuOpened:t}=this.state,s=this._getActualWidgets().filter(t=>e.includes(t.name)).map(e=>{const t=n.createElement(l.PopupMenuItem,{key:e.name,onClick:this._onMenuItemClick,onClickArg:e.name,label:e.title||e.name});if("text_notes"===e.name){const s=this._showNotesHint()&&this.state.hasNotes;return n.createElement("div",{className:d.tabWithHint,key:e.name},s&&this._getNotesHint(),t)}return t});return n.createElement(a.PopupMenu,{key:"menu-dropdown",isOpened:t,doNotCloseOn:this._menuButton,onClose:this._toggleMenu,position:this._getDropdownPosition},s)}}var f=s(12777),v=s(55323);const _=parseInt(v["css-value-footer-widget-horizontal-margin"]);var b=s(17195),w=s(42787),N=s(83522),E=s(83432),M=s(65283);const C=(0,r.t)("Show panel"),x=(0,r.t)("Hide panel"),W=(0,
r.t)("Maximize panel"),y=(0,r.t)("Minimize panel");class T extends n.PureComponent{constructor(e){super(e),this._updateMode=()=>{this.setState({mode:this.props.mode.value()})},this.state={mode:e.mode.value()}}componentDidMount(){this.props.mode.subscribe(this._updateMode)}componentWillUnmount(){this.props.mode.unsubscribe(this._updateMode)}render(){const{toggleMinimize:e,toggleMaximize:t}=this.props,{mode:s}=this.state,i="minimized"===s,r="maximized"===s;return n.createElement(n.Fragment,null,n.createElement("button",{className:o(M.button,M.minimizeButton,"apply-common-tooltip"),title:i?C:x,onClick:e,tabIndex:-1,"data-name":"toggle-visibility-button","data-active":i},n.createElement(c.Icon,{icon:i?w:b})),n.createElement("button",{className:o(M.button,M.maximizeButton,"apply-common-tooltip",{[M.active]:r}),title:r?y:W,onClick:t,tabIndex:-1,"data-name":"toggle-maximize-button","data-active":r},n.createElement(c.Icon,{icon:r?E:N})))}}class O extends n.PureComponent{constructor(e){super(e),this._tabs=null,this._buttons=null,this._refTabs=e=>{this._tabs=e},this._refButtons=e=>{this._buttons=e},this._handleMode=e=>{this.setState({isOpened:"minimized"!==e})},this._handleOverlap=e=>{this.setState({isOverlap:e})},this._handleActiveWidgetName=e=>{const{resizerBridge:t}=this.props;this.setState({activeWidgetName:e},()=>this._resize(t.width.value()))},this._setActiveWidget=(e,t,s)=>{this.props.bottomWidgetBar.toggleWidget(e,t,s)},this._resize=e=>{if(!e)return;e-=_+_;const t=(0,h.ensureNotNull)(this._tabs).getMinWidth()+(0,h.ensureNotNull)(this._buttons).offsetWidth<=e;this.setState({width:e,showButtons:t})};const{bottomWidgetBar:t,resizerBridge:s}=this.props;this.state={isOpened:"minimized"!==t.mode().value(),isOverlap:t.isOverlap().value(),activeWidgetName:t.activeWidget().value(),width:s.width.value(),showButtons:!1}}componentDidMount(){const{bottomWidgetBar:e,resizerBridge:t}=this.props;e.mode().subscribe(this._handleMode),e.isOverlap().subscribe(this._handleOverlap),e.activeWidget().subscribe(this._handleActiveWidgetName,{callWithLast:!0}),t.width.subscribe(this._resize),this._resize(t.width.value())}componentWillUnmount(){const{bottomWidgetBar:e,resizerBridge:t}=this.props;e.mode().unsubscribe(this._handleMode),e.isOverlap().unsubscribe(this._handleOverlap),e.activeWidget().unsubscribe(this._handleActiveWidgetName),t.width.unsubscribe(this._resize)}render(){const{bottomWidgetBar:e}=this.props,{isOverlap:t,activeWidgetName:s,width:i,showButtons:r}=this.state,a=this._buttons?this._buttons.offsetWidth:0,l=e.enabledWidgets(),c="minimized"!==e.mode().value()&&s;return n.createElement("div",{id:"footer-chart-panel",className:o(M.footerPanel,t&&M.overlap),onContextMenu:f.preventDefault},n.createElement(g,{ref:this._refTabs,widgets:l,activeWidgetName:c,setActiveWidget:this._setActiveWidget,settingsActiveWidget:s,close:e.close,width:i-a,compact:!r,heightWV:this.props.resizerBridge.height}),n.createElement("div",{className:o(M.buttons,!r&&M.hidden),ref:this._refButtons},n.createElement(T,{toggleMinimize:e.toggleMinimize,
toggleMaximize:e.toggleMaximize,mode:e.mode()})))}}class k{constructor(e,t,s){this._component=null,this._handleRef=e=>this._component=e,this._container=e;const o=n.createElement(O,{resizerBridge:t,bottomWidgetBar:s,ref:this._handleRef});i.render(o,this._container)}getComponent(){return(0,h.ensureNotNull)(this._component)}destroy(){i.unmountComponentAtNode(this._container)}}},21709:(e,t,s)=>{"use strict";function n(e,t,s,n,i){function o(i){if(e>i.timeStamp)return;const o=i.target;void 0!==s&&null!==t&&null!==o&&o.ownerDocument===n&&(t.contains(o)||s(i))}return i.click&&n.addEventListener("click",o,!1),i.mouseDown&&n.addEventListener("mousedown",o,!1),i.touchEnd&&n.addEventListener("touchend",o,!1),i.touchStart&&n.addEventListener("touchstart",o,!1),()=>{n.removeEventListener("click",o,!1),n.removeEventListener("mousedown",o,!1),n.removeEventListener("touchend",o,!1),n.removeEventListener("touchstart",o,!1)}}s.d(t,{addOutsideEventListener:()=>n})},61174:(e,t,s)=>{"use strict";s.d(t,{useOutsideEvent:()=>o});var n=s(59496),i=s(21709);function o(e){const{click:t,mouseDown:s,touchEnd:o,touchStart:r,handler:a,reference:l,ownerDocument:c=document}=e,h=(0,n.useRef)(null),u=(0,n.useRef)(new CustomEvent("timestamp").timeStamp);return(0,n.useLayoutEffect)(()=>{const e={click:t,mouseDown:s,touchEnd:o,touchStart:r},n=l?l.current:h.current;return(0,i.addOutsideEventListener)(u.current,n,a,c,e)},[t,s,o,r,a]),l||h}},30553:(e,t,s)=>{"use strict";s.d(t,{MenuContext:()=>n});const n=s(59496).createContext(null)},10618:(e,t,s)=>{"use strict";s.d(t,{DEFAULT_MENU_THEME:()=>f,Menu:()=>v});var n=s(59496),i=s(97754),o=s.n(i),r=s(88537),a=s(97280),l=s(12777),c=s(53327),h=s(70981),u=s(63212),d=s(82027),p=s(94488),m=s(30553),g=s(16059);const f=g;class v extends n.PureComponent{constructor(e){super(e),this._containerRef=null,this._scrollWrapRef=null,this._raf=null,this._scrollRaf=null,this._scrollTimeout=void 0,this._manager=new u.OverlapManager,this._hotkeys=null,this._scroll=0,this._handleContainerRef=e=>{this._containerRef=e,this.props.reference&&("function"==typeof this.props.reference&&this.props.reference(e),"object"==typeof this.props.reference&&(this.props.reference.current=e))},this._handleScrollWrapRef=e=>{this._scrollWrapRef=e,"function"==typeof this.props.scrollWrapReference&&this.props.scrollWrapReference(e),"object"==typeof this.props.scrollWrapReference&&(this.props.scrollWrapReference.current=e)},this._handleMeasure=({callback:e,forceRecalcPosition:t}={})=>{var s,n,i,o;if(this.state.isMeasureValid&&!t)return;const{position:l}=this.props,c=(0,r.ensureNotNull)(this._containerRef);let h=c.getBoundingClientRect();const u=document.documentElement.clientHeight,d=document.documentElement.clientWidth,p=null!==(s=this.props.closeOnScrollOutsideOffset)&&void 0!==s?s:0;let m=u-0-p;const g=h.height>m;if(g){(0,r.ensureNotNull)(this._scrollWrapRef).style.overflowY="scroll",h=c.getBoundingClientRect()}const{width:f,height:v}=h,_="function"==typeof l?l(f,v,u):l,b=d-(null!==(n=_.overrideWidth)&&void 0!==n?n:f)-0,w=(0,
a.clamp)(_.x,0,Math.max(0,b)),N=0+p,E=u-(null!==(i=_.overrideHeight)&&void 0!==i?i:v)-0;let M=(0,a.clamp)(_.y,N,Math.max(N,E));if(_.forbidCorrectYCoord&&M<_.y&&(m-=_.y-M,M=_.y),t&&void 0!==this.props.closeOnScrollOutsideOffset&&_.y<=this.props.closeOnScrollOutsideOffset)return void this._handleGlobalClose(!0);const C=null!==(o=_.overrideHeight)&&void 0!==o?o:g?m:void 0;this.setState({appearingMenuHeight:t?this.state.appearingMenuHeight:C,appearingMenuWidth:t?this.state.appearingMenuWidth:_.overrideWidth,appearingPosition:{x:w,y:M},isMeasureValid:!0},()=>{this._restoreScrollPosition(),e&&e()})},this._restoreScrollPosition=()=>{const e=document.activeElement,t=(0,r.ensureNotNull)(this._containerRef);if(null!==e&&t.contains(e))try{e.scrollIntoView()}catch(e){}else(0,r.ensureNotNull)(this._scrollWrapRef).scrollTop=this._scroll},this._resizeForced=()=>{this.setState({appearingMenuHeight:void 0,appearingMenuWidth:void 0,appearingPosition:void 0,isMeasureValid:void 0})},this._resize=()=>{null===this._raf&&(this._raf=requestAnimationFrame(()=>{this.setState({appearingMenuHeight:void 0,appearingMenuWidth:void 0,appearingPosition:void 0,isMeasureValid:void 0}),this._raf=null}))},this._handleGlobalClose=e=>{this.props.onClose(e)},this._handleSlot=e=>{this._manager.setContainer(e)},this._handleScroll=()=>{this._scroll=(0,r.ensureNotNull)(this._scrollWrapRef).scrollTop},this._handleScrollOutsideEnd=()=>{clearTimeout(this._scrollTimeout),this._scrollTimeout=setTimeout(()=>{this._handleMeasure({forceRecalcPosition:!0})},80)},this._handleScrollOutside=e=>{e.target!==this._scrollWrapRef&&(this._handleScrollOutsideEnd(),null===this._scrollRaf&&(this._scrollRaf=requestAnimationFrame(()=>{this._handleMeasure({forceRecalcPosition:!0}),this._scrollRaf=null})))},this.state={}}componentDidMount(){this._handleMeasure({callback:this.props.onOpen});const{customCloseDelegate:e=h.globalCloseDelegate}=this.props;e.subscribe(this,this._handleGlobalClose),window.addEventListener("resize",this._resize);const t=null!==this.context;this._hotkeys||t||(this._hotkeys=d.createGroup({desc:"Popup menu"}),this._hotkeys.add({desc:"Close",hotkey:27,handler:()=>this._handleGlobalClose()})),this.props.repositionOnScroll&&window.addEventListener("scroll",this._handleScrollOutside,{capture:!0})}componentDidUpdate(){this._handleMeasure()}componentWillUnmount(){const{customCloseDelegate:e=h.globalCloseDelegate}=this.props;e.unsubscribe(this,this._handleGlobalClose),window.removeEventListener("resize",this._resize),window.removeEventListener("scroll",this._handleScrollOutside,{capture:!0}),this._hotkeys&&(this._hotkeys.destroy(),this._hotkeys=null),null!==this._raf&&(cancelAnimationFrame(this._raf),this._raf=null),null!==this._scrollRaf&&(cancelAnimationFrame(this._scrollRaf),this._scrollRaf=null),this._scrollTimeout&&clearTimeout(this._scrollTimeout)}render(){
const{id:e,role:t,"aria-labelledby":s,"aria-activedescendant":i,children:r,minWidth:a,theme:h=g,className:u,maxHeight:d,onMouseOver:f,onMouseOut:v,onKeyDown:b,onFocus:w,onBlur:N}=this.props,{appearingMenuHeight:E,appearingMenuWidth:M,appearingPosition:C,isMeasureValid:x}=this.state;return n.createElement(m.MenuContext.Provider,{value:this},n.createElement(p.SubmenuHandler,null,n.createElement(c.SlotContext.Provider,{value:this._manager},n.createElement("div",{id:e,role:t,"aria-labelledby":s,"aria-activedescendant":i,className:o()(u,h.menuWrap,!x&&h.isMeasuring),style:{height:E,left:C&&C.x,minWidth:a,position:"fixed",top:C&&C.y,width:M},"data-name":this.props["data-name"],ref:this._handleContainerRef,onScrollCapture:this.props.onScroll,onContextMenu:l.preventDefaultForContextMenu,tabIndex:this.props.tabIndex,onMouseOver:f,onMouseOut:v,onKeyDown:b,onFocus:w,onBlur:N},n.createElement("div",{className:o()(h.scrollWrap,!this.props.noMomentumBasedScroll&&h.momentumBased),style:{overflowY:void 0!==E?"scroll":"auto",maxHeight:d},onScrollCapture:this._handleScroll,ref:this._handleScrollWrapRef},n.createElement(_,{className:h.menuBox},r)))),n.createElement(c.Slot,{reference:this._handleSlot})))}update(e){e?this._resizeForced():this._resize()}}function _(e){const t=(0,r.ensureNotNull)((0,n.useContext)(p.SubmenuContext)),s=n.useRef(null);return n.createElement("div",{ref:s,className:e.className,onMouseOver:function(e){if(!(null!==t.current&&e.target instanceof Node&&(n=e.target,null===(i=s.current)||void 0===i?void 0:i.contains(n))))return;var n,i;t.isSubmenuNode(e.target)||t.setCurrent(null)},"data-name":"menu-inner"},e.children)}v.contextType=p.SubmenuContext},63212:(e,t,s)=>{"use strict";s.d(t,{OverlapManager:()=>o,getRootOverlapManager:()=>a});var n=s(88537);class i{constructor(){this._storage=[]}add(e){this._storage.push(e)}remove(e){this._storage=this._storage.filter(t=>e!==t)}has(e){return this._storage.includes(e)}getItems(){return this._storage}}class o{constructor(e=document){this._storage=new i,this._windows=new Map,this._index=0,this._document=e,this._container=e.createDocumentFragment()}setContainer(e){const t=this._container,s=null===e?this._document.createDocumentFragment():e;!function(e,t){Array.from(e.childNodes).forEach(e=>{e.nodeType===Node.ELEMENT_NODE&&t.appendChild(e)})}(t,s),this._container=s}registerWindow(e){this._storage.has(e)||this._storage.add(e)}ensureWindow(e,t={position:"fixed",direction:"normal"}){const s=this._windows.get(e);if(void 0!==s)return s;this.registerWindow(e);const n=this._document.createElement("div");if(n.style.position=t.position,n.style.zIndex=this._index.toString(),n.dataset.id=e,void 0!==t.index){const e=this._container.childNodes.length;if(t.index>=e)this._container.appendChild(n);else if(t.index<=0)this._container.insertBefore(n,this._container.firstChild);else{const e=this._container.childNodes[t.index];this._container.insertBefore(n,e)}}else"reverse"===t.direction?this._container.insertBefore(n,this._container.firstChild):this._container.appendChild(n)
;return this._windows.set(e,n),++this._index,n}unregisterWindow(e){this._storage.remove(e);const t=this._windows.get(e);void 0!==t&&(null!==t.parentElement&&t.parentElement.removeChild(t),this._windows.delete(e))}getZindex(e){const t=this.ensureWindow(e);return parseInt(t.style.zIndex||"0")}moveToTop(e){if(this.getZindex(e)!==this._index){this.ensureWindow(e).style.zIndex=(++this._index).toString()}}removeWindow(e){this.unregisterWindow(e)}}const r=new WeakMap;function a(e=document){const t=e.getElementById("overlap-manager-root");if(null!==t)return(0,n.ensureDefined)(r.get(t));{const t=new o(e),s=function(e){const t=e.createElement("div");return t.style.position="absolute",t.style.zIndex=150..toString(),t.style.top="0px",t.style.left="0px",t.id="overlap-manager-root",t}(e);return r.set(s,t),t.setContainer(s),e.body.appendChild(s),t}}},92063:(e,t,s)=>{"use strict";s.d(t,{DEFAULT_POPUP_MENU_ITEM_THEME:()=>c,PopupMenuItem:()=>d});var n=s(59496),i=s(97754),o=s(70981),r=s(32133),a=s(417),l=s(23576);const c=l;function h(e){const{reference:t,...s}=e,i={...s,ref:t};return n.createElement(e.href?"a":"div",i)}function u(e){e.stopPropagation()}function d(e){const{id:t,role:s,"aria-selected":c,className:d,title:p,labelRowClassName:m,labelClassName:g,shortcut:f,forceShowShortcuts:v,icon:_,isActive:b,isDisabled:w,isHovered:N,appearAsDisabled:E,label:M,link:C,showToolboxOnHover:x,target:W,rel:y,toolbox:T,reference:O,onMouseOut:k,onMouseOver:S,suppressToolboxClick:H=!0,theme:z=l}=e,B=(0,a.filterDataProps)(e),R=(0,n.useRef)(null);return n.createElement(h,{...B,id:t,role:s,"aria-selected":c,className:i(d,z.item,_&&z.withIcon,{[z.isActive]:b,[z.isDisabled]:w||E,[z.hovered]:N}),title:p,href:C,target:W,rel:y,reference:function(e){R.current=e,"function"==typeof O&&O(e);"object"==typeof O&&(O.current=e)},onClick:function(t){const{dontClosePopup:s,onClick:n,onClickArg:i,trackEventObject:a}=e;if(w)return;a&&(0,r.trackEvent)(a.category,a.event,a.label);n&&n(i,t);s||(0,o.globalCloseMenu)()},onContextMenu:function(t){const{trackEventObject:s,trackRightClick:n}=e;s&&n&&(0,r.trackEvent)(s.category,s.event,s.label+"_rightClick")},onMouseUp:function(t){const{trackEventObject:s,trackMouseWheelClick:n}=e;if(1===t.button&&C&&s){let e=s.label;n&&(e+="_mouseWheelClick"),(0,r.trackEvent)(s.category,s.event,e)}},onMouseOver:S,onMouseOut:k},void 0!==_&&n.createElement("div",{className:z.icon,dangerouslySetInnerHTML:{__html:_}}),n.createElement("div",{className:i(z.labelRow,m)},n.createElement("div",{className:i(z.label,g)},M)),(void 0!==f||v)&&n.createElement("div",{className:z.shortcut},(P=f)&&P.split("+").join(" + ")),void 0!==T&&n.createElement("div",{onClick:H?u:void 0,className:i(z.toolbox,{[z.showOnHover]:x})},T));var P}},28466:(e,t,s)=>{"use strict";s.d(t,{CloseDelegateContext:()=>o});var n=s(59496),i=s(70981);const o=n.createContext(i.globalCloseDelegate)},44377:(e,t,s)=>{"use strict";s.d(t,{PopupMenu:()=>c});var n=s(59496),i=s(87995),o=s(8361),r=s(10618),a=s(28466),l=s(61174);function c(e){
const{controller:t,children:s,isOpened:c,closeOnClickOutside:h=!0,doNotCloseOn:u,onClickOutside:d,onClose:p,...m}=e,g=(0,n.useContext)(a.CloseDelegateContext),f=(0,l.useOutsideEvent)({handler:function(e){d&&d(e);if(!h)return;if(u&&e.target instanceof Node){const t=i.findDOMNode(u);if(t instanceof Node&&t.contains(e.target))return}p()},mouseDown:!0,touchStart:!0});return c?n.createElement(o.Portal,{top:"0",left:"0",right:"0",bottom:"0",pointerEvents:"none"},n.createElement("span",{ref:f,style:{pointerEvents:"auto"}},n.createElement(r.Menu,{...m,onClose:p,onScroll:function(t){const{onScroll:s}=e;s&&s(t)},customCloseDelegate:g,ref:t},s))):null}},8361:(e,t,s)=>{"use strict";s.d(t,{Portal:()=>l,PortalContext:()=>c});var n=s(59496),i=s(87995),o=s(16345),r=s(63212),a=s(53327);class l extends n.PureComponent{constructor(){super(...arguments),this._uuid=(0,o.guid)()}componentWillUnmount(){this._manager().removeWindow(this._uuid)}render(){const e=this._manager().ensureWindow(this._uuid,this.props.layerOptions);return e.style.top=this.props.top||"",e.style.bottom=this.props.bottom||"",e.style.left=this.props.left||"",e.style.right=this.props.right||"",e.style.pointerEvents=this.props.pointerEvents||"",i.createPortal(n.createElement(c.Provider,{value:this},this.props.children),e)}moveToTop(){this._manager().moveToTop(this._uuid)}_manager(){return null===this.context?(0,r.getRootOverlapManager)():this.context}}l.contextType=a.SlotContext;const c=n.createContext(null)},53327:(e,t,s)=>{"use strict";s.d(t,{Slot:()=>i,SlotContext:()=>o});var n=s(59496);class i extends n.Component{shouldComponentUpdate(){return!1}render(){return n.createElement("div",{style:{position:"fixed",zIndex:150,left:0,top:0},ref:this.props.reference})}}const o=n.createContext(null)},94488:(e,t,s)=>{"use strict";s.d(t,{SubmenuContext:()=>i,SubmenuHandler:()=>o});var n=s(59496);const i=n.createContext(null);function o(e){const[t,s]=(0,n.useState)(null),o=(0,n.useRef)(null),r=(0,n.useRef)(new Map);return(0,n.useEffect)(()=>()=>{null!==o.current&&clearTimeout(o.current)},[]),n.createElement(i.Provider,{value:{current:t,setCurrent:function(e){null!==o.current&&(clearTimeout(o.current),o.current=null);null===t?s(e):o.current=setTimeout(()=>{o.current=null,s(e)},100)},registerSubmenu:function(e,t){return r.current.set(e,t),()=>{r.current.delete(e)}},isSubmenuNode:function(e){return Array.from(r.current.values()).some(t=>t(e))}}},e.children)}},83522:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M8.5 6A2.5 2.5 0 0 0 6 8.5V11h1V8.5C7 7.67 7.67 7 8.5 7H11V6H8.5zM6 17v2.5A2.5 2.5 0 0 0 8.5 22H11v-1H8.5A1.5 1.5 0 0 1 7 19.5V17H6zM19.5 7H17V6h2.5A2.5 2.5 0 0 1 22 8.5V11h-1V8.5c0-.83-.67-1.5-1.5-1.5zM22 19.5V17h-1v2.5c0 .83-.67 1.5-1.5 1.5H17v1h2.5a2.5 2.5 0 0 0 2.5-2.5z"/></svg>'},83432:e=>{
e.exports='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M17 6v2.5a2.5 2.5 0 0 0 2.5 2.5H22v-1h-2.5A1.5 1.5 0 0 1 18 8.5V6h-1zm2.5 11a2.5 2.5 0 0 0-2.5 2.5V22h1v-2.5c0-.83.67-1.5 1.5-1.5H22v-1h-2.5zm-11 1H6v-1h2.5a2.5 2.5 0 0 1 2.5 2.5V22h-1v-2.5c0-.83-.67-1.5-1.5-1.5zM11 8.5V6h-1v2.5c0 .83-.67 1.5-1.5 1.5H6v1h2.5A2.5 2.5 0 0 0 11 8.5z"/></svg>'},17195:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path fill="currentColor" d="M7 20h14v1H7z"/></svg>'},42787:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" width="19" height="12" fill="none"><path stroke="currentColor" d="M1 8l8.5-6.5L18 8"/></svg>'},98584:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M7.5 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM5 14.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zm9.5-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM12 14.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zm9.5-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM19 14.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z"/></svg>'}}]);