
import * as React from '../../component/element';
import { ComposerContent } from '../../component/layerComponents';
import express = require('express');

interface TheNextEvolutionProps {
    a: string;
    l10ns: any;
}

interface TheNextEvolutionElements extends Elements {

}

export class TheNextEvolution extends ComposerContent<TheNextEvolutionProps, {}, TheNextEvolutionElements> {
    public static fetch(req: express.Request): Promise<TheNextEvolutionProps> {
        let l = req.localizations;
        return Promise.resolve({
            a: 'a',
            b: 'b',
            l10ns: {
                title: l('THE_NEXT_EVOLUTION->TITLE'),
                subTitle: l('THE_NEXT_EVOLUTION->SUB_TITLE'),
            }
        });
    }

    public render() {
        return (
            <div class='LighterBlueBG FillParentLayout'>
                <hgroup id='TheNextEvolutionHeaders'>
                    <h1 class='HeaderBlue1'>{this.props.l10ns.title}</h1>
                    <h2 class='HeaderBlue2'>{this.props.l10ns.subTitle}</h2>
                </hgroup>
                <img id='TheNextEvolutionDevice' src='/public/images/deviceLying.svg' alt='Device'></img>
            </div>
        );
    }
}