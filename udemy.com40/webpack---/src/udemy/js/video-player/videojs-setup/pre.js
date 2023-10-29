// This setting needs to be defined before videojs is imported, to prevent it from adding
// extra <style> blocks to the head of the document defining the video size (which can
// conflict with our own defined styles).
// Even when we stop using videojs for UI it would be good to keep this to avoid an unnecessary
// style block in our document.
window.VIDEOJS_NO_DYNAMIC_STYLE = true;
