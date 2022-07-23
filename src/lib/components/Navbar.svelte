<style>
	/* navigation */

	.nav-wrap {
	    position: fixed;
	    bottom: 0px;
	    height: 100px;
	    width: 100%;
	    z-index: 1000;
	}

	.nav-wrap > nav {
	    background: var(--mantle);
	    padding: 8px;
	    gap: 10px;
	    border-radius: 20px;
	    box-shadow: 0 0 10px 10px #00000020;
	    transition: all 0.3s ease-out;
	    z-index: 1000;
	}

	.nav-wrap > nav > a {
	    display: block;
	    padding: 0.5em 0.8em;
	    background: transparent;
	    border-radius: 25px;
	    color: var(--text);
	    text-decoration: none;
	    transition: background 0.3s ease-out;
	}

	.nav-wrap > nav > .active {
	    background: var(--surface1);
	    text-decoration: underline;
	}

	.nav-wrap > nav > a:hover {
	    background: var(--surface3);
	}

	.hide {
	    position: fixed;
	    bottom: 0px;
	    cursor: pointer;
	}

	.hidden {
	    transition: all 0.3s ease-out;
	    transform: translateY(150%);
	}

	.expand {
	    transition: all 0.3s ease-out;
	    width: 16px;
	    z-index: 0;
	}

	.hiddenHandle {
	    transition: all 0.3s ease-out;
	    transform: rotate(180deg);
	}

	@media screen and (orientation: portrait) {
	    .nav-wrap > nav {
		flex-direction: row;
		gap: 5px;
	    }
    	 }

</style>

<script>
	import { navIndex } from "../stores.js";
	let currIndex = 0;
	navIndex.subscribe(value => {
		currIndex = value;
	});

	let hidden = false;
	let items = [
		{
			name: "Home",
			link: "/",
		},
		{
			name: "Projects",
			link: "/projects",
		},
		{
			name: "Misc",
			link: "/misc",
		},
	]
	
</script>

<div class="nav-wrap center-flex">
	<nav class="center-flex" class:hidden>
		{#each items as item, index}
			<a href="{item.link}"
			class:active={currIndex == index}>
				{item.name}
			</a>
		{/each}
	</nav>
	<a 
	class="hide"
	on:click={() => hidden = !hidden }>
		<img src="/expand.svg" 
		alt="Show"
		class:hiddenHandle={hidden} 
		class="expand">
	</a>
</div>
