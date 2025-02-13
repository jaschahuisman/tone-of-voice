import { Sidebar } from "@/components/sidebar"
import { MainContent } from "@/components/main-content"
import { CompaniesProvider } from "@/contexts/CompaniesContext"

export default function Page() {
  return (
    <CompaniesProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <MainContent />
      </div>
    </CompaniesProvider>
  )
}

