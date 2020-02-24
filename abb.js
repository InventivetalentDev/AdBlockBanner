(function (window, document) {
    'use strict'

    let config = window.ABB_config || INSTALL_OPTIONS || {};
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
            enableReporting: true,// Toggle reporting of adblocker state to the dashboard
            previewAdblock: false,
        }, config);
    window.ABB_config = config;


    function placeInRegion(el) {
        let parent = el.parentNode;

        if (parent.classList.contains("abb_parent") && el.classList.contains("abb_has_ad_replacement")) {
            return;
        }

        let wrapper = document.createElement("div");
        wrapper.style = config.wrapperStyle;
        wrapper.style.setProperty("background-color", config.backgroundColor);
        wrapper.style.setProperty("color", config.textColor);
        wrapper.style.setProperty("width", el.style.getPropertyValue("width"));
        wrapper.style.setProperty("height", el.style.getPropertyValue("height"));
        wrapper.style.setProperty("display", "inline-block");
        wrapper.innerHTML = "<p class='abb_text'  style='" + config.textStyle + "'>" + config.text + "</p>";

        if (config.insertPosition === "before") {
            parent.insertBefore(wrapper, el);
        } else if (config.insertPosition === "after") {
            parent.insertBefore(wrapper, el.nextSibling);
        } else if (config.insertPosition === "inside") {
            el.appendChild(wrapper);
        }

        parent.classList.add("abb_parent");

        el.classList.add("abb_original_ad_region");
        el.classList.add("abb_has_ad_replacement");
    }

    function checkRegions() {
        let adblockEnabled = null;
        let isPreview = (config.previewAdblock && typeof INSTALL_ID !== "undefined" && INSTALL_ID === 'preview');
        for (let j = 0; j < config.selectors.length; j++) {
            let selector = config.selectors[j];
            let matches = document.querySelectorAll(selector);
            if (matches.length > 0 && adblockEnabled === null) adblockEnabled = false;
            for (let i = 0; i < matches.length; i++) {
                let match = matches[i];
                if (isEmpty(match) || isPreview) {
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

        if (adblockEnabled !== null) {
            if (config.enableAnalytics && typeof ga === "function") {
                if (ga.hasOwnProperty("getAll")) {// https://stackoverflow.com/a/40761709/6257838
                    let allTrackers = ga.getAll();
                    if (allTrackers && allTrackers.length > 0) {
                        allTrackers[0].send("event", "AdBlockBanner", adblockEnabled ? "adblock_on" : "adblock_off");
                    }
                }
                ga("send", "event", "AdBlockBanner", adblockEnabled ? "adblock_on" : "adblock_off");
            }

            if (config.enableReporting) {
                let xhr = new XMLHttpRequest();
                xhr.open("POST", 'https://abb.inventivetalent.org/report.php', true);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send("host=" + location.hostname + "&path=" + location.pathname + "&adblocker=" + adblockEnabled);
            }
        }
    }

    setTimeout(run, config.delay);


})(window, document);
