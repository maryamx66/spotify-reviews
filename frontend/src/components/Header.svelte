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
    <div>
        <button onclick="{logOut}">Log out</button>
    </div>
    {/if}
</header>

<style>
    h1{
        color: var(--spotify-green);
        text-align: center;
        font-family: Outfit, sans-serif;
        font-size: 3rem;
    }
    div{
        display: flex;
        justify-content: flex-end;
        
    }
</style>