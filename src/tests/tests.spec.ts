import * as chai from 'chai';
import {TeamValueI, TeamValueObject} from "../interfaces";
import {TeamValue} from '../classes';
import {Utils} from "../utils";
import {suite, test} from "mocha-typescript";

@suite('Team Value Tests')
class TeamValueTest {

    private readonly teamValue: TeamValue;
    private readonly teamResultGroupingPattern: RegExp;

    constructor() {

        this.teamValue = new TeamValue({
            name: "GoGetters",
            value: 10
        });

        this.teamResultGroupingPattern = Utils.TEAM_RESULT_GROUPING_PATTERN;

    }

    static before() {

    }

    @test('Check Team Value Class')
    public test_teamValue(done) {
        chai.assert.strictEqual(this.teamValue.getName(), 'GoGetters', 'getName() should return "GotGetters"' );
        chai.assert.strictEqual(this.teamValue.getValue(), 10, 'getValue() should return 10');
        done()
    }

    @test('Check Team Result From String')
    public test_teamResultFromString(done) {
        const teamResult: TeamValueI = Utils.getTeamResultFromString('FC Awesome 1', this.teamResultGroupingPattern);
        chai.assert.strictEqual(teamResult.getName(), 'FC Awesome', 'regex pattern should takes into account spaces within names');
        chai.assert.strictEqual(teamResult.getValue(), 1, 'value should be 1 of type number');
        done();
    }
}


@suite('Calculate Win Lose Match Points')
class WinLoseTest {

    matchPointsMap: Map<string, number>;

    constructor() {
        const teamAResult = new TeamValue({name: "A", value: 1});
        const teamBResult = new TeamValue({name: "B",value: 0});
        const matchResults: TeamValue[] = [];
        matchResults.push(teamAResult);
        matchResults.push(teamBResult);

        const matchPoints: TeamValueI[] = Utils.calculateMatchPoints(matchResults);
        this.matchPointsMap = Utils.convertTeamValueListToMap(matchPoints);

    }

    static before() {

    }

    @test('Team A (WIN) Match Points')
    public test_teamAMatchPoints(done) {
        chai.assert.strictEqual(this.matchPointsMap.get('A'), 3, 'Team A WON and should have 3 points');
        done()
    }

    @test('Team B (LOSE) Match Points')
    public test_teamBMatchPoints(done) {
        chai.assert.strictEqual(this.matchPointsMap.get('B'), 0, 'Team B LOST and should have 0 points');
        done();
    }
}

@suite('Calculate Draw Match Points')
class DrawTest {

    matchPointsMap: Map<string, number>;

    constructor() {
        const teamAResult = new TeamValue({name: "A", value: 1});
        const teamBResult = new TeamValue({name: "B",value: 1});
        const matchResults: TeamValue[] = [];
        matchResults.push(teamAResult);
        matchResults.push(teamBResult);

        const matchPoints: TeamValueI[] = Utils.calculateMatchPoints(matchResults);
        this.matchPointsMap = Utils.convertTeamValueListToMap(matchPoints);

    }

    static before() {

    }

    @test('Team A (DRAW) Match Points')
    public test_teamAMatchPoints(done) {
        chai.assert.strictEqual(this.matchPointsMap.get('A'), 1, 'It was a DRAW, Team A should have 1 point');
        done()
    }

    @test('Team B (DRAW) Match Points')
    public test_teamBMatchPoints(done) {
        chai.assert.strictEqual(this.matchPointsMap.get('B'), 1, 'It was a DRAW, Team B should have 1 point');
        done();
    }
}

@suite('Correct Team Order and Match Points')
class FinalResultTest {

    finalRank: TeamValueI[];

    constructor() {
        this.finalRank = Utils.getLeagueResults(Utils.TEST_FILE);
    }

    static before() {

    }

    @test('Tarantulas should be 1st with 6pts')
    public firstTeam(done) {
        const team: TeamValueI = this.finalRank[0];

        chai.assert.strictEqual(team.getRank(), 1, 'This team\'s rank should be 1');
        chai.assert.strictEqual(team.getName(), 'Tarantulas', 'The 1st team should be "Tarantulas"');
        chai.assert.strictEqual(team.getValue(), 6, 'Tarantulas should have 6 points.');
        done();
    }

    @test('Lions should be 2nd with 5pts')
    public secondTeam(done) {
        const team: TeamValueI = this.finalRank[1];

        chai.assert.strictEqual(team.getRank(), 2, 'This team\'s rank should be 2');
        chai.assert.strictEqual(team.getName(), 'Lions', 'The 2nd team should be "Lions"');
        chai.assert.strictEqual(team.getValue(), 5, 'Lions should have 5 points.');
        done();
    }

    @test('FC Awesome should be 3rd with 1pt')
    public thirdTeam(done) {
        const team: TeamValueI = this.finalRank[2];

        chai.assert.strictEqual(team.getRank(), 3, 'This team\'s rank should be 3');
        chai.assert.strictEqual(team.getName(), 'FC Awesome', 'The 1st 3rd ranked team should be "FC Awesome"');
        chai.assert.strictEqual(team.getValue(), 1, 'FC Awesome should have 1 point.');
        done();
    }

    @test('Snakes should be 3rd (after FC Awesome) with 1pt')
    public fourthTeam(done) {
        const team: TeamValueI = this.finalRank[3];

        chai.assert.strictEqual(team.getRank(), 3, 'This team\'s rank should be 3');
        chai.assert.strictEqual(team.getName(), 'Snakes', 'The 2nd 3rd ranked team should be "Snakes"');
        chai.assert.strictEqual(team.getValue(), 1, 'Snakes should have 1 point.');
        done();
    }

    @test('Grouches should be 5th with 0pts')
    public fifthTeam(done) {
        const team: TeamValueI = this.finalRank[4];

        chai.assert.strictEqual(team.getRank(), 5, 'This team\'s rank should be 5');
        chai.assert.strictEqual(team.getName(), 'Grouches', 'The 5th ranked team should be "Grouches"');
        chai.assert.strictEqual(team.getValue(), 0, 'Grouches should have 0 points.');
        done();
    }
}