run: build
	@./bin/db_exe

build: genproto
	go build -o ./bin/db_exe ./src

PROTO_DIR := model/proto
PROTOS := $(wildcard $(PROTO_DIR)/*.proto)

genproto: $(PROTOS)
	mkdir -p $@
	protoc --proto_path=$(PROTO_DIR) \
		-I external/googleapis \
		--go_out=$@ --go_opt=paths=source_relative \
		--go-grpc_out=$@ --go-grpc_opt=paths=source_relative \
		--plugin=protoc-gen-grpc-gateway=$(GOPATH)/bin/protoc-gen-grpc-gateway \
		--grpc-gateway_out=$@ --grpc-gateway_opt paths=source_relative \
		$(notdir $?)


test:
	mkdir -p test/tmp
	go test -v ./test
	rm -rf test/tmp

clean:
	rm -rf ./bin

.PHONY: build run test clean

