import React from 'react';
import ReactDOM from 'react-dom';
import FloatingWidget from './FloatingWidget';

interface State {
    children: Array<JSX.Element>;
}

class DebugWidget extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);

        this.state = {
            children: [],
        };
    }

    /**
     * Adds a new floating window to the application.
     *
     * @param {string} dragText - The text to be displayed in the draggable area of the window.
     * @param {-1 | 0 | 1} x - The horizontal position of the window. -1 for left edge, 0 for center, 1 for right edge.
     * @param {-1 | 0 | 1} y - The vertical position of the window. -1 for top edge, 0 for center, 1 for bottom edge.
     */
    addFloatingWindow = (dragText: string, x: -1 | 0 | 1, y: -1 | 0 | 1) => {
        const ref = React.createRef<FloatingWidget>();

        this.setState(prevState => ({
            children: [
                ...prevState.children,
                <FloatingWidget ref={ref} key={prevState.children.length} dragText={dragText} x={x} y={y} />
            ]
        }));

        return ref.current;
    };

    /**
     * Removes a floating window from the application.
     *
     * @param {JSX.Element} child - The window to be removed.
     */
    remove = (child: JSX.Element) => {
        this.setState(prevState => ({
            children: prevState.children.filter(window => window !== child)
        }));
    }

    render() {
        return (
            <div>{this.state.children}</div>
        );
    }
}

export default class ExporterDebugWidget extends DebugWidget {
    constructor(data?: any) {
        const root = document.createElement('div');
        document.body.appendChild(root);
        
        const ref = React.createRef<DebugWidget>();
        ReactDOM.render(<DebugWidget ref={ref} />, root);

        return ref.current;

        // This is side move to pass the ts error
        // And it is for purpose of passing DebugWidget types
        super(data);
    }
};
