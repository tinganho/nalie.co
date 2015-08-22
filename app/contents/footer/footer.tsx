
import * as React from '../../component/element';
import { ComposerContent } from '../../component/layerComponents';
import express = require('express');

interface Props {
    l10ns: any;
}

interface FooterElements extends Elements {
    about: DOMElement;
    terms: DOMElement;
}

export class Footer extends ComposerContent<Props, {}, FooterElements> {
    public static fetch(req: express.Request): Promise<Props> {
        let l = req.localizations;
        return Promise.resolve({
            l10ns: {
                copyright: l('FOOTER->COPRYIGHT', { thisYear: new Date().getFullYear() }),
                about: l('FOOTER->ABOUT'),
                terms: l('FOOTER->TERMS'),
                jobs: l('FOOTER->JOBS'),
                contact: l('FOOTER->CONTACT'),
            }
        });
    }

    public render() {
        return (
            <div class='LightBlueBG'>
                <span id='Copyright' class='BlueAnchor2'>{this.props.l10ns.copyright}</span>
                <ul id='FooterMenu'>
                    <li ref='about' class='FooterMenuItem'><a class='BlueAnchor2'>{this.props.l10ns.about}</a></li>
                    <li ref='terms' class='FooterMenuItem'><a class='BlueAnchor2'>{this.props.l10ns.terms}</a></li>
                    <li class='FooterMenuItem'><a class='BlueAnchor2'>{this.props.l10ns.jobs}</a></li>
                    <li class='FooterMenuItem'><a class='BlueAnchor2' href='mailto:tingan87@gmail.com' target='_blank'>{this.props.l10ns.contact}</a></li>
                </ul>
            </div>
        );
    }

    public bindDOM() {
        super.bindDOM();
        this.elements.about.onClick((event) => {
            event.preventDefault();
            this.scrollWindowTo(0, 300);
        });
        this.elements.terms.onClick(() => {
            event.preventDefault();
            alert('Sorry at this stage we have not done a terms page yet.');
        });
    }
}