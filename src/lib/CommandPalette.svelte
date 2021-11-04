<svelte:options tag="command-palette" />

<svelte:window on:keydown={handleExternalKeypress} />

{#if state === States.OPEN}
    <div
        class="command-palette"
        bind:this={refs.root}
        on:keydown|stopPropagation={testKeypressForShortcuts}
        on:command-palette:click-outside={close}
        use:clickOutside
    >
        <form
            class="command-palette__field"
            bind:this={refs.form}
            on:submit|preventDefault={({ target }) => {
                if (listingType !== 'commands') {
                    return;
                }

                dispatchEvent(
                    target,
                    Events.EXECUTE,
                    filteredCommands[0]
                )
            }}
        >
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
                autocomplete="off"
                {placeholder}
                bind:this={refs.input}
                bind:value={query}
            >
        </form>

        <ul class="command-palette__suggestions">
            {#if listingType === 'commands'}
                {#each filteredCommands as command, index}
                    <li class="command-palette__suggestions-item">
                        <button
                            class="command-palette__suggestion"
                            bind:this={refs.suggestions[index]}
                            on:click={({ target }) => dispatchEvent(
                                target,
                                Events.EXECUTE,
                                command
                            )}
                        >
                            {command.name}
                        </button>
                    </li>
                {/each}
            {:else}
                {#each filteredLinks as link, index}
                    <li class="command-palette__suggestions-item">
                        <a
                            class="command-palette__suggestion"
                            href={link.url.toString()}
                            bind:this={refs.suggestions[index]}
                        >
                            {link.name}
                        </a>
                    </li>
                {/each}
            {/if}
        </ul>
    </div>
{/if}

<script lang="ts">
import { tick } from 'svelte';
import { clickOutside } from './directives';
import { ListenerManager } from './ListenerManager';

export let links: Link[] = [];
export let commands: Command[] = [];
export let openShortcutTest = (event: KeyboardEvent) =>
    event.metaKey && event.key === 'k';
export let placeholder = '';

type AwaitInstructionSettings = {
    placeholder?: typeof placeholder
    query?: typeof query
}

type AwaitCommandSettings = {
    commands?: typeof commands
}

const prepareForInstruction = (options: AwaitInstructionSettings & AwaitCommandSettings) => {
    currentCommands = options.commands || [];
    placeholder = options.placeholder;
    query = options.query;

    refs.input.focus();
}

export const awaitCommand = (options?: AwaitInstructionSettings & AwaitCommandSettings) => new Promise(resolve => {
    prepareForInstruction(options);

    const listenedEvent = {
        element: refs.root,
        type: Events.EXECUTE,
    };

    const listener = (event: CustomEvent<Command>) => {
        const { detail: command } = event;

        event.preventDefault();

        listeners.remove(listenedEvent.element, listenedEvent.type, listener);

        resolve(command.handler());
    }

    listeners.add(listenedEvent.element, listenedEvent.type, listener);
});

export const awaitInput = (options?: AwaitInstructionSettings) => new Promise<string>(resolve => {
    prepareForInstruction(options);

    const listenedEvent = {
        element: refs.form,
        type: 'submit',
    };

    const listener = (event: SubmitEvent) => {
        event.preventDefault();

        listeners.remove(listenedEvent.element, listenedEvent.type, listener);

        resolve(query);
    }

    listeners.add(listenedEvent.element, listenedEvent.type, listener);
});

enum Events {
    EXECUTE = 'command-palette:execute',
}
enum States {
    CLOSED = 'closed',
    OPEN = 'open',
}

let currentCommands = commands;
let query = '';
let state: States = States.CLOSED;

const listeners = new ListenerManager();

let refs: {
    form: HTMLFormElement
    input: HTMLInputElement
    root: HTMLElement
    suggestions: (HTMLAnchorElement | HTMLButtonElement)[]
};
$: refs = {
    form: null,
    input: null,
    root: null,
    suggestions: [],
}

type ListingType = 'commands' | 'links';
$: listingType = query && query[0] === '>' ? 'commands' : 'links' as ListingType;

$: filteredCommands = currentCommands.filter(command => {
    if (!query) {
        return true;
    }

    return command.name.toLowerCase().replaceAll(' ', '').includes(query.toLowerCase().replace(/^>/, '').replaceAll(' ', ''));
})
$: filteredLinks = links.filter(link => {
    if (!query) {
        return true;
    }

    return link.name.toLowerCase().replaceAll(' ', '').includes(query.toLowerCase().replaceAll(' ', ''));
})

const dispatchEvent = <T extends unknown>(
    target: EventTarget,
    event: string,
    detail: T
) => target.dispatchEvent(new CustomEvent(event, { bubbles: true, detail }));

const getActiveShadowElement = () => {
    let { activeElement } = document;
    if (activeElement.shadowRoot) {
        activeElement = activeElement.shadowRoot.activeElement;
    }

    return activeElement;
}

const close = () => {
    query = '';
    state = States.CLOSED;
    listeners.removeAll();
}

const open = async () => {
    currentCommands = commands;
    state = States.OPEN;
    await tick();
    await awaitCommand({ placeholder: 'Please enter a command', commands })
        .finally(close);
}

const handleExternalKeypress = (event: KeyboardEvent) => {
    if (state === States.CLOSED && openShortcutTest(event)) {
        open();
    } else if (state === States.OPEN && event.key === 'Escape') {
        close();
    }
}

type Shortcut = {
    test: (event: KeyboardEvent) => boolean,
    handler: (event: KeyboardEvent) => unknown,
};
const shortcuts: Shortcut[] = [
    {
        test: event => event.key === 'Escape',
        handler: close,
    },
    {
        test: event => event.key === 'ArrowDown',
        handler: event => {
            event.preventDefault();

            let nextIndex = 0;

            const currentIndex = refs.suggestions.indexOf(getActiveShadowElement() as HTMLButtonElement);
            if (currentIndex !== -1) {
                nextIndex = currentIndex + 1;
            }

            if (nextIndex >= refs.suggestions.length) {
                return;
            }

            refs.suggestions[nextIndex].focus();
        },
    },
    {
        test: event => event.key === 'ArrowUp',
        handler: event => {
            event.preventDefault();

            let nextIndex = -1;

            const currentIndex = refs.suggestions.indexOf(getActiveShadowElement() as HTMLButtonElement);
            if (currentIndex !== -1) {
                nextIndex = currentIndex - 1;
            }

            if (nextIndex === -1) {
                refs.input.focus();
            } else {
                refs.suggestions[nextIndex].focus();
            }
        },
    },
    {
        test: event => event.key === 'Home',
        handler: event => {
            event.preventDefault();

            if (refs.suggestions.includes(getActiveShadowElement() as HTMLButtonElement)) {
                refs.suggestions[0].focus();
            }
        },
    },
    {
        test: event => event.key === 'End',
        handler: event => {
            event.preventDefault();

            if (refs.suggestions.includes(getActiveShadowElement() as HTMLButtonElement)) {
                refs.suggestions[refs.suggestions.length - 1].focus();
            }
        },
    },
];

const testKeypressForShortcuts = (event: KeyboardEvent) => {
    const usedShortcut = shortcuts.find(shortcut => shortcut.test(event));

    if (!usedShortcut) {
        return;
    }

    usedShortcut.handler(event);
}
</script>

<style>
* {
    box-sizing: border-box;
}

.command-palette {
    --colour-red: #ff3e00;

    --spacing: 10px;
    --vertical-offset: 150px;

    background-color: #ffffff;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3),
        0 1px 2px 0 rgba(0, 0, 0, 0.18);
    display: grid;
    gap: calc(var(--spacing) * .5);
    left: 50%;
    margin-inline: auto;
    padding: var(--spacing);
    position: fixed;
    text-align: left;
    top: var(--vertical-offset);
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

.command-palette__input:focus {
    border: 1px solid var(--colour-red);
    outline: none;
}

.command-palette__suggestions {
    display: grid;
    list-style-type: none;
    margin:  0 calc(var(--spacing) * -1) calc(var(--spacing) * -1);
    max-height: calc(100vh - (var(--vertical-offset) * 2));
    padding: calc(var(--spacing) * .5) var(--spacing) calc(var(--spacing) * .5);
    overflow: auto;
}

.command-palette__suggestions-item {
    margin-inline: calc(var(--spacing) * -1);
}

.command-palette__suggestion {
    appearance: none;
    background-color: transparent;
    border: 0;
    color: currentColor;
    cursor: pointer;
    display: block;
    padding: calc(var(--spacing) * .5) calc(var(--spacing) * 1);
    text-align: left;
    text-decoration: none;
    width: 100%;
}

.command-palette__suggestion:focus {
    background-color: rgba(0, 0, 0, .01);
    outline: 1px solid var(--colour-red);
}

.command-palette__suggestion:hover {
    background-color: rgba(0, 0, 0, .01);
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
