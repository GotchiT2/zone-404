<script lang="ts">
  import {Dialog, Portal} from "@skeletonlabs/skeleton-svelte";
  import {XIcon} from "@lucide/svelte";

  const {selectedDate, selectedRoom, time} = $props()

  let modalSlot = $state<SlotWithCalendar | null>(null);
  let modalPlayers = $state(2);
  let modalLoading = $state(false);
  let modalError = $state<string | null>(null);

  function formatTime(iso: string): string {
    if (!iso) return '';
    const date = new Date(iso);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  async function confirmModal() {
    if (!modalSlot) return;
    if (modalPlayers < 2 || modalPlayers > 6) {
      modalError = 'Le nombre de joueurs doit être compris entre 2 et 6';
      return;
    }

    modalLoading = true;
    modalError = null;

    try {
      const res = await fetch(
        `/api/calendar/${modalSlot.calendar}/start-reservation`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            slotId: modalSlot.id,
            players: modalPlayers
          })
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Erreur lors du démarrage de la réservation');
      }

      // On retire le créneau de la liste puisqu’il n’est plus [LIBRE]
      allSlots = allSlots.filter((s) => s.id !== modalSlot?.id);

      modalSlot = null;
    } catch (e) {
      modalError = (e as Error).message;
    } finally {
      modalLoading = false;
    }
  }

  function handleSelectSlot(calendarKey: CalendarKey, slot: Slot) {
    modalSlot = {...slot, calendar: calendarKey};
    modalPlayers = 2;
    modalError = null;
  }
</script>

<Dialog>
    <Dialog.Trigger class="btn preset-filled">{formatTime(time)}</Dialog.Trigger>
    <Portal>
        <Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50"/>
        <Dialog.Positioner class="fixed inset-0 z-50 flex justify-center items-center p-4">
            <Dialog.Content class="card bg-surface-100-900 w-full max-w-xl p-4 space-y-4 shadow-xl {animation}">
                <header class="flex justify-between items-center">
                    <Dialog.Title class="text-lg font-bold">Réservation en cours</Dialog.Title>
                    <Dialog.CloseTrigger class="btn-icon hover:preset-tonal">
                        <XIcon class="size-4"/>
                    </Dialog.CloseTrigger>
                </header>
                <Dialog.Description>
                    <p>
                        Salle : {selectedRoom}<br/>
                        Date : {selectedDate}<br/>
                        Heure : {formatTime(time)}
                    </p>

                    <label>
                        Nombre de joueurs (2 à 6) :
                        <input
                                bind:value={modalPlayers}
                                max="6"
                                min="2"
                                type="number"
                        />
                    </label>

                    {#if modalError}
                        <p class="error">{modalError}</p>
                    {/if}
                </Dialog.Description>
                <footer class="flex justify-end gap-2">
                    <Dialog.CloseTrigger class="btn preset-tonal">Cancel</Dialog.CloseTrigger>
                    <button class="btn preset-filled" disabled={modalLoading} onclick={confirmModal} type="button">
                        {#if modalLoading}Validation...{/if}
                        {#if !modalLoading}Valider{/if}
                    </button>
                </footer>
            </Dialog.Content>
        </Dialog.Positioner>
    </Portal>
</Dialog>