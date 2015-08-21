
import * as React from '../../component/element';
import { ComposerContent } from '../../component/layerComponents';
import express = require('express');

interface Props {
    l10ns: any;
}

interface HeroElements extends Elements {

}

export class Hero extends ComposerContent<Props, {}, HeroElements> {
    public static fetch(req: express.Request): Promise<Props> {
        let l = req.localizations;
        return Promise.resolve({
            l10ns: {
                subTitle: l('HERO->SUB_TITLE')
            }
        });
    }

    public static setPageInfo(props: Props, pageInfo: PageInfo): void {
        this.setPageTitle('Nalie', pageInfo);
        this.setPageDescription(props.l10ns.subTitle, pageInfo);
        this.setPageURL('/', pageInfo);
    }

    public render() {
        return (
            <div class='PurpleToBlueGradientBG'>
                <hgroup id='HeroHeaders'>
                    <img id="HeroTitle" src='/public/images/logo.svg' alt='Nalie'></img>
                    <h2 id="HeroDescription" class='HeaderWhite1'>{this.props.l10ns.subTitle}</h2>
                </hgroup>
            </div>
        );
    }
}