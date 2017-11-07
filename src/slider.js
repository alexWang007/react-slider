class Slider extends React.Component {
    constructor ( props ) {
        super( props );

        this.state = {
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
    }

    getValueLeft () {
        return this.getProgressWidth() - 5;
    }

    getProgressWidth () {
        let state = this.state,
            width = state.width,
            min = state.min,
            max = state.max,
            value = state.value;

        return Math.ceil( ((value - min) / (max - min)) * width );
    }

    change ( left ) {
        let state = this.state,
            max = state.max,
            min = state.min,
            value = Math.ceil( (left / state.width) * max );

        if ( value > max ) {
            value = max;
        }
        else {
            if ( value < min ) {
                value = min;
            }
        }

        this.setState( {
            value: value
        } );

        if(_.isFunction(state.onValueChange)){
            state.onValueChange(value);
        }
    }

    onMouseDown ( evt ) {
        let event = evt || window.event;

        if(this.state.disabled){
            return false;
        }

        this.setState( {
            isDragging: true,
            lastMouseX: event.clientX
        } );

        document.onmousemove = this.drag.bind( this );
        document.onmouseup = this.end.bind( this );
    }

    isDescendant ( parent, child ) {
        let node = child.parentNode;

        while ( node !== null ) {
            if ( node === parent ) {
                return true;
            }

            node = node.parentNode;
        }

        return false;
    }

    drag ( evt ) {
        let event = evt || window.event,
            target = event.target || event.srcElement,
            state = this.state,
            max = state.max,
            min = state.min,
            value = Math.ceil( state.value + (((event.clientX - state.lastMouseX) / state.width) * (max - min)) );

        // 鼠标已经移动到 Slider 区域以外了
        if ( !this.isDescendant( this.refs.slider, target ) ) {
            document.onmousemove = null;
            document.onmouseup = null;

            this.setState( {
                isDragging: false
            } );

            return false;
        }

        if ( value > max ) {
            value = max;
        }
        else {
            if ( value < min ) {
                value = min;
            }
        }

        this.setState( {
            lastMouseX: event.clientX,
            value: value
        } );

        if(_.isFunction(state.onValueChange)){
            state.onValueChange(value);
        }
    }

    end () {
        document.onmousemove = null;
        document.onmouseup = null;

        this.setState( {
            isDragging: false
        } );
    }

    onBarClick ( evt ) {

        if(this.state.disabled){
            return false;
        }

        this.change( evt.nativeEvent.offsetX );
    }

    componentWillReceiveProps ( nextProps ) {
        let newState = {
                disabled: nextProps.disabled,
                value: nextProps.value
            };

        if ( typeof nextProps.min !== 'undefined' ) {
            newState.min = nextProps.min;
        }

        if ( typeof nextProps.max !== 'undefined' ) {
            newState.max = nextProps.max;
        }

        if ( typeof nextProps.width !== 'undefined' ) {
            newState.width = nextProps.width;
        }

        this.setState( newState );
    }

    render () {
        let state = this.state,
            isDragging = state.isDragging,
            width = this.getProgressWidth(),
            valueLeft = this.getValueLeft(),
            clsVisible = isDragging ? '' : ' slider-invisible',
            clsDisabled = state.disabled ? ' slider-disabled' : '',
            tip = '',
            tipLeft = 0;

        if ( isDragging ) {
            tipLeft = width - (this.refs.tip.offsetWidth / 2);
        }

        if ( state.hasTip ) {
            tip = (<div className={'slider-tip' + clsVisible} ref="tip" style={{ left: tipLeft }}>{state.value}</div>);
        }

        return (
            <div className={'slider' + clsDisabled} ref="slider">
                <div className="slider-bar" onClick={this.onBarClick.bind( this )} ref="bar">
                    <div className="slider-progress" style={{ width: width }}>{state.value}</div>
                </div>
                <div className="slider-value" ref="value" onMouseDown={this.onMouseDown.bind( this )}
                     style={{ left: valueLeft }}>{state.value}</div>
                {tip}
            </div>
        );
    }
}

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