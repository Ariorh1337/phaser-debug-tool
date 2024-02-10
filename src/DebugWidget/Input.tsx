import React from 'react';
import Base, { BaseProps, BaseState } from './Base';

export interface InputProps extends BaseProps {
    settings: {
        title: string;
        property: string;
        target: Record<string, unknown>;
        type?: 'number' | 'text' | 'checkbox';
        min?: number;
        max?: number;
        step?: number;
    }
}

export interface InputState extends BaseState {
    value: number | string |  boolean;
}

export default class Input extends Base<InputProps, InputState> {
    constructor(props: InputProps) {
        super(props);

        this.state = {
            value: this.targetValue,
        } as InputState;

        if (["min", "max", "step"].some((key: "min" | "max" | "step") => props.settings[key] !== undefined)) {
            props.settings.type = "number";
        } else if (props.settings.type === undefined) {
            const type = typeof this.targetValue;

            if (type === "number") {
                props.settings.type = type;
            } else if (type === "string") {
                props.settings.type = "text";
            } else if (type === "boolean") {
                props.settings.type = "checkbox";
            } else {
                props.settings.type = "text";
            }
        }

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
            onTargetChange.func = () => { };
        };
    }

    get targetValue() {
        return this.props.settings.target[this.props.settings.property] as number | string | boolean;
    }

    set targetValue(value: number | string | boolean) {
        this.props.settings.target[this.props.settings.property] = value;
    }

    onTargetChange = () => {
        this.setState(prevState => ({
            ...prevState,
            value: this.targetValue,
        }));
    };

    onChange = () => {
        let value = (this._ref.current.children[1] as HTMLInputElement).value;

        if (this.props.settings.type === "checkbox") {
            value = (this._ref.current.children[1] as HTMLInputElement).checked.toString();
        }

        this.setState(prevState => ({
            ...prevState,
            value: value,
        }), () => {
            const type = this.props.settings.type;

            if (type === "number") {
                this.targetValue = parseFloat(this.state.value as string);
            } else if (type === "checkbox") {
                this.targetValue = this.state.value.toString() === "true";
            } else if (type === "text") {
                this.targetValue = this.state.value.toString();
            }
        });
    }

    render() {
        return (
            <div
                ref={this._ref}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    minWidth: "7em",
                }}
            >
                <label
                    style={{
                        textWrap: "nowrap",
                        marginRight: "1em",
                    }}
                >
                    {this.props.settings.title}
                </label>
                <input
                    style={{
                        width: "50%",
                        height: "1em",
                        minWidth: "7em",
                    }}
                    type={this.props.settings.type}
                    checked={this.state.value as boolean}
                    value={this.state.value as string}
                    onChange={this.onChange}
                />
            </div>
        );
    }
}