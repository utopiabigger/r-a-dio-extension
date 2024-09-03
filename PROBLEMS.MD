problems
- audio in background
- fix artist / title similar to Firefox

fixed
- volume slider
- API for duration 00:00/00:00
- API for duration bar

might not work in chrome
- audio in background

notes
```
// Keep the service worker alive
setInterval(() => {
  console.log('Keeping service worker alive');
  chrome.runtime.getPlatformInfo(() => {});
}, 25 * 60 * 1000); // Every 25 minutes
```