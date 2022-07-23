

<style>
	.profile {
	    width: 300px;
	    border-radius: 50%;
	    border: 5px solid var(--overlay1);
	}
	.preview-projects {
	   gap: 9%;
	}

	.section-content {
	    width: 30%;
	    text-align: center;
	}

	.project {
	    transition: all 0.3s ease-out;
	}

	.project:hover {
	    transform: translateY(-3px);
	}

	.preview-projects > .wrapper {
	    width: 28%;
	    height: 250px;
	    background: var(--mantle);
	    padding: 10px;
	    border-radius: 20px;
	    gap: 7px;
	    position: relative;
	    box-shadow: 0 0 10px 10px #00000020;
	}

	.preview-projects > .wrapper > .project {
	    background: #292c3c;
	    border-radius: 20px;
	    width: 100%;
	}

	.preview-projects > .wrapper > .project > .front {
	    justify-content: space-between;
	    margin: 0 20px;
	    gap: 20px;
	}

	.preview-projects > .wrapper > .project > .desc {
	    margin: 0 20px; 
	    text-overflow: ellipsis;
	}

	.preview-projects > .wrapper > .project > .front > .info {
	    text-align: right;
	}

	.preview-projects > .wrapper > .project > .front > .info > p {
	    margin: 5px 0;
	}

	.service-info {
	    padding: 0.4em 0.5em;
	    width: 200px;
	    background: var(--mantle);
	    border-radius: 0 20px 20px 0;
	    transform: translateX(-5px);
	    text-align: center;
	}

	.service-logo {
	    background: var(--surface1);
	    padding: 0.9em;
	    width: 60px;
	    height: 60px;
	    text-align: center;
	    border-radius: 20px;
	    box-shadow: 0 0 10px 10px #00000020;
	    z-index: 3;
	}

	.service-logo > img {
	    width: 60px;
	}

	.service-logo,
	.service-logo > img,
	.service-logo > .service-name {
	    transition: all 0.3s ease-out;
	}

	.service-logo:hover {
	    box-shadow: 0 0 15px 13px #00000030;
	}

	.service-logo:hover > img {
	    transform: translateY(-10px);
	}

	.service-logo:hover > .service-name {
	    transform: translateY(-37px);
	}

	@media screen and (orientation: portrait) {
	    .profile {
		width: 200px ;
	    }

	    .section-content {
		width: 90%;
	    }

	    .service-info {
		border-radius: 20px;
	    }


	    .preview-projects > .wrapper {
		width: 80%;
	    }

	    .preview-projects > .wrapper > .project {
		padding: 5px 0;
	    }

	    .preview-projects > .wrapper > .project > .front {
		display: block;
		text-align: center;
	    }

	    .preview-projects > .wrapper > .project > .front > .info {
		text-align: center;
	    }
	}

</style>

<script>
	import { navIndex } from "$lib/stores.js";
	navIndex.set(0);
</script>


	<header class="center-flex column">
		<img src="pf.png" alt="My profile picture" class="profile"/>
		<div class="align-center column intro">
			<h1>VnPower</h1>
			<p>
			Just a random Vietnamese student who code as a hobby
			<span class="beam"></span>
			</p>
		</div>
	</header>
	<section class="row-reverse center-flex">
		<div class="section-content">
			<h1>Who I am</h1>
			<p>
			Just a student who create stuff. This is the fourth time
			I rewrited my website, and I think this is good enough for now.
			</p>
		</div>
		<img src="waving.svg" alt="Waving hand" class="waving">
	</section>
	<section class="center-flex preview-projects">
		<div class="section-content">
			<h1>Stuff I have done</h1>
			<p>
			These are some of my recent projects.
			</p>
		</div>	
		<div class="wrapper flex column align-center no-overflow">
			<div class="overflow-gradient"></div>
			<div class="project">
				<div class="front align-center">
					<h3>DemonListVN-v2</h3>
					<div class="info">
						<p>Svelte + TypeScript</p>
						<div class="tags flex row-reverse">
							<div class="wip-tag"></div>
						</div>
					</div>
				</div>	
			</div>	
			<div class="project">
				<div class="front align-center">
					<h3>BetterNewTab</h3>
					<div class="info">
						<p>Svelte + JavaScript</p>
						<div class="tags flex row-reverse">
							<div class="unmaintained-tag"></div>
						</div>
					</div>
				</div>	
			</div>	
			<div class="project">
				<div class="front align-center">
					<h3>dotfiles</h3>
					<div class="info">
						<p>Shell</p>
						<div class="tags flex row-reverse">
							<div class="wip-tag"></div>
						</div>
					</div>
				</div>	
			</div>	
			<div class="project">
				<div class="front align-center">
					<h3>blackjack</h3>
					<div class="info">
						<p>Rust</p>
						<div class="tags flex row-reverse">
							<div class="completed-tag"></div>
						</div>
					</div>
				</div>	
			</div>	
		</div>
	</section>
	<section class="row-reverse center-flex">
		<div class="section-content">
			<h1>I also write blogs</h1>
			<p>Lorem ipsum</p>
		</div>
		<img src="writing.svg" alt="Writing" class="waving">
	</section>
	<section class="center-flex contact">
		<div class="section-content">
			<h1>You could find me on</h1>
			<p>Lorem ipsum</p>
		</div>
		<div class="flex column" style="gap: 7px">
			<div class="service flex align-center">
				<div class="service-logo no-overflow">
					<img src="xmpp.png" alt="XMPP">
					<h5 class="service-name">XMPP</h5>
				</div>
				<div class="service-info">
					<p>vnpower@jabber.fr</p>
				</div>
			</div>
			<div class="service flex align-center">
				<div class="service-logo no-overflow">
					<img src="discord.svg" alt="Discord">
					<h5 class="service-name">Discord</h5>
				</div>
				<div class="service-info">
					<p>VnPower#5919</p>
				</div>
			</div>
		</div>
	</section>
