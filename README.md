# Command Palette

Wouldn't it be handy if we had a command palette at hand to perform common actions on every site we develop? This command palette was built to address that. It's intended for use in development environments on any project. Bring your own commands.

The Command Palette is a HTML Custom Element so should work on any front end.

## Setup

```html
<command-palette></command-palette>
```

```js
import 'command-palette';

const palette = document.querySelector('command-palette');
palette.commands = [
  {
    name: 'Command',
    async handler() {
      // Do something...
    },
  },
];
```

## Properties

### commands
Type: `Command[]`

Default: `[]`

| Property | Type                                | Description                                    |
|----------|-------------------------------------|------------------------------------------------|
| name     | `string`                            | Shown in the list of commands                  |
| handler  | `() => Promise<unknown> \| unknown` | The function executed when a command is chosen |

The commands array defines the options that will be presented every time you open the palette.

### openShortcutTest
Type: `(event: KeyboardEvent) => boolean`

Default: `event => event.metaKey && event.shiftKey && event.key === 'p'`

If this function returns `true`, the command palette will open.

## Methods

### awaitCommand
Waits for the user to trigger a command. This can be used to chain a series of commands together.

```js
const palette = document.querySelector('command-palette');
palette.commands = [
  {
    name: 'Add product to cart',
    async handler() {
      const products = await fetchProducts();

      const product = await palette.awaitCommand({
        placeholder: 'Which product would you like to add?',
        commands: products.map(product => ({
          name: product.title,
          handler() {
            return product;
          },
        })),
      });

      const quantity = await palette.awaitCommand({
        placeholder: `How many ${product.title} would you like to add?`,
        commands: new Array(5).fill(null).map((_, index) => ({
          name: index + 1,
          handler() {
            return index + 1;
          },
        })),
      });

      addToCart(product.id, quantity);
    },
  },
];
```

### awaitInput
Waits for the user to provide some info. Rather than executing a command, this returns the users input.

```js
const palette = document.querySelector('command-palette');
palette.commands = [
  {
    name: 'Search',
    async handler() {
      const query = await palette.awaitInput({
        placeholder: 'What are you searching for?',
      });

      window.location.href = `/search?q=${query}`;
    },
  },
];
```

## TypeScript

I've not yet worked out how to export types automatically with Svelte & Vite. For now the code below should work.

```ts
import 'command-palette';

type Command = {
    name: string
    handler: () => Promise<unknown> | unknown
}

type AwaitInstructionSettings = {
  placeholder?: string;
  query?: string;
}

type AwaitCommandSettings = {
  commands?: string;
}

interface CommandPaletteElement extends Element {
  awaitCommand: (options: AwaitInstructionSettings & AwaitCommandSettings) => Promise<unknown>;
  awaitInput: (options: AwaitInstructionSettings) => Promise<string>;
  commands: Command[];
  openShortcutTest: (event: KeyboardEvent) => boolean;
}

const palette = document.querySelector<CommandPaletteElement>('command-palette');
palette.commands = [];
```

## Examples

The Command Palette can be used in any kind of project. You can find a number of sample commands for Shopify builds [here](/examples/shopify/index.js).
