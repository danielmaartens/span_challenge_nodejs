#!/usr/local/bin/bash

loader(){
	MAX=10
	ARR=( $(eval echo {1..${MAX}}) )

	while kill -0 $1 2>/dev/null
	do
		for i in ${ARR[*]} ; do
		    printf "\e[2K[ "
				printf '▓%.0s' $(eval echo "{1..$i}")
		    printf "\e[%uC]" $((${MAX}+1-${i}))
		    printf "\r"
        if ! [ -z "$2" ]; then
				  sleep $2
				else
					sleep 0.1
				fi
		done
	done

	space=$(printf ' %.0s' $(eval echo "{1..$MAX}"))
	printf "${red}Done !${white} ${space} \r\n\n"
}

echo "Cleaning up..."
sh cleanup.sh >/dev/null 2>&1 & pid=$!
loader $pid

echo "Building docker image..."
docker build -t span-challenge-nodejs -f Dockerfile . >/dev/null 2>&1 & pid=$!
loader $pid

echo "Setting up docker container..."
docker run -d -v src:/usr/src/src --name span-challenge-nodejs span-challenge-nodejs >/dev/null

docker exec -it span-challenge-nodejs /bin/sh -ci 'mocha --require ts-node/register **/*.spec.js && node main.js && exit'
