import React from 'react';
import ReactDOM from 'react-dom';
import FloatingWidget from './FloatingWidget';

interface State {
    windows: Array<JSX.Element>;
}

class DebugWidget extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            windows: [],
        };
    }

    addFloatingWindow = (dragText: string, x: -1 | 0 | 1, y: -1 | 0 | 1) => {
        this.setState(prevState => ({
            windows: [
                ...prevState.windows,
                <FloatingWidget key={prevState.windows.length} dragText={dragText} x={x} y={y} />
            ]
        }));
    };

    render() {
        return (
            <div>{this.state.windows}</div>
        );
    }
}

export default class ExporterDebugWidget {
    private _root: HTMLDivElement;
    private _ref: React.RefObject<DebugWidget>;

    constructor() {
        this._ref = React.createRef();

        this._root = document.createElement('div');
        document.body.appendChild(this._root);

        ReactDOM.render(<DebugWidget ref={this._ref} />, this._root);
    }

    /**
     * Adds a new floating window to the application.
     *
     * @param {string} dragText - The text to be displayed in the draggable area of the window.
     * @param {-1 | 0 | 1} x - The horizontal position of the window. -1 for left edge, 0 for center, 1 for right edge.
     * @param {-1 | 0 | 1} y - The vertical position of the window. -1 for top edge, 0 for center, 1 for bottom edge.
     */
    public addFloatingWindow(dragText: string, x: -1 | 0 | 1, y: -1 | 0 | 1) {
        if (this._ref.current) {
            this._ref.current.addFloatingWindow(dragText, x, y);
        }
    }
};
