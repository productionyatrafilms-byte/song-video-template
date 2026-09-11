// index.html — poster/playing state toggle + "zoom through the door" transition (GSAP-driven) +
// the video module overlay (the real assets/videos/1.mp4 playback)
document.addEventListener('DOMContentLoaded', function () {
    var mainContainer = document.getElementById('mainContainer');
    var bgLayer = document.getElementById('bgLayer');
    var hoverZone = document.getElementById('posterHoverZone');
    var btnVideoLaunch = document.getElementById('btnVideoLaunch');
    var videoOverlay = document.getElementById('videoOverlay');
    var songVideo = document.getElementById('songVideo');
    var btnVideoToggle = document.getElementById('btnVideoToggle');
    var btnVideoRefresh = document.getElementById('btnVideoRefresh');
    var scenePoster = bgLayer.querySelector('.scene--poster');
    var scenePlaying = bgLayer.querySelector('.scene--playing');
    var clickAudio = new Audio('./assets/audio/click.mp3');
    var isBusy = false;

    // `.bg-layer` (the background images) lives outside `#mainContainer` now — a plain sibling,
    // not a descendant — so CSS can't reach it via `.main-container.is-X .scene--Y` any more.
    // Both elements carry the SAME state classes, kept in sync here, so index.css can target each
    // independently (`.main-container.is-X ...` / `.bg-layer.is-X ...`) while index.js only has to
    // reason about one piece of state.
    function setState(remove, add) {
        mainContainer.classList.remove.apply(mainContainer.classList, remove);
        bgLayer.classList.remove.apply(bgLayer.classList, remove);
        mainContainer.classList.add.apply(mainContainer.classList, add);
        bgLayer.classList.add.apply(bgLayer.classList, add);
    }

    function playClickSound() {
        clickAudio.currentTime = 0;
        clickAudio.play().catch(function () {});
    }

    // Two sequential phases — see the comment above `.scene--poster` in index.css for the full
    // rationale (why bg2 only ever appears once, why phase 2 keeps growing in the same direction
    // phase 1 was already moving in, etc). This ONLY reveals the bg2 scene — it doesn't touch the
    // video at all; that's entirely #btnVideoLaunch's job, below.
    function startZoom() {
        isBusy = true;
        playClickSound();
        setState([], ['is-zooming']);

        gsap.timeline()
            // Phase 1: zoom into bg-4-1 (the door illustration) until "the door".
            // NOTE: both endpoints must share the SAME unit ("0vw", not bare 0) — GSAP can't
            // interpolate between a unitless value and a vw one, and silently snaps instantly to
            // the end value instead of tweening if the units don't match.
            .fromTo(scenePoster, { z: '0vw' }, { z: '56vw', duration: 1.3, ease: 'power2.in' })
            .call(function () {
                setState(['is-poster', 'is-zooming'], ['is-playing']);
            })
            // Phase 2: from the door onward, bg2 fullscreens — starts SMALLER (0.85) and grows to
            // its natural size, continuing phase 1's forward motion rather than reversing it.
            .fromTo(scenePlaying, { scale: 0.85 }, {
                scale: 1,
                duration: 0.8,
                ease: 'power3.out',
                onComplete: function () {
                    gsap.set([scenePoster, scenePlaying], { clearProps: 'all' });
                    isBusy = false;
                }
            });
    }

    hoverZone.addEventListener('click', function () {
        if (isBusy || !mainContainer.classList.contains('is-poster')) { return; }
        startZoom();
    });

    // ===== video module overlay =====

    // Fullscreen the VIDEO ELEMENT ITSELF, not the whole page — per user request: it should open
    // full screen, and the viewer can then shrink it back down themselves. Requesting fullscreen
    // on `songVideo` puts the browser's OWN fullscreen video UI in charge, which already has a
    // built-in "exit fullscreen" control in its controls bar (and still responds to Esc) — that
    // IS the shrink-back-down action, for free, with no extra button of our own needed. Exiting it
    // just returns the video to its normal (windowed, `max-width/max-height` capped) size inside
    // `#videoOverlay` — playback and our own controls underneath are untouched either way.
    //
    // Must be called SYNCHRONOUSLY inside the click handler itself — browsers only honor
    // `requestFullscreen()` as a direct result of a user gesture; calling it later (e.g. after an
    // animation, or from a promise callback) is out of that gesture's call stack and gets silently
    // rejected. That's why this lives in #btnVideoLaunch's own click handler.
    function enterFullscreen() {
        var request = songVideo.requestFullscreen
            || songVideo.webkitRequestFullscreen
            || songVideo.webkitEnterFullscreen; // iOS Safari's native video-fullscreen API
        if (!request) { return; }
        try {
            // Only the standard `requestFullscreen()` returns a promise — the vendor-prefixed
            // fallbacks don't, so guard the `.catch()` rather than assuming one exists.
            var result = request.call(songVideo);
            if (result && result.catch) { result.catch(function () {}); }
        } catch (e) { /* ignore — fullscreen is a nice-to-have, not required for playback */ }
    }

    function setToggleIcon(isPlaying) {
        btnVideoToggle.querySelector('img').src = isPlaying
            ? './assets/images/pause.png'
            : './assets/images/play.png';
        btnVideoToggle.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
    }

    // Keep the toggle icon correct regardless of WHY playback state changed (our own button, the
    // refresh button, the video reaching its end, etc.) rather than tracking it separately.
    songVideo.addEventListener('play', function () { setToggleIcon(true); });
    songVideo.addEventListener('pause', function () { setToggleIcon(false); });

    btnVideoLaunch.addEventListener('click', function () {
        playClickSound();
        enterFullscreen();
        videoOverlay.hidden = false;
        songVideo.currentTime = 0;
        songVideo.play().catch(function () {});
    });

    btnVideoToggle.addEventListener('click', function () {
        playClickSound();
        if (songVideo.paused || songVideo.ended) {
            songVideo.play().catch(function () {});
        } else {
            songVideo.pause();
        }
    });

    btnVideoRefresh.addEventListener('click', function () {
        playClickSound();
        songVideo.currentTime = 0;
        songVideo.play().catch(function () {});
    });
});
