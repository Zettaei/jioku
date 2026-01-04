<script lang="ts">
  import {
    ChevronsRightIcon,
    LibraryBigIcon,
    SearchIcon
  } from "@lucide/svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { Settings2Icon } from "@lucide/svelte";
  import ThemeToggle from "./app-ThemeToggle.svelte";
  import { cn } from "$lib/utils";
  import { page } from "$app/state";

  const classname_menuButton = cn("h-10 px-3 text-lg w-full rounded-none");
  const classname_menuButton_active = cn("border-l-4 border-yellow-500");
  const classname_menuButton_inactive = cn("border-l-4 border-transparent hover:border-border");
  const classname_appTitle = cn(
    "w-full text-center text-nowrap text-xl",
    "font-bold font-['font-avant-garde-gothic-medium']",
  );
  const classname_titleButton = cn("ms-3");



  const sidebar = Sidebar.useSidebar();
  let isOpen = $derived(sidebar.open);

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

  const bodyItems = [
    {
      title: "Search",
      url: "/search",
      icon: SearchIcon,
    },
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
          {#each bodyItems as item (item.title)}
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
