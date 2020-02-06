(function (window, document) {
    let config = window.ABB_config || {};
    config = Object.assign({},
        {
            text: "Hi! Please disable your AdBlocker for this site to keep it running, thanks :)", // Text to be displayed
            selectors: [".adsbygoogle"], // Ad Region selectors - should be the element that usually contains the ad body
            backgroundColor: '#e10000',
            textColor: '#000000',
            wrapperStyle: 'border-radius: 5px',
            textStyle: 'text-align: center; font-size: 2rem; font-family:',
            delay: 2000,
            insertPosition: 'before', // before, after, inside
            enableAnalytics: false,// Toggle Google Analytics - will send a custom event for adblock_on or adblock_off
        }, config);
    window.ABB_config = config;


    function placeInRegion(el) {
        let parent = el.parentNode;

        let wrapper = document.createElement("div");
        wrapper.style = window.ABB_config.wrapperStyle;
        wrapper.style.setProperty("background-color", window.ABB_config.backgroundColor);
        wrapper.style.setProperty("color", window.ABB_config.textColor);
        wrapper.style.setProperty("width", el.style.getPropertyValue("width"));
        wrapper.style.setProperty("height", el.style.getPropertyValue("height"));
        wrapper.style.setProperty("display", "inline-block");
        wrapper.innerHTML = "<p class='abb_text'  style='" + window.ABB_config.textStyle + "'>" + window.ABB_config.text + "</p>";

        if (window.ABB_config.insertPosition === "before") {
            parent.insertBefore(wrapper, el);
        } else if (window.ABB_config.insertPosition === "after") {
            parent.insertBefore(wrapper, el.nextSibling);
        } else if (window.ABB_config.insertPosition === "inside") {
            el.appendChild(wrapper);
        }
    }

    function checkRegions() {
        let adblockEnabled = false;
        for (let j = 0; j < window.ABB_config.selectors.length; j++) {
            let selector = window.ABB_config.selectors[j];
            let matches = document.querySelectorAll(selector);
            for (let i = 0; i < matches.length; i++) {
                let match = matches[i];
                if (isEmpty(match)) {
                    placeInRegion(match);
                    adblockEnabled = true;
                }
            }
        }
        return adblockEnabled;
    }

    function isEmpty(el) {
        return el.childElementCount <= 0;
    }

    function run() {
        let adblockEnabled = checkRegions();

        if (config.enableAnalytics && typeof ga === "function") {
            if (ga.hasOwnProperty("getAll")) {// https://stackoverflow.com/a/40761709/6257838
                let allTrackers = ga.getAll();
                if (allTrackers && allTrackers.length > 0) {
                    allTrackers[0].send("event", "AdBlockBanner", adblockEnabled ? "adblock_on" : "adblock_off");
                }
            }
            ga("send", "event", "AdBlockBanner", adblockEnabled ? "adblock_on" : "adblock_off");
        }
    }

    setTimeout(run, window.ABB_config.delay);


})(window, document);
