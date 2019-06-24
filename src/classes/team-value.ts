import {TeamValueI} from '../interfaces';

class TeamValue implements TeamValueI {
    private name: string;
    private value: number;
    private rank: number;

    public TeamValue(name: string, value: number) {
        this.name = name;
        this.value = value;
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
