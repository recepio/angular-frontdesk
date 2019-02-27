export interface CustomStepDefinition {
    /** Value */
    value: number;
    /** Legend (label for the value) */
    legend?: string;
}

export class ValueHelper {
    static linearValueToPosition(val: number, minVal: number, maxVal: number): number {
        const range: number = maxVal - minVal;
        return (val - minVal) / range;
    }

    static linearPositionToValue(percent: number, minVal: number, maxVal: number): number {
        return percent * (maxVal - minVal) + minVal;
    }

    static findStepIndex(modelValue: number, stepsArray: CustomStepDefinition[]): number {
        const differences: number[] = stepsArray.map((step: CustomStepDefinition): number => Math.abs(modelValue - step.value));

        let minDifferenceIndex: number = 0;
        for (let index: number = 0; index < stepsArray.length; index++) {
            if (differences[index] !== differences[minDifferenceIndex] && differences[index] < differences[minDifferenceIndex]) {
                minDifferenceIndex = index;
            }
        }

        return minDifferenceIndex;
    }
}
