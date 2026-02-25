<script lang="ts">
  import {CupSoda, MailPlus, PhoneCall, TicketPlus, XIcon} from '@lucide/svelte';
  import {Dialog, Navigation, Portal} from '@skeletonlabs/skeleton-svelte';
  import Logo from "$lib/components/Logo.svelte";
  import {PUBLIC_AFFICHER_ESPACE_BAR} from "$env/static/public";

  let anchorRail = 'btn hover:preset-tonal aspect-square w-full max-w-[84px] flex flex-col items-center gap-0.5';
</script>

<Navigation class="bg-black border-t z-99" layout="bar">
    <Navigation.Content>
        <Navigation.Menu class="flex justify-center gap-8 wrap">
            <a aria-label="View Homepage" class={anchorRail} href="/" title="View Homepage">
                <Logo classname="w-16"/>
            </a>
            <a class='btn bg-blue-400 hover:bg-blue-900 aspect-square w-full max-w-[84px] flex flex-col items-center gap-0.5 shadow-lg shadow-blue-500/50 '
               href='/reservation'>
                <TicketPlus class="size-5"/>
                <span class="text-xs">Réserver</span>
            </a>
            {#if PUBLIC_AFFICHER_ESPACE_BAR === 'true' }
                <a class={anchorRail} href='/bar'>
                    <CupSoda class="size-5"/>
                    <span class="text-xs">Bar</span>
                </a>
            {/if}
            <Dialog>
                <Dialog.Trigger class={anchorRail}>
                    <MailPlus class="size-5"/>
                    <span class="text-xs">Contact</span></Dialog.Trigger>
                <Portal>
                    <Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50"/>
                    <Dialog.Positioner class="fixed inset-0 z-50 flex justify-center items-center p-4">
                        <Dialog.Content
                                class="card bg-surface-100-900 w-full max-w-xl p-4 space-y-4 shadow-xl 'transition transition-discrete opacity-0 translate-y-[100px] starting:data-[state=open]:opacity-0 starting:data-[state=open]:translate-y-[100px] data-[state=open]:opacity-100 data-[state=open]:translate-y-0'">
                            <header class="flex justify-between items-center">
                                <Dialog.Title class="text-lg font-bold">Contacter</Dialog.Title>
                                <Dialog.CloseTrigger class="btn-icon hover:preset-tonal">
                                    <XIcon class="size-4"/>
                                </Dialog.CloseTrigger>
                            </header>
                            <Dialog.Description>
                                <a class="flex items-center gap-2 mb-4 text-blue-400 font-bold hover:underline" href="">
                                    <PhoneCall aria-hidden="true" class="size-8" focusable="false"/>
                                    <span class="sr-only">Par téléphone: </span>
                                    06.72.82.08.92
                                </a>
                                <a class="flex items-center gap-2 mb-4 text-blue-400 font-bold hover:underline"
                                   href="mailto:zone404team@gmail.com">
                                    <MailPlus class="size-8"/>
                                    <span class="sr-only">Par email: </span>
                                    zone404team@gmail.com
                                </a>
                            </Dialog.Description>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog>
        </Navigation.Menu>
    </Navigation.Content>
</Navigation>