<script lang="ts">
  import {CupSoda, MailPlus, MessageCircleQuestionMark, PhoneCall, TicketPlus, XIcon} from '@lucide/svelte';
  import {Dialog, Navigation, Portal} from '@skeletonlabs/skeleton-svelte';
  import Logo from "$lib/components/Logo.svelte";

  let anchorRail = 'btn hover:preset-tonal aspect-square w-full max-w-[84px] flex flex-col items-center gap-0.5';
</script>

<Navigation class="bg-black border-r" layout="rail">
    <Navigation.Header>
        <a aria-label="View Homepage" class={anchorRail} href="/" title="View Homepage">
            <Logo classname="w-16"/>
        </a>
    </Navigation.Header>
    <Navigation.Content>
        <Navigation.Menu>
            <a class='btn bg-blue-400 hover:bg-blue-900 aspect-square w-full max-w-[84px] flex flex-col items-center gap-0.5'
               href='/reservation'>
                <TicketPlus class="size-5"/>
                <span class="text-xs">Réserver</span>
            </a>
            <a class={anchorRail} href='/bar'>
                <CupSoda class="size-5"/>
                <span class="text-xs">Espace bar</span>
            </a>
            <a class={anchorRail} href='/infos-pratiques'>
                <MessageCircleQuestionMark class="size-5"/>
                <span class="text-xs">Infos pratiques</span>
            </a>
            <Dialog>
                <Dialog.Trigger class={anchorRail}>
                    <MailPlus class="size-5"/>
                    <span class="text-xs">Nous contacter</span></Dialog.Trigger>
                <Portal>
                    <Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50"/>
                    <Dialog.Positioner class="fixed inset-0 z-50 flex justify-center items-center p-4">
                        <Dialog.Content
                                class="card bg-surface-100-900 w-full max-w-xl p-4 space-y-4 shadow-xl 'transition transition-discrete opacity-0 translate-y-[100px] starting:data-[state=open]:opacity-0 starting:data-[state=open]:translate-y-[100px] data-[state=open]:opacity-100 data-[state=open]:translate-y-0'">
                            <header class="flex justify-between items-center">
                                <Dialog.Title class="text-lg font-bold">Nous contacter</Dialog.Title>
                                <Dialog.CloseTrigger class="btn-icon hover:preset-tonal">
                                    <XIcon class="size-4"/>
                                </Dialog.CloseTrigger>
                            </header>
                            <Dialog.Description>
                                <a class="flex items-center gap-2 mb-4 text-blue-400 font-bold hover:underline" href="">
                                    <PhoneCall aria-hidden="true" class="size-8" focusable="false"/>
                                    06.00.00.00.00
                                </a>
                                <a class="flex items-center gap-2 mb-4 text-blue-400 font-bold hover:underline" href="">
                                    <MailPlus class="size-8"/>
                                    zone404team@gmail.com
                                </a>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                            </Dialog.Description>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog>
        </Navigation.Menu>
    </Navigation.Content>
</Navigation>