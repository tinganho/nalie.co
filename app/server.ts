
/// <reference path='../typings/express/express.d.ts' />
/// <reference path='../typings/morgan/morgan.d.ts' />
/// <reference path='../typings/cookie-parser/cookie-parser.d.ts' />
/// <reference path='../typings/express-request-language/express-request-language.d.ts' />

(global as any).inServer = true;
(global as any).inClient = false;

if (process.env.NODE_ENV !== 'production') {
    require('source-map-support').install();
}
let localizations = require('./localizations/output/all');

import cf from '../conf/conf';
import express = require('express');
import * as path from 'path';
import logger = require('morgan');
import { ServerComposer, PlatformDetect } from './composer/serverComposer';
import { ModuleKind } from './composer/webBindingsEmitter';
import { Layout_withSections } from './layouts/layout_withSections';
import { Document } from './documents/document';
import { TopBar } from './contents/topBar/topBar';
import { Hero } from './contents/hero/hero';
import { TheNextEvolution } from './contents/theNextEvolution/theNextEvolution';
import { TheWorldWillChange } from './contents/theWorldWillChange/theWorldWillChange';
import { JoinForcesWithUs } from './contents/joinForcesWithUs/joinForcesWithUs';
import { Footer } from './contents/footer/footer';
import Debug from './debug';
import requestLanguage = require('express-request-language');
import cookieParser = require('cookie-parser');
import {
    ComposerDocument,
    DocumentDeclaration,
    LayoutDeclaration,
    ContentDeclaration,
    ComposerContent } from './component/layerComponents';

let app = express();
app.use(logger('dev'));
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        console.log(req.url)
        if(req.url.indexOf('/public/') === 0) {
            res.setHeader('Cache-Control', 'public, max-age=31536000000');
            res.setHeader('Expires', new Date(Date.now() + 365*24*3600*1000).toUTCString());
        }
        return next();
    })
}
app.use('/public', express.static(path.join(__dirname, 'public'), { etag: false }));
app.use('/', express.static(__dirname));
app.use(cookieParser());
app.use(requestLanguage({
    languages: ['en-US'],
    cookie: {
        name: 'language',
        options: { maxAge: 24*3600*1000 },
        url: '/languages/{language}'
    },
    localizations,
}));

let serverComposer = new ServerComposer({
    app,
    rootPath: __dirname,
    routerOutput: 'public/scripts/router.js',
    bindingsOutput: 'public/scripts/bindings.js',
    clientConfigurationPath: './client/*.js',
    moduleKind: ModuleKind.CommonJs,
    defaultDocumentFolder: 'documents',
    defaultLayoutFolder: 'layouts',
    defaultContentFolder: 'contents',
});

serverComposer.setPages({
    '/': page => {
        page.onPlatform({
                name: 'web',
                detect: () => true,
            })
            .hasDocument(Document, {})
            .hasLayout(Layout_withSections, {
                Header: {
                    importPath: 'contents/topBar/topBar',
                    component: TopBar,
                },
                TopSection: {
                    importPath: 'contents/hero/hero',
                    component: Hero,
                },
                Section1: {
                    importPath: 'contents/theNextEvolution/theNextEvolution',
                    component: TheNextEvolution,
                },
                Section2: {
                    importPath: 'contents/theWorldWillChange/theWorldWillChange',
                    component: TheWorldWillChange,
                },
                Section3: {
                    importPath: 'contents/joinForcesWithUs/joinForcesWithUs',
                    component: JoinForcesWithUs,
                },
                Footer: {
                    importPath: 'contents/footer/footer',
                    component: Footer,
                },
            })
            .end();
    }
});

export function emitBindingsAndRouterFiles() {
    serverComposer.emitBindings();
    serverComposer.emitClientRouter();
}

export function start() {
    serverComposer.start((err) => {
        if (err) {
            throw err;
        }
        Debug.prompt(`Server started at port ${process.env.PORT || cf.DEFAULT_PORT}. Press CTRL + C to exit.`);
    });
}
