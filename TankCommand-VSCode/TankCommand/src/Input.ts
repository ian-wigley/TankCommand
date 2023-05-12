export class InputControls {

    private m_left: boolean;			// true if left control held
    private m_right: boolean;			// true if right control held
    private m_up: boolean;				// true if up control held
    private m_down: boolean;			// true if down control held
    private m_fire: boolean;			// true if fire control held
    private m_firePressed: boolean;		// true if fire control has just been pressed

    constructor() {
        this.m_left = false;
        this.m_right = false;
        this.m_up = false;
        this.m_down = false;
        this.m_fire = false;
        this.m_firePressed = false;
    }

    public get left(): boolean {
        return this.m_left;
    }

    public set left(value: boolean) {
        this.m_left = value;
    }

    public get right(): boolean {
        return this.m_right;
    }

    public set right(value: boolean) {
        this.m_right = value;
    }

    public get up(): boolean {
        return this.m_up;
    }

    public set up(value: boolean) {
        this.m_up = value;
    }

    public get down(): boolean {
        return this.m_down;
    }

    public set down(value: boolean) {
        this.m_down = value;
    }

    public get fire(): boolean {
        return this.m_fire;
    }

    public set fire(value: boolean) {
        this.m_fire = value;
    }

    public get firePressed(): boolean {
        return this.m_firePressed;
    }

    public set firePressed(value: boolean) {
        this.m_firePressed = value;
    }
}