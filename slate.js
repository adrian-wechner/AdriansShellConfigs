/*** UTILITY FUNCTILNS ***/

function toleranceX(win) {
  return win.app().name() == 'Terminal' ? 10 : 5;
}

function toleranceY(win) {
  return win.app().name() == 'Terminal' ? 10 : 5;
}

function leansLeft(win) {
  var tolX = toleranceX(win);
  var winLeft = win.topLeft().x;

  if(winLeft <= tolX && winLeft >= 0) {
    return true;
  } else {
    return false;
  }
}

function leansRight(win) {
  var tolX = toleranceX(win);
  var winRight = win.topLeft().x + win.size().width;
  var screenWidth = win.screen().vrect().width;

  if(winRight <= screenWidth + tolX && winRight >= screenWidth - tolX) {
    return true;
  } else {
    return false;
  }
}

function leansTop(win) {
  var tolY = toleranceY(win);
  var winTop = win.topLeft().y;
  var compTop = win.screen().rect().height - win.screen().vrect().height; // Compentaste Menubar

  if(winTop <= tolY+compTop && winTop >= -tolY+compTop) {
    return true;
  } else {
    return false;
  }
}

function leansBottom(win) {
  var tolY = toleranceY(win);
  var winBottom = win.topLeft().y + win.size().height;
  var screenHeight = win.screen().rect().height;

  if(winBottom <= screenHeight + tolY && winBottom >= screenHeight - tolY) {
    return true;
  } else {
    return false;
  }
}

function windowSizes() {
  return [0.25, 0.33, 0.50, 0.67, 0.75, 1];
}

function closest(num) {
  var arr = windowSizes();
  var curr = arr[0];
  var diff = Math.abs (num - curr);
  for (var val = 0; val < arr.length; val++) {
    var newdiff = Math.abs (num - arr[val]);
    if (newdiff < diff) {
      diff = newdiff;
      curr = arr[val];
    }
  }
  return curr;
}

function cycleBigger(curr) {
  var closest = closest(curr);
  var sizes = windowSizes();
  var i = sizes.indexOf(curr);
  i = (i >= sizes.length - 1 ? 0 : i+1);
  return sizes[i];
}

function cycleSmaller(curr) {
  var closestValue = closest(curr);
  var sizes = windowSizes();
  var i = sizes.indexOf(closestValue);
  i = (i <= 0 ? sizes.length - 1 : i-1);
  return sizes[i];
}

function percWidth(win) {
  return Math.floor(win.size().width / win.screen().rect().width * 100) / 100;
}

function percHeight(win) {
  return Math.floor(win.size().height / win.screen().vrect().height * 100) / 100;
}

function cycleWindows(win) {
  var i = 0;
  var winCount = 0;
  win.app().eachWindow(function(w) { winCount++ });
  win.app().eachWindow(function(w) {
    if(i == winCount-1) {
      w.focus();
    }
    i++;
  });
}


/*** Configs ***/
S.cfga({
  "defaultToCurrentScreen" : true,
  "secondsBetweenRepeat" : 0.1,
  "checkDefaultsOnLoad" : true,
  "focusCheckWidthMax" : 3000,
  "orderScreensLeftToRight" : true
});

var hyper = ":cmd;alt;ctrl";
var hypershift = ":cmd;alt;ctrl;shift";

/*** Operations ***/
var lapFull = S.op("move", {
  "x" : "screenOriginX",
  "y" : "screenOriginY",
  "width" : "screenSizeX",
  "height" : "screenSizeY"
});

var rightHalf = S.op("move", {
  "x" : "screenOriginX+screenSizeX/2",
  "y" : "screenOriginY",
  "width" : "screenSizeX/2",
  "height" : "screenSizeY"
});

var leftHalf = S.op("move", {
  "x" : "screenOriginX",
  "y" : "screenOriginY",
  "width" : "screenSizeX/2",
  "height" : "screenSizeY"
});

var topHalf = S.op("move", {
  "x" : "screenOriginX",
  "y" : "screenOriginY",
  "width" : "screenSizeX",
  "height" : "screenSizeY/2"
});

var bottomHalf = S.op("move", {
  "x" : "screenOriginX",
  "y" : "screenOriginY+screenSizeY/2",
  "width" : "screenSizeX",
  "height" : "screenSizeY/2"
});

var stretchHorizontal = S.op("move", {
  "x" : 0,
  "y" : "windowTopLeftY",
  "width": "screenSizeX",
  "height": "windowSizeY"
});

var stretchVertical = S.op("move", {
  "x" : "windowTopLeftX",
  "y" : 0,
  "width": "windowSizeX",
  "height": "screenSizeY"
});

var alignRight = S.op("move", {
  "x" : "screenOriginX+screenSizeX-windowSizeX",
  "y" : "windowTopLeftY",
  "width": "windowSizeX",
  "height": "windowSizeY"
});

var alignBottom = S.op("move", {
  "x" : "windowTopLeftX",
  "y" : "screenOriginY+screenSizeY-windowSizeY",
  "width": "windowSizeX",
  "height": "windowSizeY"
});


/*** BINDINGS ***/
S.bind("return"+hyper, function(win) {
  var closestWidthRatio = closest(percWidth(win));
  var closestHeightRatio = closest(percHeight(win));
  if(closestWidthRatio == 1 && closestHeightRatio == 1) {
    win.doOperation(S.op("move", {
      "x": "screenOriginX+screenSizeX/3",
      "y": 0,
      "width": "screenSizeX/3",
      "height": "screenSizeY"
    }));
  } else if(closestWidthRatio == 0.33 && closestHeightRatio == 1) {
    win.doOperation(S.op("move", {
      "x": "screenOriginX+screenSizeX/8",
      "y": "screenOriginY+screenSizeY/10",
      "width": "screenSizeX*0.75",
      "height": "screenSizeY*0.8"
    }));
  } else {
    win.doOperation(lapFull);
  }
});

S.bind("left"+hyper, function(win) {
  if(leansLeft(win)) {
    var expression = "screenSizeX*" + cycleSmaller(percWidth(win));
    var before = win.size().width;
    var after = 0;

    win.doOperation(S.op("move", {
      "x": 0,
      "y": "windowTopLeftY",
      "width": expression,
      "height": "windowSizeY"
    }));

    after = win.size().width;

    // Check if sizing hasn't changed => MIN Reached => Expand
    // HACK: this is a hack, better would be to know minimum size beforehand
    if(before == after) {
      win.doOperation(stretchHorizontal);
    }
  }
  else {
    win.doOperation(leftHalf);
  }
});

S.bind("right"+hyper, function(win) {
  if(leansRight(win)) {
    var windowRatio = cycleSmaller(percWidth(win));
    var expression = "screenSizeX*" + windowRatio;
    var before = win.size().width;
    var after = 0;

    // The desired Move
    win.doOperation(S.op("move", {
      "x": (1-windowRatio) * win.screen().rect().width,
      "y": "windowTopLeftY",
      "width": expression,
      "height": "windowSizeY"
    }));

    after = win.size().width;
    
    // Check if outside of screen. and size changed. => Surpassed MIN => Re-Align
    // HACK: this is a hack, better would be to know minimum size beforehand
    if(win.topLeft().x + after > win.screen().rect().width + toleranceX(win) && before != after) {
      win.doOperation(alignRight);
    }

    // Check if sizing hasn't changed => MIN Reached => Expand
    // HACK: this is a hack, better would be to know minimum size beforehand
    if(before == after) {
      win.doOperation(stretchHorizontal);
    }
  }
  else {
    win.doOperation(rightHalf);
  }
});

S.bind("up"+hyper, function(win) {
  if(leansTop(win)) {
    var expression = "screenSizeY*" + cycleSmaller(percHeight(win));
    var before = win.size().height;
    var after = 0;

    // The desired UP Move
    win.doOperation(S.op("move", {
      "x": "windowTopLeftX",
      "y": 0,
      "width": "windowSizeX",
      "height": expression
    }));

    after = win.size().height;

    // Check if sizing hasn't changed => MIN Reached => Expand
    // HACK: this is a hack, better would be to know minimum size beforehand
    if(before == after) {
      win.doOperation(stretchVertical);
    }
  }
  else {
    win.doOperation(topHalf);
  }
});

S.bind("down"+hyper, function(win) {
  if(leansBottom(win)) {
    var compTop = win.screen().rect().height - win.screen().vrect().height;
    var windowRatio = cycleSmaller(percHeight(win));
    var expression = "screenSizeY*" + windowRatio;
    var before = win.size().height;
    var after = 0;

    // The desired UP Move
    win.doOperation(S.op("move", {
      "x": "windowTopLeftX",
      "y": (1-windowRatio) * win.screen().vrect().height + compTop,
      "width": "windowSizeX",
      "height": expression
    }));

    after = win.size().height;

    // Check if outside of screen. and size changed. => Surpassed MIN => Re-Align
    // HACK: this is a hack, better would be to know minimum size beforehand
    if(win.topLeft().y + after > win.screen().rect().height + toleranceY(win) && before != after) {
      win.doOperation(alignBottom);
    }

    // Check if sizing hasn't changed => MIN Reached => Expand
    // HACK: this is a hack, better would be to know minimum size beforehand
    if(before == after) {
      win.doOperation(stretchVertical);
    }
  }
  else {
    win.doOperation(bottomHalf);
  }
});

/**** APP BINDINGS ****/
// VS Code
S.bind("h"+hyper, function(win) {
  var app_name = 'Code';
  if(win.app().name() == app_name) {
    cycleWindows(win);
  } else {
    S.op("focus", {
      "app": app_name
    }).run();
  }
});

// Terminal
S.bind("j"+hyper, function(win) {
  var app_name = 'Terminal';
  if(win.app().name() == app_name) {
    cycleWindows(win);
  } else {
    S.op("focus", {
      "app": app_name  
    }).run();
  }
});

// Safari
S.bind("k"+hyper, function(win) {
  var app_name = 'Safari';
  if(win.app().name() == app_name) {
    cycleWindows(win);
  } else {
    S.op("focus", {
      "app": app_name  
    }).run();
  }
});

// Finder
S.bind("l"+hyper, function(win) {
  var app_name = 'Finder';
  if(win.app().name() == app_name) {
    cycleWindows(win);
  } else {
    S.op("focus", {
      "app": app_name  
    }).run();
  }
});

// Framer X
S.bind("u"+hyper, function(win) {
  var app_name = 'Framer X';
  if(win.app().name() == app_name) {
    cycleWindows(win);
  } else {
    S.op("focus", {
      "app": app_name  
    }).run();
  }
});

// Focus Flow Left
S.bind("left"+hypershift, S.op("focus", {
  "direction": "left"
}));

// Focus Flow Right
S.bind("right"+hypershift, S.op("focus", {
  "direction": "right"
}));

// Focus Flow Up
S.bind("up"+hypershift, S.op("focus", {
  "direction": "up"
}));

// Focus Flow Down
S.bind("down"+hypershift, S.op("focus", {
  "direction": "down"
}));

// Cycle/Focus Same App
S.bind("/"+hyper, function(win) {
  cycleWindows(win);
});

