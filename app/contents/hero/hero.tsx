
import * as React from '../../component/element';
import { ComposerContent } from '../../component/layerComponents';
import express = require('express');

interface Props {
    l10ns: any;
}

interface HeroElements extends Elements {

}

declare let Modernizr: any;
declare let cf: any;

export class Hero extends ComposerContent<Props, {}, HeroElements> {
    public static fetch(req: express.Request): Promise<Props> {
        let l = req.localizations;
        return Promise.resolve({
            l10ns: {
                pageMissingFeatureErrorMessage: l('PAGE->MISSING_FEATURE_ERROR_MESSAGE'),
                subTitle: l('HERO->SUB_TITLE')
            }
        });
    }

    public static setPageInfo(props: Props, pageInfo: PageInfo): void {
        this.setPageTitle(`Nalie | ${props.l10ns.subTitle}`, pageInfo);
        this.setPageURL('/', pageInfo);
        this.setPageImage('/public/images/web.jpg', pageInfo);
    }

    public bindDOM() {
        super.bindDOM();

        if (!Modernizr.svg || !Modernizr.cssgradients) {
            alert(this.props.l10ns.pageMissingFeatureErrorMessage);
        }

        (window as any).weixinShare.URL = window.location.href;
        (window as any).weixinShare.title = `Nalie | ${this.props.l10ns.subTitle}`;
        (window as any).weixinShare.imgURL = window.location.origin + '/public/images/app.png';
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