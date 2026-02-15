<script lang="ts">
	import {goto} from '$app/navigation';

	let password = '';
  let error = '';
  let loading = false;

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    loading = true;

    try {
      const response = await fetch('/admin/gm/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({password})
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirection vers le tableau de bord GM après connexion réussie
        goto('/admin/gm');
      } else {
        error = data.error || 'Erreur de connexion';
      }
    } catch (err) {
      error = 'Erreur de connexion au serveur';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
    <title>Connexion GM - Zone 404</title>
</svelte:head>

<div class="container mx-auto flex items-center justify-center min-h-screen p-4">
    <div class="card max-w-md w-full p-8 space-y-6">
        <div class="text-center">
            <h1 class="h2 font-bold mb-2">Connexion Game Master</h1>
            <p class="text-surface-600-300-token">Accès réservé aux Game Masters</p>
        </div>

        <form class="space-y-4" on:submit={handleSubmit}>
            <label class="label">
                <span>Mot de passe</span>
                <input
                        bind:value={password}
                        class="input"
                        disabled={loading}
                        placeholder="Entrez votre mot de passe"
                        required
                        type="password"
                />
            </label>

            {#if error}
                <aside class="alert preset-filled-error-500">
                    <div class="alert-message">
                        <p>{error}</p>
                    </div>
                </aside>
            {/if}

            <button
                    class="btn preset-filled-primary-500 w-full"
                    disabled={loading}
                    type="submit"
            >
                {#if loading}
                    <span>Connexion en cours...</span>
                {:else}
                    <span>Se connecter</span>
                {/if}
            </button>
        </form>
    </div>
</div>