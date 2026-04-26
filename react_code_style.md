# Rules of React (User Provided)

Just as different programming languages have their own ways of expressing concepts, React has its own idioms — or rules — for how to express patterns in a way that is easy to understand and yields high-quality applications.

## Components and Hooks must be pure
- React components are assumed to always return the same output with respect to their inputs – props, state, and context.
- Side effects should not run in render.
- Props and state are immutable. Never mutate them directly.
- Return values and arguments to Hooks are immutable.
- Values are immutable after being passed to JSX.

## React calls Components and Hooks
- Components should only be used in JSX. Don’t call them as regular functions.
- Hooks should only be called inside of components. Never pass it around as a regular value.

## Rules of Hooks
- Only call Hooks at the top level. Don’t call Hooks inside loops, conditions, or nested functions.
- Only call Hooks from React functions.

*Saved for IDE and Agent syntax and architectural compliance.*
