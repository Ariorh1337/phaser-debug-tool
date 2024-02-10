import React from 'react';
import Base, { BaseState, BaseProps } from './Base';
import Input, { InputProps } from './Input';

export interface ContainerProps extends BaseProps {
    settings: {
        title: string;
    }
}

export interface ContainerState extends BaseState {
    bgColor: string;
}

export default class Container<A extends ContainerProps, B extends ContainerState> extends Base<A, B> {
    constructor(props: A) {
        super(props);

        this.state = {
            ...this.state,
            bgColor: "#28292e",
        } as B;
    }

    /**
     * Adds a new container to the page.
     */
    addContainer = (settings: ContainerProps["settings"]) => {
        const ref = React.createRef<Container<ContainerProps, ContainerState>>();
        const id = Phaser.Utils.String.UUID();

        this.setState(prevState => ({
            children: [
                ...prevState.children,
                {
                    id,
                    child: <Container ref={ref} id={id} key={id} settings={settings} />
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

    onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();

        this.setState({
            active: !this.state.active
        });
    };

    render() {
        return (
            <div
                className='debug-ext-container'
                ref={this._ref}
                style={{
                    backgroundColor: this.state.bgColor,
                }}
            >
                <div onMouseDown={this.onMouseDown} style={{ cursor: 'pointer' }}>
                    {this.props.settings.title}
                </div>
                <div className='debug-ext-base' style={{
                    display: this.state.active ? 'block' : 'none',
                }}>{
                    this.state.children.map(({ id, child }) => {
                        return <div key={id}>{child}</div>;
                    })
                }</div>
            </div>
        );
    }
};