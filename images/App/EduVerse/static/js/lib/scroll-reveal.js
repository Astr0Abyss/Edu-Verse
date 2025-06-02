class ScrollReveal {
    constructor(element) {
        this.element = element;
        this.setVars();
        this.bindObserver();
    }

    bindObserver() {
        this.observer = new IntersectionObserver(this.observerCallback, this.options);
        this.observer.observe(this.element);
    }

    observerCallback(entries) {
        document.body.classList.add('has-scroll-reveal');

        entries.forEach((entry) => {
            const el = entry.target;
            const delay = el.getAttribute('animate-delay') || 50;

            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('isVisible');
                }, delay);

                if (el.hasAttribute('animate-up-children')) {
                    const children = el.querySelectorAll('[animate-up-child]');
                    let staggerDelay = delay;

                    children.forEach((child, index) => {
                        staggerDelay = index == 0 ? delay : parseInt(staggerDelay) + 175;

                        setTimeout(() => {
                            child.classList.add('isVisible');
                        }, staggerDelay);
                    });
                }
            }
        });
    }

    setVars() {
        this.observer = null;
        this.options = {
            rootMargin: '0px',
            threshold: 0,
        };
    }
}


const $sections = document.querySelectorAll('[animate-up]');
$sections.forEach(($section) => {
    new ScrollReveal($section);
});