"use strict";
(() => {
    var r = class {
        constructor(e, t = {}) {
            this.$element = e, this.updateChildren(), this._setVars(), this._bindEvents(), this._bindObservers(t.observer)
        }
        _bindEvents() {
            this.onViewportResize && typeof this.onViewportResize == "function" && window.addEventListener("resize", this._handleResize.bind(this))
        }
        _bindObservers({
            rootMargin: e = "0px",
            threshold: t = 0
        } = {}) {
            new IntersectionObserver(this._handleOnIntersect.bind(this), {
                root: null,
                rootMargin: e,
                threshold: t
            }).observe(this.$element)
        }
        _handleOnIntersect(e) {
            e.forEach(t => {
                t.isIntersecting ? (this.onViewportEnter && this.onViewportEnter(), this.$element.dataset.isIntersectingViewport = !0) : (this.onViewportExit && this.onViewportExit(), this.$element.dataset.isIntersectingViewport = !1)
            })
        }
        _handleResize(e) {
            this.resizeDebounce || (this.updateBreakpoints(), this.onViewportResize(e), this.resizeDebounce = setTimeout(() => delete this.resizeDebounce, 250))
        }
        _setVars() {
            this.onViewportResize && typeof this.onViewportResize == "function" && (this.breakpoints = {
                xxl: 1440,
                xl: 1280,
                l: 960,
                m: 600,
                s: 481
            }, this.updateBreakpoints())
        }
        updateBreakpoints() {
            this.isDesktop = window.innerWidth >= this.breakpoints.l, this.isTablet = !this.isDesktop && window.innerWidth >= this.breakpoints.m, this.isMobile = window.innerWidth < this.breakpoints.m
        }
        updateChildren() {
            this.getChildElements("[data-js-child]").forEach(s => {
                let n = s.getAttribute("data-js-child");
                this[n] = s
            }), this.getChildElements("[data-js-children]").forEach(s => {
                let n = s.getAttribute("data-js-children");
                this[n] || (this[n] = []), this[n].push(s)
            })
        }
        getChildElements(e) {
            return [...this.$element.querySelectorAll(e)].filter(s => this.$element === s.closest("[data-js-module]"))
        }
        handleEvent(e) {
            let t = `on${e.type}`;
            this[t] && this[t](e)
        }
        initialize() {
            this.onInitialize && this.onInitialize(), this.$element.dataset.initialized = !0
        }
        unmount() {}
    };
    window.KitModule = r;
    var m = ["ready", "complete"];
    window.mountedModules = window.mountedModules || [];

    function u(i, e) {
        function t() {
            document.querySelectorAll(`[data-js-module="${i}"]`).forEach(d => {
                let a = new e(d);
                a.initialize(), window.mountedModules.push(a)
            })
        }
        m.includes(document.readyState) ? t() : document.addEventListener("DOMContentLoaded", t)
    }
    window.registerModule = u;
    document.querySelectorAll("[role=button], .btn").forEach(i => {
        if (i && i.nodeName === "BUTTON") return;
        let t = i.nodeName === "A" ? [" "] : [" ", "Enter"];
        i.addEventListener("keyup", function(s) {
            t.includes(s.key) && i.click()
        })
    });
    var l = class extends HTMLElement {
        bindEvents() {
            this.$toggleMobileNav.addEventListener("click", this.handleToggleMobileNav.bind(this)), this.$toggleMobileNav.addEventListener("keydown", this.handleToggleKeydown.bind(this)), document.documentElement.addEventListener("click", this.handleGlobalClick.bind(this)), document.documentElement.addEventListener("keydown", this.handleGlobalKeydown.bind(this)), window.addEventListener("resize", this.handleWindowResize.bind(this)), this.menuItems.forEach(({
                hasSubnav: e,
                $menuItem: t,
                $subnavLinks: s
            }) => {
                t.getAttribute("tabindex") === "0" && t.addEventListener("focus", this.handleFocusMenuItems.bind(this)), t.addEventListener("keydown", this.handleMenuItemKeydown.bind(this)), e && (t.addEventListener("click", this.handleTogglePopup.bind(this)), s.forEach(n => {
                    n.addEventListener("keydown", this.handleSubmenuLinkKeydown.bind(this))
                }))
            })
        }
        bindUI() {
            this.$siteNav = this.querySelector("#siteNav-nav"), this.$toggleMobileNav = this.querySelector('[aria-controls="siteNav-nav"]'), this.menuItems = [...this.querySelectorAll('[role="menuitem"] > :where(a, button)')].map(e => {
                let t = e.hasAttribute("aria-haspopup"),
                    s = {
                        hasSubnav: t,
                        $menuItem: e
                    };
                if (t) {
                    let n = this.querySelector(`#${e.getAttribute("aria-controls")}`);
                    s.$subnav = n, s.$subnavLinks = [...n.querySelectorAll("a")]
                }
                return s
            })
        }
        connectedCallback() {
            this.setVars(), this.bindUI(), this.bindEvents(), this.update()
        }
        handleFocusMenuItems() {
            this.currentMenuItemIndex = 0, this.update()
        }
        handleGlobalClick(e) {
            !this.subnavIsExpanded || e.target.closest(".siteNav__navListItem") || (this.subnavIsExpanded = !1, this.update())
        }
        handleGlobalKeydown(e) {
            this.subnavIsExpanded && (e.key === "Escape" && (this.subnavIsExpanded = !1), this.update())
        }
        handleMenuItemKeydown(e) {
            let t = this.menuItems.find(s => s.$menuItem === e.target);
            if (e.key === "ArrowLeft") this.currentMenuItemIndex--;
            else if (e.key === "ArrowRight") this.currentMenuItemIndex++;
            else if (e.key === "ArrowDown" || e.key === "Enter")
                if (t.hasSubnav) this.currentSubnavLinkIndex = 0, this.subnavIsExpanded = !0;
                else return;
            else if (this.mobileNavIsExpanded)
                if (e.key === "Escape") this.mobileNavIsExpanded = !1, this.nextFocusElement = "toggle";
                else if (e.key === "Tab") e.preventDefault(), this.nextFocusElement = "toggle";
            else return;
            else return;
            e.preventDefault(), e.stopPropagation(), this.update()
        }
        handleSubmenuLinkKeydown(e) {
            if (e.key === "ArrowLeft") this.currentMenuItemIndex--, this.currentSubnavLinkIndex = 0;
            else if (e.key === "ArrowRight") this.currentMenuItemIndex++, this.currentSubnavLinkIndex = 0;
            else if (e.key === "ArrowDown") this.currentSubnavLinkIndex++;
            else if (e.key === "ArrowUp") this.currentSubnavLinkIndex--;
            else return;
            e.preventDefault(), e.stopPropagation(), this.update()
        }
        handleToggleKeydown(e) {
            e.key === "Enter" && (this.currentMenuItemIndex = null), e.key === "Escape" && (this.mobileNavIsExpanded = !1), e.key === "Tab" && this.mobileNavIsExpanded && (e.preventDefault(), this.nextFocusElement = "menuItem"), this.update()
        }
        handleToggleMobileNav() {
            this.mobileNavIsExpanded = !this.mobileNavIsExpanded, this.update()
        }
        handleTogglePopup(e) {
            let t = this.menuItems[this.currentMenuItemIndex] ? .$menuItem,
                s = e.target.closest("button");
            t === s ? this.subnavIsExpanded = !this.subnavIsExpanded : (this.currentMenuItemIndex = this.menuItems.findIndex(n => n.$menuItem === s), this.subnavIsExpanded = !0), this.update()
        }
        handleWindowResize() {
            this.mobileNavIsExpanded ? (this.mobileNavIsExpanded = !1, this.update()) : this.subnavIsExpanded && (this.subnavIsExpanded = !1, this.update())
        }
        setVars() {
            this.currentMenuItemIndex = null, this.currentSubnavLinkIndex = null, this.menuItems = [], this.mobileNavIsExpanded = !1, this.nextFocusElement = null, this.subnavIsExpanded = !1
        }
        update() {
            this.$toggleMobileNav.setAttribute("aria-expanded", this.mobileNavIsExpanded), this.$siteNav.dataset.isExpanded = this.mobileNavIsExpanded, document.documentElement.setAttribute("mobile-nav-expanded", this.mobileNavIsExpanded), this.nextFocusElement === "menuItem" && (this.currentMenuItemIndex = 0);
            let e = this.menuItems.filter(s => s.$menuItem.offsetHeight > 0);
            this.currentMenuItemIndex < 0 ? this.currentMenuItemIndex = e.length - 1 : this.currentMenuItemIndex >= e.length && (this.currentMenuItemIndex = 0);
            let t = e[this.currentMenuItemIndex];
            this.nextFocusElement === "menuItem" || this.nextFocusElement === null ? t ? .$menuItem.focus() : this.nextFocusElement === "toggle" && this.$toggleMobileNav.focus(), this.subnavIsExpanded && !t.hasSubnav && (this.subnavIsExpanded = !1), this.subnavIsExpanded || (this.currentSubnavLinkIndex = null), e.forEach((s, n) => {
                if (s.hasSubnav) {
                    let d = this.subnavIsExpanded && n === this.currentMenuItemIndex;
                    s.$menuItem.setAttribute("aria-expanded", d), s.$subnav.dataset.isExpanded = d, d && (this.currentSubnavLinkIndex < 0 ? this.currentSubnavLinkIndex = s.$subnavLinks.length - 1 : this.currentSubnavLinkIndex >= s.$subnavLinks.length && (this.currentSubnavLinkIndex = 0), s.$subnavLinks.forEach((a, o) => {
                        o === this.currentSubnavLinkIndex && a.focus()
                    }))
                }
            }), this.nextFocusElement = null
        }
    };
    customElements.get("site-nav") || customElements.define("site-nav", l);
    document.querySelectorAll(".js-video-bg").forEach(i => {
        let e = i.querySelector("video");
        e.hasAttribute("loop") && e.hasAttribute("autoplay") && e.play().catch(() => {
            e.style.display = "none"
        })
    });
    var h = class {
            constructor(e) {
                this.element = e, this.setVars(), this.bindObserver()
            }
            bindObserver() {
                this.observer = new IntersectionObserver(this.observerCallback, this.options), this.observer.observe(this.element)
            }
            observerCallback(e) {
                document.body.classList.add("has-scroll-reveal"), e.forEach(t => {
                    let s = t.target,
                        n = s.getAttribute("animate-delay") || 50;
                    if (t.isIntersecting && (setTimeout(() => {
                            t.target.classList.add("isVisible")
                        }, n), s.hasAttribute("animate-up-children"))) {
                        let d = s.querySelectorAll("[animate-up-child]"),
                            a = n;
                        d.forEach((o, c) => {
                            a = c == 0 ? n : parseInt(a) + 175, setTimeout(() => {
                                o.classList.add("isVisible")
                            }, a)
                        })
                    }
                })
            }
            setVars() {
                this.observer = null, this.options = {
                    rootMargin: "0px",
                    threshold: 0
                }
            }
        },
        b = document.querySelectorAll("[animate-up]");
    b.forEach(i => {
        new h(i)
    });
})();
//# sourceMappingURL=global.js.map