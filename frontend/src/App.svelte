<script>
  import { onMount } from "svelte";
  import Header from "./components/Header.svelte";
  import { API_URL } from "./constants";
  import { currentUser } from "./state.svelte"
  import {me, refreshToken} from "./authentication"
  import PodcastList from "./components/PodcastList.svelte";
  

  onMount(async () => {
    // If there is a code in the query parameters
    const queryParams = new URLSearchParams(window.location.search)
    if (queryParams.has("code")) {
      let callbackResponse = await fetch(API_URL + "/callback?" + queryParams.toString())
      let callbackData = await callbackResponse.json()
      localStorage.setItem("authToken", callbackData.token)
      
      // Clear ?code=... from URL
      const currentURL = new URL(window.location.href)
      currentURL.searchParams.delete("code")
      history.replaceState(history.state, "", currentURL.href)
    }

    const currentToken = localStorage.getItem("authToken")
    // No token - not logged in
    if (!currentToken) {
      return
    }
    
    const userData = await me()
    
    if (!userData) {
      const refreshedData = await refreshToken()
      $currentUser = refreshedData
      return
    }

    $currentUser = userData

    // Refresh automatically every 5 minutes
    setInterval(async () => {
      $currentUser = await refreshToken()
    }, 5 * 60 * 1000)
    
  })

</script>

<Header></Header>

{#if !$currentUser}
<div>
  <h2>
    Welcome to SpotiRev!

  </h2>
  <p>
     this app allows you to log in with your Spotify account
    to review your saved podcasts.
    You can add a review, edit it, and delete it. <br><br>
    
    Please log in with your Spotify account to start reviewing! 
  </p>
  <a class="button" href="{API_URL + "/login"}">Log in with Spotify</a>
</div>
{:else}
  <h2>Hello, {$currentUser.user_data.display_name}</h2>
  <PodcastList></PodcastList>
{/if}


<style>
  h2 {
    font-family: Outfit, sans-serif;
    color: var(--spotify-green);
    margin-bottom: 2rem;
    font-size: 1.8rem;
  }
  div{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 3px solid var(--spotify-green);
    border-radius: 1rem;
    padding: 1rem;
    max-width: 32rem;
    background-color: white;
    margin-left: auto;
    margin-right: auto;
    margin-top: 4rem;

  }

p{
  text-align: center;
  font-family: sans-serif;
}

a {
  margin-top: 2rem;
}
</style>