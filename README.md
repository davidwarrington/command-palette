# Command Palette

## Setup

```html
<command-palette></command-palette>
```

```js
import 'command-palette';

const palette = document.querySelector('palette');
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

### Commands

Type:
```ts
Array<{
    name: string;
    handler: () => Promise<unknown> | unknown;
}>
```

The commands array defines the options that will be presented every time you open the palette.

## Methods

### awaitCommand
Waits for the user to trigger a command. This can be used to chain commands together.

```js
const palette = document.querySelector('command-palette');
const commands = [
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
const commands = [
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
