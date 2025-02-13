"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Company {
  id: string
  name: string
  toneOfVoice: string // Dit is nu één string veld
}

interface CompaniesContextType {
  companies: Company[]
  selectedCompany: Company | null
  setSelectedCompanyId: (id: string) => void
  addCompany: (name: string) => void
  updateCompanyToneOfVoice: (companyId: string, toneOfVoice: string) => void
}

const CompaniesContext = createContext<CompaniesContextType | undefined>(undefined)

export function CompaniesProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null)

  useEffect(() => {
    const storedCompanies = localStorage.getItem("companies")
    if (storedCompanies) {
      const parsedCompanies = JSON.parse(storedCompanies)
      setCompanies(parsedCompanies)
      if (parsedCompanies.length > 0) {
        setSelectedCompanyId(parsedCompanies[0].id)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("companies", JSON.stringify(companies))
  }, [companies])

  const addCompany = (name: string) => {
    const newCompany: Company = {
      id: crypto.randomUUID(),
      name,
      toneOfVoice: "", // Leeg veld voor nieuwe bedrijven
    }
    setCompanies([...companies, newCompany])
    setSelectedCompanyId(newCompany.id)
  }

  const updateCompanyToneOfVoice = (companyId: string, toneOfVoice: string) => {
    setCompanies(companies.map((company) => (company.id === companyId ? { ...company, toneOfVoice } : company)))
  }

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId) || null

  return (
    <CompaniesContext.Provider
      value={{
        companies,
        selectedCompany,
        setSelectedCompanyId,
        addCompany,
        updateCompanyToneOfVoice,
      }}
    >
      {children}
    </CompaniesContext.Provider>
  )
}

export function useCompanies() {
  const context = useContext(CompaniesContext)
  if (context === undefined) {
    throw new Error("useCompanies must be used within a CompaniesProvider")
  }
  return context
}

