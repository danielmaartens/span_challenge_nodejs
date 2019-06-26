"use strict";
import {Utils, Print} from "./utils";
import * as fs from 'fs';
import untildify = require('untildify');

async function run() {

    let running: boolean = true;
    let answerYes: boolean;

    console.log("\nWelcome to the League Rank Calculator !\n");

    const print = new Print(1500);

    print.withDelay("This program will calculate the ranking table for a soccer league.\n");

    print.withDelay("The data for the results of the games should be stored in a text file.");

    setTimeout(async () => {
        while (running) {

            console.log("\nPlease provide the full path of the file where your results are stored:\n");

            // read in user input and store it in the filePath variable
            const filePath = await Utils.input('Full File Path To Data: ');

            // Does file exist ?
            if (fs.existsSync(untildify(filePath))) {

                try {
                    console.log("\nLEAGUE RANK RESULTS\n");

                    // It does so let's start processing
                    // process the file contents and get the league results
                    const finalTeamMatchPoints = Utils.getLeagueResults(filePath);

                    // Print out the ranks in a format specified in the challenge.
                    for (const team of finalTeamMatchPoints) {

                        const points = team.getValue();
                        console.log(team.getRank() + ". " + team.getName() + ", " + points + (points === 1 ? " pt" : " pts"));

                    }

                    console.log();

                    answerYes = await Utils.inputToBoolean("\nWould you like to check match point results of another league ? [y/n]: ");

                    while (answerYes === null) {
                        console.log("\nI do not understand your command, please try again...");
                        answerYes = await Utils.inputToBoolean("Would you like to check match point results of another league ? [y/n]: ");
                    }

                    running = answerYes;

                } catch (error) {
                    console.error("Something went wrong while trying to calculate the match points: ", error);
                }
            } else {

                running = await Utils.inputToBoolean("\nSorry, your file does not exist ! Please double-check your file path and try again... Press [c] to continue, or any other key (besides ENTER) to exit...\n");

            }
        }

        console.log("\nThank you for using the League Rank Calculator !");
        process.exit();

    }, print.getCurrentDelay());
}

run();