import { ApiChangeEvents, BladeApi, LabeledValueController, SliderTextController } from '@tweakpane/core';
export declare class SliderApi extends BladeApi<LabeledValueController<number, SliderTextController>> {
    private readonly emitter_;
    constructor(controller: LabeledValueController<number, SliderTextController>);
    get label(): string | undefined;
    set label(label: string | undefined);
    get maxValue(): number;
    set maxValue(maxValue: number);
    get minValue(): number;
    set minValue(minValue: number);
    get value(): number;
    set value(value: number);
    on<EventName extends keyof ApiChangeEvents<number>>(eventName: EventName, handler: (ev: ApiChangeEvents<number>[EventName]['event']) => void): this;
}
