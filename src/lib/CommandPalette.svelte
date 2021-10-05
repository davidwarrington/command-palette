<div class="command-palette">
    <section class="command-palette__field">
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
        >
    </section>

    <ul class="command-palette__suggestions">
        {#each commands as command}
            <li class="command-palette__suggestions-item">
                <button class="command-palette__suggestion" on:click={command.handler}>
                    {command.name}
                </button>
            </li>
        {/each}
    </ul>
</div>

<script lang="ts">
export let commands: Command[] = [];
export let placeholder = 'Please enter a command';
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
    margin-inline: auto;
    padding: 10px;
    text-align: left;
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
