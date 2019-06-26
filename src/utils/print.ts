/**
 * This Print class serves as a DRY way
 * of delaying output to the console.
 *
 * In the beginning we want to simulate the console talking to you
 * and giving you enough time to read the messages.
 *
 * This class serves to make the process of accomplishing that
 * in a more flowing and succinct manner when a situation arises
 * where you may have multiple outputs to the console in sequence
 * which you do not want to display all at once.
 *
 * The class is instantiated with an initialDelay.
 * Once the print.delayed() function is invoked the initialDelay will be added to the current runningDelay.
 *
 * Every time the print.delayed() is invoked it uses the runningDelay property to figure out how long it should sleep for.
 *
 * So every subsequent call to the function will always result in an even delay between subsequent outputs.
 */

export class Print {
    private readonly initialDelay: number;
    private runningDelay: number;

    constructor(initialDelay: number) {
        this.initialDelay = initialDelay;
        this.runningDelay = initialDelay;
    }

    public delay(text: string): void {
        setTimeout(() => {

            console.log(text);

        }, this.runningDelay);

        // runningDelay is incremented by initialDelay value
        // so that next delayed print can occur timeously after this one by an initialDelay.
        this.runningDelay += this.initialDelay;
    }

    public getCurrentDelay(n: number = 0) {
        return this.runningDelay + n;
    }
}