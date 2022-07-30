<script context="module">
export const load = async ({ params, fetch }) => {
  const currentCategory = params.category
  const response = await fetch('/api/posts.json')
  const posts = await response.json()

  const matchingPosts = posts
    .filter(post => post.meta.categories.includes(currentCategory))

  return {
    props: {
      posts: matchingPosts,
    }
  }
}
</script>

<script>
  import { page } from '$app/stores';
  export let posts
</script>


<header class="center-flex column">
  <h2>`{$page.params.category}` tagged blog posts</h2>
</header>
{posts[0]["meta"]["title"]}
