import {TeamValueI, TeamValueObject} from "../interfaces";
import {TeamValue} from '../classes';
import * as fs from 'fs';
import * as path from 'path';

export const filePath: string = path.resolve(__dirname, '../../data/input.csv').toString();
export const dirFilePath: string = __dirname;

export class Utils {

    public static TeamResultGroupingPattern: RegExp = /^([a-zA-Z\s]+)([0-9]+$)/;

    private static StandardInput: NodeJS.ReadStream = process.stdin;

    public static booleanFromString(s: string): boolean {
        const lowerCaseS = s.toLowerCase();

        switch (lowerCaseS) {
            case "y":
            case "yes":
                return true;
            case "n":
            case "no":
                return false;
            default:
                return null;
        }
    }

    public static setTeamRanks(sortedTeamValues: TeamValueI[]): void {
        let index: number = 1;
        let rank: number = 0;
        let previousTeamPoints: number = null;

        for (const team of sortedTeamValues) {

            const points = team.getValue();

            if (points !== previousTeamPoints) {
                rank++;
            }

            team.setRank(rank);

            if (points === previousTeamPoints) {
                rank = index;
            }

            previousTeamPoints = points;
            index++;
        }
    }

    public static getOrderedMatchPointsFromFile(file: string): TeamValueI[] {
        let teamMatchPoints: TeamValueI[] = [];
        let finalTeamMatchPoints: TeamValueI[] = [];

        const lines: string[] = fs.readFileSync(filePath).toString().split('\n');

        for (const line of lines) {

            const scores: TeamValueI[] = [];
            const matchResults: string[] = line.split(', ');

            for (const result of matchResults) {
                const teamResult: TeamValueI = this.getTeamResultFromString(result, Utils.TeamResultGroupingPattern);

                if (teamResult) {
                    scores.push(teamResult);
                }
            }

            const matchPoints = this.calculateMatchPoints(scores);
            teamMatchPoints = teamMatchPoints.concat(matchPoints);
        }

        finalTeamMatchPoints = Utils.reduceTeamMatchPoints(teamMatchPoints);

        finalTeamMatchPoints.sort((a, b): number => {

            const aName: string = a.getName();
            const bName: string = b.getName();

            const aPoints: number = a.getValue();
            const bPoints: number = b.getValue();

            if (aPoints === bPoints) {
                return (aName < bName) ? -1 : (aName > bName) ? 1 : 0;
            } else {
                return (aPoints > bPoints) ? -1 : 1;
            }
        });

        Utils.setTeamRanks(finalTeamMatchPoints);

        return finalTeamMatchPoints;

    }

    public static reduceTeamMatchPoints(allTeamMatchPoints: TeamValueI[]): TeamValueI[] {
        const finalTeamPoints = new Map();

        for (const matchPoints of allTeamMatchPoints) {

            const name: string = matchPoints.getName();
            const points: number = matchPoints.getValue();

            if (!finalTeamPoints.has(name)) {
                finalTeamPoints.set(name, points);
            } else {
                const nextPointsTotal: number = finalTeamPoints.get(name) + points;

                finalTeamPoints.set(name, nextPointsTotal);
            }
        }

        return Utils.convertTeamValueMapToList(finalTeamPoints);
    }

    public static convertTeamValueMapToList(teamValuesMap): TeamValueI[] {
        const list: TeamValueI[] = [];

        teamValuesMap.forEach((value, key) => {

            const team: TeamValueObject = {
                name: key,
                value: value
            };

            list.push(new TeamValue(team));
        });

        return list;
    }

    public static calculateMatchPoints(matchResults: TeamValueI[]): TeamValueI[] {

        const matchPoints: TeamValueI[] = [];

        const teamA: TeamValueI = matchResults[0];
        const teamB: TeamValueI = matchResults[1];

        const teamAName: string = teamA.getName();
        const teamAGoals: number = teamA.getValue();

        const initialTeamAValues: TeamValueObject = {
            name: teamAName,
            value: 0
        };

        const teamAPoints: TeamValueI = new TeamValue(initialTeamAValues);


        const teamBName: string = teamB.getName();
        const teamBGoals: number = teamB.getValue();

        const initialTeamBValues: TeamValueObject = {
            name: teamBName,
            value: 0
        };

        const teamBPoints: TeamValueI = new TeamValue(initialTeamBValues);

        if (teamAGoals === teamBGoals) {

            teamAPoints.setValue(1);
            teamBPoints.setValue(1);

        } else if (teamAGoals > teamBGoals) {
            teamAPoints.setValue(3);
        } else {
            teamBPoints.setValue(3);
        }

        matchPoints.push(teamAPoints);
        matchPoints.push(teamBPoints);

        return matchPoints;
    }

    public static getTeamResultFromString(result: string, regex: RegExp): TeamValueI {
        let matches = result.match(regex);

        if (matches) {

            const team: string = matches[1];

            // Remove the last space from the team name
            const name: string = team.slice(0, -1);

            const value: number = Number(matches[2]);

            const teamValues: TeamValueObject = {
                name: name,
                value: value
            };

            return new TeamValue(teamValues);

        }

        return null;
    }

    public static delayedPrint(text: string, timeOut: number): void {
        setTimeout(() => {
            console.log(text);
        }, timeOut)
    }

    public static input(message: string, userContinueQuestionAsked?: boolean): Promise<string | boolean> {
        this.StandardInput.setEncoding('utf-8');
        console.log(message);

        const userInput: Promise<string | boolean> = new Promise((res, rej) => {

            return this.StandardInput.on('data', (data) => {

                if (!userContinueQuestionAsked) {

                    res(data);

                } else {
                    // Remove next line from string
                    const answer: string = data.split('\n')[0];
                    const userWantsToContinue = Utils.booleanFromString(answer);

                    if (userWantsToContinue === null) {
                        res(null);
                    } else {
                        res(userWantsToContinue);
                    }
                }
            });
        });

        return userInput;
    }

}