function parseLanguage(lang) {
  return {
    js: 'jsx',
  }[lang] || lang;
}
remark.highlighter.engine.highlightBlock = block => {
  const language = parseLanguage(block.className.split(" ")[0]);
  const prismLang = Prism.languages[language];
  if (prismLang) {
    block.parentNode.className = `${block.parentNode.className} language-${language}`;
    const html = Prism.highlight(block.textContent, prismLang);
    const lines = html.split(`\n`);
    let currentSpan = null;
    for (var i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (currentSpan) {
        line = currentSpan + line;
        currentSpan = null;
      }
      const openTags = [];
      const re = /(<span[^>]*>|<\/span>)/gi;
      let matches;
      while ((matches = re.exec(line)) != null) {
        const tag = matches[1];
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
    console.warn(`Language '${language}' not supported?`)
  }
};
let amMaster = false;
function setupBrowserSync(attempts = 0) {
  if (window.___browserSync___) {
    console.log("Listening for browsersync events")
    let lastSlideIndex;
    function handleKeypress(e) {
      if (e.key === '!') {
        amMaster = true;
        const slide = slideshow.getSlides()[slideshow.getCurrentSlideIndex()];
        const slideIndex = slide.getSlideIndex();
        ___browserSync___.socket.emit('change-slide', {slideIndex});
      } else if (e.key === 'e') {
        const slide = slideshow.getSlides()[slideshow.getCurrentSlideIndex()];
        if (slide) {
          const { 'source-file': file, 'source-line': lineString} = slide.properties;
          if (file && lineString) {
            const line = parseInt(lineString, 10) || 1;
            const offset = (Object.keys(slide.properties || {}).length - 2 - 1) + 1;
            ___browserSync___.socket.emit('edit', {
              file,
              line: line + Math.max(1, Math.min(5, offset)),
            });
          }
        }
      } else if (e.key === 't' && amMaster) {
        ___browserSync___.socket.emit('cmd', 't');
      }
    }
    window.addEventListener('keypress', handleKeypress, false);
    slideshow.on('showSlide', slide => {
      const slideIndex = slide.getSlideIndex();
      if (amMaster) {
        lastSlideIndex = slideIndex;
        ___browserSync___.socket.emit('change-slide', {slideIndex});
      }
    });
    ___browserSync___.socket.on('cmd', async (msg) => {
      if (!amMaster) {
        if (msg === 't') {
          // reset timer
          slideshow.resetTimer();
        }
      }
    });
    ___browserSync___.socket.on('change-slide', async (msg) => {
      const newSlideIndex = parseInt((msg || {}).slideIndex, 10);
      if (!amMaster && newSlideIndex >= 0) {
        lastSlideIndex = newSlideIndex;
        slideshow.gotoSlide(newSlideIndex + 1);
      }
    });
    ___browserSync___.socket.on('reload:slides.md', async () => {
      console.log("RELOAD SLIDES")
      try {
        const result2 = await fetch('slides.md');
        const newSource = await result2.text();
        if (lastSource !== newSource) {
          let targetSlide;
          let slideNumber = 1;
          let i = 0, l = Math.min(lastSource.length, newSource.length);
          for (; i < l; i++) {
            const oldChr = lastSource[i];
            const newChr = newSource[i];
            if (newChr === '\n') {
              if (newSource.substr(i+1, 4).match(/^---?\n/)) {
                // TODO: don't let this break inside code blocks

                // Check if this slide is excluded
                const [_, metaMatches] = newSource.substr(i+1).match(/^---?\n(\n*[a-z_-]+:[ a-z0-9-/._]*\n)*/i)
                const lines = (metaMatches || '').split('\n');
                const values = lines.reduce((memo, line) => {
                  const matches = line.match(/^([a-z_-]+):(.*)$/i)
                  if (matches) {
                    const [_, key, value] = matches;
                    memo[key] = value.trim();
                  }
                  return memo;
                }, {});
                if (values.layout !== 'true' && values.exclude !== true) {
                  slideNumber++;
                }
              }
            }
            if (oldChr !== newChr) {
              targetSlide = slideNumber;
              break;
            }
          }
          const currentSlideCount = slideshow.getSlideCount();
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
        }
      } catch (e) {
        console.error(e);
      }
    })
  } else if (document.readyState !== 'loaded') {
    console.log(document.readyState);
    if (attempts < 10) {
      setTimeout(() => setupBrowserSync(attempts+1), Math.round(10 * Math.pow(1.5, 2)));
    }
  }
}

function hidePrintSlides() {
  const allSlides = slideshow.getSlides();
  let lastSlide;
  let currentSlide;
  const slidesToHide = [];
  const slidesEl = document.getElementsByClassName("remark-slides-area")[0];
  const slideEls = slidesEl.children;
  for (let i = 0; i < allSlides.length; i++) {
    lastSlide = currentSlide;
    currentSlide = allSlides[i];
    if (lastSlide && (
      String(lastSlide.properties.continued) === "true"
      ||
      String(currentSlide.properties.count) === "false"
    )) {
      const slideToHideIndex = i - 1;
      slidesToHide.push(slideToHideIndex);
      slideEls[slideToHideIndex].className = slideEls[slideToHideIndex].className + ' has-continuation';
    }
  }
}

let lastSource
let slideshow
async function main() {
  var ua = navigator.userAgent;
  const isIpad = /iPad/i.test(ua)
  if (isIpad) {
    document.body.className = document.body.className + " ipad";
  }
  try {
    const result = await fetch('slides.md');
    lastSource = await result.text();
    slideshow = remark.create({
      source: lastSource,
      slideNumberFormat: function (current, total) { return current },
      ratio: '4:3',
      highlightLines: true,
      highlightSpans: false, // We need ES6 backticks
      countIncrementalSlides: false,
      navigation: {
        scroll: false,
        touch: false,
        click: false,
      },
    });
    hidePrintSlides();
    setupBrowserSync();
    if (isIpad) {
      const slideEl = document.getElementsByClassName('remark-slides-area')[0];
      if (slideEl) {
        slideEl.addEventListener('touchend', event => {
          if (document.body.className.match(/remark-presenter-mode/)) {
            slideshow.gotoPreviousSlide();
          } else {
            slideshow.gotoNextSlide();
          }
        }, false);
      }
      const previewEl = document.getElementsByClassName('remark-preview-area')[0];
      if (previewEl) {
        previewEl.addEventListener('touchend', event => {
          slideshow.gotoNextSlide();
        }, false);
      }
    }
  } catch (e) {
    console.error(e);
    document.body.innerHTML = '<h1>An error ocurred!<' + '/h1>';
  }
}
window.syntaxWasValid = true;

document.addEventListener('DOMContentLoaded', main, false);


/* Disable double-tap zoom on iPad */

let lastTouchEnd = 0;
document.addEventListener('touchend', event => {
  event.preventDefault();
}, false);

