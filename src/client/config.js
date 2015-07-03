alt.application = 'prototyper';
alt.version = '1.0.0';
alt.environment = 'development';
alt.urlArgs = alt.environment == 'production' ? '_v=' + alt.version : '_t=' + (+new Date());
alt.serverUrl = 'http://localhost/';
alt.defaultUrl = 'play/';
alt.github = {
    user: 'niwasmala',
    project: 'prototyper'
};

requirejs.config({
    urlArgs: alt.urlArgs,
    paths : {
        text: 'asset/lib/requirejs-plugins/lib/text',
        async: 'asset/lib/requirejs-plugins/src/async',
        font: 'asset/lib/requirejs-plugins/src/font',
        goog: 'asset/lib/requirejs-plugins/src/goog',
        image: 'asset/lib/requirejs-plugins/src/image',
        json: 'asset/lib/requirejs-plugins/src/json',
        noext: 'asset/lib/requirejs-plugins/src/noext',
        mdown: 'asset/lib/requirejs-plugins/src/mdown',
        propertyParser : 'asset/lib/requirejs-plugins/src/propertyParser',
        markdownConverter : 'asset/lib/plugins/lib/Markdown.Converter'
    }
});
