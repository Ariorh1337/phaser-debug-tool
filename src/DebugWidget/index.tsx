import React from 'react';
import ReactDOM from 'react-dom';
import Base, { BaseProps, BaseState } from './Base';
import FloatingContainer, { FloatingContainerProps, FloatingContainerState } from './FloatingContainer';

class DebugWidget extends Base<BaseProps, BaseState> {
    constructor(props: BaseProps) {
        super(props);
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
                    child: <FloatingContainer ref={ref as any} id={id} key={id} settings={settings} />
                }
            ]
        }));

        return ref.current;
    };
}

export default class ExporterDebugWidget extends DebugWidget {
    constructor(data?: any) {
        const root = document.createElement('div');

        if (document.body) {
            document.body.appendChild(root);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(root);
            }, { once: true });
        }

        const ref = React.createRef<DebugWidget>();
        const id = Phaser.Utils.String.UUID();

        ReactDOM.render(<DebugWidget id={id} ref={ref} />, root);

        return ref.current;

        // This is side move to pass the ts error
        // And it is for purpose of passing DebugWidget types
        super(data);
    }
};
