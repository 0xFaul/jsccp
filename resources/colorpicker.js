var _colorpicker = [];

window.addEventListener('load', _onWindowLoad);

function _onWindowLoad() {
    window.addEventListener('mouseup', _onMouseUp);
    var elements = document.getElementsByClassName("colorpicker");
    for (var i = 0; i < elements.length; i++) {
        var type = elements.item(i).getAttribute("type");
        var inner = "";
        if(type === "complex") {
            inner = "<div class='complex'><div class='sat'><div class='sat-rot'><div class='sat-dot'></div></div></div> <div class='lum'><div class='lum-rot'><div class='lum-dot'></div></div></div><div class='colorwheel'><div class='rot'><div class='dot'></div></div></div></div>";
        } else if(type === "simple") {
            inner = "<div class='simple'><div class='colorwheel'><div class='rot'><div class='dot'></div></div></div></div>";
        }
        elements.item(i).innerHTML = inner;
        var cSH = window.getComputedStyle(elements.item(i), null).getPropertyValue('height');
        var cSW = window.getComputedStyle(elements.item(i), null).getPropertyValue('width');
        var _size = Math.min(cSH.substring(0, cSH.length -2), cSW.substring(0, cSW.length-2)) / 20;
        if(type === 'complex') {
            _size = _size * 0.735;
            var elems = elements.item(i).firstElementChild.children;
            elems[2].style.left = '4em';
            elems[2].style.top = '3.599999999999em';
            elems[2].style.width = '19em';
            elems[2].style.height = '19em';
            elems[2].firstElementChild.style.height = '19em';
            elems[2].firstElementChild.style.width = '19em';

            elems[2].firstElementChild.firstElementChild.style.margin = '0.75em';


        }
        elements.item(i).setAttribute('cp-id', i);
        var item = {id: i,
                    color: {red: 255,
                            green: 0,
                            blue: 0
                           },
                    colorwheel: {degree: 0,
                                 color: {
                                     red: 255,
                                     green: 0,
                                     blue: 0
                                     },
                                 md: false,
                                 ts: false
                                },
                    sat: {degree: 195,
                          md: false,
                          ts: false
                         },
                    lum: {degree: 0,
                          md: false,
                          ts: false
                         }
                   };

        _colorpicker.push(item);

        var childcount = elements.item(i).firstElementChild.children.length;

        for(var j = 0; j< childcount; j++) {
            elements.item(i).firstElementChild.children[j].style.fontSize = _size + "px";

        }

        var colorwheel = elements.item(i).firstElementChild.children[childcount-1];
        colorwheel.addEventListener('mouseover', function() { document.body.style.overflow='hidden'; });
        colorwheel.addEventListener('mouseout', function() { document.body.style.overflow='auto'; });
        colorwheel.addEventListener('mousedown', _onCPMouseDown);
        colorwheel.addEventListener('mouseup', _onMouseUp);
        colorwheel.addEventListener('mousemove', _onCPMouseMove);
        colorwheel.addEventListener('wheel', _onCPScroll, false);
        colorwheel.addEventListener('touchstart', _onCPTouchStart);
        colorwheel.addEventListener('touchend', _onCPTouchEnd);
        colorwheel.addEventListener('touchmove', _onCPTouchMove);

        if(type === "complex") {
            var sat = elements.item(i).firstElementChild.children[0];
            sat.addEventListener('mouseover', function() { document.body.style.overflow='hidden'; });
            sat.addEventListener('mouseout', function() { document.body.style.overflow='auto'; });
            sat.addEventListener('mousedown', _onSATMouseDown);
            sat.addEventListener('mousemove', _onSATMouseMove);
            sat.addEventListener('mouseup', _onMouseUp);
            sat.addEventListener('wheel', _onSATScroll, false);
            sat.addEventListener('touchstart', _onSATTouchStart);
            sat.addEventListener('touchend',   _onSATTouchEnd);
            sat.addEventListener('touchmove',  _onSATTouchMove);

            var lum = elements.item(i).firstElementChild.children[1];
            lum.addEventListener('mouseover', function() { document.body.style.overflow='hidden'; });
            lum.addEventListener('mouseout', function() { document.body.style.overflow='auto'; });
            lum.addEventListener('mousedown', _onLUMMouseDown);
            lum.addEventListener('mousemove', _onLUMMouseMove);
            lum.addEventListener('mouseup', _onMouseUp);
            lum.addEventListener('wheel', _onLUMScroll, false);
            lum.addEventListener('touchstart', _onLUMTouchStart);
            lum.addEventListener('touchend',   _onLUMTouchEnd);
            lum.addEventListener('touchmove',  _onLUMTouchMove);
        }
        _calcColor(i);
    }
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.type = 'text/css';
    link.href = './colorpicker.css';
    document.head.appendChild(link);
}

function _onCPMouseDown(event) {
    var id = 0;
    var doc = null;
    if(event.target.className === "rot") {
        id = event.target.parentElement.parentElement.parentElement.getAttribute('cp-id');
        doc = event.target.parentElement.parentElement.parentElement.getBoundingClientRect();
    } else if (event.target.className === 'dot') {
        id = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute('cp-id');
        doc = event.target.parentElement.parentElement.parentElement.parentElement.getBoundingClientRect();
    } else if (event.target.className === 'colorwheel') {
        id = event.target.parentElement.parentElement.getAttribute('cp-id');
        doc = event.target.parentElement.parentElement.getBoundingClientRect();
    }
    if(doc != null) {
        x = event.clientX - doc.x - doc.width / 2;
        y = event.clientY - doc.y - doc.height / 2;
        _colorpicker[id].colorwheel.degree = _calcDegree(x, y);
        _CProtate(id);
        _colorpicker[id].colorwheel.md = true;
    }
}

function _onSATMouseDown(event) {
    var id = 0;
    var doc = null;
    if(event.target.className === "sat-rot") {
        id = event.target.parentElement.parentElement.parentElement.getAttribute('cp-id');
        doc = event.target.parentElement.parentElement.parentElement.getBoundingClientRect();
    } else if (event.target.className === 'sat-dot') {
        id = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute('cp-id');
        doc = event.target.parentElement.parentElement.parentElement.parentElement.getBoundingClientRect();
    } else if(event.target.className === 'sat') {
        d = event.target.parentElement.parentElement.parentElement.getAttribute('cp-id');
        doc = event.target.parentElement.parentElement.parentElement.getBoundingClientRect();
    }
    if(doc != null) {
        x = event.clientX - doc.x - doc.width / 2;
        y = event.clientY - doc.y - doc.height / 2;

        var deg = _calcDegree(x, y);
        if(deg < 195 ) {
            deg = 195;
        } else if(deg > 345){
            deg = 345;
        }
        _colorpicker[id].sat.degree = deg;
        _SATrotate(id);


        _colorpicker[id].sat.md = true;
    }
}

function _onLUMMouseDown(event) {
    var id = 0;
    var doc = null;
    if(event.target.className === "lum-rot") {
        id = event.target.parentElement.parentElement.parentElement.getAttribute('cp-id');
        doc = event.target.parentElement.parentElement.parentElement.getBoundingClientRect();
    } else if (event.target.className === 'lum-dot') {
        id = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute('cp-id');
        doc = event.target.parentElement.parentElement.parentElement.parentElement.getBoundingClientRect();
    } else if (event.target.className === 'lum') {
        id = event.target.parentElement.parentElement.getAttribute('cp-id');
        doc = event.target.parentElement.parentElement.getBoundingClientRect();
    }
    if(doc != null) {
        x = event.clientX - doc.x - doc.width / 2;
        y = event.clientY - doc.y - doc.height / 2;

        var deg = _calcDegree(x, y);
        if(deg < 15 ) {
            deg = 15;
        } else if(deg > 165){
            deg = 165;
        }
        _colorpicker[id].lum.degree = deg;
        _LUMrotate(id);


        _colorpicker[id].lum.md = true;
    }
}

function _onMouseUp(event) {
    for(var id = 0; id < _colorpicker.length; id++) {
        _colorpicker[id].colorwheel.md = false;
        _colorpicker[id].sat.md = false;
        _colorpicker[id].lum.md = false;
    }
}

function _onCPMouseMove(event) {
    if(event.target) {
        var id = 0;
        var rot = 0;
        if(event.target.className === "rot") {
            id = event.target.parentElement.parentElement.parentElement.getAttribute('cp-id');
            rot = 1;
        } else if (event.target.className === 'dot') {
            id = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute('cp-id');
            rot = 2;
        }else if (event.target.className === 'colorwheel') {
        id = event.target.parentElement.parentElement.getAttribute('cp-id');
        rot=3;
    }
        if(_colorpicker[id].colorwheel.md) {
            var doc = null;
            if(rot === 1) {
                doc = event.target.parentElement.parentElement.parentElement.getBoundingClientRect();
            } else if (rot === 2){
                doc = event.target.parentElement.parentElement.parentElement.parentElement.getBoundingClientRect();
            }else if(rot === 3) {
                doc = event.target.parentElement.parentElement.getBoundingClientRect();
            }
            if(doc != null) {
                var x = event.clientX - doc.x - doc.width / 2;
                var y = event.clientY - doc.y - doc.height / 2;
                _colorpicker[id].colorwheel.degree = _calcDegree(x, y);
                _CProtate(id);
            }
        }
    } else {
        for(var id = 0; id < _colorpicker.length; id++) {
            _colorpicker[id].colorwheel.md = false;
        }
    }
}

function _onSATMouseMove(event) {
    if(event.target) {
        var id = 0;
        var rot = 0;
        if(event.target.className === "sat-rot") {
            id = event.target.parentElement.parentElement.parentElement.getAttribute('cp-id');
            rot = 1;
        } else if (event.target.className === 'sat-dot') {
            id = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute('cp-id');
            rot = 2;
        }else if (event.target.className === 'sat') {
        id = event.target.parentElement.parentElement.getAttribute('cp-id');
        rot=3;
    }
        if(_colorpicker[id].sat.md) {
            var doc = null;
            if(rot === 1) {
                doc = event.target.parentElement.parentElement.parentElement.getBoundingClientRect();
            } else  if (rot === 2){
                doc = event.target.parentElement.parentElement.parentElement.parentElement.getBoundingClientRect();
            }else if(rot === 3) {
                doc = event.target.parentElement.parentElement.getBoundingClientRect();
            }
            if(doc != null){
                var x = event.clientX - doc.x - doc.width / 2;
                var y = event.clientY - doc.y - doc.height / 2;
                var deg = _calcDegree(x, y);
                if(deg < 195 ) {
                    deg = 195;
                } else if(deg > 345){
                    deg = 345;
                }
                if(rot > 0) {
                    _colorpicker[id].sat.degree = deg;
                    _SATrotate(id);
                }
            }
        }
    } else {
        for(var id = 0; id < _colorpicker.length; id++) {
            _colorpicker[id].sat.md = false;
        }
    }
}

function _onLUMMouseMove(event) {
    if(event.target) {
        var id = 0;
        var rot = 0;
        if(event.target.className === "lum-rot") {
            id = event.target.parentElement.parentElement.parentElement.getAttribute('cp-id');
            rot = 1;
        } else if (event.target.className === 'lum-dot') {
            id = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute('cp-id');
            rot = 2;
        }else if (event.target.className === 'lum') {
            id = event.target.parentElement.parentElement.getAttribute('cp-id');
            rot=3;
        }
        if(_colorpicker[id].lum.md) {
            var doc = null;
            if(rot === 1) {
                doc = event.target.parentElement.parentElement.parentElement.getBoundingClientRect();
            } else  if (rot === 2) {
                doc = event.target.parentElement.parentElement.parentElement.parentElement.getBoundingClientRect();
            } else if(rot === 3) {
                doc = event.target.parentElement.parentElement.getBoundingClientRect();
            }
            if(doc != null) {
                var x = event.clientX - doc.x - doc.width / 2;
                var y = event.clientY - doc.y - doc.height / 2;
                var deg = _calcDegree(x, y);
                if(deg < 15 ) {
                    deg = 15;
                } else if(deg > 165){
                    deg = 165;
                }
                if(rot > 0) {
                    _colorpicker[id].lum.degree = deg;
                    _LUMrotate(id);
                }
            }
        }
    } else {
        for(var id = 0; id < _colorpicker.length; id++) {
            _colorpicker[id].lum.md = false;
        }
    }
}

function _onCPTouchStart(event) {
    var id = 0;
    var doc = null;
    if(event.target.className === "rot") {
        id = event.touches[0].target.parentElement.parentElement.parentElement.getAttribute('cp-id');
        doc = event.touches[0].target.parentElement.parentElement.parentElement.getBoundingClientRect();
    } else if (event.target.className === 'dot') {
        id = event.touches[0].target.parentElement.parentElement.parentElement.parentElement.getAttribute('cp-id');
        doc = event.touches[0].parentElement.parentElement.parentElement.parentElement.getBoundingClientRect();
    }else if (event.target.className === 'colorwheel') {
        id = event.target.parentElement.parentElement.getAttribute('cp-id');
        doc = event.target.parentElement.parentElement.getBoundingClientRect();
    }
    if(doc != null) {
        var x = event.touches[0].clientX - doc.x - (doc.width /2);
        var y = event.touches[0].clientY - doc.y -(doc.height/2);
        _colorpicker[id].colorwheel.degree = _calcDegree(x, y);
        _CProtate(id);
        _colorpicker[id].colorwheel.ts = true;
    }
}

function _onSATTouchStart(event) {
    var id = 0;
    var doc = null;
    if(event.target.className === "sat-rot") {
        id = event.touches[0].target.parentElement.parentElement.parentElement.getAttribute('cp-id');
        doc = event.touches[0].target.parentElement.parentElement.parentElement.getBoundingClientRect();
    } else if (event.target.className === 'sat-dot') {
        id = event.touches[0].target.parentElement.parentElement.parentElement.parentElement.getAttribute('cp-id');
        doc = event.touches[0].parentElement.parentElement.parentElement.parentElement.getBoundingClientRect();
    }else if (event.target.className === 'sat') {
        id = event.target.parentElement.parentElement.getAttribute('cp-id');
        doc = event.target.parentElement.parentElement.getBoundingClientRect();
    }
    if(doc != null) {
        var x = event.touches[0].clientX - doc.x - (doc.width /2);
        var y = event.touches[0].clientY - doc.y -(doc.height/2);
        var deg = _calcDegree(x, y);
        if(deg < 195 ) {
            deg = 195;
        } else if(deg > 345){
            deg = 345;
        }
        _colorpicker[id].sat.degree = deg;
        _SATrotate(id);
        _colorpicker[id].sat.ts = true;
    }
}

function _onLUMTouchStart(event) {
    var id = 0;
    var doc = null;
    if(event.target.className === "lum-rot") {
        id = event.touches[0].target.parentElement.parentElement.parentElement.getAttribute('cp-id');
        doc = event.touches[0].target.parentElement.parentElement.parentElement.getBoundingClientRect();
    } else if (event.target.className === 'lum-dot') {
        id = event.touches[0].target.parentElement.parentElement.parentElement.parentElement.getAttribute('cp-id');
        doc = event.touches[0].parentElement.parentElement.parentElement.parentElement.getBoundingClientRect();
    }else if (event.target.className === 'lum') {
        id = event.target.parentElement.parentElement.getAttribute('cp-id');
        doc = event.target.parentElement.parentElement.getBoundingClientRect();
    }
    if(doc != null) {
        var x = event.touches[0].clientX - doc.x - (doc.width /2);
        var y = event.touches[0].clientY - doc.y -(doc.height/2);
        var deg = _calcDegree(x, y);
        if(deg < 15 ) {
            deg = 15;
        } else if(deg > 165){
            deg = 165;
        }
        _colorpicker[id].lum.degree = deg;
        _LUMrotate(id);
        _colorpicker[id].lum.ts = true;
    }
}

function _onCPTouchEnd(event) {
    for(var id = 0; id < _colorpicker.length; id++) {
        _colorpicker[id].colorwheel.ts = false;
    }
}

function _onSATTouchEnd(event) {
    for(var id = 0; id < _colorpicker.length; id++) {
        _colorpicker[id].sat.ts = false;
    }
}

function _onLUMTouchEnd(event) {
    for(var id = 0; id < _colorpicker.length; id++) {
        _colorpicker[id].lum.ts = false;
    }
}

function _onCPTouchMove(event) {
    event.preventDefault();
    var id = 0;
    var rot = 0;
    if(event.target.className === "rot") {
        id = event.touches[0].target.parentElement.parentElement.parentElement.getAttribute('cp-id');
        rot = 1;
    } else if (event.target.className === 'dot') {
        id = event.touches[0].target.parentElement.parentElement.parentElement.parentElement.getAttribute('cp-id');
        rot = 2;
    }else if (event.target.className === 'colorwheel') {
        id = event.target.parentElement.parentElement.getAttribute('cp-id');
        rot=3;
    }
    if(_colorpicker[id].colorwheel.ts){
        var doc = null;
        if(rot === 1) {
            doc = event.touches[0].target.parentElement.parentElement.parentElement.getBoundingClientRect();
        } else  if (rot === 2) {
            doc = event.touches[0].parentElement.parentElement.parentElement.parentElement.getBoundingClientRect();
        }else if(rot === 3) {
                doc = event.target.parentElement.parentElement.getBoundingClientRect();
            }
        if(doc != null) {
            var x = event.touches[0].clientX - doc.x - (doc.width /2);
            var y = event.touches[0].clientY - doc.y - (doc.height/2);
            _colorpicker[id].colorwheel.degree = _calcDegree(x, y);
            _CProtate(id);
        }
    }
}

function _onSATTouchMove(event) {
    event.preventDefault();
    var id = 0;
    var rot = 0;
    if(event.target.className === "sat-rot") {
        id = event.touches[0].target.parentElement.parentElement.parentElement.getAttribute('cp-id');
        rot = 1;
    } else if (event.target.className === 'sat-dot') {
        id = event.touches[0].target.parentElement.parentElement.parentElement.parentElement.getAttribute('cp-id');
        rot = 2;
    }else if (event.target.className === 'sat') {
        id = event.target.parentElement.parentElement.getAttribute('cp-id');
        rot=3;
    }
    if(_colorpicker[id].sat.ts){
        var doc = null;
        if(rot === 1) {
            doc = event.touches[0].target.parentElement.parentElement.parentElement.getBoundingClientRect();
        } else  if (rot === 2){
            doc = event.touches[0].parentElement.parentElement.parentElement.parentElement.getBoundingClientRect();
        }else if(rot === 3) {
                doc = event.target.parentElement.parentElement.getBoundingClientRect();
            }
        if(doc != null) {
            var x = event.touches[0].clientX - doc.x - (doc.width /2);
            var y = event.touches[0].clientY - doc.y - (doc.height/2);
            var deg = _calcDegree(x, y);
            if(deg < 195 ) {
                deg = 195;
            } else if(deg > 345){
                deg = 345;
            }
            _colorpicker[id].sat.degree = deg;
            _SATrotate(id);
        }
    }
}

function _onLUMTouchMove(event) {
    event.preventDefault();
    var id = 0;
    var rot = 0;
    if(event.target.className === "lum-rot") {
        id = event.touches[0].target.parentElement.parentElement.parentElement.getAttribute('cp-id');
        rot = 1;
    } else if (event.target.className === 'lum-dot') {
        id = event.touches[0].target.parentElement.parentElement.parentElement.parentElement.getAttribute('cp-id');
        rot = 2;
    }else if (event.target.className === 'lum') {
        id = event.target.parentElement.parentElement.getAttribute('cp-id');
        rot=3;
    }
    if(_colorpicker[id].lum.ts){
        var doc = null;
        if(rot === 1) {
            doc = event.touches[0].target.parentElement.parentElement.parentElement.getBoundingClientRect();
        } else  if (rot === 2){
            doc = event.touches[0].parentElement.parentElement.parentElement.parentElement.getBoundingClientRect();
        }else if(rot === 3) {
                doc = event.target.parentElement.parentElement.getBoundingClientRect();
            }
        if(doc != null) {
            var x = event.touches[0].clientX - doc.x - (doc.width /2);
            var y = event.touches[0].clientY - doc.y - (doc.height/2);
            var deg = _calcDegree(x, y);
            if(deg < 15 ) {
                deg = 15;
            } else if(deg > 165){
                deg = 165;
            }
            _colorpicker[id].lum.degree = deg;
            _LUMrotate(id);
        }
    }
}

function _onCPScroll(event){
    var id = 0;
    if(event.target.className === "rot") {
        id = event.target.parentElement.parentElement.parentElement.getAttribute('cp-id');
    } else if (event.target.className === 'dot') {
        id = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute('cp-id');
    }
    _colorpicker[id].colorwheel.degree = (_colorpicker[id].colorwheel.degree + event.wheelDeltaY*0.05 + 360) % 360;
    _CProtate(id);
}

function _onSATScroll(event){
    var id = 0;
    if(event.target.className === "sat-rot") {
        id = event.target.parentElement.parentElement.parentElement.getAttribute('cp-id');
    } else if (event.target.className === 'sat-dot') {
        id = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute('cp-id');
    }
    var deg = _colorpicker[id].sat.degree - 195;
    if(deg - event.wheelDeltaY*0.05 > 150) {
        deg = 150;
    } else if (deg - event.wheelDeltaY*0.05 < 0) {
        deg = 0;
    } else {
        deg = deg - event.wheelDeltaY*0.05;
    }

    _colorpicker[id].sat.degree = deg + 195;
    _SATrotate(id);
}

function _onLUMScroll(event){

    var id = 0;
    if(event.target.className === "lum-rot") {
        id = event.target.parentElement.parentElement.parentElement.getAttribute('cp-id');
    } else if (event.target.className === 'lum-dot') {
        id = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute('cp-id');
    }
    var deg = _colorpicker[id].lum.degree - 15;
    if(deg + event.wheelDeltaY*0.05 > 150) {
        deg = 150;
    } else if (deg + event.wheelDeltaY*0.05 < 0) {
        deg = 0;
    } else {
        deg = deg + event.wheelDeltaY*0.05 ;
    }
    console.log(deg + 15);
    _colorpicker[id].lum.degree = deg + 15;
    _LUMrotate(id);
}

function _calcDegree(x, y) {
    var deg = Math.atan(y/x) * 180 / Math.PI;
    if(x >= 0){
        deg = deg + 90;
    } else {
        deg = deg + 270;
    }
    return deg;
}

function _CProtate(id) {
    var deg = _colorpicker[id].colorwheel.degree;
    var elem = document.getElementsByClassName("colorpicker")[id];
    var rot = elem.firstElementChild.children[elem.firstElementChild.children.length-1].firstElementChild;
    rot.style.webkitTransform = 'rotate('+deg+'deg)';
    rot.style.mozTransform    = 'rotate('+deg+'deg)';
    rot.style.msTransform     = 'rotate('+deg+'deg)';
    rot.style.oTransform      = 'rotate('+deg+'deg)';
    rot.style.transform       = 'rotate('+deg+'deg)';
    _calcColor(id);
}

function _SATrotate(id) {
    var deg = _colorpicker[id].sat.degree;
    if(deg < 195 ) {
        deg = 195;
    } else if(deg > 345){
        deg = 345;
    }
    var elem = document.getElementsByClassName("colorpicker")[id];

    var rot = elem.firstElementChild.children[0].firstElementChild;
    rot.style.webkitTransform = 'rotate('+deg+'deg)';
    rot.style.mozTransform    = 'rotate('+deg+'deg)';
    rot.style.msTransform     = 'rotate('+deg+'deg)';
    rot.style.oTransform      = 'rotate('+deg+'deg)';
    rot.style.transform       = 'rotate('+deg+'deg)';
    _calcColor(id);
}

function _LUMrotate(id) {
    var deg = _colorpicker[id].lum.degree;
    var elem = document.getElementsByClassName("colorpicker")[id];
    if(deg < 15 ) {
        deg = 15;
    } else if(deg > 165){
        deg = 165;
    }
    var rot = elem.firstElementChild.children[1].firstElementChild;
    rot.style.webkitTransform = 'rotate('+deg+'deg)';
    rot.style.mozTransform    = 'rotate('+deg+'deg)';
    rot.style.msTransform     = 'rotate('+deg+'deg)';
    rot.style.oTransform      = 'rotate('+deg+'deg)';
    rot.style.transform       = 'rotate('+deg+'deg)';
    _calcColor(id);
}

function _calcColor(id) {
    var max = 6*255;
    var step = max / 360;
    var col = Math.round(step * ((_colorpicker[id].colorwheel.degree) % 360));
    var red = 0;
    var green = 0;
    var blue = 0;
    var r = Math.floor(col / 255);
    if(r === 0){
        red = 255;
        green = (col % 255);
    }else if(r === 1) {
        green = 255;
        red = (255 - (col % 255));
    }else if(r === 2) {
        green = 255;
        blue = (col % 255);
    }else if(r === 3) {
        blue = 255;
        green = (255 - (col % 255));
    }else if(r === 4) {
        blue = 255;
        red = (col % 255);
    }else if(r === 5) {
        red = 255;
        blue = (255 - (col % 255));
    }else if (r === 6) {
        red = 255;
    }
    _colorpicker[id].colorwheel.color = {red: red, green: green, blue: blue};
    var cp = document.getElementsByClassName("colorpicker")[id];

    if(document.getElementsByClassName('colorpicker')[id].getAttribute('type') === "complex") {
        document.getElementsByClassName('sat')[id].style.background = 'linear-gradient(180deg, white 20%, rgb(' + _colorpicker[id].colorwheel.color.red + ', ' + _colorpicker[id].colorwheel.color.green + ', ' + _colorpicker[id].colorwheel.color.blue + ') 80%)';
        var sat =  1 - ((_colorpicker[id].sat.degree - 195) / 150 );

        var r = _colorpicker[id].colorwheel.color.red * sat + (1-sat) * 255;
        var g = _colorpicker[id].colorwheel.color.green * sat + (1-sat) * 255;
        var b = _colorpicker[id].colorwheel.color.blue * sat + (1-sat) * 255;

        document.getElementsByClassName('lum')[id].style.background = 'linear-gradient(180deg, rgb(' + r + ', ' + g + ', ' + b +') 20% , #000 80%)';

        var lum = 1 - ((_colorpicker[id].lum.degree - 15) /150 );

        r = r * lum + (1-lum) * 0;
        g = g * lum + (1-lum) * 0;
        b = b * lum + (1-lum) * 0;

        _colorpicker[id].color.red = r;
        _colorpicker[id].color.green = g;
        _colorpicker[id].color.blue = b;
    } else {
        _colorpicker[id].color = _colorpicker[id].colorwheel.color;
    }
    var fireevent = new CustomEvent('colorchange', { detail: { color: _colorpicker[id].color }});
    cp.dispatchEvent(fireevent);
}
