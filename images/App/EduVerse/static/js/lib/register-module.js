const READY_STATES = ['ready', 'complete'];

// keep track of active modules
window.mountedModules = window.mountedModules || [];

/**
 * register module to be initialized
 * @param {String} name
 * @param {Class} ModuleClass
 */
export default function registerModule(name, ModuleClass) {
    /**
     * initialize module on matching elements
     */
    function initializeModule() {
        // get elements with data-js-module attribute matching module name
        const $moduleElements = document.querySelectorAll(`[data-js-module="${name}"]`);
        $moduleElements.forEach(($element) => {
            const module = new ModuleClass($element);
            module.initialize();

            // add to global collection
            window.mountedModules.push(module);
        });
    }

    const isReady = READY_STATES.includes(document.readyState);
    if (isReady) {
        initializeModule();
    } else {
        document.addEventListener('DOMContentLoaded', initializeModule);
    }
}

// add to global namespace
window.registerModule = registerModule;