
import * as React from '../../component/element';
import { ComposerContent } from '../../component/layerComponents';
import express = require('express');

interface HeroProps {
    l10ns: any;
}

interface HeroElements extends Elements {
    logo: DOMElement;
}

export class TopBar extends ComposerContent<HeroProps, {}, HeroElements> {
    private heroHeadersBottomTopPosition: number;

    public static fetch(req: express.Request): Promise<HeroProps> {
        let l = req.localizations;
        return Promise.resolve({});
    }

    public render() {
        return (
            <div class='DarkBlueBG isHidden'>
                <img ref='logo' id='TopBarLogo' src='/public/images/logo.svg' alt='Nalie'></img>
            </div>
        );
    }

    public bindDOM() {
        super.bindDOM();
        let heroHeadersEl = this.findNode('HeroHeaders');
        this.heroHeadersBottomTopPosition = heroHeadersEl.position().top + heroHeadersEl.height();
        this.setViewState();
        window.onscroll = this.setViewState.bind(this);

        this.elements.logo.onClick(() => {
            this.scrollWindowTo(0, 300);
        });
    }

    private setViewState() {
        if (window.scrollY > this.heroHeadersBottomTopPosition) {
            this.root.removeClass('isHidden').addClass('isRevealed');
        }
        else {
            this.root.removeClass('isRevealed').addClass('isHidden');
        }
    }
}