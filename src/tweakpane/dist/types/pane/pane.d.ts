import { TpPluginBundle } from '@tweakpane/core';
import { RootApi } from '../blade/root/api/root';
import { PaneConfig } from './pane-config';
/**
 * The root pane of Tweakpane.
 */
export declare class Pane extends RootApi {
    private readonly pool_;
    private readonly usesDefaultWrapper_;
    private doc_;
    private containerElem_;
    constructor(opt_config?: PaneConfig);
    get document(): Document;
    dispose(): void;
    registerPlugin(bundle: TpPluginBundle): void;
    private embedPluginStyle_;
    private setUpDefaultPlugins_;
}
