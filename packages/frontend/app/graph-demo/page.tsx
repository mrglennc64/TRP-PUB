import { redirect } from 'next/navigation';

// ATL Identity Graph — served as a standalone Cytoscape.js experience
// The HTML file lives at /public/graph-demo.html and is served at /graph-demo.html
export default function GraphDemoPage() {
  redirect('/graph-demo.html');
}
