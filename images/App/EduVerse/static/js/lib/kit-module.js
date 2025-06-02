export default class KitModule {
    /**
     * @example
     * // Sets custom IntersectionObserver threshold
     * super($element, { observer: { threshold: 0.5 } });
     *
     * @param {HTMLElement} $element
     * @param {Object} [options]
     * @param {Object} [options.observer] - options passed to IntersectionObserver
     * @param {Number} [options.observer.rootMargin='0px']
     * @param {string} [options.observer.threshold=0]
     */
    constructor($element, options = {}) {
        this.$element = $element;

        this.updateChildren();
        this._setVars();
        this._bindEvents();
        this._bindObservers(options.observer);
    }

    /**
     * Add event listeners and call appropriate hooks.
     */
    _bindEvents() {
        if (this.onViewportResize && typeof this.onViewportResize === 'function') {
            // Only register resize listener if onViewportResize is defined
            window.addEventListener('resize', this._handleResize.bind(this));
        }
    }

    /**
     * Set IntersectionObserver that handles 'activate' and 'deactivate' events.
     * @param {Object} options
     * @param {string} [options.rootMargin='0px']
     * @param {Number} [options.threshold=0]
     */
    _bindObservers({
        rootMargin = '0px',
        threshold = 0
    } = {}) {
        const elementObserver = new IntersectionObserver(
            this._handleOnIntersect.bind(this), {
                root: null,
                rootMargin,
                threshold,
            },
        );
        elementObserver.observe(this.$element);
    }

    /**
     * Call onViewportEnter and onViewportExit hooks when element scrolls into or out of
     * the viewport, and set data-is-intersecting-viewport="[true|false]" accordingly.
     * @param {IntersectionObserverEntry[]} entries
     */
    _handleOnIntersect(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                this.onViewportEnter && this.onViewportEnter();
                this.$element.dataset.isIntersectingViewport = true;
            } else {
                this.onViewportExit && this.onViewportExit();
                this.$element.dataset.isIntersectingViewport = false;
            }
        });
    }

    /**
     * Call onViewportResize hook, with 250ms debounce.
     * @param {Event} event
     */
    _handleResize(event) {
        if (!this.resizeDebounce) {
            this.updateBreakpoints();
            this.onViewportResize(event);
            this.resizeDebounce = setTimeout(() => delete this.resizeDebounce, 250);
        }
    }

    /**
     * Set variables used by KitModule and its subclasses
     */
    _setVars() {
        if (this.onViewportResize && typeof this.onViewportResize === 'function') {
            // Only set breakpoint values if subclass implements onviewPortResize, to
            // encourage using breakpoints responsively rather than statically.
            this.breakpoints = {
                xxl: 1440,
                xl: 1280,
                l: 960,
                m: 600,
                s: 481,
            };

            this.updateBreakpoints();
        }
    }

    /**
     * Update named breakpoints using the current window width
     */
    updateBreakpoints() {
        this.isDesktop = window.innerWidth >= this.breakpoints['l'];
        this.isTablet = !this.isDesktop && window.innerWidth >= this.breakpoints['m'];
        this.isMobile = window.innerWidth < this.breakpoints['m'];
    }

    updateChildren() {
        // map child elements to their data-js-child key
        // data-js-child="$button" -> this.$button = <button>
        const $childElements = this.getChildElements('[data-js-child]');
        $childElements.forEach(($child) => {
            const key = $child.getAttribute('data-js-child');
            this[key] = $child;
        });

        // map children elements to their data-js-children key
        // data-js-children="$item" -> this.$items = [ <li>, <li>, <li> ]
        const $childrenElements = this.getChildElements('[data-js-children]');
        $childrenElements.forEach(($child) => {
            const key = $child.getAttribute('data-js-children');
            if (!this[key]) this[key] = []; // create array if first child
            this[key].push($child);
        });
    }

    /**
     * @param {String} selector
     * @return {Array} childElements
     */
    getChildElements(selector) {
        const $childElements = this.$element.querySelectorAll(selector);
        // filter out child elements of child modules
        return [...$childElements].filter(($child) => {
            return this.$element === $child.closest('[data-js-module]');
        });
    }

    // enable $element.addEventListener('eventname', this)
    // to trigger oneventname() method
    handleEvent(event) {
        const method = `on${event.type}`;
        if (this[method]) this[method](event);
    }

    /**
     * Call onInitialize hook function if defined, and set data-initialized="true"
     * on top-level element.
     */
    initialize() {
        this.onInitialize && this.onInitialize();
        this.$element.dataset.initialized = true;
    }

    unmount() {}
}

// add to global namespace
window.KitModule = KitModule;