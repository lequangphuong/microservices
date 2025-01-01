docker compose exec broker-0 /opt/bitnami/kafka/bin/kafka-topics.sh --create --bootstrap-server broker-0:9092,broker-1:9092 --replication-factor 1 --partitions 1 --topic test

docker compose exec broker-0 /opt/bitnami/kafka/bin/kafka-topics.sh --list --bootstrap-server broker-0:9092,broker-1:9092

docker compose exec broker-0 /opt/bitnami/kafka/bin/kafka-topics.sh --describe --topic test --bootstrap-server broker-0:9092,broker-1:9092

docker compose exec broker-0 /opt/bitnami/kafka/bin/kafka-console-producer.sh --bootstrap-server broker-0:9092,broker-1:9092 --producer.config /opt/bitnami/kafka/config/producer.properties --topic test

docker compose exec broker-0  /opt/bitnami/kafka/bin/kafka-console-consumer.sh --bootstrap-server broker-0:9092,broker-1:9092 --consumer.config /opt/bitnami/kafka/config/consumer.properties --topic test --from-beginning