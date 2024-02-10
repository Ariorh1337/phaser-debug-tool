import React from 'react';
import Base, { BaseState, BaseProps } from './Base';
import Input, { InputProps } from './Input';

export interface FloatingContainerProps extends BaseProps {
    settings: {
        title: string;
    } & (
        | { left?: number; right?: never; }
        | { left?: never; right?: number; }
    ) & (
        | { top?: number; bottom?: never; }
        | { top?: never; bottom?: number; }
    );
}

export interface FloatingContainerState extends BaseState {
    isDragging: boolean;
    position: {
        x: number;
        y: number;
    };
    offset: { x: number; y: number };
}

export default class FloatingContainer<A extends FloatingContainerProps, B extends FloatingContainerState> extends Base<FloatingContainerProps, FloatingContainerState> {
    constructor(props: A) {
        super(props);

        const x = props.settings.left ?? props.settings.right;
        const y = props.settings.top ?? props.settings.bottom;

        this.state = {
            children: [],
            isDragging: false,
            position: { x, y },
            offset: { x: 0, y: 0 },
        } as B;
    }

    /**
     * Adds a new floating container to the page.
     */
    addFloatingContainer = (settings: FloatingContainerProps["settings"]) => {
        const ref = React.createRef<FloatingContainer<FloatingContainerProps, FloatingContainerState>>();
        const id = Phaser.Utils.String.UUID();

        this.setState(prevState => ({
            children: [
                ...prevState.children,
                {
                    id,
                    child: <FloatingContainer ref={ref} id={id} key={id} settings={settings} />
                }
            ]
        }));

        return ref.current;
    };

    addInput = (settings: InputProps["settings"]) => {
        const ref = React.createRef<Input>();
        const id = Phaser.Utils.String.UUID();

        this.setState(prevState => ({
            children: [
                ...prevState.children,
                {
                    id,
                    child: <Input ref={ref as any} id={id} key={id} settings={settings} />
                }
            ]
        }));

        return ref.current;
    }

    componentDidMount() {
        this.recalculatePosition();

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
            const x = Math.max(0, Math.min(this.state.offset.x, window.innerWidth));
            const y = Math.max(0, Math.min(this.state.offset.y, window.innerHeight));
    
            this.setState({
                position: { x, y },
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

        let vec = {
            x: e.clientX - this.state.offset.x,
            y: e.clientY - this.state.offset.y,
        };

        // Ensure the position is within the screen bounds
        vec.x = Math.max(0, Math.min(vec.x, window.innerWidth));
        vec.y = Math.max(0, Math.min(vec.y, window.innerHeight));

        if (this.props.settings.right !== undefined) {
            vec.x = window.innerWidth - vec.x - this._ref.current.offsetWidth;
        }
        if (this.props.settings.bottom !== undefined) {
            vec.y = window.innerHeight - vec.y - this._ref.current.offsetHeight;
        }

        this.setState({ position: vec });
    };

    onMouseUp = () => {
        this.setState({ isDragging: false });
    };

    render() {
        const { settings } = this.props;
        const { position } = this.state;

        const style = {
            position: 'fixed',
            zIndex: 1000,
            backgroundColor: "#28292e",
            borderRadius: "0.2em",
            color: "white",
            padding: "0.3em 0.2em",
            width: "min-content",

            left: "unset",
            right: "unset",
            top: "unset",
            bottom: "unset",
        };

        if (settings.right !== undefined) {
            style.right = `${position.x}px`;
        } else {
            style.left = `${position.x || 0}px`;
        }

        if (settings.bottom !== undefined) {
            style.bottom = `${position.y}px`;
        } else {
            style.top = `${position.y || 0}px`;
        }

        return (
            <div
                ref={this._ref}
                style={style}
            >
                <div
                    style={{
                        cursor: this.state.isDragging ? 'grabbing' : 'grab',
                    }}
                    onMouseDown={this.onMouseDown}
                >{settings.title}</div>
                {  super.render() }
            </div>
        );
    }
};