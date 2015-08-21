
import * as React from '../../component/element';
import { ComposerContent } from '../../component/layerComponents';
import express = require('express');

interface TheWorldWillChangeProps {
    a: string;
    l10ns: any;
}

interface TheWorldWillChangeElements extends Elements {

}

export class TheWorldWillChange extends ComposerContent<TheWorldWillChangeProps, {}, TheWorldWillChangeElements> {
    public static fetch(req: express.Request): Promise<TheWorldWillChangeProps> {
        let l = req.localizations;
        return Promise.resolve({
            a: 'a',
            b: 'b',
            l10ns: {
                title: l('THE_WORLD_WILL_CHANGE->TITLE'),
                subTitle: l('THE_WORLD_WILL_CHANGE->SUB_TITLE'),
            }
        });
    }

    public render() {
        return (
            <div class='LightBlueBG FillParentLayout'>
                <hgroup id='TheWorldWillChangeHeaders'>
                    <h1 class='HeaderBlue1'>{this.props.l10ns.title}</h1>
                    <h2 class='HeaderBlue2'>{this.props.l10ns.subTitle}</h2>
                </hgroup>
                <img id='TheWorldWillChangeIcon' src='/public/images/world.svg' alt='Device'></img>
            </div>
        );
    }
}