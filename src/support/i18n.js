var I18n = {};

I18n.translations = {};
I18n.locale = 'en';

I18n.load = function (translations, parents) {
    if (typeof parents == 'undefined') {
        parents = [];
    }
    for (var key in translations) {
        parents.push(key);
        if (typeof translations[key] == 'object') {
            I18n.load(translations[key], parents);
        } else {
            I18n.translations[parents.join('.')] = translations[key];
        }
        parents.pop();
    }
};

I18n.translate = function (str, options) {
    var locale, ary;

    if (!options) {
        options = {};
    }
    if (options.scope) {
        if (options.scope.join) {
            str = options.scope.join('.') + '.' + str;
        } else {
            str = options.scope + '.' + str;
        }
    }
    locale = options.locale || I18n.locale;
    str = locale + '.' + str;

    if (I18n.translations[str]) {
        return I18n.translations[str];
    } else {
        if (options['default']) {
            return options['default'];
        }
        else if (I18n.development) {
            ary = str.split('.');
            return '<span class="missing_translation" title="' + str.replace(/"/g, '\\"') + '">' + ary[ary.length - 1].replace('_', ' ') + '</span>';
        } else {
            ary = str.split('.');
            return ary[ary.length - 1].replace('_', ' ');
        }
    }
};

I18n.t = I18n.translate;
