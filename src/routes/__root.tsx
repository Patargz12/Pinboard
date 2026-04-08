import {
  HeadContent,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import '@/styles.css'
import { NotFoundPage } from '@/shared'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Map Pinboard',
      },
    ],
    links: [
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon.png',
      },
      {
        rel: 'shortcut icon',
        href: '/favicon.png',
        type: 'image/png',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html:
              'body[data-css-ready="false"]{opacity:0;visibility:hidden}body[data-css-ready="true"]{opacity:1;visibility:visible;transition:opacity .12s ease-out}',
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){function markReady(){if(document.body){document.body.setAttribute("data-css-ready","true")}}function hasStyles(){for(var i=0;i<document.styleSheets.length;i++){var href=document.styleSheets[i].href||"";if(href.indexOf("/assets/")!==-1&&href.indexOf(".css")!==-1){return true}}return false}var started=Date.now();function tick(){if(hasStyles()||Date.now()-started>4000){markReady();return}requestAnimationFrame(tick)}window.addEventListener("load",markReady,{once:true});tick()})();',
          }}
        />
        <HeadContent />
      </head>
      <body
        data-css-ready="false"
        className="wrap-anywhere font-sans antialiased selection:bg-[rgba(79,184,178,0.24)]"
      >
        {children}

        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
