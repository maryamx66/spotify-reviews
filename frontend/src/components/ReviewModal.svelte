<script>
  import { onMount } from "svelte";
  import { authenticated_fetch } from "../utilities";
  import Modal from "./Modal.svelte";
  import StarRating from "./StarRating.svelte";
  import { API_URL } from "../constants";
  
  export let review
  export let show
  export let showModal = true
  export let onsubmit = (existingReview) => {}

  const submitWrapper = (e) => {
    e.preventDefault()
    onsubmit(review)
  }

  onMount(async () => {
    if (review.id) {
      const revRes = await authenticated_fetch(API_URL + `/reviews/${review.id}`)
      review = await revRes.json()
    }
  })
</script>

<Modal bind:showModal>
  {#snippet header()}
    <h3>Review {show.name}</h3>
  {/snippet}
  <form onsubmit="{submitWrapper}">
    <p class="podcast-description">{show.description}</p>
    <p class="center">Rating: <StarRating bind:rating={review.rating} /></p>
    <textarea rows="10" id="reviewText" placeholder="Write your review here (optional)" bind:value={review.review_text}></textarea>
    <button type="submit">Save Review</button>
  </form>
</Modal>


<style>
  textarea {
    width: 100%;
    font-family: sans-serif;
  }
  .podcast-description{
    font-size: 0.8rem;
  }
  h3 {
    color: var(--spotify-green);
  }
  button{
    margin-top: 1rem;
  }
</style>