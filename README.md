# Atividade TFS - COSMOS

## Dependências

- Node.js 24 ou superior
- Qualquer gerenciador de pacotes (npm, yarn, pnpm)
- `protoc`
- `@grpc/grpc-js`
- `google-protobuf`
- `deasync`
- `protoc-gen-ts`

`protoc` precisa ser instalado a parte através do site oficial: [Protobuf](https://protobuf.dev/installation/). Todos os outros pacotes podem ser instalados via npm ou outro gerenciador de pacotes.

## Instalação

```bash
pnpm install
```

## Geração dos tipos do proto

O projeto usa `protoc-gen-ts` para gerar os tipos a partir de `src/proto/limites.proto`.

```bash
pnpm proto:gen
```

## Build

```bash
pnpm build
```

Esse comando gera os tipos do proto e depois compila o TypeScript para `dist/`.

## Execução

1. Inicie o servidor gRPC:

```bash
node dist/server.js
# ou
pnpm start:server
```

2. Em outro terminal, execute o cliente:

```bash
node dist/index.js
# ou
pnpm start:client
```

## Scripts disponíveis

- `pnpm proto:gen` - gera os arquivos TypeScript do proto
- `pnpm build` - gera os tipos e compila o projeto
- `pnpm start:client` - executa `dist/index.js`
- `pnpm start:server` - executa `dist/server.js`
- `pnpm lint` - roda o ESLint
- `pnpm lint:fix` - roda o ESLint com correção automática
- `pnpm format` - formata o código com Prettier

## Observação

O arquivo gerado pelo `protoc-gen-ts` fica em `src/proto/limites.ts` e é usado diretamente pelo servidor e pelo conector gRPC.
