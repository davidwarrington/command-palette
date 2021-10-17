/**
 * Modified from Svelte REPL
 * @see https://svelte.dev/repl/0ace7a508bd843b798ae599940a91783?version=3.16.7
 */
export const clickOutside = (element: HTMLElement) => {
    const handler = (event: MouseEvent) => {
        const elementNoLongerExists = !element;
        const elementContainsTarget = element.contains(event.target as HTMLElement);

        if (
            event.defaultPrevented ||
            elementNoLongerExists ||
            elementContainsTarget
        ) {
            return;
        }

        element.dispatchEvent(
            new CustomEvent(
                'command-palette:click-outside',
                { detail: element },
            )
        );
    }

    document.addEventListener('click', handler, true);

    return {
        destroy() {
            document.removeEventListener('click', handler, true);
        }
    }
}
