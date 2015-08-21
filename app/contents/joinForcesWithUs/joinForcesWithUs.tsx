
import * as React from '../../component/element';
import { ComposerContent } from '../../component/layerComponents';
import express = require('express');

interface JoinForcesWithUsProps {
    l10ns: any;
}

interface JoinForcesWithUsElements extends Elements {

}

export class JoinForcesWithUs extends ComposerContent<JoinForcesWithUsProps, {}, JoinForcesWithUsElements> {
    public static fetch(req: express.Request): Promise<JoinForcesWithUsProps> {
        let l = req.localizations;
        return Promise.resolve({
            l10ns: {
                title: l('JOIN_FORCES_WITH_US->TITLE'),
                subTitle: l('JOIN_FORCES_WITH_US->SUB_TITLE'),
                role1: l('JOIN_FORCES_WITH_US->ROLE1'),
                role2: l('JOIN_FORCES_WITH_US->ROLE2'),
                role3: l('JOIN_FORCES_WITH_US->ROLE3'),
                role4: l('JOIN_FORCES_WITH_US->ROLE4'),
            }
        });
    }

    public render() {
        return (
            <div class='LighterBlueBG FillParentLayout'>
                <hgroup id='JoinForcesWithUsHeaders'>
                    <h1 class='HeaderBlue1'>{this.props.l10ns.title}</h1>
                    <h2 class='HeaderBlue2'>{this.props.l10ns.subTitle}</h2>
                </hgroup>
                <ul id='JoinForcesWithUsRoles'>
                    <li class="JoinForcesWithUsRole"><a class="BlueAnchor1">{this.props.l10ns.role1}</a></li>
                    <li class="JoinForcesWithUsRole"><a class="BlueAnchor1">{this.props.l10ns.role2}</a></li>
                    <li class="JoinForcesWithUsRole"><a class="BlueAnchor1">{this.props.l10ns.role3}</a></li>
                    <li class="JoinForcesWithUsRole"><a class="BlueAnchor1">{this.props.l10ns.role4}</a></li>
                </ul>
            </div>
        );
    }
}