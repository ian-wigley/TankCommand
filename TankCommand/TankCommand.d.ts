/// <reference path="stats.d.ts" />
/// <reference path="ammo.d.ts" />
declare class TankCommand {
    private canvas;
    private renderer;
    private scene;
    private m_camera;
    private m_terrain;
    private m_ctrl;
    private m_tank;
    private m_arrowHelper;
    private stats;
    private m_angle;
    private m_sceneWidth;
    private m_sceneHeight;
    constructor();
    init(): void;
    private onProgress;
    private onError;
    private ColCallBack;
    run(): void;
    private addHitListener;
    onResizeScreen(event: any): void;
    private onKeyPress;
    private onKeyUp;
    private onKeyboardPress;
    private onKeyboardRelease;
    private update;
    draw(): void;
}
export = TankCommand;
