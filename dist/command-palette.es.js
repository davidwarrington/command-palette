var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var _listeners;
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function action_destroyer(action_result) {
  return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}
function append(target, node) {
  target.appendChild(node);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i])
      iterations[i].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function empty() {
  return text("");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
  return function(event) {
    event.preventDefault();
    return fn.call(this, event);
  };
}
function stop_propagation(fn) {
  return function(event) {
    event.stopPropagation();
    return fn.call(this, event);
  };
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.wholeText !== data)
    text2.data = data;
}
function set_input_value(input, value) {
  input.value = value == null ? "" : value;
}
function attribute_to_object(attributes) {
  const result = {};
  for (const attribute of attributes) {
    result[attribute.name] = attribute.value;
  }
  return result;
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function tick() {
  schedule_update();
  return resolved_promise;
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
  if (flushing)
    return;
  flushing = true;
  do {
    for (let i = 0; i < dirty_components.length; i += 1) {
      const component = dirty_components[i];
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  flushing = false;
  seen_callbacks.clear();
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
const outroing = new Set();
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function mount_component(component, target, anchor, customElement) {
  const { fragment, on_mount, on_destroy, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = on_mount.map(run).filter(is_function);
      if (on_destroy) {
        on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: null,
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    flush();
  }
  set_current_component(parent_component);
}
let SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      const { on_mount } = this.$$;
      this.$$.on_disconnect = on_mount.map(run).filter(is_function);
      for (const key in this.$$.slotted) {
        this.appendChild(this.$$.slotted[key]);
      }
    }
    attributeChangedCallback(attr2, _oldValue, newValue) {
      this[attr2] = newValue;
    }
    disconnectedCallback() {
      run_all(this.$$.on_disconnect);
    }
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    $on(type, callback) {
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1)
          callbacks.splice(index, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  };
}
const clickOutside = (element2) => {
  const handler = (event) => {
    const elementNoLongerExists = !element2;
    const elementContainsTarget = event.composedPath().includes(element2);
    if (event.defaultPrevented || elementNoLongerExists || elementContainsTarget) {
      return;
    }
    element2.dispatchEvent(new CustomEvent("command-palette:click-outside", { detail: element2 }));
  };
  document.addEventListener("click", handler, true);
  return {
    destroy() {
      document.removeEventListener("click", handler, true);
    }
  };
};
class ListenerManager {
  constructor() {
    __privateAdd(this, _listeners, new Map());
  }
  add(element2, event, listener, options = { once: false }) {
    element2.addEventListener(event, listener, options);
    if (!__privateGet(this, _listeners).has(element2)) {
      __privateGet(this, _listeners).set(element2, []);
    }
    __privateGet(this, _listeners).get(element2).push({
      event,
      fn: listener
    });
  }
  remove(element2, event, listener) {
    const existingListeners = __privateGet(this, _listeners).get(element2);
    if (!existingListeners) {
      return;
    }
    __privateGet(this, _listeners).set(element2, existingListeners.filter((existingListener) => existingListener.event === event && existingListener.fn === listener));
    element2.removeEventListener(event, listener);
  }
  removeAll() {
    __privateGet(this, _listeners).forEach((listeners, element2) => {
      listeners.forEach((listener) => {
        this.remove(element2, listener.event, listener.fn);
      });
      __privateGet(this, _listeners).delete(element2);
    });
  }
}
_listeners = new WeakMap();
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[28] = list[i];
  child_ctx[29] = list;
  child_ctx[30] = i;
  return child_ctx;
}
function create_if_block(ctx) {
  let div;
  let form;
  let label;
  let t0;
  let t1;
  let input;
  let t2;
  let ul;
  let clickOutside_action;
  let mounted;
  let dispose;
  let each_value = ctx[6];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  return {
    c() {
      div = element("div");
      form = element("form");
      label = element("label");
      t0 = text(ctx[0]);
      t1 = space();
      input = element("input");
      t2 = space();
      ul = element("ul");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(label, "class", "command-palette__label u-visually-hidden");
      attr(label, "for", "command-palette-input");
      attr(input, "id", "command-palette-input");
      attr(input, "class", "command-palette__input");
      attr(input, "type", "text");
      attr(input, "placeholder", ctx[0]);
      attr(form, "class", "command-palette__field");
      attr(ul, "class", "command-palette__suggestions");
      attr(div, "class", "command-palette");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, form);
      append(form, label);
      append(label, t0);
      append(form, t1);
      append(form, input);
      ctx[16](input);
      set_input_value(input, ctx[1]);
      ctx[18](form);
      append(div, t2);
      append(div, ul);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(ul, null);
      }
      ctx[22](div);
      if (!mounted) {
        dispose = [
          listen(input, "input", ctx[17]),
          listen(form, "submit", prevent_default(ctx[19])),
          listen(div, "keydown", stop_propagation(ctx[10])),
          listen(div, "command-palette:click-outside", ctx[8]),
          action_destroyer(clickOutside_action = clickOutside.call(null, div))
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & 1)
        set_data(t0, ctx2[0]);
      if (dirty & 1) {
        attr(input, "placeholder", ctx2[0]);
      }
      if (dirty & 2 && input.value !== ctx2[1]) {
        set_input_value(input, ctx2[1]);
      }
      if (dirty & 228) {
        each_value = ctx2[6];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(ul, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
    },
    d(detaching) {
      if (detaching)
        detach(div);
      ctx[16](null);
      ctx[18](null);
      destroy_each(each_blocks, detaching);
      ctx[22](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_each_block(ctx) {
  let li;
  let button;
  let t0_value = ctx[28].name + "";
  let t0;
  let index = ctx[30];
  let t1;
  let mounted;
  let dispose;
  const assign_button = () => ctx[20](button, index);
  const unassign_button = () => ctx[20](null, index);
  function click_handler(...args) {
    return ctx[21](ctx[28], ...args);
  }
  return {
    c() {
      li = element("li");
      button = element("button");
      t0 = text(t0_value);
      t1 = space();
      attr(button, "class", "command-palette__suggestion");
      attr(li, "class", "command-palette__suggestions-item");
    },
    m(target, anchor) {
      insert(target, li, anchor);
      append(li, button);
      append(button, t0);
      assign_button();
      append(li, t1);
      if (!mounted) {
        dispose = listen(button, "click", click_handler);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 64 && t0_value !== (t0_value = ctx[28].name + ""))
        set_data(t0, t0_value);
      if (index !== ctx[30]) {
        unassign_button();
        index = ctx[30];
        assign_button();
      }
    },
    d(detaching) {
      if (detaching)
        detach(li);
      unassign_button();
      mounted = false;
      dispose();
    }
  };
}
function create_fragment(ctx) {
  let if_block_anchor;
  let mounted;
  let dispose;
  let if_block = ctx[4] === ctx[3].OPEN && create_if_block(ctx);
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
      this.c = noop;
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      if (!mounted) {
        dispose = listen(window, "keydown", ctx[9]);
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (ctx2[4] === ctx2[3].OPEN) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block(ctx2);
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (if_block)
        if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
      mounted = false;
      dispose();
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let filteredCommands;
  let { commands = [] } = $$props;
  let { openShortcutTest = (event) => event.metaKey && event.key === "k" } = $$props;
  let { placeholder = "" } = $$props;
  const prepareForInstruction = (options) => {
    $$invalidate(15, currentCommands = options.commands || []);
    $$invalidate(0, placeholder = options.placeholder);
    $$invalidate(1, query = options.query);
    refs.input.focus();
  };
  const awaitCommand = (options) => new Promise((resolve) => {
    prepareForInstruction(options);
    const listenedEvent = { element: refs.root, type: Events.EXECUTE };
    const listener = (event) => {
      const { detail: command } = event;
      event.preventDefault();
      listeners.remove(listenedEvent.element, listenedEvent.type, listener);
      resolve(command.handler());
    };
    listeners.add(listenedEvent.element, listenedEvent.type, listener);
  });
  const awaitInput = (options) => new Promise((resolve) => {
    prepareForInstruction(options);
    const listenedEvent = { element: refs.form, type: "submit" };
    const listener = (event) => {
      event.preventDefault();
      listeners.remove(listenedEvent.element, listenedEvent.type, listener);
      resolve(query);
    };
    listeners.add(listenedEvent.element, listenedEvent.type, listener);
  });
  var Events;
  (function(Events2) {
    Events2["EXECUTE"] = "command-palette:execute";
  })(Events || (Events = {}));
  var States;
  (function(States2) {
    States2["CLOSED"] = "closed";
    States2["OPEN"] = "open";
  })(States || (States = {}));
  let currentCommands = commands;
  let query = "";
  let state = States.CLOSED;
  const listeners = new ListenerManager();
  let refs;
  const dispatchEvent = (target, event, detail) => target.dispatchEvent(new CustomEvent(event, { bubbles: true, detail }));
  const getActiveShadowElement = () => {
    let { activeElement } = document;
    if (activeElement.shadowRoot) {
      activeElement = activeElement.shadowRoot.activeElement;
    }
    return activeElement;
  };
  const close = () => {
    $$invalidate(1, query = "");
    $$invalidate(4, state = States.CLOSED);
    listeners.removeAll();
  };
  const open = async () => {
    $$invalidate(15, currentCommands = commands);
    $$invalidate(4, state = States.OPEN);
    await tick();
    await awaitCommand({
      placeholder: "Please enter a command",
      commands
    }).finally(close);
  };
  const handleExternalKeypress = (event) => {
    if (state === States.CLOSED && openShortcutTest(event)) {
      open();
    } else if (state === States.OPEN && event.key === "Escape") {
      close();
    }
  };
  const shortcuts = [
    {
      test: (event) => event.key === "Escape",
      handler: close
    },
    {
      test: (event) => event.key === "ArrowDown",
      handler: (event) => {
        event.preventDefault();
        let nextIndex = 0;
        const currentIndex = refs.suggestions.indexOf(getActiveShadowElement());
        if (currentIndex !== -1) {
          nextIndex = currentIndex + 1;
        }
        if (nextIndex >= filteredCommands.length) {
          return;
        }
        refs.suggestions[nextIndex].focus();
      }
    },
    {
      test: (event) => event.key === "ArrowUp",
      handler: (event) => {
        event.preventDefault();
        let nextIndex = -1;
        const currentIndex = refs.suggestions.indexOf(getActiveShadowElement());
        if (currentIndex !== -1) {
          nextIndex = currentIndex - 1;
        }
        if (nextIndex === -1) {
          refs.input.focus();
        } else {
          refs.suggestions[nextIndex].focus();
        }
      }
    },
    {
      test: (event) => event.key === "Home",
      handler: (event) => {
        event.preventDefault();
        if (refs.suggestions.includes(getActiveShadowElement())) {
          refs.suggestions[0].focus();
        }
      }
    },
    {
      test: (event) => event.key === "End",
      handler: (event) => {
        event.preventDefault();
        if (refs.suggestions.includes(getActiveShadowElement())) {
          refs.suggestions[refs.suggestions.length - 1].focus();
        }
      }
    }
  ];
  const testKeypressForShortcuts = (event) => {
    const usedShortcut = shortcuts.find((shortcut) => shortcut.test(event));
    if (!usedShortcut) {
      return;
    }
    usedShortcut.handler(event);
  };
  function input_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      refs.input = $$value;
      $$invalidate(5, refs);
    });
  }
  function input_input_handler() {
    query = this.value;
    $$invalidate(1, query);
  }
  function form_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      refs.form = $$value;
      $$invalidate(5, refs);
    });
  }
  const submit_handler = ({ target }) => dispatchEvent(target, Events.EXECUTE, filteredCommands[0]);
  function button_binding($$value, index) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      refs.suggestions[index] = $$value;
      $$invalidate(5, refs);
    });
  }
  const click_handler = (command, { target }) => dispatchEvent(target, Events.EXECUTE, command);
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      refs.root = $$value;
      $$invalidate(5, refs);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("commands" in $$props2)
      $$invalidate(11, commands = $$props2.commands);
    if ("openShortcutTest" in $$props2)
      $$invalidate(12, openShortcutTest = $$props2.openShortcutTest);
    if ("placeholder" in $$props2)
      $$invalidate(0, placeholder = $$props2.placeholder);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 32770) {
      $$invalidate(6, filteredCommands = currentCommands.filter((command) => {
        if (!query) {
          return true;
        }
        return command.name.toLowerCase().replaceAll(" ", "").includes(query.toLowerCase().replaceAll(" ", ""));
      }));
    }
  };
  $$invalidate(5, refs = {
    form: null,
    input: null,
    root: null,
    suggestions: []
  });
  return [
    placeholder,
    query,
    Events,
    States,
    state,
    refs,
    filteredCommands,
    dispatchEvent,
    close,
    handleExternalKeypress,
    testKeypressForShortcuts,
    commands,
    openShortcutTest,
    awaitCommand,
    awaitInput,
    currentCommands,
    input_binding,
    input_input_handler,
    form_binding,
    submit_handler,
    button_binding,
    click_handler,
    div_binding
  ];
}
class CommandPalette extends SvelteElement {
  constructor(options) {
    super();
    this.shadowRoot.innerHTML = `<style>*{box-sizing:border-box}.command-palette{--colour-red:#ff3e00;--spacing:10px;--vertical-offset:150px;background-color:#ffffff;box-shadow:0 1px 3px 0 rgba(0, 0, 0, 0.3),
        0 1px 2px 0 rgba(0, 0, 0, 0.18);display:grid;gap:calc(var(--spacing) * .5);left:50%;margin-inline:auto;padding:var(--spacing);position:fixed;text-align:left;top:var(--vertical-offset);transform:translateX(-50%);width:600px}.command-palette__input{appearance:none;background-color:transparent;border:1px solid rgba(0, 0, 0, .3);padding:5px;width:100%}.command-palette__input:focus{border:1px solid var(--colour-red);outline:none}.command-palette__suggestions{display:grid;list-style-type:none;margin:0 calc(var(--spacing) * -1) calc(var(--spacing) * -1);max-height:calc(100vh - (var(--vertical-offset) * 2));padding:calc(var(--spacing) * .5) var(--spacing) calc(var(--spacing) * .5);overflow:auto}.command-palette__suggestions-item{margin-inline:calc(var(--spacing) * -1)}.command-palette__suggestion{appearance:none;background-color:transparent;border:0;cursor:pointer;padding:calc(var(--spacing) * .5) calc(var(--spacing) * 1);text-align:left;width:100%}.command-palette__suggestion:focus{background-color:rgba(0, 0, 0, .01);outline:1px solid var(--colour-red)}.command-palette__suggestion:hover{background-color:rgba(0, 0, 0, .01)}.u-visually-hidden{border-width:0;clip:rect(0, 0, 0, 0);height:1px;padding:0;position:absolute;margin:-1px;overflow:hidden;white-space:nowrap;width:1px}</style>`;
    init(this, {
      target: this.shadowRoot,
      props: attribute_to_object(this.attributes),
      customElement: true
    }, instance, create_fragment, safe_not_equal, {
      commands: 11,
      openShortcutTest: 12,
      placeholder: 0,
      awaitCommand: 13,
      awaitInput: 14
    }, null);
    if (options) {
      if (options.target) {
        insert(options.target, this, options.anchor);
      }
      if (options.props) {
        this.$set(options.props);
        flush();
      }
    }
  }
  static get observedAttributes() {
    return ["commands", "openShortcutTest", "placeholder", "awaitCommand", "awaitInput"];
  }
  get commands() {
    return this.$$.ctx[11];
  }
  set commands(commands) {
    this.$$set({ commands });
    flush();
  }
  get openShortcutTest() {
    return this.$$.ctx[12];
  }
  set openShortcutTest(openShortcutTest) {
    this.$$set({ openShortcutTest });
    flush();
  }
  get placeholder() {
    return this.$$.ctx[0];
  }
  set placeholder(placeholder) {
    this.$$set({ placeholder });
    flush();
  }
  get awaitCommand() {
    return this.$$.ctx[13];
  }
  get awaitInput() {
    return this.$$.ctx[14];
  }
}
customElements.define("command-palette", CommandPalette);
export { CommandPalette as default };
