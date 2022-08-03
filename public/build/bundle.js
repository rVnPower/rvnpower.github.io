
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
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
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
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
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
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
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
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
        seen_callbacks.clear();
        set_current_component(saved_component);
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
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
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
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
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
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
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
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/App.svelte generated by Svelte v3.49.0 */

    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let header;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div0;
    	let h10;
    	let t2;
    	let p0;
    	let t3;
    	let span;
    	let t4;
    	let p1;
    	let t5;
    	let a0;
    	let t7;
    	let t8;
    	let section0;
    	let div1;
    	let h11;
    	let t10;
    	let p2;
    	let t12;
    	let img1;
    	let img1_src_value;
    	let t13;
    	let section1;
    	let div2;
    	let h12;
    	let t15;
    	let p3;
    	let t17;
    	let div24;
    	let div3;
    	let t18;
    	let div8;
    	let div7;
    	let h30;
    	let t20;
    	let div6;
    	let p4;
    	let t22;
    	let div5;
    	let div4;
    	let t23;
    	let div13;
    	let div12;
    	let h31;
    	let t25;
    	let div11;
    	let p5;
    	let t27;
    	let div10;
    	let div9;
    	let t28;
    	let div18;
    	let div17;
    	let h32;
    	let t30;
    	let div16;
    	let p6;
    	let t32;
    	let div15;
    	let div14;
    	let t33;
    	let div23;
    	let div22;
    	let h33;
    	let t35;
    	let div21;
    	let p7;
    	let t37;
    	let div20;
    	let div19;
    	let t38;
    	let section2;
    	let div25;
    	let h13;
    	let t40;
    	let p8;
    	let t41;
    	let a1;
    	let t43;
    	let t44;
    	let img2;
    	let img2_src_value;
    	let t45;
    	let section3;
    	let div26;
    	let h14;
    	let t47;
    	let div33;
    	let div29;
    	let div27;
    	let img3;
    	let img3_src_value;
    	let t48;
    	let h50;
    	let t50;
    	let div28;
    	let p9;
    	let t52;
    	let div32;
    	let div30;
    	let img4;
    	let img4_src_value;
    	let t53;
    	let h51;
    	let t55;
    	let div31;
    	let p10;

    	const block = {
    		c: function create() {
    			main = element("main");
    			header = element("header");
    			img0 = element("img");
    			t0 = space();
    			div0 = element("div");
    			h10 = element("h1");
    			h10.textContent = "VnPower";
    			t2 = space();
    			p0 = element("p");
    			t3 = text("Just a random Vietnamese student who code as a hobby\n      ");
    			span = element("span");
    			t4 = space();
    			p1 = element("p");
    			t5 = text("This is now just my single-page portfolio, go to ");
    			a0 = element("a");
    			a0.textContent = "my website on tilde.club\n      ";
    			t7 = text("to read my blogs. Newer updates will be on there also.");
    			t8 = space();
    			section0 = element("section");
    			div1 = element("div");
    			h11 = element("h1");
    			h11.textContent = "Who I am";
    			t10 = space();
    			p2 = element("p");
    			p2.textContent = "Just a student who create stuff. This is the fourth time\n      I rewrited my website, and I think this is good enough for now.";
    			t12 = space();
    			img1 = element("img");
    			t13 = space();
    			section1 = element("section");
    			div2 = element("div");
    			h12 = element("h1");
    			h12.textContent = "Stuff I have done";
    			t15 = space();
    			p3 = element("p");
    			p3.textContent = "These are some of my recent projects.";
    			t17 = space();
    			div24 = element("div");
    			div3 = element("div");
    			t18 = space();
    			div8 = element("div");
    			div7 = element("div");
    			h30 = element("h3");
    			h30.textContent = "DemonListVN-v2";
    			t20 = space();
    			div6 = element("div");
    			p4 = element("p");
    			p4.textContent = "Svelte + TypeScript";
    			t22 = space();
    			div5 = element("div");
    			div4 = element("div");
    			t23 = space();
    			div13 = element("div");
    			div12 = element("div");
    			h31 = element("h3");
    			h31.textContent = "BetterNewTab";
    			t25 = space();
    			div11 = element("div");
    			p5 = element("p");
    			p5.textContent = "Svelte + JavaScript";
    			t27 = space();
    			div10 = element("div");
    			div9 = element("div");
    			t28 = space();
    			div18 = element("div");
    			div17 = element("div");
    			h32 = element("h3");
    			h32.textContent = "dotfiles";
    			t30 = space();
    			div16 = element("div");
    			p6 = element("p");
    			p6.textContent = "Shell";
    			t32 = space();
    			div15 = element("div");
    			div14 = element("div");
    			t33 = space();
    			div23 = element("div");
    			div22 = element("div");
    			h33 = element("h3");
    			h33.textContent = "blackjack";
    			t35 = space();
    			div21 = element("div");
    			p7 = element("p");
    			p7.textContent = "Rust";
    			t37 = space();
    			div20 = element("div");
    			div19 = element("div");
    			t38 = space();
    			section2 = element("section");
    			div25 = element("div");
    			h13 = element("h1");
    			h13.textContent = "I also write blogs";
    			t40 = space();
    			p8 = element("p");
    			t41 = text("I have changed my mind on this. Please go to ");
    			a1 = element("a");
    			a1.textContent = "my website on tilde.club\n      ";
    			t43 = text("to read my blogs. Newer updates will be on there also.");
    			t44 = space();
    			img2 = element("img");
    			t45 = space();
    			section3 = element("section");
    			div26 = element("div");
    			h14 = element("h1");
    			h14.textContent = "You could find me on";
    			t47 = space();
    			div33 = element("div");
    			div29 = element("div");
    			div27 = element("div");
    			img3 = element("img");
    			t48 = space();
    			h50 = element("h5");
    			h50.textContent = "XMPP";
    			t50 = space();
    			div28 = element("div");
    			p9 = element("p");
    			p9.textContent = "vnpower@jabber.fr";
    			t52 = space();
    			div32 = element("div");
    			div30 = element("div");
    			img4 = element("img");
    			t53 = space();
    			h51 = element("h5");
    			h51.textContent = "Discord";
    			t55 = space();
    			div31 = element("div");
    			p10 = element("p");
    			p10.textContent = "VnPower#5919";
    			if (!src_url_equal(img0.src, img0_src_value = "pf.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "My profile picture");
    			attr_dev(img0, "class", "profile svelte-vcqqrz");
    			add_location(img0, file, 143, 4, 2509);
    			add_location(h10, file, 145, 6, 2620);
    			attr_dev(span, "class", "beam");
    			add_location(span, file, 148, 6, 2712);
    			add_location(p0, file, 146, 6, 2643);
    			attr_dev(a0, "href", "https://tilde.club/~vnpower");
    			add_location(a0, file, 150, 58, 2808);
    			add_location(p1, file, 150, 6, 2756);
    			attr_dev(div0, "class", "align-center column intro");
    			add_location(div0, file, 144, 4, 2574);
    			attr_dev(header, "class", "center-flex column full-height");
    			add_location(header, file, 142, 2, 2457);
    			add_location(h11, file, 157, 6, 3056);
    			add_location(p2, file, 158, 6, 3080);
    			attr_dev(div1, "class", "section-content svelte-vcqqrz");
    			add_location(div1, file, 156, 4, 3020);
    			if (!src_url_equal(img1.src, img1_src_value = "waving.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Waving hand");
    			attr_dev(img1, "class", "waving");
    			add_location(img1, file, 163, 4, 3243);
    			attr_dev(section0, "class", "row-reverse center-flex svelte-vcqqrz");
    			add_location(section0, file, 155, 2, 2974);
    			add_location(h12, file, 167, 6, 3401);
    			add_location(p3, file, 168, 6, 3434);
    			attr_dev(div2, "class", "section-content svelte-vcqqrz");
    			add_location(div2, file, 166, 4, 3365);
    			attr_dev(div3, "class", "overflow-gradient");
    			add_location(div3, file, 173, 6, 3574);
    			add_location(h30, file, 176, 10, 3691);
    			attr_dev(p4, "class", "svelte-vcqqrz");
    			add_location(p4, file, 178, 12, 3756);
    			attr_dev(div4, "class", "wip-tag");
    			add_location(div4, file, 180, 14, 3845);
    			attr_dev(div5, "class", "tags flex row-reverse");
    			add_location(div5, file, 179, 12, 3795);
    			attr_dev(div6, "class", "info svelte-vcqqrz");
    			add_location(div6, file, 177, 10, 3725);
    			attr_dev(div7, "class", "front align-center svelte-vcqqrz");
    			add_location(div7, file, 175, 8, 3648);
    			attr_dev(div8, "class", "project svelte-vcqqrz");
    			add_location(div8, file, 174, 6, 3618);
    			add_location(h31, file, 187, 10, 4018);
    			attr_dev(p5, "class", "svelte-vcqqrz");
    			add_location(p5, file, 189, 12, 4081);
    			attr_dev(div9, "class", "unmaintained-tag");
    			add_location(div9, file, 191, 14, 4170);
    			attr_dev(div10, "class", "tags flex row-reverse");
    			add_location(div10, file, 190, 12, 4120);
    			attr_dev(div11, "class", "info svelte-vcqqrz");
    			add_location(div11, file, 188, 10, 4050);
    			attr_dev(div12, "class", "front align-center svelte-vcqqrz");
    			add_location(div12, file, 186, 8, 3975);
    			attr_dev(div13, "class", "project svelte-vcqqrz");
    			add_location(div13, file, 185, 6, 3945);
    			add_location(h32, file, 198, 10, 4352);
    			attr_dev(p6, "class", "svelte-vcqqrz");
    			add_location(p6, file, 200, 12, 4411);
    			attr_dev(div14, "class", "wip-tag");
    			add_location(div14, file, 202, 14, 4486);
    			attr_dev(div15, "class", "tags flex row-reverse");
    			add_location(div15, file, 201, 12, 4436);
    			attr_dev(div16, "class", "info svelte-vcqqrz");
    			add_location(div16, file, 199, 10, 4380);
    			attr_dev(div17, "class", "front align-center svelte-vcqqrz");
    			add_location(div17, file, 197, 8, 4309);
    			attr_dev(div18, "class", "project svelte-vcqqrz");
    			add_location(div18, file, 196, 6, 4279);
    			add_location(h33, file, 209, 10, 4659);
    			attr_dev(p7, "class", "svelte-vcqqrz");
    			add_location(p7, file, 211, 12, 4719);
    			attr_dev(div19, "class", "completed-tag");
    			add_location(div19, file, 213, 14, 4793);
    			attr_dev(div20, "class", "tags flex row-reverse");
    			add_location(div20, file, 212, 12, 4743);
    			attr_dev(div21, "class", "info svelte-vcqqrz");
    			add_location(div21, file, 210, 10, 4688);
    			attr_dev(div22, "class", "front align-center svelte-vcqqrz");
    			add_location(div22, file, 208, 8, 4616);
    			attr_dev(div23, "class", "project svelte-vcqqrz");
    			add_location(div23, file, 207, 6, 4586);
    			attr_dev(div24, "class", "wrapper flex column align-center no-overflow svelte-vcqqrz");
    			add_location(div24, file, 172, 4, 3509);
    			attr_dev(section1, "class", "center-flex preview-projects svelte-vcqqrz");
    			add_location(section1, file, 165, 2, 3314);
    			add_location(h13, file, 222, 6, 5001);
    			attr_dev(a1, "href", "https://tilde.club/~vnpower");
    			add_location(a1, file, 223, 54, 5083);
    			add_location(p8, file, 223, 6, 5035);
    			attr_dev(div25, "class", "section-content svelte-vcqqrz");
    			add_location(div25, file, 221, 4, 4965);
    			if (!src_url_equal(img2.src, img2_src_value = "writing.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Writing");
    			attr_dev(img2, "class", "waving");
    			add_location(img2, file, 227, 4, 5239);
    			attr_dev(section2, "class", "row-reverse center-flex svelte-vcqqrz");
    			add_location(section2, file, 220, 2, 4919);
    			add_location(h14, file, 231, 6, 5385);
    			attr_dev(div26, "class", "section-content svelte-vcqqrz");
    			add_location(div26, file, 230, 4, 5349);
    			if (!src_url_equal(img3.src, img3_src_value = "xmpp.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "XMPP");
    			attr_dev(img3, "class", "svelte-vcqqrz");
    			add_location(img3, file, 236, 10, 5576);
    			attr_dev(h50, "class", "service-name svelte-vcqqrz");
    			add_location(h50, file, 237, 10, 5618);
    			attr_dev(div27, "class", "service-logo no-overflow svelte-vcqqrz");
    			add_location(div27, file, 235, 8, 5527);
    			add_location(p9, file, 240, 10, 5713);
    			attr_dev(div28, "class", "service-info svelte-vcqqrz");
    			add_location(div28, file, 239, 8, 5676);
    			attr_dev(div29, "class", "service flex align-center");
    			add_location(div29, file, 234, 6, 5479);
    			if (!src_url_equal(img4.src, img4_src_value = "discord.svg")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "Discord");
    			attr_dev(img4, "class", "svelte-vcqqrz");
    			add_location(img4, file, 245, 10, 5869);
    			attr_dev(h51, "class", "service-name svelte-vcqqrz");
    			add_location(h51, file, 246, 10, 5917);
    			attr_dev(div30, "class", "service-logo no-overflow svelte-vcqqrz");
    			add_location(div30, file, 244, 8, 5820);
    			add_location(p10, file, 249, 10, 6015);
    			attr_dev(div31, "class", "service-info svelte-vcqqrz");
    			add_location(div31, file, 248, 8, 5978);
    			attr_dev(div32, "class", "service flex align-center");
    			add_location(div32, file, 243, 6, 5772);
    			attr_dev(div33, "class", "flex column");
    			set_style(div33, "gap", "7px");
    			add_location(div33, file, 233, 4, 5430);
    			attr_dev(section3, "class", "center-flex contact svelte-vcqqrz");
    			add_location(section3, file, 229, 2, 5307);
    			add_location(main, file, 141, 0, 2448);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, header);
    			append_dev(header, img0);
    			append_dev(header, t0);
    			append_dev(header, div0);
    			append_dev(div0, h10);
    			append_dev(div0, t2);
    			append_dev(div0, p0);
    			append_dev(p0, t3);
    			append_dev(p0, span);
    			append_dev(div0, t4);
    			append_dev(div0, p1);
    			append_dev(p1, t5);
    			append_dev(p1, a0);
    			append_dev(p1, t7);
    			append_dev(main, t8);
    			append_dev(main, section0);
    			append_dev(section0, div1);
    			append_dev(div1, h11);
    			append_dev(div1, t10);
    			append_dev(div1, p2);
    			append_dev(section0, t12);
    			append_dev(section0, img1);
    			append_dev(main, t13);
    			append_dev(main, section1);
    			append_dev(section1, div2);
    			append_dev(div2, h12);
    			append_dev(div2, t15);
    			append_dev(div2, p3);
    			append_dev(section1, t17);
    			append_dev(section1, div24);
    			append_dev(div24, div3);
    			append_dev(div24, t18);
    			append_dev(div24, div8);
    			append_dev(div8, div7);
    			append_dev(div7, h30);
    			append_dev(div7, t20);
    			append_dev(div7, div6);
    			append_dev(div6, p4);
    			append_dev(div6, t22);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div24, t23);
    			append_dev(div24, div13);
    			append_dev(div13, div12);
    			append_dev(div12, h31);
    			append_dev(div12, t25);
    			append_dev(div12, div11);
    			append_dev(div11, p5);
    			append_dev(div11, t27);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div24, t28);
    			append_dev(div24, div18);
    			append_dev(div18, div17);
    			append_dev(div17, h32);
    			append_dev(div17, t30);
    			append_dev(div17, div16);
    			append_dev(div16, p6);
    			append_dev(div16, t32);
    			append_dev(div16, div15);
    			append_dev(div15, div14);
    			append_dev(div24, t33);
    			append_dev(div24, div23);
    			append_dev(div23, div22);
    			append_dev(div22, h33);
    			append_dev(div22, t35);
    			append_dev(div22, div21);
    			append_dev(div21, p7);
    			append_dev(div21, t37);
    			append_dev(div21, div20);
    			append_dev(div20, div19);
    			append_dev(main, t38);
    			append_dev(main, section2);
    			append_dev(section2, div25);
    			append_dev(div25, h13);
    			append_dev(div25, t40);
    			append_dev(div25, p8);
    			append_dev(p8, t41);
    			append_dev(p8, a1);
    			append_dev(p8, t43);
    			append_dev(section2, t44);
    			append_dev(section2, img2);
    			append_dev(main, t45);
    			append_dev(main, section3);
    			append_dev(section3, div26);
    			append_dev(div26, h14);
    			append_dev(section3, t47);
    			append_dev(section3, div33);
    			append_dev(div33, div29);
    			append_dev(div29, div27);
    			append_dev(div27, img3);
    			append_dev(div27, t48);
    			append_dev(div27, h50);
    			append_dev(div29, t50);
    			append_dev(div29, div28);
    			append_dev(div28, p9);
    			append_dev(div33, t52);
    			append_dev(div33, div32);
    			append_dev(div32, div30);
    			append_dev(div30, img4);
    			append_dev(div30, t53);
    			append_dev(div30, h51);
    			append_dev(div32, t55);
    			append_dev(div32, div31);
    			append_dev(div31, p10);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
