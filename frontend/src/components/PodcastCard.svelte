<script>
  import Modal from "./Modal.svelte";
  import StarRating from "./StarRating.svelte"
  import ReviewModal from "./ReviewModal.svelte";
  import {authenticated_fetch} from "../utilities"
  import { API_URL } from "../constants";
  import ReviewDetailsModal from "./ReviewDetailsModal.svelte";
  
  // Props
  export let show
  /** @type {any} */
  export let review = null

  // State
  let showNewReviewModal = false
  let showShowReviewModal = false
  let showEditReviewModal = false

  
  
  const openNewReviewModal = () => {
    showNewReviewModal = true
  }
  
  const openShowReviewModal = () => {
    showShowReviewModal = true
  }
  
  const openEditReviewModal = () => {
    showEditReviewModal = true
  }
  
  let newReview = {
    review_text: "",
    rating: 5,
    spotify_id: show.id
  }

  const addReview = async () => {
    let reviewRes =  await authenticated_fetch(API_URL + "/reviews", {
        method: "POST",
        body: JSON.stringify(newReview),
        headers: {
          "content-type": "application/json"
        }
    })
    review =  await reviewRes.json()

    showNewReviewModal = false
    newReview = {
      review_text: "",
      rating: 5,
      spotify_id: show.id
    }
  }

  const deleteReview = async () => {
    if (confirm("Are you sure you want to delete this review?")) {

      const response = await authenticated_fetch(API_URL + "/reviews/" + review.id, {
        method: "DELETE"
      })
      if (response.status === 200) {
        review = null
      }
    }
}

  const editReview = async () => {
    const editRes = await authenticated_fetch(API_URL + "/reviews/" + review.id, {
        method: "PUT",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(review)
    })
    review = await editRes.json()
    showEditReviewModal = false
  }
</script>

<article>
  <img src="{show.images[2].url}" alt="Cover of {show.name}">
  <div class="content">
    <h2>{show.name}</h2>
      <div class="buttons">
        {#if review}
        <button onclick="{openShowReviewModal}">Show Review</button>
        <button onclick="{openEditReviewModal}">Edit Review</button>
        <button class="red" onclick="{deleteReview}">Delete Review</button>
        {:else}
        <button onclick="{openNewReviewModal}">Review Podcast</button>
        {/if}
      </div>
  </div>
</article>

{#if showNewReviewModal}
<ReviewModal bind:review={newReview} bind:showModal={showNewReviewModal} onsubmit={addReview} />
{/if}

{#if showShowReviewModal && review}
<ReviewDetailsModal reviewId={review.id} bind:showModal={showShowReviewModal} {show} />
{/if}

{#if showEditReviewModal && review}
<ReviewModal bind:review={review} bind:showModal={showEditReviewModal} onsubmit={editReview} />
{/if}

<style>
  
  img {
    width: 100%;
    border-top-left-radius: 0.8rem;
    border-top-right-radius: 0.8rem;
  }
  .red {
    background-color: rgb(182, 2, 2);
    color:white
  }
  h2 {
    text-align: center;
    padding: 0;
    margin: 0;
    margin-bottom: 1.5rem;
  }

  article {
    display: flex;
    flex-direction: column;
    border: solid 3px;
    border-radius: 1rem;
    border-color: var(--spotify-green);
    background-color: #fff;
  }

  .content {
    display: flex;
    flex-direction: column;
    padding: 2rem 1rem;
    height: 100%;
  }
  
  .buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: auto;
    gap: 0.5rem;
  }
</style>


