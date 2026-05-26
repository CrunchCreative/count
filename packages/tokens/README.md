# @count/tokens

Design tokens for Count — colours, type, spacing, glass surfaces, radii.

The source of truth is `docs/design-source/the-count-v2/project/colors_and_type.css`. This package translates those CSS variables into typed TypeScript constants consumed by `@count/ui`, the Tailwind theme in `apps/mobile/tailwind.config.js`, and any other surface that needs them.

Add new tokens here first, then surface them in `tailwind.config.js` if they need to be available as utility classes.

## Two exports, same values

`@count/tokens` exports typed TS constants for runtime code. `@count/tokens/tailwind` exports the same values as CommonJS for `tailwind.config.js`, which runs in Node before any TS compiler. When you change a token, update both files. They are kept in sync by hand because duplicating a small constant tree is cheaper than introducing a build step.
