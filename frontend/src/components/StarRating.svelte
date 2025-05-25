<script>
    export let rating = 0;           // current rating
    export let maxStars = 5;         // total number of stars
    export let size = "48px";        // star size
    export let readonly = false;     // disable interactivity
  
    let hoverRating = 0;
  
    const setRating = (value) => {
      if (!readonly) rating = value;
    };
  </script>
  
  <style>
    .star {
      cursor: pointer;
      transition: color 0.2s;
      user-select: none;
    }
    .readonly {
      cursor: default;
    }
  </style>
  
  <div>
    {#each Array(maxStars) as _, i}
    <!-- svelte-ignore a11y_mouse_events_have_key_events -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <span
        class="star {readonly ? 'readonly' : ''}"
        on:click={() => setRating(i + 1)}
        on:mouseover={() => !readonly && (hoverRating = i + 1)}
        on:mouseleave={() => (hoverRating = 0)}
        style="font-size: {size}; color: {(hoverRating || rating) > i ? '#ffc107' : '#e4e5e9'};"
      >
        ★
      </span>
    {/each}
  </div>
  