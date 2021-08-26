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
    private m_cameraArrowHelper;
    private stats;
    private m_angle;
    private currentPosition;
    private currentLookat;
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
    private updateTank;
    private updateCamera;
    private calculateIdealOffet;
    private calculateIdealLookAt;
    draw(): void;
}
export = TankCommand;
