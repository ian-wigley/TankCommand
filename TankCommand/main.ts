require(["TankCommand.js"], function (someModule) {
    var tc = new someModule();
    tc.init();
    tc.run();
});

require.config({
    paths: {
        three: './three',
        ColladaLoader: './ColladaLoader',
        Terrain: './Terrain',
        Statsz:"./stats"
    },
    waitSeconds: 15,
});
