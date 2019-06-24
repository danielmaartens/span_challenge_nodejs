import {TeamValueI, TeamValueObject} from '../interfaces';

export class TeamValue implements TeamValueI {
    private name: string;
    private value: number;
    private rank: number;

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
