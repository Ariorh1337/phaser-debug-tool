import React from 'react';

export interface BaseProps {
    id: string;
}

export interface BaseState {
    active: boolean;
    children: Array<{ id: string, child: React.ReactNode }>;
}


export default class Base<A extends BaseProps, B extends BaseState> extends React.Component<A, B> {
    protected _ref: React.RefObject<HTMLDivElement>;

    constructor(props: A) {
        super(props);

        this.state = {
            active: false,
            children: [],
        } as B;

        this._ref = React.createRef();
    }

    /**
     * Removes a floating container from the page.
     *
     * @param {string} id - The id of the container to be removed.
     */
    remove = (id: string) => {
        this.setState(prevState => ({
            children: prevState.children.filter(window => window.id !== id)
        }));
    }

    render() {
        return (
            <div className='debug-ext-base'>{
                this.state.children.map(({ id, child }) => {
                    return <div key={id}>{child}</div>;
                })
            }</div>
        );
    }
};