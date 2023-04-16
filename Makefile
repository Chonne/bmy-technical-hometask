start-level1:
	docker-compose -f ./level1/docker-compose.yml up -d --build

stop-level1:
	docker-compose -f ./level1/docker-compose.yml down --remove-orphans


execute-logs-emit:
	npm run logs:emit

level1: start-level1 execute-logs-emit

