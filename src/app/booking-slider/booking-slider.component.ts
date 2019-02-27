import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Directive,
    ElementRef, EventEmitter, Input,
    OnChanges, OnDestroy,
    OnInit, Output,
    Renderer2,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {addDays, eachDay, isFirstDayOfMonth} from 'date-fns';
import {TimelineService} from '../timeline.service';
import {JqLiteWrapper} from './jq-wrapper';
import {CustomStepDefinition, ValueHelper} from './value-helper';
import {CompatibilityHelper} from './compatibility';
import { ThrottledFuncService } from './throttled-func.service';

import detectPassiveEvents from 'detect-passive-events';
import {MathHelper} from './math-helper';
import {LabelType} from './test';
import {ControlValueAccessor} from '@angular/forms';

export class ChangeContext {
    value: number;
    highValue: number;
}
enum HandleType {
    Low,
    High
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

export enum PointerType {
    /** Low pointer */
    Min,
    /** High pointer */
    Max
}

export class SliderElement extends JqLiteWrapper {
    position: number = 0;
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

export class BookingSliderComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy, ControlValueAccessor {

    width: number = 800;
    height: number = 150;
    paddingLeft: number = 5;

    // Output for low value slider to support two-way bindings
    @Output() valueChange: EventEmitter<number> = new EventEmitter();
    // Output for high value slider to support two-way bindings
    @Output() highValueChange: EventEmitter<number> = new EventEmitter();

    // Event emitted when user starts interaction with the slider
    @Output() userChangeStart: EventEmitter<ChangeContext> = new EventEmitter();

    // Event emitted on each change coming from user interaction
    @Output() userChange: EventEmitter<ChangeContext> = new EventEmitter();

    // Event emitted when user finishes interaction with the slider
    @Output() userChangeEnd: EventEmitter<ChangeContext> = new EventEmitter();

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
    private onTouchedCallback: (value: any) => void = null;
    private onChangeCallback: (value: any) => void = null;


    // Precision limit
    private precisionLimit: number = 12;

    // Step
    private step: number = 1;
    // Internal flag to prevent watchers to be called when the sliders value are modified internally.
    private internalChange: boolean = false;
    // The name of the handle we are currently tracking
    private tracking: HandleType = null;
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
    private stepsArray: CustomStepDefinition[];

    // Left slider handle
    @ViewChild(MinHDirective)
    private minHElem: SliderElement;

    // The whole slider bar
    @ViewChild(FullBarDirective)
    private fullBarElem: SliderElement;
    // Right slider handle
    @ViewChild(MaxHDirective)
    private maxHElem: SliderElement;

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
        this.stepsArray = eachDay(this.timelineService.startFrom, addDays(this.timelineService.startFrom,31)).map((date: Date) => {
            return { value: date.getTime() };
        });
    }

    ngAfterViewInit(): void {
        this.syncLowValue();

        this.syncHighValue();
        this.setMinAndMax()
        this.calcViewDimensions();
        this.initHandles();
        this.bindEvents();
    }

    ngOnDestroy(): void {
        this.unbindEvents();
    }

    ngOnChanges(changes: SimpleChanges): void {

        // Then value changes
        if (changes.value) {
            this.onChangeValue(changes.value.previousValue, changes.value.currentValue);
        }

        if (changes.highValue) {
            this.onChangeHighValue(changes.highValue.previousValue, changes.highValue.currentValue);
        }
    }

    onChangeValue(oldValue: number, newValue: number): void {
        if (!this.initHasRun || this.internalChange || newValue === oldValue) {
            return;
        }

        this.thrOnLowHandleChange.call();
    }

    onChangeHighValue(oldValue: number, newValue: number): void {
        if (!this.initHasRun || this.internalChange || newValue === oldValue) {
            return;
        }
        if (newValue != null) {
            this.thrOnHighHandleChange.call();
        }
        if ( (this.range && newValue == null) ||
            (!this.range && newValue != null) ) {
            this.resetSlider();
        }
    }

    // Resets slider
    private resetSlider(): void {
        this.setMinAndMax();
        this.unbindEvents();
        this.bindEvents();
        this.calcViewDimensions();
    }

    // ControlValueAccessor interface
    writeValue(obj: any): void {
        if (obj instanceof Array) {

            const oldLowValue: number = this.value;
            const oldHighValue: number = this.highValue;

            this.value = obj[0];
            this.highValue = obj[1];

            this.onChangeValue(oldLowValue, obj[0]);
            this.onChangeHighValue(oldHighValue, obj[1]);

        } else {
            const oldVal: number = this.value;
            const newVal: any = obj;
            if (oldVal) {
                this.value = obj;
                this.onChangeValue(oldVal, newVal);
            } else {
                this.value = obj;
            }
        }
    }

    registerOnChange(onChangeCallback: any): void {
        this.onChangeCallback = onChangeCallback;
    }

    registerOnTouched(onTouchedCallback: any): void {
        this.onTouchedCallback = onTouchedCallback;
    }

    private syncLowValue(): void {
        this.viewLowValue = ValueHelper.findStepIndex(this.value, this.stepsArray);
    }

    private syncHighValue(): void {
       this.viewHighValue = ValueHelper.findStepIndex(this.highValue, this.stepsArray);
    }

    // Set maximum and minimum values for the slider and ensure the model and high value match these limits
    private setMinAndMax(): void {

        this.minValue = 0;
        this.maxValue = 31;

        this.viewLowValue = this.roundStep(this.viewLowValue);
        this.viewHighValue = this.roundStep(this.viewHighValue);
        this.applyLowValue();
        if (this.range) {
            this.applyHighValue();
        }
    }

    // Unbind mouse and touch events to slider handles
    private unbindEvents(): void {
        this.minHElem.off();
        this.maxHElem.off();
        this.fullBarElem.off();
        this.selBarElem.off();
    }
    // Bind mouse and touch events to slider handles
    private bindEvents(): void {

        this.selBarElem.on('mousedown', (event: MouseEvent): void => this.onBarStart(true, null, event, true, true, true));
        this.minHElem.on('mousedown', (event: MouseEvent): void => this.onStart(this.minHElem, HandleType.Low, event, true, true));
        this.maxHElem.on('mousedown', (event: MouseEvent): void => this.onStart(this.maxHElem, HandleType.High, event, true, true));
        this.fullBarElem.on('mousedown', (event: MouseEvent): void => { this.onStart(null, null, event, true, true, true); });

        //bind touch events
        this.selBarElem.onPassive('touchstart', (event: TouchEvent): void => this.onBarStart(true, null, event, true, true));
        this.minHElem.onPassive('touchstart', (event: TouchEvent): void => this.onStart(this.minHElem, HandleType.Low, event, true, true));
        this.maxHElem.onPassive('touchstart', (event: TouchEvent): void => this.onStart(this.maxHElem, HandleType.High, event, true, true));
        this.fullBarElem.onPassive('touchstart', (event: TouchEvent): void => this.onStart(null, null, event, true, true, true));
    }

    private onBarStart(draggableRange: boolean, pointer: SliderElement, event: MouseEvent|TouchEvent,
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

        this.focusElement(pointer);

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

        this.userChangeStart.emit(this.getChangeContext());
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

    private onEnd(event: MouseEvent|TouchEvent): void {
        if (CompatibilityHelper.isTouchEvent(event)) {
            const changedTouches: TouchList = (event as TouchEvent).changedTouches;
            if (changedTouches[0].identifier !== this.touchId) {
                return;
            }
        }

        this.isDragging = false;
        this.touchId = null;

        this.minHElem.removeClass('ng5-slider-active');
        this.maxHElem.removeClass('ng5-slider-active');
        this.tracking = null;
        this.dragging.active = false;

        if (this.onMoveUnsubscribe !== null) {
            this.onMoveUnsubscribe();
        }
        if (this.onEndUnsubscribe !== null) {
            this.onEndUnsubscribe();
        }
        this.userChangeEnd.emit(this.getChangeContext());
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
            newValue = this.positionToValue(newPos);
            newValue = this.roundStep(newValue);
        }
        this.positionTrackingHandle(newValue);
    }

    private applyMinMaxRange(newValue: number): number {
        const oppositeValue: number = this.tracking === HandleType.Low ? this.viewHighValue : this.viewLowValue;
        const difference: number = Math.abs(newValue - oppositeValue);
        return newValue;
    }

    // Set the new value and position to the current tracking handle
    private positionTrackingHandle(newValue: number): void {
        let valueChanged: boolean = false;
        if (this.tracking === HandleType.Low && newValue > this.viewHighValue) {
            newValue = this.applyMinMaxRange(this.viewHighValue);
        } else if (this.tracking === HandleType.High &&
            newValue < this.viewLowValue) {
            newValue = this.applyMinMaxRange(this.viewLowValue);
        }
        newValue = this.applyMinMaxRange(newValue);
                if (this.tracking === HandleType.Low && newValue > this.viewHighValue) {
                    newValue = this.viewHighValue;
                } else if (this.tracking === HandleType.High &&
                    newValue < this.viewLowValue) {
                    newValue = this.viewLowValue;
                }
                /* This is to check if we need to switch the min and max handles */
                if (this.tracking === HandleType.Low && newValue > this.viewHighValue) {
                    this.viewLowValue = this.viewHighValue;
                    this.applyLowValue();
                    this.applyModel(false);
                    this.updateHandles(HandleType.Low, this.maxHElem.position);
                    this.tracking = HandleType.High;
                    this.minHElem.removeClass('ng5-slider-active');
                    this.maxHElem.addClass('ng5-slider-active');
                    this.focusElement(this.maxHElem);
                    valueChanged = true;
                } else if (this.tracking === HandleType.High &&
                    newValue < this.viewLowValue) {
                    this.viewHighValue = this.viewLowValue;
                    this.applyHighValue();
                    this.applyModel(false);
                    this.updateHandles(HandleType.High, this.minHElem.position);
                    this.tracking = HandleType.Low;
                    this.maxHElem.removeClass('ng5-slider-active');
                    this.minHElem.addClass('ng5-slider-active');
                    this.focusElement(this.minHElem);
                    valueChanged = true;
                }
        if (this.getCurrentTrackingValue() !== newValue) {
            if (this.tracking === HandleType.Low) {
                this.viewLowValue = newValue;
                this.applyLowValue();
            } else {
                this.viewHighValue = newValue;
                this.applyHighValue();
            }
            this.applyModel(false);
            this.updateHandles(this.tracking, this.valueToPosition(newValue));
            valueChanged = true;
        }
        if (valueChanged) {
            this.applyModel(true);
        }
    }

    private getCurrentTrackingValue(): number {
        if (this.tracking === null) {
            return null;
        }

        return this.tracking === HandleType.Low ? this.viewLowValue : this.viewHighValue;
    }
    private onDragMove(pointer: SliderElement, event?: MouseEvent|TouchEvent): void {
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
        newMinValue = this.getMinValue(newPos, false, false);
        newMaxValue = this.getMaxValue(newPos, false, false);

        this.positionTrackingBar(newMinValue, newMaxValue);
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
           value =  this.positionToValue(newPos - this.dragging.lowLimit) +
                    this.dragging.difference;
        }

        return this.roundStep(value);
    }
    // Set the new value and position for the entire bar
    private positionTrackingBar(newMinValue: number, newMaxValue: number): void {
        this.viewLowValue = newMinValue;
        this.viewHighValue = newMaxValue;
        this.applyLowValue();
        if (this.range) {
            this.applyHighValue();
        }
        this.applyModel(true);
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
    }

    private getStepValue(sliderValue: number): number {
        const step: CustomStepDefinition = this.stepsArray[sliderValue];
        return step.value;
    }

    private applyLowValue(): void {
        this.internalChange = true;
        this.value = this.getStepValue(this.viewLowValue);
        this.internalChange = false;
    }

    private applyHighValue(): void {
        this.internalChange = true;

        this.highValue = this.getStepValue(this.viewHighValue);
        this.internalChange = false;
    }
    // Wrapper function to focus an angular element
    private focusElement(el: SliderElement): void {
        el.focus();
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
            this.initHandles();
        }
    }

    // Initialize slider handles positions and labels
    // Run only once during initialization and every time view port changes size
    private initHandles(): void {
        this.updateLowHandle(this.valueToPosition(this.viewLowValue));

        /*
       the order here is important since the selection bar should be
       updated after the high handle but before the combined label
       */
       this.updateHighHandle(this.valueToPosition(this.viewHighValue));
       this.updateSelectionBar();
    }

    // Update low slider handle position and label
    private updateLowHandle(newPos: number): void {
        this.setPosition(this.minHElem, newPos);
    }

    // Update high slider handle position and label
    private updateHighHandle(newPos: number): void {
        this.setPosition(this.maxHElem, newPos);
    }

    // Update slider selection bar, combined label and range label
    private updateSelectionBar(): void {
        let position, dimension: number = 0;
        const isSelectionBarFromRight: boolean = false;
        const positionForRange: number = this.minHElem.position + this.handleHalfDim;

        dimension = Math.abs(this.maxHElem.position - this.minHElem.position);
        position = positionForRange;

        this.setDimension(this.selBarElem, dimension);
        this.setPosition(this.selBarElem, position);
    }

    // Set element width/height depending on whether slider is horizontal or vertical
    private setDimension(elem: SliderElement, dim: number): number {
        elem.dimension = dim;
        elem.css('width', Math.round(dim) + 'px');

        return dim;
    }
    // Set element left/top position depending on whether slider is horizontal or vertical
    private setPosition(elem: SliderElement, pos: number): void {
        elem.position = pos;
        elem.css('left', Math.round(pos) + 'px');
        elem.css('x', Math.round(pos) + 'px');
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
    // Calculate element's width/height depending on whether slider is horizontal or vertical
    private calculateElementDimension(elem: SliderElement): void {
        const val: ClientRect = elem.getBoundingClientRect();
        elem.dimension = (val.right - val.left);
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
        let fn: PositionToValueFunction = ValueHelper.linearPositionToValue;
        return fn(percent, this.minValue, this.maxValue) || 0;
    }

    // Round value to step and precision based on minValue
    private roundStep(value: number, customStep?: number): number {
        const step: number = customStep ? customStep : this.step;
        let steppedDifference: number = MathHelper.roundToPrecisionLimit((value - this.minValue) / step, this.precisionLimit);
        steppedDifference = Math.round(steppedDifference) * step;
        return MathHelper.roundToPrecisionLimit(this.minValue + steppedDifference, this.precisionLimit);
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

    private applyModel(callUserChange: boolean): void {
        this.internalChange = true;
        this.valueChange.emit(this.value);
        this.highValueChange.emit(this.highValue);
        if (callUserChange) {
            this.userChange.emit(this.getChangeContext());
        }

        if (this.onChangeCallback) {
            if (this.range) {
                this.onChangeCallback([this.value, this.highValue]);
            } else {
                this.onChangeCallback(this.value);
            }
        }
        if (this.onTouchedCallback) {
            if (this.range) {
                this.onTouchedCallback([this.value, this.highValue]);
            } else {
                this.onTouchedCallback(this.value);
            }
        }

        this.internalChange = false;
    }

    private getChangeContext(): ChangeContext {
        const changeContext: ChangeContext = new ChangeContext();
        changeContext.value = this.value;
        changeContext.highValue = this.highValue;
        return changeContext;
    }

    addDays (i: number): Date {
        return addDays(this.timelineService.startFrom, i);
    }
}
