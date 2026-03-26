function onOpen() {
  SlidesApp.getUi()
    .createMenu('Holden\'s Toolbox')
    .addItem('Count Selected Objects', 'countSelectedObjects')
    .addItem('Rainbowfy Text Colour', 'rainbowTextColor')
    .addItem('Rainbowfy Text Highlight', 'rainbowTextHighlight')
    .addSeparator()
    .addItem('Holden\'s Toolbox v' + version, 'dispInfo')
    .addItem('Made by Holden Myles', 'dispInfo')
    .addToUi();
    var version = "1.0"
}

function countSelectedObjects() {
  var presentation = SlidesApp.getActivePresentation();
  var selection = presentation.getSelection();
  var pageElements = selection.getPageElementRange();

  var count = 0;

  if (pageElements) {
    count = pageElements.getPageElements().length;
  }

  SlidesApp.getUi().alert('You have selected ' + count + ' object(s).');
}

function rainbowTextColor() {
  RainbowText(false);
}

function rainbowTextHighlight() {
  RainbowText(true);
}

function RainbowText(isHighlight) {
  var selection = SlidesApp.getActivePresentation().getSelection();
  var textRange = selection.getTextRange();

  if (!textRange) {
    SlidesApp.getUi().alert("Please select some text first.");
    return;
  }

  var textLength = textRange.getLength();
  if (textLength === 0) return;

  var h = 0;
  var s = 1;
  var v = 1;

  var fullText = textRange.asString();

  for (var idx = 0; idx < textLength; idx++) {
    var char = fullText.charAt(idx);

    // Skip spaces and line breaks (optional but cleaner)
    if (char === " " || char === "\n") continue;

    var rgb = hsvToRgb(h / 360, s, v);
    var hex = rgbToHex(rgb[0], rgb[1], rgb[2]);

    var charStyle = textRange.getRange(idx, idx + 1).getTextStyle();

    if (isHighlight) {
      charStyle.setBackgroundColor(hex);
    } else {
      charStyle.setForegroundColor(hex);
    }

    h += 360 / textLength;
  }
}

/* =========================
   Helper: HSV → RGB
   ========================= */

function hsvToRgb(h, s, v) {
  var r, g, b;

  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }

  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255)
  ];
}

/* =========================
   Helper: RGB → Hex
   ========================= */

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1);
}

/*==========
Display Info
==========*/
function dispInfo() {
  var ui = SlidesApp.getUi();

  var response = ui.alert(
    'Holden\'s Toolbox v' + version + '\nMade by Holden Myles...',
    ui.ButtonSet.YES_NO
  );

  if (response === ui.Button.YES) {
    Logger.log('User triggered update check');

    var updates = checkForUpdates();

    if (updates === 0) {
      Logger.log('No updates available.');
      ui.alert('No updates available.');
    } else {
      Logger.log('Updates available but not implemented');
      ui.alert('New update available:' + updates + '\nDownload the update here: \nhttps://github.com/holdenawesome15/holdens-toolbox-for-slides/tree/main');
      Utilities.sleep(2000);
      ui.alert('Updates completed.');
    }
  }
}
/**
*@returns {Boolean}
*/
function checkForUpdates() {
  var currentVersion = version;
  var url = "https://raw.githubusercontent.com/holdenawesome15/holdens-toolbox-for-slides/main/version.json";

  try {
    var response = UrlFetchApp.fetch(url);
    var data = JSON.parse(response.getContentText());

    var latestVersion = data.version;

    Logger.log("Current: " + currentVersion);
    Logger.log("Latest: " + latestVersion);

    if (latestVersion !== currentVersion) {
      return latestVersion; // update available
    }

    return 0; // up to date
  } catch (e) {
    Logger.log("Update check failed: " + e);
    return 0;
  }
}
