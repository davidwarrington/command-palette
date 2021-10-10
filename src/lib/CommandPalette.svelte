<svelte:window on:keydown={handleExternalKeypress} />

{#if state === 'open'}
    <div class="command-palette">
        <form class="command-palette__field" bind:this={refs.form}>
            <label
                class="command-palette__label u-visually-hidden"
                for="command-palette-input"
            >
                {placeholder}
            </label>

            <input
                id="command-palette-input"
                class="command-palette__input"
                type="text"
                {placeholder}
                bind:this={refs.input}
                bind:value={query}
            >
        </form>

        <ul class="command-palette__suggestions">
            {#each filteredCommands as command, index}
                <li class="command-palette__suggestions-item">
                    <button
                        class="command-palette__suggestion"
                        bind:this={refs.commands[command.name]}
                        data-index={index}
                    >
                        {command.name}
                    </button>
                </li>
            {/each}
        </ul>
    </div>
{/if}

<script lang="ts">
import { tick } from "svelte";
import { ListenerManager } from './ListenerManager';

export let commands: Command[] = [];
export let openShortcutTest = (event: KeyboardEvent) =>
    event.metaKey && event.shiftKey && event.key === 'p';
export let placeholder = '';

export const awaitCommand = ({
    placeholder: inputPlaceholder = '',
} = {}) => new Promise(resolve => {
    placeholder = inputPlaceholder;

    refs.input.focus();

    const events = [
        {
            elements: Object.values(refs.commands),
            type: 'click',
        },
        {
            elements: [refs.form],
            type: 'submit',
        },
    ];

    const listener = (event: Event) => {
        event.preventDefault();

        events.forEach(event => {
            event.elements.forEach(element =>
                listeners.remove(element, event.type, listener)
            );
        });

        const commandIndex = event.type === 'submit'
            ? 0
            : Number((event.target as HTMLButtonElement).dataset.index);

        resolve(executeCommandAtIndex(commandIndex));
    }

    events.forEach(event => {
        event.elements.forEach(element =>
            listeners.add(element, event.type, listener)
        );
    });
});

let query = '';
let state: 'closed' | 'open' = 'closed';

const listeners = new ListenerManager();

const refs: {
    commands: Record<string, HTMLButtonElement>
    form: HTMLFormElement
    input: HTMLInputElement
} = {
    commands: {},
    form: null,
    input: null,
}

$: filteredCommands = commands.filter(command => {
    if (!query) {
        return true;
    }

    return command.name.toLowerCase().replaceAll(' ', '').includes(query.toLowerCase().replaceAll(' ', ''));
})

const executeCommandAtIndex = (index: number) => {
    const chosenCommand = filteredCommands[index];

    if (!chosenCommand) {
        return;
    }

    return chosenCommand.handler();
}

const close = () => {
    query = '';
    state = 'closed';
    listeners.removeAll();
}

const open = async () => {
    state = 'open';
    await tick();
    await awaitCommand({ placeholder: 'Please enter a command' }).finally(close);
}

const handleExternalKeypress = (event: KeyboardEvent) => {
    if (state === 'closed' && openShortcutTest(event)) {
        open();
    } else if (state === 'open' && event.key === 'Escape') {
        close();
    }
}
</script>

<style>
* {
    box-sizing: border-box;
}

.command-palette {
    background-color: #ffffff;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3),
        0 1px 2px 0 rgba(0, 0, 0, 0.18);
    display: grid;
    gap: 10px;
    left: 50%;
    margin-inline: auto;
    padding: 10px;
    position: fixed;
    text-align: left;
    top: 150px;
    transform: translateX(-50%);
    width: 600px;
}

.command-palette__input {
    appearance: none;
    background-color: transparent;
    border: 1px solid rgba(0, 0, 0, .3);
    padding: 5px;
    width: 100%;
}

.command-palette__suggestions {
    display: grid;
    gap: 5px;
    list-style-type: none;
    margin: 0;
    padding: 0;
}

.command-palette__suggestion {
    appearance: none;
    background-color: transparent;
    border: 0;
    padding: 5px;
    text-align: left;
    width: 100%;
}

.command-palette__suggestion:focus,
.command-palette__suggestion:hover {
    background-color: rgba(0, 0, 0, .03);
}

.u-visually-hidden {
    border-width: 0;
    clip: rect(0, 0, 0, 0);
    height: 1px;
    padding: 0;
    position: absolute;
    margin: -1px;
    overflow: hidden;
    white-space: nowrap;
    width: 1px;
}
</style>
