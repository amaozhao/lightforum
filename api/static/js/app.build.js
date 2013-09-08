({
    baseUrl: ".",
    name: 'main',
    paths: {
	    "codemirror": 'libs/codemirror/codemirror',
	    "overlay": 'libs/codemirror/addon/mode/overlay',
	    "xml": 'libs/codemirror/mode/xml/xml',
	    "markdown": 'libs/codemirror/mode/markdown/markdown',
	    "javascript": 'libs/codemirror/mode/javascript/javascript',
	    "css": 'libs/codemirror/mode/css/css',
	    "python": 'libs/codemirror/mode/python/python',
	    "php": 'libs/codemirror/mode/php/php',
	    "gfm": 'libs/codemirror/mode/gfm/gfm',

		"jquery": 'libs/jquery/jquery.min',
		"jquery-migrate": "libs/jquery/jquery-migrate.min",
		"jquery.bootstrap": "libs/bootstrap/bootstrap.min",
		"jquery.spin": "libs/spin/jquery.spin",
		"spin": "libs/spin/spin.min",
		"underscore": 'libs/underscore/underscore',
		"underi18n": 'libs/underi18n/underi18n',
		"backbone": 'libs/backbone/backbone',
		"text": 'libs/requirejs-text/text'
	},
    out: 'main-built.js',
    shim: {
		"underscore": {
			exports: "_"
		},
		"backbone": {
			deps: [
				"underscore",
				"jquery"
			],
			exports: 'Backbone'
		},
		"underi18n": {
			exports: 'underi18n'
		},
		"jquery.bootstrap": {
            deps: ["jquery", "jquery-migrate"]
        },
		"jquery.spin": {
            deps: ["jquery", "jquery-migrate", "spin"]
        },

        "codemirror": {
        	exports: "codemirror"
        },
        "overlay": {
        	deps: ["codemirror"]
        },
        "xml": {
        	deps: ["codemirror"]
        },
        "markdown": {
        	deps: ["codemirror"]
        },
        "javascript": {
        	deps: ["codemirror"]
        },
        "css": {
        	deps: ["codemirror"]
        },
        "python": {
        	deps: ["codemirror"]
        },
        "php": {
        	deps: ["codemirror"]
        },
		"gfm": {
			deps: [
				"codemirror",
				"overlay",
				"xml",
				"markdown",
				"javascript",
				"css",
				"python",
				"php"
			],
		    exports: 'gfm'
		}
	}
})
