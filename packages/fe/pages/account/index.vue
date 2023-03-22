<script>
// ====================================================================== Export
export default {
  name: 'IndexPage',

  async fetch ({ app, store, redirect }) {
    const username = await store.getters['account/account'].githubUsername
    await redirect(`/account/${username}/applications`)
  }

}
</script>
