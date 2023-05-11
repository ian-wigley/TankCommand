declare module "colladaloader" {
    export = THREE.ColladaLoader;
}

declare namespace THREE {
    export class ColladaLoader {
        constructor();
        public options: any;
        public load(
            url: string,
            readyCallback: (result: any) => void,
            progressCallback: (total: number, loaded: number) => void,
            failCallback: (result: any) => void);
    }
}