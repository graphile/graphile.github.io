'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var main = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var ua, isIpad, result, slideEl, previewEl;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            ua = navigator.userAgent;
            isIpad = /iPad/i.test(ua);

            if (isIpad) {
              document.body.className = document.body.className + " ipad";
            }
            _context4.prev = 3;
            _context4.next = 6;
            return fetch('slides.md');

          case 6:
            result = _context4.sent;
            _context4.next = 9;
            return result.text();

          case 9:
            lastSource = _context4.sent;

            slideshow = remark.create({
              source: lastSource,
              slideNumberFormat: function slideNumberFormat(current, total) {
                return current;
              },
              ratio: '4:3',
              highlightLines: true,
              highlightSpans: false, // We need ES6 backticks
              countIncrementalSlides: false,
              navigation: {
                scroll: false,
                touch: false,
                click: false
              }
            });
            hidePrintSlides();
            setupBrowserSync();
            if (isIpad) {
              slideEl = document.getElementsByClassName('remark-slides-area')[0];

              if (slideEl) {
                slideEl.addEventListener('touchend', function (event) {
                  if (document.body.className.match(/remark-presenter-mode/)) {
                    slideshow.gotoPreviousSlide();
                  } else {
                    slideshow.gotoNextSlide();
                  }
                }, false);
              }
              previewEl = document.getElementsByClassName('remark-preview-area')[0];

              if (previewEl) {
                previewEl.addEventListener('touchend', function (event) {
                  slideshow.gotoNextSlide();
                }, false);
              }
            }
            _context4.next = 20;
            break;

          case 16:
            _context4.prev = 16;
            _context4.t0 = _context4['catch'](3);

            console.error(_context4.t0);
            document.body.innerHTML = '<h1>An error ocurred!<' + '/h1>';

          case 20:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[3, 16]]);
  }));

  return function main() {
    return _ref4.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function parseLanguage(lang) {
  return {
    js: 'jsx'
  }[lang] || lang;
}
remark.highlighter.engine.highlightBlock = function (block) {
  var language = parseLanguage(block.className.split(" ")[0]);
  var prismLang = Prism.languages[language];
  if (prismLang) {
    block.parentNode.className = block.parentNode.className + ' language-' + language;
    var html = Prism.highlight(block.textContent, prismLang);
    var lines = html.split('\n');
    var currentSpan = null;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (currentSpan) {
        line = currentSpan + line;
        currentSpan = null;
      }
      var openTags = [];
      var re = /(<span[^>]*>|<\/span>)/gi;
      var matches = void 0;
      while ((matches = re.exec(line)) != null) {
        var tag = matches[1];
        if (tag[1] === '/') {
          openTags.pop();
        } else {
          openTags.push(tag);
        }
      }
      currentSpan = openTags.join('');
      line = line + ('</' + 'span>').repeat(openTags.length);
      lines[i] = line;
    }
    block.innerHTML = lines.join('\n');
  } else {
    console.warn('Language \'' + language + '\' not supported?');
  }
};
var amMaster = false;
function setupBrowserSync() {
  var _this = this;

  var attempts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  if (window.___browserSync___) {
    var handleKeypress = function handleKeypress(e) {
      if (e.key === '!') {
        amMaster = true;
        var slide = slideshow.getSlides()[slideshow.getCurrentSlideIndex()];
        var slideIndex = slide.getSlideIndex();
        ___browserSync___.socket.emit('change-slide', { slideIndex: slideIndex });
      } else if (e.key === 'e') {
        var _slide = slideshow.getSlides()[slideshow.getCurrentSlideIndex()];
        if (_slide) {
          var _slide$properties = _slide.properties,
              file = _slide$properties['source-file'],
              lineString = _slide$properties['source-line'];

          if (file && lineString) {
            var line = parseInt(lineString, 10) || 1;
            var offset = Object.keys(_slide.properties || {}).length - 2 - 1 + 1;
            ___browserSync___.socket.emit('edit', {
              file: file,
              line: line + Math.max(1, Math.min(5, offset))
            });
          }
        }
      } else if (e.key === 't' && amMaster) {
        ___browserSync___.socket.emit('cmd', 't');
      }
    };

    console.log("Listening for browsersync events");
    var lastSlideIndex = void 0;

    window.addEventListener('keypress', handleKeypress, false);
    slideshow.on('showSlide', function (slide) {
      var slideIndex = slide.getSlideIndex();
      if (amMaster) {
        lastSlideIndex = slideIndex;
        ___browserSync___.socket.emit('change-slide', { slideIndex: slideIndex });
      }
    });
    ___browserSync___.socket.on('cmd', function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(msg) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!amMaster) {
                  if (msg === 't') {
                    // reset timer
                    slideshow.resetTimer();
                  }
                }

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }));

      return function (_x2) {
        return _ref.apply(this, arguments);
      };
    }());
    ___browserSync___.socket.on('change-slide', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(msg) {
        var newSlideIndex;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                newSlideIndex = parseInt((msg || {}).slideIndex, 10);

                if (!amMaster && newSlideIndex >= 0) {
                  lastSlideIndex = newSlideIndex;
                  slideshow.gotoSlide(newSlideIndex + 1);
                }

              case 2:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this);
      }));

      return function (_x3) {
        return _ref2.apply(this, arguments);
      };
    }());
    ___browserSync___.socket.on('reload:slides.md', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var result2, newSource, targetSlide, slideNumber, i, l, oldChr, newChr, _newSource$substr$mat, _newSource$substr$mat2, _, metaMatches, lines, values, currentSlideCount;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              console.log("RELOAD SLIDES");
              _context3.prev = 1;
              _context3.next = 4;
              return fetch('slides.md');

            case 4:
              result2 = _context3.sent;
              _context3.next = 7;
              return result2.text();

            case 7:
              newSource = _context3.sent;

              if (!(lastSource !== newSource)) {
                _context3.next = 28;
                break;
              }

              targetSlide = void 0;
              slideNumber = 1;
              i = 0, l = Math.min(lastSource.length, newSource.length);

            case 12:
              if (!(i < l)) {
                _context3.next = 22;
                break;
              }

              oldChr = lastSource[i];
              newChr = newSource[i];

              if (newChr === '\n') {
                if (newSource.substr(i + 1, 4).match(/^---?\n/)) {
                  // TODO: don't let this break inside code blocks

                  // Check if this slide is excluded
                  _newSource$substr$mat = newSource.substr(i + 1).match(/^---?\n(\n*[a-z_-]+:[ a-z0-9-/._]*\n)*/i), _newSource$substr$mat2 = _slicedToArray(_newSource$substr$mat, 2), _ = _newSource$substr$mat2[0], metaMatches = _newSource$substr$mat2[1];
                  lines = (metaMatches || '').split('\n');
                  values = lines.reduce(function (memo, line) {
                    var matches = line.match(/^([a-z_-]+):(.*)$/i);
                    if (matches) {
                      var _matches = _slicedToArray(matches, 3),
                          _2 = _matches[0],
                          key = _matches[1],
                          value = _matches[2];

                      memo[key] = value.trim();
                    }
                    return memo;
                  }, {});

                  if (values.layout !== 'true' && values.exclude !== true) {
                    slideNumber++;
                  }
                }
              }

              if (!(oldChr !== newChr)) {
                _context3.next = 19;
                break;
              }

              targetSlide = slideNumber;
              return _context3.abrupt('break', 22);

            case 19:
              i++;
              _context3.next = 12;
              break;

            case 22:
              currentSlideCount = slideshow.getSlideCount();

              if (targetSlide <= currentSlideCount) {
                slideshow.gotoSlide(targetSlide);
              }
              lastSource = newSource;
              slideshow.loadFromString(newSource);
              if (targetSlide) {
                slideshow.gotoSlide(targetSlide);
              } else {
                slideshow.gotoLastSlide();
              }
              hidePrintSlides();

            case 28:
              _context3.next = 33;
              break;

            case 30:
              _context3.prev = 30;
              _context3.t0 = _context3['catch'](1);

              console.error(_context3.t0);

            case 33:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this, [[1, 30]]);
    })));
  } else if (document.readyState !== 'loaded') {
    console.log(document.readyState);
    if (attempts < 10) {
      setTimeout(function () {
        return setupBrowserSync(attempts + 1);
      }, Math.round(10 * Math.pow(1.5, 2)));
    }
  }
}

function hidePrintSlides() {
  var allSlides = slideshow.getSlides();
  var lastSlide = void 0;
  var currentSlide = void 0;
  var slidesToHide = [];
  var slidesEl = document.getElementsByClassName("remark-slides-area")[0];
  var slideEls = slidesEl.children;
  for (var i = 0; i < allSlides.length; i++) {
    lastSlide = currentSlide;
    currentSlide = allSlides[i];
    if (lastSlide && (String(lastSlide.properties.continued) === "true" || String(currentSlide.properties.count) === "false")) {
      var slideToHideIndex = i - 1;
      slidesToHide.push(slideToHideIndex);
      slideEls[slideToHideIndex].className = slideEls[slideToHideIndex].className + ' has-continuation';
    }
  }
}

var lastSource = void 0;
var slideshow = void 0;

window.syntaxWasValid = true;

document.addEventListener('DOMContentLoaded', main, false);

/* Disable double-tap zoom on iPad */

var lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  event.preventDefault();
}, false);
