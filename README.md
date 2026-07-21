# Taste Blocks

A source-backed React component registry and catalog. Website sections, page layouts, and templates are out of scope.

- Public catalog: https://leonxlnx.github.io/taste-blocks/
- Public registry: https://leonxlnx.github.io/taste-blocks/r/registry.json
- Taste Skill integration: the `taste-blocks` stdio MCP server in this repository

## Commands

```bash
npm install
npm run dev
npm run verify
```

`npm run verify` validates registry policy, generates the catalog and shadcn payloads, type-checks the app, and runs a production build.

## Source policy

Every published component requires exact upstream source, revision, path, license, notices, and modification records. Restricted libraries, paid source, and original substitute components are not accepted in the current collection phase.

See `registry.json`, `licenses/`, and `THIRD_PARTY_NOTICES.md` for the shipped evidence and policy output. The complete collection research and rules are included in the DevDay bundle and the Taste Skill V2 branch.

## License

Taste Blocks project code is MIT licensed. Every collected component retains its own verified upstream license and provenance metadata. See `THIRD_PARTY_NOTICES.md`, `licenses/`, and each registry item's `meta.tasteblocks` record before redistribution.
