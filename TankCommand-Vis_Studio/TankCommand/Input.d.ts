declare class InputControls {
    private m_left;
    private m_right;
    private m_up;
    private m_down;
    private m_fire;
    private m_firePressed;
    private m_divePressed;
    private m_reversePressed;
    constructor();
    get left(): boolean;
    set left(value: boolean);
    get right(): boolean;
    set right(value: boolean);
    get up(): boolean;
    set up(value: boolean);
    get down(): boolean;
    set down(value: boolean);
    get fire(): boolean;
    set fire(value: boolean);
    get firePressed(): boolean;
    set firePressed(value: boolean);
}
export = InputControls;
