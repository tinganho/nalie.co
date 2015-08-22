
import * as React from '../component/element';
import { ComposerDocument, Link } from '../component/layerComponents';

interface ComposerDocumentProps extends DocumentProps {
    title: string;
    layout: string;
}

export class Document extends ComposerDocument<ComposerDocumentProps, {}, Elements> {
    public id = 'composer-document';
    public render() {
        return (
            <html lang='en'>
                <head>
                    <title>{this.props.pageInfo.title}</title>
                    <meta property='og:title' content={this.props.pageInfo.title} />
                    <meta charset='utf-8'></meta>
                    <meta http-equiv='X-UA-Compatible' content='IE=edge,chrome=1'></meta>
                    <meta property='og:type' content='website' />
                    <meta name='twitter:card' content='summary' />

                    {
                        (() => {
                            if (this.props.pageInfo.description) {
                                return [
                                    <meta name='description' content={this.props.pageInfo.description} />,
                                    <meta property='og:description' content={this.props.pageInfo.description} />
                                ];
                            }
                        })()
                    }

                    {
                        (() => {
                            if (this.props.pageInfo.image) {
                                return <meta property='og:image' content={this.props.pageInfo.image} />;
                            }
                        })()
                    }

                    {
                        (() => {
                            if (this.props.pageInfo.URL) {
                                return [
                                    <link rel='canonical' href={this.props.pageInfo.URL} />,
                                    <meta property='og:url' content={this.props.pageInfo.URL} />
                                ];
                            }
                        })()
                    }

                    <link rel='mask-icon' href='/public/images/Nalie.svg' color='red'/>
                    <link rel='icon' sizes='any' mask href='/public/images/Nalie.svg'/>
                    <link rel='icon' type='image/x-icon' href='/public/images/Nalie.ico'/>
                    <link rel='shortcut icon' sizes='196x196' href='/public/images/Nalie.svg'/>
                    <link rel='shortcut icon' type='image/x-icon' href='/public/images/Nalie.ico'/>
                    <link rel='stylesheet' href='/public/styles/styles.css'/>
                    <meta name='viewport' content='user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi' />
                    <meta property='og:site_name' content='Nalie' />
                    <script type='text/javascript' html='window.inServer = false; window.inClient = true;'></script>
                    <script type='text/javascript' src='/public/scripts/vendor/promise.js'></script>
                    <script type='text/javascript' src='/public/scripts/vendor/promise.prototype.finally.js'></script>
                    <script type='text/javascript' src='/public/scripts/vendor/system.js'></script>

                    {this.props.jsonScriptData.map(attr => {
                        return (
                            <script
                                type='application/json'
                                id={attr.id}>
                                {JSON.stringify(attr)}
                            </script>
                        );
                    })}

                </head>
                <body id="LayoutRegion">
                    {this.props.layout}

                    {
                        (() => {
                            if (this.manifestExists) {
                                return <script type='text/javascript' src='/public/scripts/app.js'></script>
                            }
                            else {
                                return <script type='text/javascript' src='/public/scripts/startup.js'></script>;
                            }
                        })()
                    }
                </body>
            </html>
        );
    }
}