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
  <a class="button" href="{API_URL + "/login"}">Log in with Spotify</a>
{:else}
  <h2>Hello, {$currentUser.user_data.display_name}</h2>
  <PodcastList></PodcastList>
{/if}


<style>
  h2 {
    font-family: sans-serif;
    color: rgb(74, 73, 73);
  }
</style>