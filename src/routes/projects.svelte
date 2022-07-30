
<style>
	.project:hover {
	    transform: translateY(-3px);
	}

	.project {
	    background: #292c3c;
	    border-radius: 20px;
	    width: 100%;
	    transition: all 0.3s ease-out;
	    padding: 10px 0;
	}

	hr {
	    z-index: -999;
	    width: 60%;
	    border: 1px solid var(--overlay3);
	    float: left;
	    margin: 0.5em 20px;
	}

	.front {
	    justify-content: space-between;
	    margin: 0 20px;
	    gap: 20px;
	}

	.desc {
	    margin: 0 20px; 
	    word-break: break-word;
	    clear: both;
	}

	.info {
	    text-align: right;
	}

	.info > p {
	    margin: 5px 0;
	}

	.wrapper {
	    margin: 30px 0;
	    gap: 7px;
	}

	.col {
	    width: 380px;
      gap: 7px;
	}
</style>

<script>
	import { navIndex } from "$lib/stores.js";
	navIndex.set(1);

	let projects = [
		{
			name: "DemonListVNv2",
			desc: "A rewrite version of DemonListVN",
			pl: ["Svelte", "TypeScript"],
			tags: ["wip"],
			link: "github.com/NamPE286/DemonListVN-v2"
		},
		{
			name: "BetterNewTab",
			desc: "\
			A customizable and minimal new tab.\
			This is my first project in Svelte btw",
			pl: ["Svelte", "JavaScript"],
			tags: ["completed"],
			link: "git.076.ne.jp/VnPower/bnt"
		},
		{
			name: "dotfiles",
			desc: "\
			My Linux desktop configuration, just \
			to make myself comfortable, ft. Nackoneko",
			pl: ["Svelte", "JavaScript"],
			tags: ["completed"],
			link: "git.076.ne.jp/VnPower/bnt"
		},
	]
	let firstCol = [];
	let secondCol = [];
	let thirdCol = [];

	for (let i = 0; i < projects.length; i++) {
		let project = projects[i];
		if (i % 3 === 0) firstCol.push(project);
		if ((i - 1) % 3 === 0) secondCol.push(project);
		if ((i - 2) % 3 === 0) thirdCol.push(project);
	}
</script>

<header class="center-flex full-height">
	<h1>Projects</h1>	
</header>
<section class="align-center column">
	<div class="wrapper flex">
		<div class="column flex col">
			{#each firstCol as project}
			<a href="http://{project.link}">
				<div class="project">
					<div class="front align-center">
						<h3>{project.name}</h3>
						<div class="info">
							<p>{project.pl.join(' + ')}</p>
							<div class="tags flex row-reverse">
								{#each project.tags as tag}
								<div class="{tag}-tag"></div>
								{/each}
							</div>
						</div>
					</div>	
					<hr>
					<p class="desc">
						{project.desc}
					</p>
				</div>
			</a>
			{/each}
		</div>
		<div class="column flex col">
			{#each secondCol as project}
			<div class="project">
				<div class="front align-center">
					<h3>{project.name}</h3>
					<div class="info">
						<p>{project.pl.join(' + ')}</p>
						<div class="tags flex row-reverse">
							{#each project.tags as tag}
							<div class="{tag}-tag"></div>
							{/each}
						</div>
					</div>
				</div>	
				<hr>
				<p class="desc">
					{project.desc}
				</p>
			</div>
			{/each}
		</div>
		<div class="column flex col">
			{#each thirdCol as project}
			<div class="project">
				<div class="front align-center">
					<h3>{project.name}</h3>
					<div class="info">
						<p>{project.pl.join(' + ')}</p>
						<div class="tags flex row-reverse">
							{#each project.tags as tag}
							<div class="{tag}-tag"></div>
							{/each}
						</div>
					</div>
				</div>	
				<hr>
				<p class="desc">
					{project.desc}
				</p>
			</div>
			{/each}
		</div>
	</div>
</section>
