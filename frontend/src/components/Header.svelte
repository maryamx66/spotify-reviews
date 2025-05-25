<script>
    import {currentUser} from "../state.svelte"
    const logOut = () => {
        localStorage.removeItem("authToken")
        window.location.reload()
    }
</script>

<header>
    <h1>SpotiRev</h1>
    {#if $currentUser} 
    <button onclick="{logOut}">Log out</button>
    {/if}
</header>

<style>
    h1{
        color: var(--spotify-green);
    }
</style>