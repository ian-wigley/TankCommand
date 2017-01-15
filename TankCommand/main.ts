require(["TankCommand.js"], function (someModule) {
    var tc = new someModule();
    tc.Run();
});

require.config({
    paths: {
        three: './three',
        ColladaLoader: './ColladaLoader',
        Terrain: './Terrain'
    },
    shim: {
        './ColladaLoader': ['three']
    },
    waitSeconds: 15,
});
