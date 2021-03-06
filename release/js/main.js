/*rem初始化*/
(function (window, document) {
    (function () {
        var viewportEl = document.querySelector('meta[name="viewport"]'), hotcssEl = document.querySelector('meta[name="hotcss"]'), dpr = window.devicePixelRatio || 1;
        if (hotcssEl) {
            var hotcssCon = hotcssEl.getAttribute("content");
            if (hotcssCon) {
                var initialDpr = hotcssCon.match(/initial\-dpr=([\d\.]+)/);
                if (initialDpr) {
                    dpr = parseFloat(initialDpr[1])
                }
            }
        }
        var scale = 1, content = "width=device-width, initial-scale=" + scale + ", minimum-scale=" + scale + ", maximum-scale=" + scale + ", user-scalable=no";
        if (viewportEl) {
            viewportEl.setAttribute("content", content)
        } else {
            viewportEl = document.createElement("meta");
            viewportEl.setAttribute("name", "viewport");
            viewportEl.setAttribute("content", content);
            document.head.appendChild(viewportEl)
        }
    })();
    var hotcss = {};
    hotcss.px2rem = function (px, designWidth) {
        if (!designWidth) {
            designWidth = parseInt(hotcss.designWidth, 10)
        }
        return parseInt(px, 10) * 320 / designWidth / 20
    };
    hotcss.mresize = function () {
        var innerWidth = window.innerWidth;
        if (!innerWidth) {
            return false
        }
        document.documentElement.style.fontSize = (innerWidth * 20 / 320) + "px"
    };
    hotcss.mresize();
    window.addEventListener("resize", hotcss.mresize, false);
    window.addEventListener("load", hotcss.mresize, false);
    setTimeout(function () {
        hotcss.mresize()
    }, 300);
    window.hotcss = hotcss
})(window, document);