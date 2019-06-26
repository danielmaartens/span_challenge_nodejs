import {TeamValueI, TeamValueObject} from '../interfaces';

export class TeamValue implements TeamValueI {
    private name: string;
    private value: number;
    private rank: number;

    /**
     * This constructor expects a TeamValueObject.
     *
     * This is just done for preference as I think it looks neater
     * and you can make sure that you pass through the correct variables.
     *
     * It is probably unnecessary since there are only two values that require setting initially.
     *
     * However I thought it shows an alternative/cleaner way of initialising objects
     * that may have many more initialising parameters.
     *
     * @param values
     */

    constructor(values: TeamValueObject) {
        this.name = values.name;
        this.value = values.value;
        this.rank = values.rank;
    }

    public setName(name: string) {
        this.name = name;
    }

    public getName() {
        return this.name;
    }

    public setValue(value: number) {
        this.value = value;
    }

    public getValue() {
        return this.value;
    }

    public setRank(rank: number) {
        this.rank = rank;
    }

    public getRank() {
        return this.rank;
    }


}
