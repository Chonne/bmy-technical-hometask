start-level1:
	docker-compose -f ./level1/docker-compose.yml up -d --build

stop-level1:
	docker-compose -f ./level1/docker-compose.yml down --remove-orphans

start-level2:
	docker-compose -f ./level2/docker-compose.yml up -d --build

stop-level2:
	docker-compose -f ./level2/docker-compose.yml down --remove-orphans

execute-logs-emit:
	npm run logs:emit

level1: start-level1 execute-logs-emit

level2: start-level2 execute-logs-emit
