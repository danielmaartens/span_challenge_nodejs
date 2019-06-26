import {TeamValueI, TeamValueObject} from "../interfaces";
import {TeamValue} from '../classes';
import * as fs from 'fs';
import * as path from "path";

export class Utils {

    public static TEAM_RESULT_GROUPING_PATTERN: RegExp = /^([a-zA-Z\s]+)([0-9]+$)/;
    public static TEST_FILE = path.resolve(__dirname, '../../data/input.csv').toString();

    private static StandardInput: NodeJS.ReadStream = process.stdin;

    /**
     * Converts expected user input for yes/no/continue questions into a boolean value.
     * @param s
     */
    public static booleanFromString(s: string): boolean {
        const lowerCaseS = s.toLowerCase();

        switch (lowerCaseS) {
            case "y":
            case "yes":
            case "c":
                return true;
            case "n":
            case "no":
                return false;
            default:
                return null;
        }
    }

    /**
     * Sets the rank value for all teams.
     * Note: the array must be sorted.
     *
     * @param sortedTeamValues
     */
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

    /**
     * Converts an array of TeamValues to a map with the team name as key with the corresponding value in TeamValue object.
     * This is so that the tests who know the team name can easily access the value property.
     *
     * @param teamValues
     */
    public static convertTeamValueListToMap(teamValues: TeamValueI[]): Map<string, number> {
        const map: Map<string, number> = new Map<string, number>();

        for (const team of teamValues) {
            map.set(team.getName(), team.getValue());
        }

        return map;
    }

    /**
     * This is the most important function.
     * It serves as the parent for most of the other functions within this module.
     * It is responsible for reading through the file contents line by line and
     * processing the final ranks of teams in the league based on all the matches played.
     *
     * @param file
     */
    public static getLeagueResults(file: string): TeamValueI[] {
        let teamMatchPoints: TeamValueI[] = [];
        let finalTeamMatchPoints: TeamValueI[] = [];

        // read file contents
        const lines: string[] = fs.readFileSync(Utils.TEST_FILE).toString().split('\n');

        // go through each line of the file
        for (const line of lines) {

            const scores: TeamValueI[] = [];

            // Each line represents the outcome of a match.
            // Each team's own outcome of the match is separated by a ", "
            // which is why we first split the line by ", " to get a matchResults vector
            // of two strings representing the outcome of each team for the match.
            const matchResults: string[] = line.split(', ');

            // Now we loop through the matchResults
            for (const result of matchResults) {

                // We parse the string into a TeamValue object for easy processing later.
                const teamResult: TeamValueI = this.getTeamResultFromString(result, Utils.TEAM_RESULT_GROUPING_PATTERN);

                // We add this result to an array representing the scores for each team of this match.
                if (teamResult) {
                    scores.push(teamResult);
                }
            }

            // Now that we have an array of TeamValue objects for the match representing each team,
            // we can calculate the match points.
            const matchPoints = this.calculateMatchPoints(scores);

            // Here we concatenate the new matchPoints array with all previous added matchPoints.
            // The purpose of this is to have an array of TeamValue objects each representing
            // the points the team gained in a match.
            teamMatchPoints = teamMatchPoints.concat(matchPoints);
        }

        // Now we reduce this array of all our teams' matchPoints
        // into an array containing a single entry for each team
        // with the value representing the sum of all their match points gained.
        finalTeamMatchPoints = Utils.reduceTeamMatchPoints(teamMatchPoints);

        // Sort finalTeamMatchPoints by points DESC, and then by name ASC.
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

        // Set the team ranks on the sorted data.
        Utils.setTeamRanks(finalTeamMatchPoints);

        return finalTeamMatchPoints;

    }

    /**
     * When this function is called we have an array
     * containing each team's match points for all games played.
     *
     * We want to reduced that array to one that only has
     * one entry for each team, with each new object having it's
     * value represent the sum of all match points gained in the league.
     *
     * @param allTeamMatchPoints
     */
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

    /**
     * Convert a map object to a list for easier processing of data later.
     *
     * @param teamValuesMap
     */
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

    /**
     * Processes an array of the two team scores in a single match
     * and returns a new TeamValue object for each team where the value parameter
     * represents the points the team received from either Losing/Winning/Drawing the match.
     *
     * @param matchResults
     */
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

    /**
     * Expects a string containing the name of the team followed by a space and then the team's score for that match.
     * E.g. team "GoGetters" with score 10 should have a string as follows: "GoGetters 10"
     *
     * It will then convert this string into a TeamValue object that has a name and value variable.
     * It should also convert the string score into a number.
     *
     * @param result
     * @param regex
     */
    public static getTeamResultFromString(result: string, regex: RegExp): TeamValueI {

        // Use regex pattern to match team names that include spaces
        let matches = result.match(regex);

        if (matches) {

            const team: string = matches[1];

            // Remove the space at the end of the team name
            const name: string = team.slice(0, -1);

            // Convert string value into a number.
            const value: number = Number(matches[2]);

            const teamValues: TeamValueObject = {
                name: name,
                value: value
            };

            // return a TeamValue class object
            return new TeamValue(teamValues);

        }

        return null;
    }

    /**
     *
     * A method to simplify asking a question in the console that expects user input.
     *
     * The function combines outputting a message to the console
     * and waiting for user input, returning a promise that resolves that user input
     * eventually returning that input which is awaited on when called.
     *
     * @param message
     */
    public static input(message: string): Promise<string> {
        this.StandardInput.setEncoding('utf-8');
        console.log(message);

        return new Promise((res, rej) => {

            return this.StandardInput.on('data', (data) => {

                // In NodeJS the data received from input includes a newline at the end (as we hit enter)
                // We must get rid of this newline to transform the string into a boolean value.
                data = data.split('\n')[0];
                res(data);
            });
        });
    }

    /**
     * Converts user input for yes/no/continue questions to a boolean value.
     * @param message
     */
    public static async inputToBoolean(message: string): Promise<boolean> {

        let answer: string = await Utils.input(message);

        // In NodeJS the data received from input includes a newline at the end (as we hit enter)
        // We must get rid of this newline to transform the string into a boolean value.
        answer = answer.split('\n')[0];
        return Utils.booleanFromString(answer);

    }
}