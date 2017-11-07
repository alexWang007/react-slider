'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Slider = function (_React$Component) {
    _inherits(Slider, _React$Component);

    function Slider(props) {
        _classCallCheck(this, Slider);

        var _this = _possibleConstructorReturn(this, (Slider.__proto__ || Object.getPrototypeOf(Slider)).call(this, props));

        _this.state = {
            name: props.name,
            value: props.value,
            min: props.min,
            max: props.max,
            width: props.width,
            disabled: props.disabled,
            isDragging: false,
            hasTip: props.hasTip,
            lastMouseX: 0,
            afterValueChange: props.afterValueChange
        };
        return _this;
    }

    _createClass(Slider, [{
        key: 'getValueLeft',
        value: function getValueLeft() {
            return this.getProgressWidth() - 5;
        }
    }, {
        key: 'getProgressWidth',
        value: function getProgressWidth() {
            var state = this.state,
                width = state.width,
                min = state.min,
                max = state.max,
                value = state.value;

            return Math.ceil((value - min) / (max - min) * width);
        }
    }, {
        key: 'change',
        value: function change(left) {
            var state = this.state,
                max = state.max,
                min = state.min,
                value = Math.ceil(left / state.width * max);

            if (value > max) {
                value = max;
            } else {
                if (value < min) {
                    value = min;
                }
            }

            this.setState({
                value: value
            });

            if (_.isFunction(state.onValueChange)) {
                state.onValueChange(value);
            }
        }
    }, {
        key: 'onMouseDown',
        value: function onMouseDown(evt) {
            var event = evt || window.event;

            if (this.state.disabled) {
                return false;
            }

            this.setState({
                isDragging: true,
                lastMouseX: event.clientX
            });

            document.onmousemove = this.drag.bind(this);
            document.onmouseup = this.end.bind(this);
        }
    }, {
        key: 'isDescendant',
        value: function isDescendant(parent, child) {
            var node = child.parentNode;

            while (node !== null) {
                if (node === parent) {
                    return true;
                }

                node = node.parentNode;
            }

            return false;
        }
    }, {
        key: 'drag',
        value: function drag(evt) {
            var event = evt || window.event,
                target = event.target || event.srcElement,
                state = this.state,
                max = state.max,
                min = state.min,
                value = Math.ceil(state.value + (event.clientX - state.lastMouseX) / state.width * (max - min));

            // 鼠标已经移动到 Slider 区域以外了
            if (!this.isDescendant(this.refs.slider, target)) {
                document.onmousemove = null;
                document.onmouseup = null;

                this.setState({
                    isDragging: false
                });

                return false;
            }

            if (value > max) {
                value = max;
            } else {
                if (value < min) {
                    value = min;
                }
            }

            this.setState({
                lastMouseX: event.clientX,
                value: value
            });

            if (_.isFunction(state.onValueChange)) {
                state.onValueChange(value);
            }
        }
    }, {
        key: 'end',
        value: function end() {
            document.onmousemove = null;
            document.onmouseup = null;

            this.setState({
                isDragging: false
            });
        }
    }, {
        key: 'onBarClick',
        value: function onBarClick(evt) {

            if (this.state.disabled) {
                return false;
            }

            this.change(evt.nativeEvent.offsetX);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var newState = {
                disabled: nextProps.disabled,
                value: nextProps.value
            };

            if (typeof nextProps.min !== 'undefined') {
                newState.min = nextProps.min;
            }

            if (typeof nextProps.max !== 'undefined') {
                newState.max = nextProps.max;
            }

            if (typeof nextProps.width !== 'undefined') {
                newState.width = nextProps.width;
            }

            this.setState(newState);
        }
    }, {
        key: 'render',
        value: function render() {
            var state = this.state,
                isDragging = state.isDragging,
                width = this.getProgressWidth(),
                valueLeft = this.getValueLeft(),
                clsVisible = isDragging ? '' : ' slider-invisible',
                clsDisabled = state.disabled ? ' slider-disabled' : '',
                tip = '',
                tipLeft = 0;

            if (isDragging) {
                tipLeft = width - this.refs.tip.offsetWidth / 2;
            }

            if (state.hasTip) {
                tip = React.createElement(
                    'div',
                    { className: 'slider-tip' + clsVisible, ref: 'tip', style: { left: tipLeft } },
                    state.value
                );
            }

            return React.createElement(
                'div',
                { className: 'slider' + clsDisabled, ref: 'slider' },
                React.createElement(
                    'div',
                    { className: 'slider-bar', onClick: this.onBarClick.bind(this), ref: 'bar' },
                    React.createElement(
                        'div',
                        { className: 'slider-progress', style: { width: width } },
                        state.value
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'slider-value', ref: 'value', onMouseDown: this.onMouseDown.bind(this),
                        style: { left: valueLeft } },
                    state.value
                ),
                tip
            );
        }
    }]);

    return Slider;
}(React.Component);

Slider.defaultProps = {
    name: 'slider',
    value: 0,
    min: 0,
    max: 240,
    width: 120,
    disabled: false,
    hasTip: true,
    afterValueChange: null
};

Slider.propTypes = {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.number.isRequired,
    min: React.PropTypes.number.isRequired,
    max: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired
};
