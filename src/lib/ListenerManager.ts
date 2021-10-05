type Listener = {
    event: string
    fn: Function
}

export class ListenerManager {
    #listeners = new Map<HTMLElement, Listener[]>()

    add(
        element: HTMLElement,
        event: string,
        listener: (event: Event) => void,
        options: AddEventListenerOptions = { once: false }
    ) {
        element.addEventListener(event, listener, options);

        if (!this.#listeners.has(element)) {
            this.#listeners.set(element, []);
        }

        this.#listeners.get(element)
            .push({
                event,
                fn: listener,
            });
    }

    remove(
        element: HTMLElement,
        event: string,
        listener: Function
    ) {
        const existingListeners = this.#listeners.get(element);

        if (!existingListeners) {
            return;
        }

        this.#listeners.set(
            element,
            existingListeners.filter(existingListener =>
                existingListener.event === event && existingListener.fn === listener
            )
        );
    }

    removeAll() {
        this.#listeners.forEach((listeners, element) => {
            listeners.forEach(listener => {
                this.remove(
                    element,
                    listener.event,
                    listener.fn
                );
            });

            this.#listeners.delete(element);
        });
    }
}
