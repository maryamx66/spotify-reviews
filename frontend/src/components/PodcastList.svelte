<script>
  import PodcastCard from './PodcastCard.svelte';

  import {onMount} from "svelte"
  import {API_URL} from "../constants"
  import {authenticated_fetch} from "../utilities"
  
  let podcasts = []
  let reviews = []

  onMount(async () => {
    let podRes = await authenticated_fetch(API_URL + "/podcasts")
    podcasts = await podRes.json()

    let revRes = await authenticated_fetch(API_URL + "/reviews")
    reviews = await revRes.json()
  })

</script>

<section>
   {#each podcasts as podcast}
    <PodcastCard review={reviews.find((r) => r.spotify_id === podcast.show.id) || null} show={podcast.show}></PodcastCard>
   
   {/each}
</section>

<style>
  section {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
  }
</style>

