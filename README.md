# span_challenge_nodejs #

### League Rank Calculator

This is a command-line application written in `NodeJS` that will calculate the ranking table for a
soccer league.

### Requirements

- Node 8 (optional if you have Docker)
- Docker

### Note
- Results of your soccer league must be in a file with the following structure

```
Lions 3, Snakes 3
Tarantulas 1, FC Awesome 0
Lions 1, FC Awesome 1
Tarantulas 3, Snakes 1
Lions 4, Grouches 0
```

- You need to know the absolute file path to copy and paste it into the terminal

### Setup, Test, Run

Before completing the following steps, please make sure you are in the root directory.

``` 
cd path/to/span_challenge_nodejs
```

#### Programmatic Execution

##### Options

1 - setup, test and run
``` 
sh setup_test_and_run_without_docker.sh
```

2 - setup
``` 
sh setup.sh
```
3 - test
``` 
sh test.sh
```
4 - run
``` 
sh run_without_docker.sh
```
5 - test and run with docker
``` 
test_and_run_with_docker.sh
```
6 - run with docker
``` 
run_with_docker.sh
```

#### Run manually without Docker
Step 1 - npm install
```
npm install
```

Step 2 - run tests
``` 
mocha --require ts-node/register **/*.spec.ts
```

Step 3 - build
```
gulp
```

Step 4 - run program
```
cd ./dist
node main.js 
```

