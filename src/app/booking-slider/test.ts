import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Directive,
    ElementRef, Input,
    OnChanges,
    OnInit,
    Renderer2,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {addDays, isFirstDayOfMonth} from 'date-fns';
import {TimelineService} from '../timeline.service';
import {JqLiteWrapper} from './jq-wrapper';
import { ValueHelper } from './value-helper';
import {CompatibilityHelper} from './compatibility';
import { ThrottledFuncService } from './throttled-func.service';

import detectPassiveEvents from 'detect-passive-events';
import {MathHelper} from './math-helper';

enum HandleLabelType {
    Min,
    Max
}
enum HandleType {
    Low,
    High
}
export enum LabelType {
    /** Label above low pointer */
    Low,
    /** Label above high pointer */
    High,
    /** Label for minimum slider value */
    Floor,
    /** Label for maximum slider value */
    Ceil
}
export enum PointerType {
    /** Low pointer */
    Min,
    /** High pointer */
    Max
}


class Dragging {
    active: boolean = false;
    value: number = 0;
    difference: number = 0;
    position: number = 0;
    lowLimit: number = 0;
    highLimit: number = 0;
}
export type PositionToValueFunction = (percent: number, minVal: number, maxVal: number) => number;
/** Function to translate label value into text */
export type TranslateFunction = (value: number, label: LabelType) => string;
/** Function converting slider value to slider position */
export type ValueToPositionFunction = (val: number, minVal: number, maxVal: number) => number;
/** Function to combind */
export type CombineLabelsFunction = (minLabel: string, maxLabel: string) => string;


export class SliderElement extends JqLiteWrapper {
    position: number = 0;
    value: string;
    dimension: number;
    alwaysHide: boolean = false;

    constructor(elemRef: ElementRef, renderer: Renderer2) {
        super(elemRef, renderer);
    }
}

@Directive({selector: '[appSliderMinHElem]'})
export class MinHDirective extends SliderElement {
    constructor(elemRef: ElementRef, renderer: Renderer2) {
        super(elemRef, renderer);
    }
}

@Directive({selector: '[appSliderMaxHElem]'})
export class MaxHDirective extends SliderElement {
    constructor(elemRef: ElementRef, renderer: Renderer2) {
        super(elemRef, renderer);
    }
}

@Directive({selector: '[appSliderFullBarElem]'})
export class FullBarDirective extends SliderElement {
    constructor(elemRef: ElementRef, renderer: Renderer2) {
        super(elemRef, renderer);
    }
}

@Directive({selector: '[appSliderFlrLabElem]'})
export class FlrLabDirective extends SliderElement {
    constructor(elemRef: ElementRef, renderer: Renderer2) {
        super(elemRef, renderer);
    }
}

@Directive({selector: '[appSliderCeilLabElem]'})
export class CeilLabDirective extends SliderElement {
    constructor(elemRef: ElementRef, renderer: Renderer2) {
        super(elemRef, renderer);
    }
}

@Directive({selector: '[appSliderMaxLabElem]'})
export class MaxLabDirective extends SliderElement {
    constructor(elemRef: ElementRef, renderer: Renderer2) {
        super(elemRef, renderer);
    }
}

@Directive({selector: '[appSliderMinLabElem]'})
export class MinLabDirective extends SliderElement {
    constructor(elemRef: ElementRef, renderer: Renderer2) {
        super(elemRef, renderer);
    }
}

@Directive({selector: '[appSliderCmbLabElem]'})
export class CmbLabDirective extends SliderElement {
    constructor(elemRef: ElementRef, renderer: Renderer2) {
        super(elemRef, renderer);
    }
}

@Directive({selector: '[appSliderSelBarElem]'})
export class SelBarDirective extends SliderElement {
    constructor(elemRef: ElementRef, renderer: Renderer2) {
        super(elemRef, renderer);
    }
}

@Component({
    selector: 'app-booking-slider',
    templateUrl: './booking-slider.component.html',
    styleUrls: ['./booking-slider.component.scss']
})

export class BookingSliderComponent implements OnInit, AfterViewInit, OnChanges {

    width: number = 800;
    height: number = 150;
    paddingLeft: number = 5;

    // Model for low value slider. If only value is provided single slider will be rendered.
    private _value: number;
    @Input() set value(newValue: number) {
        this._value = +newValue;
    }
    get value(): number {
        return this._value;
    }

    // Model for high value slider. Providing both value and highValue will render range slider.
    private _highValue: number;
    @Input() set highValue(newHighValue: number) {
        this._highValue = +newHighValue;
    }
    get highValue(): number {
        return this._highValue;
    }
    private barDimension: number;
    private isDragging: boolean;
    private touchId: number;

    private thrOnLowHandleChange: ThrottledFuncService;
    private thrOnHighHandleChange: ThrottledFuncService;
    private onMoveUnsubscribe: () => void = null;
    private onEndUnsubscribe: () => void = null;

    // Precision limit
    private precisionLimit: number = 12;

    // Step
    private step: number = 1;
    // Internal flag to prevent watchers to be called when the sliders value are modified internally.
    private internalChange: boolean = false;
    // The name of the handle we are currently tracking
    private tracking: HandleType = null;
    // Internal flag to keep track of the visibility of combo label
    private cmbLabelShown: boolean = false;
    private combineLabels: CombineLabelsFunction;
    private translate: TranslateFunction;
    // Set to true if init method already executed
    private initHasRun: boolean = false;
    // Minimum value (floor) of the model
    private minValue: number = 0;

    // Low value synced to model low value
    private viewLowValue: number;
    // High value synced to model high value
    private viewHighValue: number;
    // Maximum value (ceiling) of the model
    private maxValue: number = 100;
    // Maximum position the slider handle can have
    private maxPos: number = 0;
    // Half of the width or height of the slider handles
    private handleHalfDim: number = 0;
    // Values recorded when first dragging the bar
    private dragging: Dragging = new Dragging();
    public fitDays = 30;
    public isFirstDay = isFirstDayOfMonth;

    // Left slider handle
    @ViewChild(MinHDirective)
    private minHElem: SliderElement;

    // The whole slider bar
    @ViewChild(FullBarDirective)
    private fullBarElem: SliderElement;
    // Right slider handle
    @ViewChild(MaxHDirective)
    private maxHElem: SliderElement;

    // Floor label
    @ViewChild(FlrLabDirective)
    private flrLabElem: SliderElement;

    // Ceiling label
    @ViewChild(CeilLabDirective)
    private ceilLabElem: SliderElement;

    // Label above the high value
    @ViewChild(MaxLabDirective)
    private maxLabElem: SliderElement;

    // Label above the low value
    @ViewChild(MinLabDirective)
    private minLabElem: SliderElement;

    // Combined label
    @ViewChild(CmbLabDirective)
    private cmbLabElem: SliderElement;

    // Highlight between two handles
    @ViewChild(SelBarDirective)
    private selBarElem: SliderElement;

    // Slider type, true means range slider
    get range(): boolean {
        return true;
    }

    constructor(private renderer: Renderer2,
                private elementRef: ElementRef,
                public timelineService: TimelineService,
                private changeDetectionRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.translate = (value: number): string => String(value);
        this.combineLabels = (minValue: string, maxValue: string): string => {
            return minValue + ' - ' + maxValue;
        };
    }

    ngAfterViewInit(): void {
        this.thrOnLowHandleChange = new ThrottledFuncService((): void => { this.onLowHandleChange(); }, 350);
        this.thrOnHighHandleChange = new ThrottledFuncService((): void => { this.onHighHandleChange(); }, 350);

        this.syncLowValue();

        if (this.range) {
            this.syncHighValue();
        }
        this.calcViewDimensions();
        //this.updateCeilLab();
        //this.updateFloorLab();
        this.initHandles();
        this.bindEvents();

        this.initHasRun = true;

        // In some cases, the starting model values are actually outside valid range, so we need to fix this
        if (this.value !== this.viewLowValue || (this.range && this.highValue !== this.viewHighValue)) {
            //setTimeout(() => this.applyModel(false));
        }

        // Run change detection manually to resolve some issues when init procedure changes values used in the view
        this.changeDetectionRef.detectChanges();
    }

    // Bind mouse and touch events to slider handles
    private bindEvents(): void {
        const draggableRange: boolean = true;

        this.minHElem.on('mousedown', (event: MouseEvent): void => this.onStart(this.minHElem, HandleType.Low, event, true, true));

        if (this.range) {
            this.maxHElem.on('mousedown', (event: MouseEvent): void => this.onStart(this.maxHElem, HandleType.High, event, true, true));
        }

        this.minHElem.onPassive('touchstart', (event: TouchEvent): void => this.onStart(this.minHElem, HandleType.Low, event, true, true));
        if (this.range) {
            this.maxHElem.onPassive('touchstart', (event: TouchEvent): void => this.onStart(this.maxHElem, HandleType.High, event, true, true));
        }
    }

    // Reflow the slider when the low handle changes (called with throttle)
    private onLowHandleChange(): void {
        this.normaliseLowValue();
        if (this.range) {
            this.normaliseRange(PointerType.Min);
        }
        this.syncLowValue();
        if (this.range) {
            this.syncHighValue();
        }
        this.updateLowHandle(this.valueToPosition(this.viewLowValue));
        this.updateSelectionBar();
        if (this.range) {
            this.updateCmbLabel();
        }
    }

    // Reflow the slider when the high handle changes (called with throttle)
    private onHighHandleChange(): void {
        this.normaliseHighValue();
        this.normaliseRange(PointerType.Max);
        this.syncLowValue();
        this.syncHighValue();
        this.updateHighHandle(this.valueToPosition(this.viewHighValue));
        this.updateSelectionBar();
        this.updateCmbLabel();
    }

    // Make sure the low value is in allowed range
    private normaliseLowValue(): void {

        const normalisedValue: number = this.value;
        if (this.value !== normalisedValue) {
            // Apply new value as internal change
            this.internalChange = true;
            this.value = normalisedValue;
            this.internalChange = false;

            // Push the value out, too
            //setTimeout(() => this.applyModel(false));
        }
    }

    private syncLowValue(): void {
        this.viewLowValue = this.value;
    }

    private syncHighValue(): void {
        this.viewHighValue = this.highValue;
    }
    // Make sure high value is in allowed range
    private normaliseHighValue(): void {
        const normalisedHighValue: number = this.highValue;
        if (this.highValue !== normalisedHighValue) {
            // Apply new value as internal change
            this.internalChange = true;
            this.highValue = normalisedHighValue;
            this.internalChange = false;

            // Push the value out, too
            //setTimeout(() => this.applyModel(false));
        }
    }

    // Make sure that range slider invariant (value <= highValue) is always satisfied
    private normaliseRange(changedPointer: PointerType): void {

        if (this.range && this.value > this.highValue) {

        }
    }

    private onBarStart(pointer: SliderElement, event: MouseEvent|TouchEvent,
                       bindMove: boolean, bindEnd: boolean, simulateImmediateMove?: boolean, simulateImmediateEnd?: boolean): void {
        this.onDragStart(pointer, HandleType.High, event, bindMove, bindEnd, simulateImmediateMove, simulateImmediateEnd);
    }

    // onDragStart event handler, handles dragging of the middle bar
    private onDragStart(pointer: SliderElement, ref: HandleType, event: MouseEvent|TouchEvent,
                        bindMove: boolean, bindEnd: boolean, simulateImmediateMove?: boolean, simulateImmediateEnd?: boolean): void {
        const position: number = this.getEventPosition(event);

        this.dragging = new Dragging();
        this.dragging.active = true;
        this.dragging.value = this.positionToValue(position);
        this.dragging.difference = this.viewHighValue - this.viewLowValue;
        this.dragging.lowLimit = position - this.minHElem.position;
        this.dragging.highLimit = this.maxHElem.position - position;

        this.onStart(pointer, ref, event, bindMove, bindEnd, simulateImmediateMove, simulateImmediateEnd);
    }

    // onStart event handler
    private onStart(pointer: SliderElement, ref: HandleType, event: MouseEvent|TouchEvent,
                    bindMove: boolean, bindEnd: boolean, simulateImmediateMove?: boolean, simulateImmediateEnd?: boolean): void {
        let moveEvent: string = '';
        let endEvent: string = '';

        if (CompatibilityHelper.isTouchEvent(event)) {
            moveEvent = 'touchmove';
            endEvent = 'touchend';
        } else {
            moveEvent = 'mousemove';
            endEvent = 'mouseup';
        }

        event.stopPropagation();
        // Only call preventDefault() when handling non-passive events (passive events don't need it)
        if (!CompatibilityHelper.isTouchEvent(event) || !detectPassiveEvents.hasSupport) {
            event.preventDefault();
        }

        // We have to do this in case the HTML where the sliders are on
        // have been animated into view.
        this.calcViewDimensions();

        if (pointer) {
            this.tracking = ref;
        } else {
            pointer = this.getNearestHandle(event);
            this.tracking = pointer === this.minHElem ? HandleType.Low : HandleType.High;
        }

        pointer.addClass('ng5-slider-active');
        if (bindMove) {
            const ehMove: ((e: MouseEvent|TouchEvent) => void) =
                (e: MouseEvent|TouchEvent): void => this.dragging.active ? this.onDragMove(pointer, e) : this.onMove(pointer, e);

            if (this.onMoveUnsubscribe !== null) {
                this.onMoveUnsubscribe();
            }
            this.onMoveUnsubscribe = this.renderer.listen('document', moveEvent, ehMove);
        }

        if (bindEnd) {
            const ehEnd: ((e: MouseEvent|TouchEvent) => void) =
                (e: MouseEvent|TouchEvent): void => this.onEnd(e);
            if (this.onEndUnsubscribe !== null) {
                this.onEndUnsubscribe();
            }
            this.onEndUnsubscribe = this.renderer.listen('document', endEvent, ehEnd);
        }

        //this.userChangeStart.emit(this.getChangeContext());

        if (CompatibilityHelper.isTouchEvent(event) && (event as TouchEvent).changedTouches) {
            // Store the touch identifier
            if (!this.touchId) {
                this.isDragging = true;
                this.touchId = (event as TouchEvent).changedTouches[0].identifier;
            }
        }

        // Click events, either with mouse or touch gesture are weird. Sometimes they result in full
        // start, move, end sequence, and sometimes, they don't - they only invoke mousedown
        // As a workaround, we simulate the first move event and the end event if it's necessary
        if (simulateImmediateMove) {
            this.onMove(pointer, event, true);
        }

        if (simulateImmediateEnd) {
            this.onEnd(event);
        }
    }

    // onMove event handler
    private onMove(pointer: SliderElement, event: MouseEvent|TouchEvent, fromTick?: boolean): void {
        let touchForThisSlider: Touch;

        if (CompatibilityHelper.isTouchEvent(event)) {
            const changedTouches: TouchList = (event as TouchEvent).changedTouches;
            for (let i: number = 0; i < changedTouches.length; i++) {
                if (changedTouches[i].identifier === this.touchId) {
                    touchForThisSlider = changedTouches[i];
                    break;
                }
            }

            if (!touchForThisSlider) {
                return;
            }
        }

        const newPos: number = this.getEventPosition(
            event,
            touchForThisSlider ? touchForThisSlider.identifier : undefined
        );
        let newValue: number;
        const ceilValue: number = this.maxValue;
        const flrValue: number = this.minValue;

        if (newPos <= 0) {
            newValue = flrValue;
        } else if (newPos >= this.maxPos) {
            newValue = ceilValue;
        } else {
            console.log(this.maxPos);
            newValue = this.positionToValue(newPos);
            newValue = this.roundStep(newValue);
        }
        console.log(newValue);
        this.positionTrackingHandle(newValue);
    }

    // Set the new value and position to the current tracking handle
    private positionTrackingHandle(newValue: number): void {
        let valueChanged: boolean = false;
        if (this.range) {
            /* This is to check if we need to switch the min and max handles */
            if (this.tracking === HandleType.Low && newValue > this.viewHighValue) {
                this.viewLowValue = this.viewHighValue;
                this.applyLowValue();
                //this.applyModel(false);
                this.updateHandles(HandleType.Low, this.maxHElem.position);
                //this.updateAriaAttributes();
                this.tracking = HandleType.High;
                this.minHElem.removeClass('ng5-slider-active');
                this.maxHElem.addClass('ng5-slider-active');
                valueChanged = true;
            } else if (this.tracking === HandleType.High &&
                newValue < this.viewLowValue) {
                this.viewHighValue = this.viewLowValue;
                this.applyHighValue();
                //this.applyModel(false);
                this.updateHandles(HandleType.High, this.minHElem.position);
                //this.updateAriaAttributes();
                this.tracking = HandleType.Low;
                this.maxHElem.removeClass('ng5-slider-active');
                this.minHElem.addClass('ng5-slider-active');
                valueChanged = true;
            }
        }

        if (this.getCurrentTrackingValue() !== newValue) {
            if (this.tracking === HandleType.Low) {
                this.viewLowValue = newValue;
                this.applyLowValue();
            } else {
                this.viewHighValue = newValue;
                this.applyHighValue();
            }
            //this.applyModel(false);
            this.updateHandles(this.tracking, this.valueToPosition(newValue));
            //this.updateAriaAttributes();
            valueChanged = true;
        }

    }

    private getCurrentTrackingValue(): number {
        if (this.tracking === null) {
            return null;
        }

        return this.tracking === HandleType.Low ? this.viewLowValue : this.viewHighValue;
    }

    private onEnd(event: MouseEvent|TouchEvent): void {
        if (CompatibilityHelper.isTouchEvent(event)) {
            const changedTouches: TouchList = (event as TouchEvent).changedTouches;
            if (changedTouches[0].identifier !== this.touchId) {
                return;
            }
        }

        this.isDragging = false;
        this.touchId = null;

        this.dragging.active = false;

        if (this.onMoveUnsubscribe !== null) {
            this.onMoveUnsubscribe();
        }
        if (this.onEndUnsubscribe !== null) {
            this.onEndUnsubscribe();
        }

        //this.userChangeEnd.emit(this.getChangeContext());
    }
    /** Get min value depending on whether the newPos is outOfBounds above or below the bar and rightToLeft */
    private getMinValue(newPos: number, outOfBounds: boolean, isAbove: boolean): number {
        let value: number = null;

        if (outOfBounds) {
            if (isAbove) {
                value = this.maxValue - this.dragging.difference;
            } else {
                value = this.minValue;
            }
        } else {
            value = this.positionToValue(newPos - this.dragging.lowLimit);
        }
        return this.roundStep(value);
    }

    /** Get max value depending on whether the newPos is outOfBounds above or below the bar and rightToLeft */
    private getMaxValue(newPos: number, outOfBounds: boolean, isAbove: boolean): number {
        let value: number = null;

        if (outOfBounds) {
            if (isAbove) {
                value = this.maxValue;
            } else {
                value = this.minValue + this.dragging.difference;
            }
        } else {
            value =
                this.positionToValue(newPos - this.dragging.lowLimit) +
                this.dragging.difference;
        }

        return this.roundStep(value);
    }

    // Round value to step and precision based on minValue
    private roundStep(value: number, customStep?: number): number {
        const step: number = customStep ? customStep : this.step;
        let steppedDifference: number = MathHelper.roundToPrecisionLimit((value - this.minValue) / step, this.precisionLimit);
        steppedDifference = Math.round(steppedDifference) * step;
        return MathHelper.roundToPrecisionLimit(this.minValue + steppedDifference, this.precisionLimit);
    }

    private onDragMove(pointer: SliderElement, event?: MouseEvent|TouchEvent): void {
        console.log(pointer);
        const newPos: number = this.getEventPosition(event);

        let ceilLimit: number, flrLimit: number, flrHElem: SliderElement, ceilHElem: SliderElement;
        ceilLimit = this.dragging.highLimit;
        flrLimit = this.dragging.lowLimit;
        flrHElem = this.minHElem;
        ceilHElem = this.maxHElem;

        const isUnderFlrLimit: boolean = newPos <= flrLimit;
        const isOverCeilLimit: boolean = newPos >= this.maxPos - ceilLimit;

        let newMinValue: number;
        let newMaxValue: number;
        if (isUnderFlrLimit) {
            if (flrHElem.position === 0) {
                return;
            }
            newMinValue = this.getMinValue(newPos, true, false);
            newMaxValue = this.getMaxValue(newPos, true, false);
        } else if (isOverCeilLimit) {
            if (ceilHElem.position === this.maxPos) {
                return;
            }
            newMaxValue = this.getMaxValue(newPos, true, true);
            newMinValue = this.getMinValue(newPos, true, true);
        } else {
            newMinValue = this.getMinValue(newPos, false, false);
            newMaxValue = this.getMaxValue(newPos, false, false);
        }

        this.positionTrackingBar(newMinValue, newMaxValue);
    }

    // Set the new value and position for the entire bar
    private positionTrackingBar(newMinValue: number, newMaxValue: number): void {

        this.viewLowValue = newMinValue;
        this.viewHighValue = newMaxValue;
        this.applyLowValue();
        if (this.range) {
            this.applyHighValue();
        }
        //this.applyModel(true);
        this.updateHandles(HandleType.Low, this.valueToPosition(newMinValue));
        this.updateHandles(HandleType.High, this.valueToPosition(newMaxValue));
    }

    // Update slider handles and label positions
    private updateHandles(which: HandleType, newPos: number): void {
        if (which === HandleType.Low) {
            this.updateLowHandle(newPos);
        } else {
            this.updateHighHandle(newPos);
        }

        this.updateSelectionBar();
        if (this.range) {
            this.updateCmbLabel();
        }
    }

    private applyLowValue(): void {
        this.internalChange = true;
        this.value = this.viewLowValue;
        this.internalChange = false;
    }

    private applyHighValue(): void {
        console.log(this.highValue);
        this.internalChange = true;
        this.highValue = this.viewHighValue;
        this.internalChange = false;
    }
    // Get the handle closest to an event
    private getNearestHandle(event: MouseEvent|TouchEvent): SliderElement {
        if (!this.range) {
            return this.minHElem;
        }

        const position: number = this.getEventPosition(event);
        const distanceMin: number = Math.abs(position - this.minHElem.position);
        const distanceMax: number = Math.abs(position - this.maxHElem.position);

        if (distanceMin < distanceMax) {
            return this.minHElem;
        } else if (distanceMin > distanceMax) {
            return this.maxHElem;
        } else {
            // reverse in rtl
            return position > this.minHElem.position ? this.minHElem : this.maxHElem;
        }
    }

    // Compute the event position depending on whether the slider is horizontal or vertical
    private getEventPosition(event: MouseEvent|TouchEvent, targetTouchId?: number): number {
        const sliderElementBoundingRect: ClientRect = this.elementRef.nativeElement.getBoundingClientRect();

        const sliderPos: number = sliderElementBoundingRect.left;
        let eventPos: number = 0;
        eventPos = this.getEventXY(event, targetTouchId) - sliderPos;
        return eventPos - this.handleHalfDim;
    }

    // Get the X-coordinate or Y-coordinate of an event
    private getEventXY(event: MouseEvent|TouchEvent, targetTouchId: number): number {
        if (event instanceof MouseEvent) {
            return event.clientX;
        }

        let touchIndex: number = 0;
        const touches: TouchList = event.touches;
        if (targetTouchId !== undefined) {
            for (let i: number = 0; i < touches.length; i++) {
                if (touches[i].identifier === targetTouchId) {
                    touchIndex = i;
                    break;
                }
            }
        }
        // Return the target touch or if the target touch was not found in the event
        // returns the coordinates of the first touch
        return touches[touchIndex].clientX;
    }

    // Translate position to model value
    private positionToValue(position: number): number {
        let percent: number = position / this.maxPos;
        console.log(this.maxValue);
        let fn: PositionToValueFunction = ValueHelper.linearPositionToValue;
        return fn(percent, this.minValue, this.maxValue) || 0;
    }

    // Calculate dimensions that are dependent on view port size
    // Run once during initialization and every time view port changes size.
    private calcViewDimensions(): void {
        this.calculateElementDimension(this.minHElem);
        const handleWidth: number = this.minHElem.dimension;

        this.handleHalfDim = handleWidth / 2;

        this.calculateElementDimension(this.fullBarElem);
        this.barDimension = this.fullBarElem.dimension;

        this.maxPos = this.barDimension - handleWidth;

        if (this.initHasRun) {
            this.updateFloorLab();
            this.updateCeilLab();
            this.initHandles();
        }
    }

    // Calculate element's width/height depending on whether slider is horizontal or vertical
    private calculateElementDimension(elem: SliderElement): void {
        const val: ClientRect = elem.getBoundingClientRect();
        elem.dimension = (val.right - val.left);
    }

    // Update position of the floor label
    private updateFloorLab(): void {
        if (!this.flrLabElem.alwaysHide) {
            this.setLabelValue(this.getDisplayValue(this.minValue, LabelType.Floor), this.flrLabElem);
            this.calculateElementDimension(this.flrLabElem);
            const position: number = 0;
            this.setPosition(this.flrLabElem, position);
        }
    }

    // Update position of the ceiling label
    private updateCeilLab(): void {
        if (!this.ceilLabElem.alwaysHide) {
            this.setLabelValue(this.getDisplayValue(this.maxValue, LabelType.Ceil), this.ceilLabElem);
            this.calculateElementDimension(this.ceilLabElem);
            const position: number = this.barDimension - this.ceilLabElem.dimension;
            this.setPosition(this.ceilLabElem, position);
        }
    }

    // Set label value and recalculate label dimensions
    private setLabelValue(value: string, label: SliderElement): void {
        let recalculateDimension: boolean = false;
        const noLabelInjection: boolean = label.hasClass('no-label-injection');

        if (!label.alwaysHide &&
            (label.value === undefined ||
                label.value.length !== value.length ||
                (label.value.length > 0 && label.dimension === 0))) {
            recalculateDimension = true;
            label.value = value;
        }

        if (!noLabelInjection) {
            label.html(value);
        }

        // Update width only when length of the label have changed
        if (recalculateDimension) {
            this.calculateElementDimension(label);
        }
    }

    // Return the translated value if a translate function is provided else the original value
    private getDisplayValue(value: number, which: LabelType): string {
        return this.translate(value, which);
    }

    // Set element left/top position depending on whether slider is horizontal or vertical
    private setPosition(elem: SliderElement, pos: number): void {
        elem.position = pos;
        elem.css('left', Math.round(pos) + 'px');
    }

    // Initialize slider handles positions and labels
    // Run only once during initialization and every time view port changes size
    private initHandles(): void {
        this.updateLowHandle(this.valueToPosition(this.viewLowValue));

        /*
       the order here is important since the selection bar should be
       updated after the high handle but before the combined label
       */
        if (this.range) {
            this.updateHighHandle(this.valueToPosition(this.viewHighValue));
        }

        this.updateSelectionBar();

        if (this.range) {
            this.updateCmbLabel();
        }
    }

    // Update combined label position and value
    private updateCmbLabel(): void {
        let isLabelOverlap: boolean = null;
        isLabelOverlap = this.minLabElem.position + this.minLabElem.dimension + 10 >= this.maxLabElem.position;

        if (isLabelOverlap) {
            const lowTr: string = this.getDisplayValue(this.viewLowValue, LabelType.Low);
            const highTr: string = this.getDisplayValue(this.viewHighValue, LabelType.High);
            const labelVal: string = this.combineLabels(lowTr, highTr);

            this.setLabelValue(labelVal, this.cmbLabElem);
            const pos: number = this.selBarElem.position + this.selBarElem.dimension / 2 - this.cmbLabElem.dimension / 2;

            this.setPosition(this.cmbLabElem, pos);
            this.cmbLabelShown = true;
            this.hideEl(this.minLabElem);
            this.hideEl(this.maxLabElem);
            this.showEl(this.cmbLabElem);
        } else {
            this.cmbLabelShown = false;
            this.updateHighHandle(this.valueToPosition(this.viewHighValue));
            this.updateLowHandle(this.valueToPosition(this.viewLowValue));
            this.showEl(this.maxLabElem);
            this.showEl(this.minLabElem);
            this.hideEl(this.cmbLabElem);
        }

    }

    // Update slider selection bar, combined label and range label
    private updateSelectionBar(): void {
        let position: number = 0;
        let dimension: number = 0;
        const isSelectionBarFromRight: boolean = false;
        const positionForRange: number = this.minHElem.position + this.handleHalfDim;

        if (this.range) {
            dimension = Math.abs(this.maxHElem.position - this.minHElem.position);
            position = positionForRange;
        }
        this.setDimension(this.selBarElem, dimension);
        this.setPosition(this.selBarElem, position);

    }

    // Helper function to work out the position for handle labels depending on RTL or not
    private getHandleLabelPos(labelType: HandleLabelType, newPos: number): number {
        const labelDimension: number = labelType === HandleLabelType.Min ? this.minLabElem.dimension : this.maxLabElem.dimension;
        const nearHandlePos: number = newPos - labelDimension / 2 + this.handleHalfDim;
        const endOfBarPos: number = this.barDimension - labelDimension;

        return Math.min(Math.max(nearHandlePos, 0), endOfBarPos);
    }


    // Translate value to pixel position
    private valueToPosition(val: number): number {
        let fn: ValueToPositionFunction  = ValueHelper.linearValueToPosition;

        val = this.sanitizeValue(val);
        let percent: number = fn(val, this.minValue, this.maxValue) || 0;

        return percent * this.maxPos;
    }

    // Returns a value that is within slider range
    private sanitizeValue(val: number): number {
        return Math.min(Math.max(val, this.minValue), this.maxValue);
    }
    // Update low slider handle position and label
    private updateLowHandle(newPos: number): void {
        this.setPosition(this.minHElem, newPos);
        //this.setLabelValue(this.getDisplayValue(this.viewLowValue, LabelType.Low), this.minLabElem);
        this.setPosition(
            this.minLabElem,
            this.getHandleLabelPos(HandleLabelType.Min, newPos)
        );
    }

    // Update high slider handle position and label
    private updateHighHandle(newPos: number): void {
        this.setPosition(this.maxHElem, newPos);
        this.setLabelValue(this.getDisplayValue(this.viewHighValue, LabelType.High), this.maxLabElem);
        this.setPosition(
            this.maxLabElem,
            this.getHandleLabelPos(HandleLabelType.Max, newPos)
        );
    }

    // Show/hide floor/ceiling label
    private shFloorCeil(): void {
        let flHidden: boolean = false;
        let clHidden: boolean = false;
        const isMinLabAtFloor: boolean = this.isLabelBelowFloorLab(this.minLabElem);
        const isMinLabAtCeil: boolean = this.isLabelAboveCeilLab(this.minLabElem);
        const isMaxLabAtCeil: boolean = this.isLabelAboveCeilLab(this.maxLabElem);
        const isCmbLabAtFloor: boolean = this.isLabelBelowFloorLab(this.cmbLabElem);
        const isCmbLabAtCeil: boolean = this.isLabelAboveCeilLab(this.cmbLabElem);

        if (isMinLabAtFloor) {
            flHidden = true;
            this.hideEl(this.flrLabElem);
        } else {
            flHidden = false;
            this.showEl(this.flrLabElem);
        }

        if (isMinLabAtCeil) {
            clHidden = true;
            this.hideEl(this.ceilLabElem);
        } else {
            clHidden = false;
            this.showEl(this.ceilLabElem);
        }

        if (this.range) {
            const hideCeil: boolean = this.cmbLabelShown ? isCmbLabAtCeil : isMaxLabAtCeil;
            const hideFloor: boolean = this.cmbLabelShown
                ? isCmbLabAtFloor
                : isMinLabAtFloor;

            if (hideCeil) {
                this.hideEl(this.ceilLabElem);
            } else if (!clHidden) {
                this.showEl(this.ceilLabElem);
            }

            // Hide or show floor label
            if (hideFloor) {
                this.hideEl(this.flrLabElem);
            } else if (!flHidden) {
                this.showEl(this.flrLabElem);
            }
        }
    }

    private setDimension(elem: SliderElement, dim: number): number {
        elem.dimension = dim;
        elem.css('width', Math.round(dim) + 'px');
        return dim;
    }

    private isLabelBelowFloorLab(label: SliderElement): boolean {
        const pos: number = label.position;
        const floorPos: number = this.flrLabElem.position;
        const floorDim: number = this.flrLabElem.dimension;
        return pos <= floorPos + floorDim + 2;
    }

    private isLabelAboveCeilLab(label: SliderElement): boolean {
        const pos: number = label.position;
        const dim: number = label.dimension;
        const ceilPos: number = this.ceilLabElem.position;
        return pos + dim >= ceilPos - 2;
    }

    // Hide element
    private hideEl(element: SliderElement): void {
        element.css('visibility', 'hidden');
    }

    // Show element
    private showEl(element: SliderElement): void {
        if (!!element.alwaysHide) {
            return;
        }

        element.css('visibility', 'visible');
    }

    addDays (i: number): Date {
        return addDays(this.timelineService.startFrom, i);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.width) {
            this.fitDays = Math.floor(changes.width.currentValue / this.timelineService.dayWidth);
        }
    }
}
