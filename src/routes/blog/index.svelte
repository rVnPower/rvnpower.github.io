<script context="module">
export const load = async ({ fetch }) => {
  const posts = await fetch('/api/posts.json')
  const allPosts = await posts.json()

  return {
    props: {
      posts: allPosts
    }
  }
}
</script>
<script>
  export let posts
</script>

<header class="center-flex">
  <h1>Blog</h1>
</header>

<section>
    {#each posts as post}
      <h2>
        <a href={post.path}>
          {post.meta.title}
        </a>
      </h2>
      Published {post.meta.date}
    {/each}
</section>
