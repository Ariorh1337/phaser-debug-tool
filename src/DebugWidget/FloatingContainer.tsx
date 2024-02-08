import React from 'react';
import formatRelativeCenter from './utils/formatRelative';
import Base, { BaseState, BaseProps } from './Base';
import Phaser from 'phaser';

export interface FloatingContainerProps extends BaseProps {
    settings: {
        title: string;
        relativeX: -1 | 0 | 1;
        relativeY: -1 | 0 | 1;
    }
}

export interface FloatingContainerState extends BaseState {
    isDragging: boolean;
    position: { x: number; y: number };
    offset: { x: number; y: number };
    dimensions: { width: number; height: number };
}

export default class FloatingContainer<A extends FloatingContainerProps, B extends FloatingContainerState> extends Base<FloatingContainerProps, FloatingContainerState> {
    constructor(props: A) {
        super(props);

        const x = formatRelativeCenter(props.settings.relativeX, window.innerWidth);
        const y = formatRelativeCenter(props.settings.relativeY, window.innerHeight);

        this.state = {
            children: [],
            isDragging: false,
            position: { x, y },
            offset: { x: 0, y: 0 },
            dimensions: { width: 0, height: 0 },
        } as B;
    }

    /**
     * Adds a new floating container to the page.
     */
    addFloatingContainer = (settings: FloatingContainerProps["settings"]) => {
        const ref = React.createRef<HTMLDivElement>();
        const id = Phaser.Utils.String.UUID();

        this.setState(prevState => ({
            children: [
                ...prevState.children,
                {
                    id,
                    child: <FloatingContainer ref={ref as any} id={id} key={prevState.children.length} settings={settings} />
                }
            ]
        }));

        return ref.current;
    };

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
                >{this.props.settings.title}</div>
                { super.render() }
            </div>
        );
    }
};