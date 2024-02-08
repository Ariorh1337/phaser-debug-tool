import React from 'react';
import Base, { BaseProps, BaseState } from './Base';

export interface InputProps extends BaseProps {
    settings: {
        title: string;
        property: string;
        target: Record<string, unknown>;
    }
}

export interface InputState extends BaseState {
    value: number | string;
}

export default class Input extends Base<InputProps, InputState> {
    constructor(props: InputProps) {
        super(props);

        this.state = {
            value: this.targetValue,
        } as InputState;

        const onTargetChange = {
            id: props.id,
            property: props.settings.property,
            func: this.onTargetChange,
        };

        const descriptor = Object.getOwnPropertyDescriptor(props.settings.target, props.settings.property);
        if (descriptor.value === undefined) {
            const set = descriptor.set.bind(props.settings.target);
            const get = descriptor.get.bind(props.settings.target);
            Object.defineProperty(props.settings.target, props.settings.property, {
                get: function () {
                    return get();
                },
                set: function (value: number | string) {
                    set(value);
                    onTargetChange.func();
                }
            });
        } else {
            props.settings.target[`_${props.id}_${props.settings.property}`] = props.settings.target[props.settings.property];
            Object.defineProperty(props.settings.target, props.settings.property, {
                get: function () {
                    return this[`_${onTargetChange.id}_${onTargetChange.property}`];
                },
                set: function (value: number | string) {
                    this[`_${onTargetChange.id}_${onTargetChange.property}`] = value;
                    onTargetChange.func();
                }
            });
        }

        this.componentWillUnmount = () => {
            onTargetChange.func = () => {};
        };
    }

    get targetValue() {
        return this.props.settings.target[this.props.settings.property] as number | string;
    }

    set targetValue(value: number | string) {
        this.props.settings.target[this.props.settings.property] = value;
    }

    onTargetChange = () => {
        this.setState(prevState => ({
            ...prevState,
            value: this.targetValue,
        }));
    };

    onChange = () => {
        this.setState(prevState => ({
            ...prevState,
            value: (this._ref.current.children[1] as HTMLInputElement).value,
        }), () => {
            if (typeof this.targetValue === 'number') {
                this.targetValue = parseFloat(this.state.value as string);
            } else {
                this.targetValue = this.state.value.toString();
            }
        });
    }

    render() {
        return (
            <div ref={ this._ref }>
                <label>{ this.props.settings.title }</label>
                <input type="text" value={ this.state.value } onChange={ this.onChange } />
            </div>
        );
    }
}