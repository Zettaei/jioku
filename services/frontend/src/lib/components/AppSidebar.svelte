<script lang="ts">
  import {
    ChevronsRightIcon,
    LibraryBigIcon,
    SearchIcon,
    LogInIcon,
    LogOutIcon,
    UserIcon,
  } from "@lucide/svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { Settings2Icon } from "@lucide/svelte";
  import ThemeToggle from "./app-ThemeToggle.svelte";
  import { cn } from "$lib/utils";
  import { page } from "$app/state";
  import { userStore } from "$lib/stores/auth";
  import { goto } from "$app/navigation";
  import { logout } from "../../routes/(auth)/services";
  import { errorState } from "$lib/global/errorState.svelte";

  const classname_menuButton = cn("h-10 px-3 text-lg w-full rounded-none");
  const classname_menuButton_active = cn("border-l-4 border-yellow-500");
  const classname_menuButton_inactive = cn("border-l-4 border-transparent hover:border-border");
  const classname_appTitle = cn(
    "w-full text-center text-nowrap text-xl",
    "font-bold avantgarde",
  );
  const classname_titleButton = cn("ms-3 avantgarde");



  const sidebar = Sidebar.useSidebar();
  let isOpen = $derived(sidebar.open);

  let user = $derived($userStore);
  let isLoggedIn = $derived(user !== null);

  const onMenuButtonClick = () => {
    sidebar.setOpenMobile(false);
  }

  function handleMouseEnter() {
    if (!sidebar.isMobile) {
      sidebar.setOpen(true);
    }
  }

  function handleMouseLeave() {
    if (!sidebar.isMobile) {
      sidebar.setOpen(false);
    }
  }

  const isActive = (url: string) => {
    return page.url.pathname.startsWith(url);
  };

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // ignore errors on logout — clear client state regardless
    }
    userStore.set(null);
    goto("/search");
  }

  const alwaysItems = [
    {
      title: "Search",
      url: "/search",
      icon: SearchIcon,
    },
  ];

  const memberItems = [
    {
      title: "Deck",
      url: "/deck",
      icon: LibraryBigIcon,
    },
  ];

  const footerItems = [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2Icon,
    },
  ];
</script>


<Sidebar.Root
  variant="floating"
  collapsible="icon"
  side="left"
  class="uppercase"
  onmouseenter={() => { isOpen ? handleMouseEnter() : undefined }}
  onmouseleave={() => { isOpen ? handleMouseLeave() : undefined }}
>
  <Sidebar.Header>
    <Sidebar.Menu></Sidebar.Menu>
  </Sidebar.Header>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each alwaysItems as item (item.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton 
                class={cn(
                  classname_menuButton,
                  isActive(item.url) ? classname_menuButton_active : classname_menuButton_inactive
                )} 
                onclick={onMenuButtonClick}
              >
                {#snippet child({ props })}
                  <a href={item.url} {...props}>
                    <item.icon />
                    <span class={classname_titleButton}>{item.title}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}

          {#if isLoggedIn}
            {#each memberItems as item (item.title)}
              <Sidebar.MenuItem>
                <Sidebar.MenuButton 
                  class={cn(
                    classname_menuButton,
                    isActive(item.url) ? classname_menuButton_active : classname_menuButton_inactive
                  )} 
                  onclick={onMenuButtonClick}
                >
                  {#snippet child({ props })}
                    <a href={item.url} {...props}>
                      <item.icon />
                      <span class={classname_titleButton}>{item.title}</span>
                    </a>
                  {/snippet}
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            {/each}
          {/if}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
    <div
      class="w-full h-full flex items-center justify-center"
      onmouseenter={() => {
        if (sidebar.state === "collapsed") handleMouseEnter();
      }}
    >
      {#if (sidebar.state === "collapsed" && !sidebar.isMobile)}
        <ChevronsRightIcon opacity=0.2/>
      {/if}
    </div>
  </Sidebar.Content>
  <Sidebar.Footer class="px-0 pb-2">
    {#if isLoggedIn}
      <Sidebar.Group>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            {#each footerItems as item (item.title)}
              <Sidebar.MenuItem>
                <Sidebar.MenuButton 
                  class={cn(
                    classname_menuButton,
                    isActive(item.url) ? classname_menuButton_active : classname_menuButton_inactive
                  )} 
                  onclick={onMenuButtonClick}
                >
                  {#snippet child({ props })}
                    <a href={item.url} {...props}>
                      <item.icon />
                      <span class={classname_titleButton}>{item.title}</span>
                    </a>
                  {/snippet}
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            {/each}
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    {/if}

    <Sidebar.Group>
      <Sidebar.GroupContent>
        <Sidebar.Menu>

          {#if !isLoggedIn}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                class={cn(classname_menuButton, classname_menuButton_inactive)}
                onclick={() => { onMenuButtonClick(); goto("/login"); }}
              >
                {#snippet child({ props })}
                  <a href="/login" {...props}>
                    <LogInIcon />
                    <span class={classname_titleButton}>Log In</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/if}
          
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>

    <Sidebar.Group>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#if sidebar.state === "expanded" || sidebar.isMobile }
            <Sidebar.MenuItem class="flex justify-between items-center">
              <div class={classname_appTitle}> J I O K U </div>
              <ThemeToggle />
            </Sidebar.MenuItem>
          {:else}
            <Sidebar.MenuItem>
              <ThemeToggle />
            </Sidebar.MenuItem>
          {/if}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Footer>
</Sidebar.Root>
