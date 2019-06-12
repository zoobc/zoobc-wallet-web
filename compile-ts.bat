protoc --plugin="protoc-gen-ts='node_modules\.bin\protoc-gen-ts'" --grpc-web_out="import_style=typescript,mode=grpcwebtext:src\app\grpc" --js_out="import_style=commonjs,binary:src\app\grpc" proto\model\transaction.proto --proto_path=proto

protoc --plugin="protoc-gen-ts='node_modules\.bin\protoc-gen-ts'" --grpc-web_out="import_style=typescript,mode=grpcwebtext:src\app\grpc" --js_out="import_style=commonjs,binary:src\app\grpc" proto\model\accountBalance.proto --proto_path=proto

protoc --plugin="protoc-gen-ts='node_modules\.bin\protoc-gen-ts'" --grpc-web_out="import_style=typescript,mode=grpcwebtext:src\app\grpc" --js_out="import_style=commonjs,binary:src\app\grpc" proto\model\empty.proto --proto_path=proto

protoc --plugin="protoc-gen-ts='node_modules\.bin\protoc-gen-ts'" --grpc-web_out="import_style=typescript,mode=grpcwebtext:src\app\grpc" --js_out="import_style=commonjs,binary:src\app\grpc" proto\service\accountBalance.proto --proto_path=proto

protoc --plugin="protoc-gen-ts='node_modules\.bin\protoc-gen-ts'" --grpc-web_out="import_style=typescript,mode=grpcwebtext:src\app\grpc" --js_out="import_style=commonjs,binary:src\app\grpc" proto\service\transaction.proto --proto_path=proto