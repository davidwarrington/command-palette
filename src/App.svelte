<script lang="ts">
  import CommandPalette from './lib/CommandPalette.svelte';

  let palette: CommandPalette;

  const commands: Command[] = [
      'Command 1',
      'Command 2',
      'Command 3',
      'Command 4',
      'Command 5',
    ].map(name => ({
        name,
        handler: async () => {
          console.log(name)
          if (name === 'Command 1') {
            await palette.awaitCommand({ placeholder: `What's your next command?` });
          } else {
            await palette.awaitCommand();
          }
        },
      }))

    commands.push({
      name: 'Close',
      handler: async () => {
        console.log('Closing')
      }
    })
</script>

<main>
  <h1>
    Press CMD + SHIFT + P
  </h1>

  <CommandPalette {commands} bind:this={palette} />
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }
  }
</style>
