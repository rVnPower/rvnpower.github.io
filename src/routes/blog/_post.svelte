<script>
export let title
export let date
export let desc
export let image
export let categories
</script>

<div>
  <header class="center-flex column">
    <div class="background" style="background-image: url({image})"></div>
    <div class="foreground center-flex column">
      <h1 class="title">{title}</h1>	
      {#if categories.length}
        <aside>
          <h2>Posted in:</h2>
          <ul>
            {#each categories as category}
              <li>
                <a href="/blog/categories/{category}">
                  {category}
                </a>
              </li>
            {/each}
          </ul>
        </aside>
      {/if}
      <p>{desc}</p>
    </div>
  </header>
</div>
<section>
  <slot />
</section>

<style>
  .background {
    filter: blur(4px) brightness(0.6) ;
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .foreground {
    z-index: 7;
  }

  .title {
    text-decoration: var(--overlay3) wavy underline;
  }

  section {
    margin: 50px 300px 0 300px;
  }

  @media screen and (orientation: portrait) {
    section {
      margin: 50px 100px 0 100px;
    }
  }

  @media screen and (max-width: 600px) {
    section {
      margin: 40px 20px 0 20px;
    }
  }
</style>
