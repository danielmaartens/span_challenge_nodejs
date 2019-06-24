"use strict";
import {Utils} from "./utils";

async function run() {

    let running: boolean = true;

    console.log("\nWelcome to the Match Point Calculator !\n");

    const initialDelay: number = 1500;
    let delay: number = initialDelay;

    Utils.delayedPrint("This program will calculate the ranking table for a soccer league.\n", delay);
    delay += initialDelay;

    Utils.delayedPrint("The data for the results of the games should be stored in a text file.", delay);
    delay += initialDelay;

    setTimeout(async () => {
        while (running) {


            console.log("\nPlease provide the full path of the file where your results are stored:\n");

            let filePath = null;


            filePath = await Utils.input('Full File Path: ');


            try {
                console.log("\nRESULTS\n");

                const finalTeamMatchPoints = Utils.getOrderedMatchPointsFromFile(filePath);

                for (const team of finalTeamMatchPoints) {

                    const points = team.getValue();
                    console.log(team.getRank() + ". " + team.getName() + ", " + points + (points === 1 ? " pt" : " pts"));

                }

                console.log();

                let answer: string | boolean = await Utils.input("\nWould you like to check match point results of another league ? [y/n]: ", true);

                while (answer === null) {
                    console.log("\nI do not understand your command, please try again...");
                    answer = await Utils.input("Would you like to check match point results of another league ? [y/n]: ", true);
                }

                running = Boolean(answer);

            } catch (error) {
                console.error("Something went wrong while trying to calculate the match points: ", error);
            }
        }

        console.log("\nThank you for using the Match Point Calculator !");
        process.exit();
    }, delay);
}

run();