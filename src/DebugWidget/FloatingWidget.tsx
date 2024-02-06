import React from 'react';

interface Props {
    dragText: string;
    x: -1 | 0 | 1;
    y: -1 | 0 | 1;
}

interface State {
    isDragging: boolean;
    position: { x: number; y: number };
    offset: { x: number; y: number };
    dimensions: { width: number; height: number };
}

class FloatingWidget extends React.Component<Props, State> {
    private _ref: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);

        const format = {
            "-1": (n: number) => n * 0,
            "0": (n: number) => n * 0.5,
            "1": (n: number) => n * 1,
        };

        this.state = {
            isDragging: false,
            position: {
                x: format[props.x](window.innerWidth),
                y: format[props.y](window.innerHeight),
            },
            offset: { x: 0, y: 0 },
            dimensions: { width: 0, height: 0 },
        };

        this._ref = React.createRef();
    }

    componentDidMount() {
        if (this._ref.current) {
            this.setState({
                dimensions: {
                    width: this._ref.current.offsetWidth + 2,
                    height: this._ref.current.offsetHeight + 2,
                },
            }, this.recalculatePosition);
        }

        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
        window.addEventListener('resize', this.recalculatePosition);
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
        window.removeEventListener('resize', this.recalculatePosition);
    }

    recalculatePosition = () => {
        if (this._ref.current) {
            this.setState({
                position: {
                    x: Math.min(
                        this.state.position.x,
                        window.innerWidth - this.state.dimensions.width
                    ),
                    y: Math.min(
                        this.state.position.y,
                        window.innerHeight - this.state.dimensions.height
                    ),
                },
            });
        }
    }

    onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();

        this.setState({
            isDragging: true,
            offset: {
                x: e.clientX - e.currentTarget.getBoundingClientRect().left,
                y: e.clientY - e.currentTarget.getBoundingClientRect().top,
            },
        });
    };

    onMouseMove = (e: MouseEvent) => {
        if (!this.state.isDragging) return;

        let newPosition = {
            x: e.clientX - this.state.offset.x,
            y: e.clientY - this.state.offset.y,
        };

        // Ensure the position is within the screen bounds
        newPosition.x = Math.max(0, Math.min(newPosition.x, window.innerWidth - this.state.dimensions.width));
        newPosition.y = Math.max(0, Math.min(newPosition.y, window.innerHeight - this.state.dimensions.height));

        this.setState({ position: newPosition });
    };

    onMouseUp = () => {
        this.setState({ isDragging: false });
    };

    render() {
        return (
            <div
                ref={this._ref}
                style={{
                    position: 'fixed',
                    top: this.state.position.y + 'px',
                    left: this.state.position.x + 'px',
                    zIndex: 1000,
                    backgroundColor: "#28292e",
                    borderRadius: "4px",
                    padding: "4px",
                }}
            >
                <div
                    style={{
                        cursor: this.state.isDragging ? 'grabbing' : 'grab',
                    }}
                    onMouseDown={this.onMouseDown}
                >{this.props.dragText}</div>
                <div>Hello, I'm a floating window!</div>
            </div>
        );
    }
}

export default FloatingWidget;