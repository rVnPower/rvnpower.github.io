<script>
export let title
export let date
export let desc
export let image
</script>

<div>
  <header class="center-flex column">
    <div class="background" style="background-image: url({image})"></div>
    <div class="foreground center-flex column">
      <h1>{title}</h1>	
      <p>{desc}</p>
    </div>
  </header>
</div>
<section>
  <slot />
</section>

<style>
  .background {
    filter: blur(4px) brightness(0.5) ;
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .foreground {
    z-index: 7;
  }

  section {
    margin: 50px 300px 0 300px;
  }
</style>
