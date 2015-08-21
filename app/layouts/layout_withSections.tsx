
import * as React from '../component/element';
import { ComposerLayout, Link } from '../component/layerComponents';

interface Regions extends Props {
    Header: new(props: any, children: any) => ComposerContent<any, any, any>;
    TopSection: new(props: any, children: any) => ComposerContent<any, any, any>;
    Section1: new(props: any, children: any) => ComposerContent<any, any, any>;
    Section2: new(props: any, children: any) => ComposerContent<any, any, any>;
    Section3: new(props: any, children: any) => ComposerContent<any, any, any>;
    Footer: new(props: any, children: any) => ComposerContent<any, any, any>;
}

export class Layout_withSections extends ComposerLayout<Regions, {}, Elements> {
    public render() {
        return (
            <main>
                <header id='Header'>
                    {this.props.Header}
                </header>
                <section id='TopSection'>
                    {this.props.TopSection}
                </section>
                <section id='Section1'>
                    {this.props.Section1}
                </section>
                <section id='Section2'>
                    {this.props.Section2}
                </section>
                <section id='Section3'>
                    {this.props.Section3}
                </section>
                <footer id='Footer'>
                    {this.props.Footer}
                </footer>
            </main>
        );
    }
}