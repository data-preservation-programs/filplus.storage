<script>
// ====================================================================== Export
export default {
  name: 'IndexPage',

  async fetch ({ app, store, redirect }) {
    const username = await store.getters['auth/account'].githubUsername
    await redirect(`/account/${username}/applications`)
  }
}
</script>
