'use strict';

(function () {

    var props = {
        value: 500,
        min: 50,
        max: 1000,
        width: 240
    };

    ReactDOM.render(React.createElement(Slider, { value: props.value, min: props.min, max: props.max, width: props.width }), document.getElementById('wrap'));
})();
