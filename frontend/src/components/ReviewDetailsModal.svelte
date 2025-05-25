<script>
  import { onMount } from "svelte";
  import { authenticated_fetch } from "../utilities";
  import { API_URL } from "../constants";
  import StarRating from "./StarRating.svelte";
  import Modal from "./Modal.svelte";
  
  export let show
  export let reviewId
  export let showModal = true

  let review = null
  onMount(async () => {
    const revRes = await authenticated_fetch(API_URL + `/reviews/${reviewId}`)
    review = await revRes.json()
  })
</script>

{#if review}
<Modal bind:showModal>
  {#snippet header()}
    <h3>{show.name}</h3>
  {/snippet}
  <p class="center">Rating <StarRating rating={review.rating} readonly /></p>
  <p>{review.review_text}</p>
</Modal>
{/if}