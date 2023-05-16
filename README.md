Think of this template more as a list of things to consider. Feel free to change headings, content, add sections, etc.

# Canadian Institute of Forestry Urban Forest Web App

## Product Description and Motivation

- Also list relevant project links (eg to issue board, UX documents)
- Who to talk to about what (Current team and roles)

## Setting Up and Running a Development Environment

- clone this repo
- in the new repo directory on your maching run 'yarn'
- add a `.env` file. Copy the key names from the `.env-sample` file. Ask a developer to share the key values.
- run `yarn dev`
- in the termal, the `yarn dev` command should give you an address where the app is served. Open a browser with that address.

## Deploying the app

## Tech Stack and Dependencies Worth Noting

- dont forget to a link to the back end repo if that is a dependency
- typescript - todo, mention weird maplibre/react-map-gl type conflicts

## General Development Process and Standards

- link to style guide and general process doc when available
- list any exceptions to above

## Architectural Decisions and Tradeoffs

- React Router's `useSearchParams` hook provides `searchParams` state that is stale. Instead we get query parameters by reading `window.location.search` We still use the provided `setSearchParams` to update the url (writing to `window.location.search` would cause the app to reload).

## Testing

- strategy (coverage goals)
- quick how to run
