export const partialHydrationDomExample = `<!-- The encoded props are placed immediately before the component wrapper -->
<script type="application/hydration-data" data-internal-ref="Navigation-1234abcd">
  {"items":["Home","About"]}
</script>

<!-- data-component is the primary lookup attribute on the client -->
<div 
  data-component="Navigation" 
  data-internal-id="Navigation-1234abcd" 
  class="site-nav"
>
  <!-- Pre-rendered SSR HTML goes here -->
  <nav><h1>Welcome</h1></nav>
</div>`;
