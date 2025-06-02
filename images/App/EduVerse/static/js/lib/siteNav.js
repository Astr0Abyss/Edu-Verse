class SiteNav extends HTMLElement {
    bindEvents() {
        this.$toggleMobileNav.addEventListener('click', this.handleToggleMobileNav.bind(this));
        this.$toggleMobileNav.addEventListener('keydown', this.handleToggleKeydown.bind(this));

        document.documentElement.addEventListener('click', this.handleGlobalClick.bind(this));
        document.documentElement.addEventListener('keydown', this.handleGlobalKeydown.bind(this));
        window.addEventListener('resize', this.handleWindowResize.bind(this));

        this.menuItems.forEach(({
            hasSubnav,
            $menuItem,
            $subnavLinks
        }) => {
            if ($menuItem.getAttribute('tabindex') === '0') {
                $menuItem.addEventListener('focus', this.handleFocusMenuItems.bind(this));
            }

            $menuItem.addEventListener('keydown', this.handleMenuItemKeydown.bind(this));

            if (hasSubnav) {
                $menuItem.addEventListener('click', this.handleTogglePopup.bind(this));

                $subnavLinks.forEach(($subnavLink) => {
                    $subnavLink.addEventListener('keydown', this.handleSubmenuLinkKeydown.bind(this));
                });
            }
        });
    }

    bindUI() {
        this.$siteNav = this.querySelector('#siteNav-nav');
        this.$toggleMobileNav = this.querySelector('[aria-controls="siteNav-nav"]');

        this.menuItems = [...this.querySelectorAll('[role="menuitem"] > :where(a, button)')].map(($menuItem) => {
            const hasSubnav = $menuItem.hasAttribute('aria-haspopup');
            /** @type {MenuItem} */
            const menuItem = {
                hasSubnav,
                $menuItem,
            };
            if (hasSubnav) {
                const $subnav = this.querySelector(`#${$menuItem.getAttribute('aria-controls')}`);
                menuItem.$subnav = $subnav;
                menuItem.$subnavLinks = [...$subnav.querySelectorAll('a')];
            }
            return menuItem;
        });
    }

    connectedCallback() {
        this.setVars();
        this.bindUI();
        this.bindEvents();
        this.update();
    }

    /**
     * Ensure that arrow selection resets if the user tabs back to the initial
     * menu item.
     */
    handleFocusMenuItems() {
        this.currentMenuItemIndex = 0;
        this.update();
    }

    /**
     * Dismiss subnav if open
     * @param {MouseEvent} event
     */
    handleGlobalClick(event) {
        if (!this.subnavIsExpanded) {
            return;
        }

        const $closestListItem = event.target.closest('.siteNav__navListItem');
        if ($closestListItem) {
            // If the click was made in a list item, defer to other handlers in case
            // closing the subnav isn't desirable.
            return;
        }

        this.subnavIsExpanded = false;
        this.update();
    }

    /**
     * Important keydown events that may fire outside <site-nav>
     * @param {KeyboardEvent} event
     */
    handleGlobalKeydown(event) {
        if (!this.subnavIsExpanded) {
            return;
        }

        if (event.key === 'Escape') {
            this.subnavIsExpanded = false;
        }

        this.update();
    }

    /**
     * Keydown events on menu item elements
     * @param {KeyboardEvent} event
     */
    handleMenuItemKeydown(event) {
        const menuItem = this.menuItems.find((menuItem) => menuItem.$menuItem === event.target);

        /* eslint-disable brace-style */
        // Cycling through menu items
        if (event.key === 'ArrowLeft') {
            this.currentMenuItemIndex--;
        } else if (event.key === 'ArrowRight') {
            this.currentMenuItemIndex++;
        }

        // Opening Submenu
        else if (event.key === 'ArrowDown' || event.key === 'Enter') {
            if (menuItem.hasSubnav) {
                this.currentSubnavLinkIndex = 0;
                this.subnavIsExpanded = true;
            } else {
                return;
            }
        }

        // Mobile Menu
        else if (this.mobileNavIsExpanded) {
            if (event.key === 'Escape') {
                this.mobileNavIsExpanded = false;
                this.nextFocusElement = 'toggle';
            } else if (event.key === 'Tab') {
                // Trap focus in mobile navigation
                event.preventDefault();
                this.nextFocusElement = 'toggle';
            }

            // All other keys
            else {
                return;
            }
        }

        // All other keys
        else {
            return;
        }
        /* eslint-enable brace-style */

        event.preventDefault();
        event.stopPropagation();

        this.update();
    }

    /**
     * @param {KeyboardEvent} event
     */
    handleSubmenuLinkKeydown(event) {
        /* eslint-disable brace-style */
        // Cycling through menu items
        if (event.key === 'ArrowLeft') {
            this.currentMenuItemIndex--;
            this.currentSubnavLinkIndex = 0;
        } else if (event.key === 'ArrowRight') {
            this.currentMenuItemIndex++;
            this.currentSubnavLinkIndex = 0;
        }

        // Cycling through submenu links
        else if (event.key === 'ArrowDown') {
            this.currentSubnavLinkIndex++;
        } else if (event.key === 'ArrowUp') {
            this.currentSubnavLinkIndex--;
        }

        // All other keys
        else {
            return;
        }
        /* eslint-enable brace-style */

        event.preventDefault();
        event.stopPropagation();

        this.update();
    }

    /**
     * Keydown events on the mobile navigation toggle button
     * @param {KeyboardEvent} event
     */
    handleToggleKeydown(event) {
        if (event.key === 'Enter') {
            // Reset the selected menu item any time we open or close mobile
            // navigation
            this.currentMenuItemIndex = null;
        }

        if (event.key === 'Escape') {
            this.mobileNavIsExpanded = false;
        }

        if (event.key === 'Tab') {
            if (this.mobileNavIsExpanded) {
                // Trap focus in mobile navigation
                event.preventDefault();
                this.nextFocusElement = 'menuItem';
            }
        }

        this.update();
    }

    /**
     * Toggle visibility of mobile navigation
     */
    handleToggleMobileNav() {
        this.mobileNavIsExpanded = !this.mobileNavIsExpanded;
        this.update();
    }

    /**
     * Toggle visibility of the specified subnav
     * @param {MouseEvent} event
     */
    handleTogglePopup(event) {
        const $currentMenuItem = this.menuItems[this.currentMenuItemIndex] ? .$menuItem;
        const $toggleMenuItem = event.target.closest('button');

        if ($currentMenuItem === $toggleMenuItem) {
            // The current menu item was clicked, so we toggle the subnav expanded state
            this.subnavIsExpanded = !this.subnavIsExpanded;
        } else {
            // A different menu item was clicked, so we set make that active and
            // expand the subnav.
            this.currentMenuItemIndex = this.menuItems.findIndex((menuItem) => (
                menuItem.$menuItem === $toggleMenuItem
            ));
            this.subnavIsExpanded = true;
        }

        this.update();
    }

    handleWindowResize() {
        // Updates are only called if state should change, to maintain performance
        if (this.mobileNavIsExpanded) {
            this.mobileNavIsExpanded = false;
            this.update();
        } else if (this.subnavIsExpanded) {
            this.subnavIsExpanded = false;
            this.update();
        }
    }

    setVars() {
        /** @type {Number|null} */
        this.currentMenuItemIndex = null;

        /** @type {Number|null} */
        this.currentSubnavLinkIndex = null;

        /** @type {MenuItem[]} */
        this.menuItems = [];

        /** @type {boolean} */
        this.mobileNavIsExpanded = false;

        /** @type {'menuItem'|'toggle'|null} */
        this.nextFocusElement = null;

        /** @type {boolean} */
        this.subnavIsExpanded = false;
    }

    update() {
        /*
         * Mobile Nav
         */
        this.$toggleMobileNav.setAttribute('aria-expanded', this.mobileNavIsExpanded);
        this.$siteNav.dataset.isExpanded = this.mobileNavIsExpanded;
        document.documentElement.setAttribute('mobile-nav-expanded', this.mobileNavIsExpanded);

        /*
         * Menu Item Selection
         */
        if (this.nextFocusElement === 'menuItem') {
            this.currentMenuItemIndex = 0;
        }

        // Ensure that we're not including the CTA overflow element unnecessarily,
        // since it's hidden at the 'nav' breakpoint. (NOTE: We use offsetHeight
        // instead of offsetParent because Safari always reports `null`)
        const visibleMenuItems = this.menuItems.filter((menuItem) => menuItem.$menuItem.offsetHeight > 0);

        // Correct invalid indices if necessary
        if (this.currentMenuItemIndex < 0) {
            this.currentMenuItemIndex = visibleMenuItems.length - 1;
        } else if (this.currentMenuItemIndex >= visibleMenuItems.length) {
            this.currentMenuItemIndex = 0;
        }

        const currentMenuItem = visibleMenuItems[this.currentMenuItemIndex];

        // Update focus
        if (this.nextFocusElement === 'menuItem' || this.nextFocusElement === null) {
            currentMenuItem ? .$menuItem.focus();
        } else if (this.nextFocusElement === 'toggle') {
            this.$toggleMobileNav.focus();
        }

        /*
         * Submenus
         */
        if (this.subnavIsExpanded && !currentMenuItem.hasSubnav) {
            // Close subnavs if the current menu item doesn't have a subnav. This
            // helps prevent subnavs from popping in and out of view unexpectedly when
            // cycling through menu items.
            this.subnavIsExpanded = false;
        }

        if (!this.subnavIsExpanded) {
            // Reset when the subnav is closed
            this.currentSubnavLinkIndex = null;
        }

        visibleMenuItems.forEach((menuItem, index) => {
            if (menuItem.hasSubnav) {
                const subnavIsExpanded = this.subnavIsExpanded && index === this.currentMenuItemIndex;
                menuItem.$menuItem.setAttribute('aria-expanded', subnavIsExpanded);
                menuItem.$subnav.dataset.isExpanded = subnavIsExpanded;

                if (subnavIsExpanded) {
                    // Correct invalid indices if necessary
                    if (this.currentSubnavLinkIndex < 0) {
                        this.currentSubnavLinkIndex = menuItem.$subnavLinks.length - 1;
                    } else if (this.currentSubnavLinkIndex >= menuItem.$subnavLinks.length) {
                        this.currentSubnavLinkIndex = 0;
                    }

                    menuItem.$subnavLinks.forEach(($subnavLink, index) => {
                        if (index === this.currentSubnavLinkIndex) {
                            $subnavLink.focus();
                        }
                    });
                }
            }
        });

        /*
         * Cleanup
         */
        this.nextFocusElement = null;
    }
}

if (!customElements.get('site-nav')) {
    customElements.define('site-nav', SiteNav);
}


/**
 * @typedef {Object} MenuItem
 * @property {boolean} hasSubnav
 * @property {HTMLAnchorElement|HTMLButtonElement} $menuItem - the button that toggles visibility of the subnav
 * @property {HTMLDivElement} [$subnav] - the element itself
 * @property {HTMLAnchorElement[]} [$subnavLinks] - all links in the subnav
 */