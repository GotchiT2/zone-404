<script lang="ts">
  import {onDestroy, onMount} from 'svelte';
  import {browser} from '$app/environment';
  import type {MessageCreatedEvent, TimerStateEvent} from '$lib/types/display-events';

  // ✅ Svelte 5 props
  const {data} = $props<{ data: { roomId: string } }>();

  let eventSource: EventSource | null = null;

  // ✅ runes state
  let displayTime = $state('--:--');
  let timerStatus = $state<'IDLE' | 'RUNNING' | 'PAUSED' | 'ENDED'>('IDLE');
  let isOffline = $state(false);

  // Message overlay state
  let showOverlay = $state(false);
  let overlayMessage = $state('');
  let overlayTimeout: number | null = null;
  let messageTextElement: HTMLElement | null = null;
  let scrollInterval: number | null = null;
  let notificationAudio: HTMLAudioElement | null = null;

  // Timer synchronization
  let timerEndTimestamp: number | null = null;
  let timerInterval: number | null = null;
  let lastRemainingMs = 0;

  // ✅ derived values (remplace $:)
  const roomId = $derived(data.roomId);

  function formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  function updateTimerDisplay() {
    if (timerStatus === 'RUNNING' && timerEndTimestamp) {
      const remaining = Math.max(0, timerEndTimestamp - Date.now());
      displayTime = formatTime(remaining);
      lastRemainingMs = remaining;
    } else {
      displayTime = formatTime(lastRemainingMs);
    }
  }

  function handleTimerState(event: TimerStateEvent) {
    timerStatus = event.status;
    lastRemainingMs = event.remainingMs;

    if (event.status === 'RUNNING' && event.endsAt) {
      timerEndTimestamp = new Date(event.endsAt).getTime();
    } else {
      timerEndTimestamp = null;
    }

    updateTimerDisplay();
  }

  function handleMessageCreated(event: MessageCreatedEvent) {
    playNotificationSound();
    showMessageOverlay(event.text);
  }

  function playNotificationSound() {
    if (!notificationAudio) {
      notificationAudio = new Audio('/notif.mp3');
    }

    notificationAudio.currentTime = 0;
    notificationAudio.play().catch((e) => {
      console.error('[Display] Error playing notification sound:', e);
    });
  }

  function startAutoScroll() {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = null;
    }

    setTimeout(() => {
      if (!messageTextElement) return;

      const element = messageTextElement;
      const isOverflowing = element.scrollHeight > element.clientHeight;

      if (!isOverflowing) return;

      const scrollSpeed = 2;

      scrollInterval = window.setInterval(() => {
        if (!element) return;

        element.scrollTop += scrollSpeed;

        if (element.scrollTop + element.clientHeight >= element.scrollHeight - 1) {
          element.scrollTop = 0;
        }
      }, 50);
    }, 100);
  }

  function stopAutoScroll() {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = null;
    }
    if (messageTextElement) {
      messageTextElement.scrollTop = 0;
    }
  }

  function showMessageOverlay(text: string) {
    if (overlayTimeout) {
      clearTimeout(overlayTimeout);
    }

    stopAutoScroll();

    overlayMessage = text;
    showOverlay = true;

    startAutoScroll();

    overlayTimeout = window.setTimeout(() => {
      showOverlay = false;
      overlayMessage = '';
      overlayTimeout = null;
      stopAutoScroll();
    }, 30000);
  }

  function handleMessageState(data: any) {
    if (data.text && data.activeUntil) {
      const activeUntil = new Date(data.activeUntil).getTime();
      const now = Date.now();
      const remainingTime = activeUntil - now;

      if (remainingTime > 0) {
        overlayMessage = data.text;
        showOverlay = true;

        if (overlayTimeout) {
          clearTimeout(overlayTimeout);
        }

        overlayTimeout = window.setTimeout(() => {
          showOverlay = false;
          overlayMessage = '';
          overlayTimeout = null;
          stopAutoScroll();
        }, remainingTime);

        startAutoScroll();
      }
    }
  }

  function setupSSE() {
    if (eventSource) {
      eventSource.close();
    }

    if (timerInterval) {
      clearInterval(timerInterval);
    }

    const url = `/api/rooms/${roomId}/events`;
    eventSource = new EventSource(url);

    eventSource.addEventListener('timer_state', (e) => {
      isOffline = false;
      const data: TimerStateEvent = JSON.parse((e as MessageEvent).data);
      handleTimerState(data);
    });

    eventSource.addEventListener('message_state', (e) => {
      isOffline = false;
      const data = JSON.parse((e as MessageEvent).data);
      handleMessageState(data);
    });

    eventSource.addEventListener('display_message_created', (e) => {
      isOffline = false;
      const data: MessageCreatedEvent = JSON.parse((e as MessageEvent).data);
      handleMessageCreated(data);
    });

    eventSource.onerror = (e) => {
      console.error('[Display] SSE error:', e);
      isOffline = true;

      eventSource?.close();
      setTimeout(() => {
        if (browser) {
          setupSSE();
        }
      }, 5000);
    };

    eventSource.onopen = () => {
      console.log('[Display] SSE connected');
      isOffline = false;
    };

    updateTimerDisplay();
    timerInterval = window.setInterval(updateTimerDisplay, 100);
  }

  onMount(() => {
    if (browser) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      setupSSE();
    }
  });

  onDestroy(() => {
    if (eventSource) {
      eventSource.close();
    }
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    if (overlayTimeout) {
      clearTimeout(overlayTimeout);
    }
    if (scrollInterval) {
      clearInterval(scrollInterval);
    }

    if (browser) {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
  });
</script>

<svelte:head>
    <title>Display - {roomId}</title>
    <meta name="google" content="notranslate">
</svelte:head>

<div class="display-container">
    <!-- Timer principal -->
    <div class="timer-display" class:paused={timerStatus === 'PAUSED'}>
        <div class="timer-text">{displayTime}</div>
        {#if timerStatus === 'PAUSED'}
            <div class="pause-badge">PAUSE</div>
        {/if}
    </div>

    <!-- Overlay message -->
    {#if showOverlay}
        <div class="message-overlay">
            <div class="message-content">
                <div class="message-icon">💬</div>
                <div class="message-text" bind:this={messageTextElement}>{overlayMessage}</div>
            </div>
        </div>
    {/if}

    <!-- Indicateur offline -->
    {#if isOffline}
        <div class="offline-indicator">
            <div class="offline-dot"></div>
            <span>OFFLINE</span>
        </div>
    {/if}
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        overflow: hidden;
        background: #000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    .display-container {
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
    }

    .timer-display {
        text-align: center;
        animation: fadeIn 0.5s ease-in;
    }

    .timer-text {
        font-size: 25vw;
        font-weight: 700;
        color: #00ff88;
        text-shadow: 0 0 40px rgba(0, 255, 136, 0.5), 0 0 80px rgba(0, 255, 136, 0.3);
        font-family: 'Courier New', monospace;
        letter-spacing: 0.05em;
        line-height: 1;
        transition: color 0.3s ease;
    }

    .timer-display.paused .timer-text {
        color: #ffa500;
        text-shadow: 0 0 40px rgba(255, 165, 0, 0.5), 0 0 80px rgba(255, 165, 0, 0.3);
    }

    .pause-badge {
        margin-top: 2vw;
        font-size: 5vw;
        font-weight: 700;
        color: #ffa500;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        animation: pulse 2s infinite;
    }

    .message-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: slideIn 0.5s ease-out;
        z-index: 100;
    }

    .message-content {
        text-align: center;
        padding: 5vw;
        max-width: 80vw;
    }

    .message-icon {
        font-size: 15vw;
        margin-bottom: 3vw;
        animation: bounce 1s ease-in-out infinite;
    }

    .message-text {
        font-size: 6vw;
        font-weight: 600;
        color: #fff;
        line-height: 1.4;
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        max-height: 60vh;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .message-text::-webkit-scrollbar {
        display: none;
    }

    .offline-indicator {
        position: absolute;
        top: 20px;
        right: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 20px;
        background: rgba(255, 0, 0, 0.2);
        border: 2px solid rgba(255, 0, 0, 0.5);
        border-radius: 20px;
        font-size: 18px;
        font-weight: 600;
        color: #ff4444;
        z-index: 50;
    }

    .offline-dot {
        width: 12px;
        height: 12px;
        background: #ff4444;
        border-radius: 50%;
        animation: blink 1s infinite;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-100%);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.6;
        }
    }

    @keyframes bounce {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    @keyframes blink {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.3;
        }
    }

    @media (max-width: 768px) {
        .timer-text {
            font-size: 30vw;
        }

        .message-text {
            font-size: 7vw;
        }

        .offline-indicator {
            font-size: 14px;
            padding: 8px 15px;
        }
    }
</style>
