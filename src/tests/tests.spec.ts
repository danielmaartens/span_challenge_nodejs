import * as chai from 'chai';
import {suite, test} from "mocha-typescript";

@suite('Challenge Tests')
class Test {

    static before() {
    }

    @test('test')
    public test(done) {
        done()
    }
}