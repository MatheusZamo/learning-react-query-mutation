import { createRoot } from "react-dom/client"
import { App } from "./app.jsx"
import "./index.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const rootElement = document.querySelector('[data-js="root"]')
const root = createRoot(rootElement)

const queryClient = new QueryClient()

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
)
