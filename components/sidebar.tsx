"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { useCompanies } from "@/contexts/CompaniesContext"

export function Sidebar() {
  const { companies, selectedCompany, setSelectedCompanyId, addCompany } = useCompanies()
  const [isAddingCompany, setIsAddingCompany] = useState(false)
  const [newCompanyName, setNewCompanyName] = useState("")

  const handleAddCompany = () => {
    if (newCompanyName.trim()) {
      addCompany(newCompanyName.trim())
      setNewCompanyName("")
      setIsAddingCompany(false)
    }
  }

  return (
    <div className="w-64 border-r bg-background p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-muted-foreground">companies</h2>
        <Button variant="outline" size="icon" onClick={() => setIsAddingCompany(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {isAddingCompany && (
        <div className="mb-4 space-y-2">
          <Input
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
            placeholder="Bedrijfsnaam"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddCompany()
            }}
          />
          <div className="flex gap-2">
            <Button onClick={handleAddCompany} className="flex-1">
              Toevoegen
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingCompany(false)
                setNewCompanyName("")
              }}
              className="flex-1"
            >
              Annuleren
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-1">
        {companies.map((company) => (
          <button
            key={company.id}
            onClick={() => setSelectedCompanyId(company.id)}
            className={cn(
              "w-full text-left px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors",
              selectedCompany?.id === company.id && "bg-muted font-medium",
            )}
          >
            {company.name}
          </button>
        ))}
      </div>
    </div>
  )
}

