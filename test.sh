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

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
[ ! -d "$SCRIPTPATH/node_modules" ] && echo "Setting up..."
[ ! -d "$SCRIPTPATH/node_modules" ] && sh setup.sh >/dev/null 2>&1 & pid=$!
[ ! -d "$SCRIPTPATH/node_modules" ] && loader $pid

echo "Running tests..."
mocha --require ts-node/register **/*.spec.ts