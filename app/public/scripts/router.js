/// <reference path='./router.d.ts'/>
/// <reference path='../component/component.d.ts'/>
/// <reference path='../component/layerComponents.d.ts'/>
/// <reference path='../../typings/es6-promise/es6-promise.d.ts'/>
var React = require('/component/element');
var Router = (function () {
    function Router(appName, pages, pageComponents) {
        var _this = this;
        this.appName = appName;
        this.pageComponents = pageComponents;
        this.inInitialPageLoad = true;
        this.hasPushState = window.history && !!window.history.pushState;
        this.routingInfoIndex = {};
        this.routes = [];
        this.currentRegions = [];
        for (var _i = 0; _i < pages.length; _i++) {
            var page = pages[_i];
            var routePattern = '^' + page.route
                .replace(/:(\w+)\//, function (match, param) { return ("(" + param + ")"); })
                .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '$';
            var route = {
                matcher: new RegExp(routePattern),
                path: page.route
            };
            this.routes.push(route);
            this.routingInfoIndex[route.path] = page;
            this.layoutRegion = document.getElementById('LayoutRegion');
        }
        this.checkRouteAndRenderIfMatch(document.location.pathname);
        if (this.hasPushState) {
            window.onpopstate = function () {
                _this.checkRouteAndRenderIfMatch(document.location.pathname);
            };
            this.onPushState = this.checkRouteAndRenderIfMatch;
        }
    }
    Router.prototype.navigateTo = function (route, state) {
        if (this.hasPushState) {
            window.history.pushState(state, null, route);
        }
        else {
            window.location.pathname = route;
        }
        this.onPushState(route);
    };
    Router.prototype.checkRouteAndRenderIfMatch = function (currentRoute) {
        var _this = this;
        this.routes.some(function (route) {
            if (route.matcher.test(currentRoute)) {
                _this.renderPage(_this.routingInfoIndex[route.path]);
                return true;
            }
            return false;
        });
    };
    Router.prototype.loadContentFromJsonScripts = function (placeholderContents, page) {
        for (var _i = 0, _a = page.contents; _i < _a.length; _i++) {
            var content = _a[_i];
            var jsonElement = document.getElementById("composer-content-json-" + content.className.toLowerCase());
            if (!jsonElement) {
                throw new Error("Could not find JSON file " + content.className + ". Are you sure\nthis component is properly named?");
            }
            try {
                this.currentRegions.push(content.region);
                placeholderContents[content.region] = React.createElement(window[this.appName].Component.Content[content.className], jsonElement.innerHTML !== '' ? JSON.parse(jsonElement.innerHTML).data : {}, null);
            }
            catch (err) {
                console.log(jsonElement.innerHTML);
                throw new Error("Could not parse JSON for " + content.className + ".\n " + err.message);
            }
            if (jsonElement.remove) {
                jsonElement.remove();
            }
            else {
                jsonElement.parentElement.removeChild(jsonElement);
            }
        }
    };
    Router.prototype.bindLayoutAndContents = function (page, contents) {
        this.currentLayoutComponent = new this.pageComponents.Layout[page.layout.className](contents);
        this.currentLayoutComponent.bindDOM();
        this.currentContents = this.currentLayoutComponent.customElements;
    };
    Router.prototype.renderLayoutAndContents = function (page, contents) {
    };
    Router.prototype.showErrorDialog = function (err) {
    };
    Router.prototype.loopThroughIrrelevantCurrentContentsAndExec = function (nextPage, method) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var currentNumberOfRemoves = 0;
            var expectedNumberOfRemoves = 0;
            var usedRegions = [];
            if (!_this.currentContents || Object.keys(_this.currentContents).length === 0) {
                return reject(new Error('You have not set any content for the current page.'));
            }
            for (var currentContent in _this.currentContents) {
                if (!_this.currentContents.hasOwnProperty(currentContent))
                    return;
                var removeCurrentContent = true;
                for (var _i = 0, _a = nextPage.contents; _i < _a.length; _i++) {
                    var nextContent = _a[_i];
                    if (nextContent.className === _this.currentContents[currentContent].constructor.name) {
                        removeCurrentContent = false;
                        usedRegions.push(nextContent.region);
                    }
                }
                if (!_this.currentContents[currentContent][method]) {
                    return reject(new Error('You have not implemented a hide or remove method for \'' + currentContent.constructor.name + '\''));
                }
                (function (currentContent) {
                    if (removeCurrentContent) {
                        expectedNumberOfRemoves++;
                        _this.currentContents[currentContent].recursivelyCallMethod(method)
                            .then(function () {
                            currentNumberOfRemoves++;
                            if (method === 'remove') {
                                for (var _i = 0, _a = _this.currentRegions; _i < _a.length; _i++) {
                                    var r = _a[_i];
                                    // Dispose current regions which are not used on the next page.
                                    // We need dispose them because layout needs to call bindDOM correctly.
                                    if (usedRegions.indexOf(r) === -1) {
                                        _this.currentLayoutComponent.unsetProp(r);
                                    }
                                }
                            }
                            if (currentNumberOfRemoves === expectedNumberOfRemoves) {
                                resolve(undefined);
                            }
                        });
                    }
                })(currentContent);
            }
        });
    };
    Router.prototype.removeIrrelevantCurrentContents = function (nextPage) {
        return this.loopThroughIrrelevantCurrentContentsAndExec(nextPage, 'remove');
    };
    Router.prototype.hideIrrelevantCurrentContents = function (nextPage) {
        return this.loopThroughIrrelevantCurrentContentsAndExec(nextPage, 'hide');
    };
    Router.prototype.renderPage = function (page) {
        var contents = {};
        if (this.inInitialPageLoad) {
            this.loadContentFromJsonScripts(contents, page);
            this.bindLayoutAndContents(page, contents);
            this.inInitialPageLoad = false;
        }
        else {
            this.handleClientPageRequest(page);
        }
    };
    Router.prototype.handleClientPageRequest = function (page) {
        var _this = this;
        var contents = {};
        var currentNumberOfNetworkRequests = 0;
        var expectedNumberOfNetworkRequest = 0;
        this.hideIrrelevantCurrentContents(page).then(function () {
            var contentClassNames = [];
            for (var _i = 0, _a = page.contents; _i < _a.length; _i++) {
                var content = _a[_i];
                var ContentComponent = window[_this.appName].Component.Content[content.className];
                // Filter those which are not going to fetch content from network
                if (_this.currentContents.hasOwnProperty(content.className)) {
                    continue;
                }
                expectedNumberOfNetworkRequest++;
                // Is only used below to get all content instances of the layout component
                contentClassNames.push(content.className);
                (function (contentInfo, ContentComponent) {
                    if (typeof ContentComponent.fetch !== 'function') {
                        throw Error("You have not implemented a static fetch function on your component " + contentInfo.className);
                    }
                    else {
                        ContentComponent.fetch(page.route)
                            .then(function (result) {
                            contents[contentInfo.region] = React.createElement(window[_this.appName].Component.Content[contentInfo.className], result, null);
                            currentNumberOfNetworkRequests++;
                            if (currentNumberOfNetworkRequests === expectedNumberOfNetworkRequest) {
                                var LayoutComponentClass = _this.pageComponents.Layout[page.layout.className];
                                if (LayoutComponentClass.name !== _this.currentLayoutComponent.id) {
                                    var layoutComponent = new LayoutComponentClass(contents);
                                    _this.currentLayoutComponent.remove();
                                    document.getElementById('LayoutRegion').appendChild(layoutComponent.toDOM());
                                    layoutComponent.show();
                                    _this.currentLayoutComponent = layoutComponent;
                                }
                                else {
                                    _this.removeIrrelevantCurrentContents(page).then(function () {
                                        for (var c in contents) {
                                            var content_1 = contents[c];
                                            var region = document.getElementById(c);
                                            if (!region) {
                                                throw new Error('Region \'' + c + '\' is missing.');
                                            }
                                            _this.currentLayoutComponent.setProp(c, content_1);
                                            region.appendChild(content_1.toDOM().frag);
                                            // We must reset the component created by the `toDOM()` method above.
                                            // Because children custom element should not have component reference
                                            // in their create element closure. If we don't reset the component
                                            // reference there will be a custom element property referencing itself.
                                            content_1.resetComponent();
                                        }
                                        _this.currentLayoutComponent.hasBoundDOM = false;
                                        _this.currentLayoutComponent.bindDOM();
                                        _this.currentContents = _this.currentLayoutComponent.customElements;
                                        for (var c in _this.currentContents) {
                                            _this.currentContents[c].recursivelyCallMethod('show');
                                        }
                                    });
                                }
                            }
                        })
                            .catch(function (err) {
                        });
                    }
                })(content, ContentComponent);
            }
        });
    };
    return Router;
})();
exports.Router = Router;
exports["default"] = Router;
