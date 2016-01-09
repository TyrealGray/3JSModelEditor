({
    appDir: "./",
    baseUrl: "js",
    dir: "./build",
    paths: {
        text: 'thirdLib/requirejs/text',
        THREE: 'thirdLib/threejs/Three.min'
    },
    shim: {
        THREE: {
            exports: 'THREE'
        }
    },
    modules: [{
        name: 'module/MainFrame',
            }],
    fileExclusionRegExp:  /^(r|build)\.js$|^(.git)$/
})